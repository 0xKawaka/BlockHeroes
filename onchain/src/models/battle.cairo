mod entity;

use starknet::ContractAddress;

use entity::Entity;
use entity::healthOnTurnProc::{HealthOnTurnProc, HealthOnTurnProcImpl, DamageOrHealEnum};
use entity::turnBar::{TurnBarTrait, TurnBarImpl};
use entity::{EntityImpl, EntityTrait, AllyOrEnemy, cooldowns::CooldownsTrait, skill::Skill};

use game::utils::nullableVector::{NullableVector, NullableVectorImpl, VecTrait};
use game::utils::vector::{Vector, VectorImpl};
use game::utils::arrayHelper;
use game::utils::spanHelper;
use game::utils::signedIntegers::{i64::i64Impl};

use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
use game::models::events::{Event, StartTurn, IdAndValue, TurnBarEvent, EntityBuffEvent, BuffEvent, EndBattle};

use debug::PrintTrait;

#[derive(Destruct)]
struct Battle {
    entities: NullableVector<Entity>,
    aliveEntities: Vector<u32>,
    deadEntities: Array<u32>,
    turnTimeline: Vector<u32>,
    alliesIndexes: Array<u32>,
    enemiesIndexes: Array<u32>,
    aliveAlliesIndexes: Vector<u32>,
    aliveEnemiesIndexes: Vector<u32>,
    healthOnTurnProcs: NullableVector<HealthOnTurnProc>,
    skillSets : Array<Array<Skill>>,
    isBattleOver: bool,
    isVictory: bool,
    isWaitingForPlayerAction: bool,
    #[key]
    owner: ContractAddress,
}

fn new(entities: Array<Entity>, aliveEntities: Array<u32>, deadEntities: Array<u32>, turnTimeline: Array<u32>, allies: Array<u32>, enemies: Array<u32>, healthOnTurnProcs: Array<HealthOnTurnProc>, skillSets : Array<Array<Skill>>, isBattleOver: bool, isWaitingForPlayerAction: bool, owner: ContractAddress) -> Battle {
    let alliesSpan = allies.span();
    let enemiesSpan = enemies.span();
    let aliveEntitiesSpan = aliveEntities.span();
    let mut battle = Battle {
        entities: NullableVectorImpl::newFromArray(entities),
        aliveEntities: VectorImpl::newFromArray(aliveEntities),
        deadEntities: deadEntities,
        turnTimeline: VectorImpl::newFromArray(turnTimeline),
        alliesIndexes: allies,
        enemiesIndexes: enemies,
        aliveAlliesIndexes: initAliveAlliesOrEnemiesIndexes(alliesSpan, aliveEntitiesSpan),
        aliveEnemiesIndexes: initAliveAlliesOrEnemiesIndexes(enemiesSpan, aliveEntitiesSpan),
        healthOnTurnProcs: NullableVectorImpl::newFromArray(healthOnTurnProcs),
        skillSets : skillSets,
        isBattleOver: isBattleOver,
        isVictory: false,
        isWaitingForPlayerAction: isWaitingForPlayerAction,
        owner: owner,
    };
    return battle;
}

fn initAliveAlliesOrEnemiesIndexes(alliesOrEnemiesIndexes: Span<u32>, aliveEntities: Span<u32>) -> Vector<u32> {
    let mut aliveAlliesOrEnemiesIndexes: Array<u32> = Default::default();
    let mut i: u32 = 0;
    loop {
        if (i == alliesOrEnemiesIndexes.len()) {
            break;
        }
        let entityIndex = alliesOrEnemiesIndexes.get(i).unwrap().unbox();
        if (spanHelper::includes(aliveEntities, entityIndex)) {
            aliveAlliesOrEnemiesIndexes.append(*entityIndex);
        }
        i = i + 1;
    };
    return VectorImpl::newFromArray(aliveAlliesOrEnemiesIndexes);
}

trait BattleTrait {
    fn battleLoop(ref self: Battle, world: IWorldDispatcher);
    fn playTurn(ref self: Battle, world: IWorldDispatcher, skillIndex: u8, targetIndex: u32);
    fn processHealthOnTurnProcs(ref self: Battle, world: IWorldDispatcher, ref entity: Entity);
    fn loopUntilNextTurn(ref self: Battle);
    fn updateTurnBarsSpeed(ref self: Battle);
    fn incrementTurnBars(ref self: Battle);
    fn sortTurnTimeline(ref self: Battle);
    fn getEntityHighestTurn(ref self: Battle) -> Entity;
    fn waitForPlayerAction(ref self: Battle);
    fn checkTurnBarsForFullBars(ref self: Battle) -> bool;
    fn checkAndProcessDeadEntities(ref self: Battle) -> Array<u32>;
    fn checkAndProcessBattleOver(ref self: Battle, world: IWorldDispatcher) -> bool;
    fn isAlly(ref self: Battle, entityIndex: u32) -> bool;
    fn isAllyOf(ref self: Battle, entityIndex: u32, isAllyIndex: u32) -> bool;
    fn getAliveAlliesOf(ref self: Battle, entityIndex: u32) -> Array<Entity>;
    fn getAliveEnemiesOf(ref self: Battle, entityIndex: u32) -> Array<Entity>;
    fn getAlliesOf(ref self: Battle, entityIndex: u32) -> Array<Entity>;
    fn getEnemiesOf(ref self: Battle, entityIndex: u32) -> Array<Entity>;
    fn getAliveAllies(ref self: Battle) -> Array<Entity>;
    fn getAliveEnemies(ref self: Battle) -> Array<Entity>;
    fn getAllAllies(ref self: Battle) -> Array<Entity>;
    fn getAllEnemies(ref self: Battle) -> Array<Entity>;
    fn getAllAlliesButIndex(ref self: Battle, entityIndex: u32) -> Array<Entity>;
    fn getAllEnemiesButIndex(ref self: Battle, entityIndex: u32) -> Array<Entity>;
    fn getEventSpeedsArray(ref self: Battle) -> Array<IdAndValue>;
    fn getEventTurnBarsArray(ref self: Battle) -> Array<TurnBarEvent>;
    fn getEventEntityBuffsArray(ref self: Battle, entityIndex: u32) -> Array<EntityBuffEvent>;
    fn getEventEntityStatusArray(ref self: Battle, entityIndex: u32) -> Array<EntityBuffEvent>;
    fn getEventEntityBuffsHealthOnTurnProcs(ref self: Battle, entityIndex: u32) -> Array<EntityBuffEvent>;
    fn getEventEntityStatusHealthOnTurnProcs(ref self: Battle, entityIndex: u32) -> Array<EntityBuffEvent>;
    fn getEventBuffsArray(ref self: Battle) -> Array<BuffEvent>;
    fn getEventStatusArray(ref self: Battle) -> Array<BuffEvent>;
    fn getEventBuffsHealthOnTurnProcs(ref self: Battle) -> Array<BuffEvent>;
    fn getEventStatusHealthOnTurnProcs(ref self: Battle) -> Array<BuffEvent>;
    fn getHealthOnTurnProcsEntity(ref self: Battle, entityIndex: u32) -> Array<HealthOnTurnProc>;
    fn getHealthsArray(ref self: Battle) -> Array<u64>;
    fn getEntityByIndex(ref self: Battle, entityIndex: u32) -> Entity;
    fn getOwner(self: Battle) -> ContractAddress;
    fn printAllEntities(ref self: Battle);
    fn printTurnTimeline(ref self: Battle);
    fn print(ref self: Battle);
}

impl BattleImpl of BattleTrait {
    fn battleLoop(ref self: Battle, world: IWorldDispatcher) {       
        loop {
            self.checkAndProcessBattleOver(world);
            if (self.isBattleOver || self.isWaitingForPlayerAction) {
                break;
            }
            self.loopUntilNextTurn();
            let mut entity = self.getEntityHighestTurn();
            self.processHealthOnTurnProcs(world, ref entity);
            // PrintTrait::print('playTurn');
            entity.playTurn(world, ref self);
        };
    }
    fn playTurn(ref self: Battle, world: IWorldDispatcher, skillIndex: u8, targetIndex: u32) {
        // PrintTrait::print('Play turn');
        self.sortTurnTimeline();
        assert(!self.isBattleOver, 'Battle is over');
        assert(self.isWaitingForPlayerAction, 'Not waiting for player action');
        let mut entity = self.getEntityHighestTurn();
        // PrintTrait::print('Entity player playing index :');
        // entity.index.print();
        entity.playTurnPlayer(world, skillIndex, targetIndex, ref self);
        self.isWaitingForPlayerAction = false;
        self.battleLoop(world);
    }
    fn processHealthOnTurnProcs(ref self: Battle, world: IWorldDispatcher, ref entity: Entity) {
        // PrintTrait::print('processHealthOnTurnProcs of');
        // PrintTrait::print(entity.index);
        let mut damageArray: Array<u64> = Default::default();
        let mut healArray: Array<u64> = Default::default();
        let mut removed: bool = false;
        let mut i: u32 = 0;
        loop {
            if (i == self.healthOnTurnProcs.len()) {
                break;
            }
            removed = false;
            let mut onTurnProc = self.healthOnTurnProcs.getValue(i);
            if (onTurnProc.getEntityIndex() == entity.getIndex()) {
                let damageOrHealVal = onTurnProc.proc(ref entity);
                match onTurnProc.damageOrHeal {
                    DamageOrHealEnum::Damage => damageArray.append(damageOrHealVal),
                    DamageOrHealEnum::Heal => healArray.append(damageOrHealVal),
                }
                
                if(onTurnProc.isExpired()) {
                    // PrintTrait::print('Removing healthOnTurnProc');
                    self.healthOnTurnProcs.remove(i);
                    removed = true;
                }
                else {
                    self.healthOnTurnProcs.set(i, onTurnProc);
                }
            }
            if(!removed) {
                i = i + 1;
            }
        };
        emit!(world, (Event::StartTurn(StartTurn {
            owner: self.owner,
            entityId: entity.getIndex(),
            damages: damageArray,
            heals: healArray,
            buffs: self.getEventEntityBuffsArray(entity.index),
            status: self.getEventEntityStatusArray(entity.index),
            isDead: entity.isDead(),
        })));
        // PrintTrait::print('finished onturnprocs');
    }
    fn loopUntilNextTurn(ref self: Battle) {
        println!("Loop until next turn");
        self.updateTurnBarsSpeed();
        loop {
            if (self.checkTurnBarsForFullBars()) {
                self.sortTurnTimeline();
                println!("Turn timeline : ");
                println!("{}", self.getEntityHighestTurn().getIndex());
                println!("{}", *self.getEntityHighestTurn().getTurnBar().turnbar);
                println!("{}", self.getEntityHighestTurn().getSpeed());
                // PrintTrait::print(self.getEntityByIndex(self.turnTimeline.getValue(1)).getIndex());
                // PrintTrait::print(*self.getEntityByIndex(self.turnTimeline.getValue(1)).getTurnBar().turnbar);
                // PrintTrait::print(self.getEntityByIndex(self.turnTimeline.getValue(1)).getSpeed());
                break;
            }
            self.incrementTurnBars();
        };
    }

    fn checkTurnBarsForFullBars(ref self: Battle) -> bool {
        let mut i: u32 = 0;
        let mut isFull = false;
        loop {
            if (i >= self.aliveEntities.len()) {
                break;
            }
            let entity = self.entities.getValue(self.aliveEntities.getValue(i));
            if ((*entity.getTurnBar()).isFull()) {
                isFull =  true;
                break;
            }
            i = i + 1;
        };
        return isFull;
    }

    fn updateTurnBarsSpeed(ref self: Battle) {
        let mut i: u32 = 0;
        loop {
            if (i == self.aliveEntities.len()) {
                break;
            }
            let mut entity = self.entities.getValue(self.aliveEntities.getValue(i));
            entity.updateTurnBarSpeed();
            self.entities.set(entity.getIndex(), entity);
            i = i + 1;
        };
    }
    fn incrementTurnBars(ref self: Battle) {
        let mut i: u32 = 0;
        loop {
            if (i == self.aliveEntities.len()) {
                break;
            }
            let mut entity = self.entities.getValue(self.aliveEntities.getValue(i));
            entity.incrementTurnbar();
            self.entities.set(entity.getIndex(), entity);
            i = i + 1;
        };
    }

    fn sortTurnTimeline(ref self: Battle) {
        if self.turnTimeline.len() < 2 {
            return;
        }
        let mut idx1 = 0;
        let mut idx2 = 1;
        let mut sortedIteration = 0;
        let mut sortedArray: Array<u32> = Default::default();
        
        loop {
            if idx2 == self.turnTimeline.len() {
                sortedArray.append(self.turnTimeline.getValue(idx1));
                if sortedIteration == 0 {
                    break;
                }
                self.turnTimeline = VecTrait::<Vector, u32>::newFromArray(sortedArray);
                sortedArray = array![];
                idx1 = 0;
                idx2 = 1;
                sortedIteration = 0;
            } else {
                let entityIndex1 = self.turnTimeline.getValue(idx1);
                let entityIndex2 = self.turnTimeline.getValue(idx2);
                let entity1TurnBar = *self.entities.getValue(entityIndex1).getTurnBar().turnbar;
                let entity2TurnBar = *self.entities.getValue(entityIndex2).getTurnBar().turnbar;
                if entity1TurnBar > entity2TurnBar {
                    sortedArray.append(entityIndex1);
                    idx1 = idx2;
                    idx2 += 1;
                }
                else if (entity1TurnBar == entity2TurnBar) {
                    if(entityIndex1 > entityIndex2){
                        sortedArray.append(entityIndex2);
                        idx2 += 1;
                    }
                    else {
                        sortedArray.append(entityIndex1);
                        idx1 = idx2;
                        idx2 += 1;
                    }
                }
                else {
                    sortedArray.append(entityIndex2);
                    idx2 += 1;
                    sortedIteration = 1;
                }
            };
        };
        self.turnTimeline = VecTrait::<Vector, u32>::newFromArray(sortedArray);
    }
    fn getEntityHighestTurn(ref self: Battle) -> Entity {
        return self.entities.getValue(self.turnTimeline.getValue(0));
    }
    fn waitForPlayerAction(ref self: Battle) {
        println!("Waiting for player action");
        self.isWaitingForPlayerAction = true;
    }
    fn checkAndProcessDeadEntities(ref self: Battle) -> Array<u32> {
        let mut i: u32 = 0;
        let mut deadEntities: Array<u32> = Default::default();
        let mut died: bool = false;
        loop {
            if (i == self.aliveEntities.len()) {
                break;
            }
            died = false;
            let mut entity = self.entities.getValue(self.aliveEntities.getValue(i));
            if (entity.isDead()) {
                entity.die(ref self);
                deadEntities.append(entity.index);
                died = true;
            }
            if(!died) {
                i = i + 1;
            }
        };
        return deadEntities;
    }
    fn checkAndProcessBattleOver(ref self: Battle, world: IWorldDispatcher) -> bool {
        let mut i: u32 = 0;
        let mut alliesDeadCount: u32 = 0;
        let mut enemiesDeadCount: u32 = 0;
        loop {
            if (i == self.deadEntities.len()) {
                break;
            }
            let entityIndex = *self.deadEntities[i];
            if (self.isAlly(entityIndex)) {
                alliesDeadCount = alliesDeadCount + 1;
            } else {
                enemiesDeadCount = enemiesDeadCount + 1;
            }
            i = i + 1;
        };
        if (alliesDeadCount == self.alliesIndexes.len()) {
            println!("All allies dead");
            emit!(world, (Event::EndBattle(EndBattle {
                owner: self.owner,
                playerHasWon: false,
            })));
            self.isBattleOver = true;
            self.isVictory = false;
            return true;
        }
        if (enemiesDeadCount == self.enemiesIndexes.len()) {
            println!("All enemies dead");
            emit!(world, (Event::EndBattle(EndBattle {
                owner: self.owner,
                playerHasWon: true,
            })));
            self.isBattleOver = true;
            self.isVictory = true;
            return true;
        }
        return false;
    }
    fn isAlly(ref self: Battle, entityIndex: u32) -> bool {
        return arrayHelper::includes(@self.alliesIndexes, @entityIndex);
    }
    fn isAllyOf(ref self: Battle, entityIndex: u32, isAllyIndex: u32) -> bool {
        if (self.isAlly(entityIndex)) {
            return self.isAlly(isAllyIndex);
        }
        return !self.isAlly(isAllyIndex);
    }
    fn getAliveAlliesOf(ref self: Battle, entityIndex: u32) -> Array<Entity> {
        if (self.isAlly(entityIndex)) {
            return self.getAliveAllies();
        }
        return self.getAliveEnemies();
    }
    fn getAliveEnemiesOf(ref self: Battle, entityIndex: u32) -> Array<Entity> {
        if (self.isAlly(entityIndex)) {
            // PrintTrait::print('is ally');
            return self.getAliveEnemies();
        }
        // PrintTrait::print('is enemy');
        return self.getAliveAllies();
    }
    fn getAlliesOf(ref self: Battle, entityIndex: u32) -> Array<Entity> {
        if (self.isAlly(entityIndex)) {
           return self.getAllAllies();
        }
        return self.getAllEnemies();
    }
    fn getEnemiesOf(ref self: Battle, entityIndex: u32) -> Array<Entity> {
        if (self.isAlly(entityIndex)) {
            return self.getAllEnemies();
        }
        return self.getAllAllies();
    }
    fn getAliveAllies(ref self: Battle) -> Array<Entity> {
        let mut allies: Array<Entity> = ArrayTrait::new();
        let mut i: u32 = 0;
        let mut aliveAlliesIndexesArray = self.aliveAlliesIndexes.toArray();
        loop {
            if (i == aliveAlliesIndexesArray.len()) {
                break;
            }
            let allyIndex = *aliveAlliesIndexesArray[i];
            // PrintTrait::print('allyIndex');
            // allyIndex.print();
            let mut entity = self.entities.getValue(allyIndex);
            allies.append(entity);
            i = i + 1;
        };
        return allies;
    }
    fn getAliveEnemies(ref self: Battle) -> Array<Entity> {
        let mut enemies: Array<Entity> = ArrayTrait::new();
        let mut i: u32 = 0;
        let mut aliveEnemiesIndexesArray = self.aliveEnemiesIndexes.toArray();
        loop {
            if (i == aliveEnemiesIndexesArray.len()) {
                break;
            }
            let enemyIndex = *aliveEnemiesIndexesArray[i];
            let mut entity = self.entities.getValue(enemyIndex);
            enemies.append(entity);
            i = i + 1;
        };
        return enemies;
    }
    fn getAllAllies(ref self: Battle) -> Array<Entity> {
        let mut allies: Array<Entity> = ArrayTrait::new();
        let mut i: u32 = 0;
        let mut alliesIndexesSpan = self.alliesIndexes.span();
        loop {
            if (i == alliesIndexesSpan.len()) {
                break;
            }
            let allyIndex = *alliesIndexesSpan.pop_front().unwrap();
            let mut entity = self.entities.getValue(allyIndex);
            allies.append(entity);
            i = i + 1;
        };
        return allies;
    }
    fn getAllEnemies(ref self: Battle) -> Array<Entity> {
        let mut enemies: Array<Entity> = ArrayTrait::new();
        let mut i: u32 = 0;
        let mut enemiesIndexesSpan = self.enemiesIndexes.span();
        loop {
            if (i == enemiesIndexesSpan.len()) {
                break;
            }
            let enemyIndex = *enemiesIndexesSpan.pop_front().unwrap();
            let mut entity =self.entities.getValue(enemyIndex);
            enemies.append(entity);
            i = i + 1;
        };
        return enemies;
    }
    fn getAllAlliesButIndex(ref self: Battle, entityIndex: u32) -> Array<Entity> {
        let mut allies: Array<Entity> = ArrayTrait::new();
        let mut i: u32 = 0;
        let mut alliesIndexesSpan = self.alliesIndexes.span();
        loop {
            if (i == alliesIndexesSpan.len()) {
                break;
            }
            let allyIndex = *alliesIndexesSpan.pop_front().unwrap();
            if (allyIndex != entityIndex) {
                let mut entity = self.entities.getValue(allyIndex);
                if(!entity.isDead()) {
                    allies.append(entity);
                }
            }
            i = i + 1;
        };
        return allies;
    }
    fn getAllEnemiesButIndex(ref self: Battle, entityIndex: u32) -> Array<Entity> {
        let mut enemies: Array<Entity> = ArrayTrait::new();
        let mut i: u32 = 0;
        let mut enemiesIndexesSpan = self.enemiesIndexes.span();
        loop {
            if (i == enemiesIndexesSpan.len()) {
                break;
            }
            let enemyIndex = *enemiesIndexesSpan.pop_front().unwrap();
            if (enemyIndex != entityIndex) {
                let mut entity = self.entities.getValue(enemyIndex);
                if(!entity.isDead()) {
                    enemies.append(entity);
                }
            }
            i = i + 1;
        };
        return enemies;
    }
    fn getEventSpeedsArray(ref self: Battle) -> Array<IdAndValue> {
        let mut speeds: Array<IdAndValue> = ArrayTrait::new();
        let mut i: u32 = 0;
        loop {
            if (i == self.aliveEntities.len()) {
                break;
            }
            let mut entity = self.entities.getValue(self.aliveEntities.getValue(i));
            speeds.append(IdAndValue { entityId: entity.index, value: entity.getSpeed()});
            i = i + 1;
        };
        return speeds;
    }
    fn getEventTurnBarsArray(ref self: Battle) -> Array<TurnBarEvent> {
        let mut turnBars: Array<TurnBarEvent> = ArrayTrait::new();
        let mut i: u32 = 0;
        loop {
            if (i == self.aliveEntities.len()) {
                break;
            }
            let mut entity = self.entities.getValue(self.aliveEntities.getValue(i));
            turnBars.append(TurnBarEvent { entityId: entity.index, value:*entity.getTurnBar().turnbar });
            i = i + 1;
        };
        return turnBars;
    }
    fn getEventEntityBuffsArray(ref self: Battle, entityIndex: u32) -> Array<EntityBuffEvent> {
        let mut buffs: Array<EntityBuffEvent> = ArrayTrait::new();
        let buffsArray = self.getEntityByIndex(entityIndex).getEventBuffsArray();
        let buffsHealthArray = self.getEventEntityBuffsHealthOnTurnProcs(entityIndex);
        let mut i: u32 = 0;
        loop {
            if (i == buffsArray.len()) {
                break;
            }
            let buff = *buffsArray[i];
            buffs.append(EntityBuffEvent { name: buff.name, duration: buff.duration });
            i = i + 1;
        };
        let mut j: u32 = 0;
        loop {
            if (j == buffsHealthArray.len()) {
                break;
            }
            let buff = *buffsHealthArray[j];
            buffs.append(buff);
            j = j + 1;
        };
        return buffs;
    }
    fn getEventEntityStatusArray(ref self: Battle, entityIndex: u32) -> Array<EntityBuffEvent> {
        let mut status: Array<EntityBuffEvent> = ArrayTrait::new();
        let statusArray = self.getEntityByIndex(entityIndex).getEventStatusArray();
        let statusHealthArray = self.getEventEntityStatusHealthOnTurnProcs(entityIndex);
        let mut i: u32 = 0;
        loop {
            if (i == statusArray.len()) {
                break;
            }
            let statusBuff = *statusArray[i];
            status.append(EntityBuffEvent { name: statusBuff.name, duration: statusBuff.duration });
            i = i + 1;
        };
        let mut j: u32 = 0;
        loop {
            if (j == statusHealthArray.len()) {
                break;
            }
            let statusBuff = *statusHealthArray[j];
            status.append(statusBuff);
            j = j + 1;
        };
        return status;
    }
    fn getEventEntityBuffsHealthOnTurnProcs(ref self: Battle, entityIndex: u32) -> Array<EntityBuffEvent> {
        let mut buffsHealthOnTurnProcs: Array<EntityBuffEvent> = Default::default();
        let buffsHealthArray = self.getHealthOnTurnProcsEntity(entityIndex);
        let mut i: u32 = 0;
        loop {
            if (i == buffsHealthArray.len()) {
                break;
            }
            let buff = *buffsHealthArray[i];
            match buff.getDamageOrHeal() {
                DamageOrHealEnum::Damage => (),
                DamageOrHealEnum::Heal => buffsHealthOnTurnProcs.append(EntityBuffEvent { name: 'regen', duration: buff.duration }),
            }
            i = i + 1;
        };
        return buffsHealthOnTurnProcs;
    }
    fn getEventEntityStatusHealthOnTurnProcs(ref self: Battle, entityIndex: u32) -> Array<EntityBuffEvent> {
        let mut statusHealthOnTurnProcs: Array<EntityBuffEvent> = Default::default();
        let statusHealthArray = self.getHealthOnTurnProcsEntity(entityIndex);
        let mut i: u32 = 0;
        loop {
            if (i == statusHealthArray.len()) {
                break;
            }
            let buff = *statusHealthArray[i];
            match buff.getDamageOrHeal() {
                DamageOrHealEnum::Damage => statusHealthOnTurnProcs.append(EntityBuffEvent { name: 'poison', duration: buff.duration }),
                DamageOrHealEnum::Heal => (),
            }
            i = i + 1;
        };
        return statusHealthOnTurnProcs;
    }
    fn getEventBuffsArray(ref self: Battle) -> Array<BuffEvent> {
        let mut buffs: Array<BuffEvent> = ArrayTrait::new();
        let mut i: u32 = 0;
        loop {
            if (i == self.aliveEntities.len()) {
                break;
            }
            let mut entity = self.entities.getValue(self.aliveEntities.getValue(i));
            let buffsArray = entity.getEventBuffsArray();
            let mut j: u32 = 0;
            loop {
                if (j == buffsArray.len()) {
                    break;
                }
                let buff = *buffsArray[j];
                buffs.append(BuffEvent { entityId: entity.index, name: buff.name, duration: buff.duration });
                j = j + 1;
            };
            i = i + 1;
        };
        let buffsHealthArray = self.getEventBuffsHealthOnTurnProcs();
        let mut k: u32 = 0;
        loop {
            if (k == buffsHealthArray.len()) {
                break;
            }
            let buff = *buffsHealthArray[k];
            buffs.append(buff);
            k = k + 1;
        };
        return buffs;
    }
    fn getEventBuffsHealthOnTurnProcs(ref self: Battle) -> Array<BuffEvent> {
        let mut buffsHealthOnTurnProcs: Array<BuffEvent> = Default::default();
        let mut i: u32 = 0;
        loop {
            if (i == self.healthOnTurnProcs.len()) {
                break;
            }
            let onTurnProc = self.healthOnTurnProcs.getValue(i);
            match onTurnProc.getDamageOrHeal() {
                DamageOrHealEnum::Damage => (),
                DamageOrHealEnum::Heal => buffsHealthOnTurnProcs.append(BuffEvent { entityId: onTurnProc.entityIndex, name: 'regen', duration: onTurnProc.duration }),
            }
            i = i + 1;
        };
        return buffsHealthOnTurnProcs;
    }
    fn getEventStatusArray(ref self: Battle) -> Array<BuffEvent> {
        let mut status: Array<BuffEvent> = ArrayTrait::new();
        let mut i: u32 = 0;
        loop {
            if (i == self.aliveEntities.len()) {
                break;
            }
            let mut entity = self.entities.getValue(self.aliveEntities.getValue(i));
            let statusArray = entity.getEventStatusArray();
            let mut j: u32 = 0;
            loop {
                if (j == statusArray.len()) {
                    break;
                }
                let statusBuff = *statusArray[j];
                status.append(BuffEvent { entityId: entity.index, name: statusBuff.name, duration: statusBuff.duration });
                j = j + 1;
            };
            i = i + 1;
        };
        let statusHealthArray = self.getEventStatusHealthOnTurnProcs();
        let mut k: u32 = 0;
        loop {
            if (k == statusHealthArray.len()) {
                break;
            }
            let statusBuff = *statusHealthArray[k];
            status.append(statusBuff);
            k = k + 1;
        };
        return status;
    }
    fn getEventStatusHealthOnTurnProcs(ref self: Battle) -> Array<BuffEvent> {
        let mut statusHealthOnTurnProcs: Array<BuffEvent> = Default::default();
        let mut i: u32 = 0;
        loop {
            if (i == self.healthOnTurnProcs.len()) {
                break;
            }
            let onTurnProc = self.healthOnTurnProcs.getValue(i);
            match onTurnProc.getDamageOrHeal() {
                DamageOrHealEnum::Damage => statusHealthOnTurnProcs.append(BuffEvent { entityId: onTurnProc.entityIndex, name: 'poison', duration: onTurnProc.duration }),
                DamageOrHealEnum::Heal => (),
            }
            i = i + 1;
        };
        return statusHealthOnTurnProcs;
    }
    fn getHealthOnTurnProcsEntity(ref self: Battle, entityIndex: u32) -> Array<HealthOnTurnProc> {
        let mut healthOnTurnProcs: Array<HealthOnTurnProc> = ArrayTrait::new();
        let mut i: u32 = 0;
        loop {
            if (i == self.healthOnTurnProcs.len()) {
                break;
            }
            let mut onTurnProc = self.healthOnTurnProcs.getValue(i);
            if (onTurnProc.getEntityIndex() == entityIndex) {
                healthOnTurnProcs.append(onTurnProc);
            }
            i = i + 1;
        };
        return healthOnTurnProcs;
    }
    fn getHealthsArray(ref self: Battle) -> Array<u64> {
        let mut healths: Array<u64> = ArrayTrait::new();
        let mut i: u32 = 0;
        loop {
            if (i == self.aliveEntities.len()) {
                break;
            }
            let mut entity = self.entities.getValue(self.aliveEntities.getValue(i));
            healths.append(entity.getHealth().mag);
            i = i + 1;
        };
        return healths;
    }
    fn getEntityByIndex(ref self: Battle, entityIndex: u32) -> Entity {
        return self.entities.getValue(entityIndex);
    }
    fn getOwner(self: Battle) -> ContractAddress {
        return self.owner;
    }
    fn printTurnTimeline(ref self: Battle) {
        let mut i: u32 = 0;
        loop {
            if (i >= self.turnTimeline.len()) {
                break;
            }
            let entityIndex = self.turnTimeline.getValue(i);
            println!("Entity index : {}", entityIndex);
            let entity = self.entities.getValue(entityIndex);
            (*entity.getTurnBar().turnbar).print();
            entity.getSpeed().print();
            i = i + 1;
        };
    }
    fn print(ref self: Battle) {
        self.printAllEntities();
    }
    fn printAllEntities(ref self: Battle) {
        let mut i: u32 = 0;
        loop {
            if (i >= self.entities.len()) {
                break;
            }
            let battleHero = self.entities.getValue(i);
            battleHero.print();
            i = i + 1;
        };
    }
}
