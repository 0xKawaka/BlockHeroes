mod experienceHandler;
mod lootHandler;
mod battleFactory;

use starknet::ContractAddress;
use game::models::battle::entity::Entity;
use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};

trait IBattles {
    fn newArenaBattle(world: IWorldDispatcher, owner: ContractAddress, enemyOwner: ContractAddress, allyEntities: Array<Entity>, enemyEntities: Array<Entity>, heroesIds: Array<u32>);
    fn newBattle(world: IWorldDispatcher, owner: ContractAddress, allyEntities: Array<Entity>, enemyEntities: Array<Entity>, map: u16, level: u16);
    fn playArenaTurn(world: IWorldDispatcher, owner: ContractAddress, spellIndex: u8, targetIndex: u32);
    fn playTurn(world: IWorldDispatcher, owner: ContractAddress, map: u16, spellIndex: u8, targetIndex: u32);
}

mod Battles {
    use core::option::OptionTrait;
    use starknet::ContractAddress;
    use game::utils::nullableVector::NullableVectorImpl;

    use game::models::battle::entity::skill::SkillTrait;
    use game::models::{battle,  battle::Battle, battle::BattleImpl, battle::BattleTrait};
    use game::models::battle::entity::{Entity, EntityImpl, skill::SkillImpl};
    use game::models::battle::entity::{turnBar::TurnBarImpl};
    use game::models::battle::entity::healthOnTurnProc::{HealthOnTurnProc, HealthOnTurnProcImpl};
    use game::models::storage::battles::{healthOnTurnProcStorage::HealthOnTurnProcStorage, battleStorage::BattleStorage, entityStorage::EntityStorage, arenaBattleStorage::ArenaBattleStorage};
    use game::models::storage::arena::arenaAccount::ArenaAccount;
    use game::models::storage::mapProgress::MapProgress;
    use game::models::events::{Event, NewBattle};
    use game::models::map::{MapTrait, Map};
    use game::systems::levels::Levels::LevelsImpl;
    use game::systems::arena::Arena::ArenaImpl;
    use game::systems::skillFactory::SkillFactory::SkillFactoryImpl;
    use super::battleFactory::BattleFactory::BattleFactoryImpl;

    use game::systems::battles::experienceHandler;
    use game::systems::battles::lootHandler;
    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};

    impl BattlesImpl of super::IBattles {
        fn newArenaBattle(world: IWorldDispatcher, owner: ContractAddress, enemyOwner: ContractAddress, allyEntities: Array<Entity>, enemyEntities: Array<Entity>, heroesIds: Array<u32>) {
            InternalBattlesImpl::initArenaBattleStorage(world, owner, enemyOwner, allyEntities, enemyEntities);
            let mut battle = BattleFactoryImpl::getBattle(world, owner, 0);
            let healthsArray = battle.getHealthsArray();
            emit!(world, (Event::NewBattle(NewBattle { owner: owner, healthsArray: healthsArray })));
            battle.battleLoop(world);
            InternalBattlesImpl::ifArenaBattleIsOverHandle(world, owner, battle.isBattleOver, battle.isVictory);
            // InternalBattlesImpl::storeArenaBattleState(world, ref battle, owner);
        }
        fn newBattle(world: IWorldDispatcher, owner: ContractAddress, allyEntities: Array<Entity>, enemyEntities: Array<Entity>, map: u16, level: u16) {
            InternalBattlesImpl::initBattleStorage(world, owner, allyEntities, enemyEntities, map, level);
            let mut battle = BattleFactoryImpl::getBattle(world, owner, map);
            let healthsArray = battle.getHealthsArray();
            emit!(world, (Event::NewBattle(NewBattle { owner: owner, healthsArray: healthsArray })));
            battle.battleLoop(world);
            InternalBattlesImpl::ifBattleIsOverHandle(world, owner, map, battle.isBattleOver, battle.isVictory);
            InternalBattlesImpl::storeBattleState(world, ref battle, owner, map);
        }
        fn playArenaTurn(world: IWorldDispatcher, owner: ContractAddress, spellIndex: u8, targetIndex: u32) {
            let mut battle = BattleFactoryImpl::getBattle(world, owner, 0);
            battle.playTurn(world, spellIndex, targetIndex);
            InternalBattlesImpl::ifArenaBattleIsOverHandle(world, owner, battle.isBattleOver, battle.isVictory);
            // InternalBattlesImpl::storeArenaBattleState(world, ref battle, owner);
        }
        fn playTurn(world: IWorldDispatcher, owner: ContractAddress, map: u16, spellIndex: u8, targetIndex: u32) {
            let mut battle = BattleFactoryImpl::getBattle(world, owner, map);
            battle.playTurn(world, spellIndex, targetIndex);
            InternalBattlesImpl::ifBattleIsOverHandle(world, owner, map, battle.isBattleOver, battle.isVictory);
            InternalBattlesImpl::storeBattleState(world, ref battle, owner, map);
        }
    }

    #[generate_trait]
    impl InternalBattlesImpl of InternalBattlesTrait {
        fn getHeroesIdsByMap(world: IWorldDispatcher, owner: ContractAddress, map: u16) -> Array<u32> {
            let entitiesCount = get!(world, (owner, map), BattleStorage).entitiesCount;
            let mut i: u32 = 0;
            let mut heroesIds: Array<u32> = Default::default();
            loop {
                if( i == entitiesCount ) {
                    break;
                }
                let entityStorage = get!(world, (owner, map, i), EntityStorage);
                if(entityStorage.entityVal.isAlly()) {
                    heroesIds.append(entityStorage.entityVal.heroId);
                }
                i += 1;
            };
            return heroesIds;
        }
        fn ifBattleIsOverHandle(world: IWorldDispatcher, owner: ContractAddress, map: u16, isBattleOver: bool, isVictory: bool) {
            if(!isBattleOver || !isVictory) {
                return;
            }
            let heroesIds = Self::getHeroesIdsByMap(world, owner, map);
            let battleStorage = get!(world, (owner, map), BattleStorage);
            let levels = LevelsImpl::getEnemiesLevels(world, map, battleStorage.level);
            experienceHandler::computeAndDistributeExperience(world, owner, heroesIds, @levels);
            lootHandler::computeAndDistributeLoot(world, owner, @levels);
            let levelProgress = get!(world, (owner, map), MapProgress).level;
            if(levelProgress == battleStorage.level){
                set!(world, MapProgress { owner: owner, map: map, level: battleStorage.level + 1 });
            }
        }
                
        fn ifArenaBattleIsOverHandle(world: IWorldDispatcher, owner: ContractAddress, isBattleOver: bool, isVictory: bool) {
            if(!isBattleOver || !isVictory) {
                return;
            }
            let arenaBattleStorage = get!(world, owner, ArenaBattleStorage);
            let arenaAccounnt = get!(world, owner, ArenaAccount);
            ArenaImpl::swapRanks(world, owner, arenaBattleStorage.enemyOwner, arenaAccounnt.lastClaimedRewards);    
        }

        fn initArenaBattleStorage(world: IWorldDispatcher, owner: ContractAddress, enemyOwner: ContractAddress, allyEntities: Array<Entity>, enemyEntities: Array<Entity>) {
            set!(world,
                (
                    ArenaBattleStorage {
                        owner: owner,
                        enemyOwner: enemyOwner,
                    }
                )
            );
            Self::initBattleStorage(world, owner, allyEntities, enemyEntities, Map::Arena.toU16(), 0);

        }
        fn initBattleStorage(world: IWorldDispatcher, owner: ContractAddress, allyEntities: Array<Entity>, enemyEntities: Array<Entity>, map: u16, level: u16) {
            set!(world,
                (
                    BattleStorage {
                        owner: owner,
                        map: map,
                        level: level,
                        entitiesCount: allyEntities.len() + enemyEntities.len(),
                        aliveEntitiesCount: allyEntities.len() + enemyEntities.len(),
                        isBattleOver: false,
                        isWaitingForPlayerAction: false,
                    }
                )
            );
            let mut i: u32 = 0;
            loop {
                if( i == allyEntities.len() ) {
                    break;
                }
                set!(world,
                    (
                        EntityStorage {
                            owner: owner,
                            map: map,
                            entityIndex: allyEntities[i].getIndex(),
                            entityVal: *allyEntities[i],
                            healthOnTurnProcCount: 0,
                        }
                    )
                );
                i += 1;
            };
            i = 0;
            loop {
                if( i == enemyEntities.len() ) {
                    break;
                }
                set!(world,
                    (
                        EntityStorage {
                            owner: owner,
                            map: map,
                            entityIndex: enemyEntities[i].getIndex(),
                            entityVal: *enemyEntities[i],
                            healthOnTurnProcCount: 0,
                        }
                    )
                );
                i += 1;
            };
        }
        fn storeBattleState(world: IWorldDispatcher, ref battle: Battle, owner: ContractAddress, map: u16) {
            let battleInfos = get!(world, (owner, map), BattleStorage);

            set!(world,
                (
                    BattleStorage {
                        owner: battleInfos.owner,
                        map: battleInfos.map,
                        level: battleInfos.level,
                        entitiesCount: battle.entities.len(),
                        aliveEntitiesCount: battle.aliveEntities.len(),
                        isBattleOver: battle.isBattleOver,
                        isWaitingForPlayerAction: battle.isWaitingForPlayerAction,
                    }
                )
            );

            let mut i: u32 = 0;
            loop {
                if( i == battle.entities.len() ) {
                    break;
                }
                println!("stor entity {} isDead {}", battle.entities.get(i).unwrap().getIndex(), battle.entities.get(i).unwrap().isDead());
                let healthOnTurnProcsEntity: Array<HealthOnTurnProc> = battle.getHealthOnTurnProcsEntity(i);
                set!(world,
                    (
                        EntityStorage {
                            owner: battleInfos.owner,
                            map: battleInfos.map,
                            entityIndex: battle.entities.get(i).unwrap().getIndex(),
                            entityVal: battle.entities.get(i).unwrap(),
                            healthOnTurnProcCount: healthOnTurnProcsEntity.len(),
                        },
                    )
                
                );
                let mut j: u32 = 0;
                loop {
                    if( j == healthOnTurnProcsEntity.len() ) {
                        break;
                    }
                    set!(world,
                        (
                            HealthOnTurnProcStorage {
                                owner: battleInfos.owner,
                                map: battleInfos.map,
                                entityIndex: battle.entities.get(i).unwrap().getIndex(),
                                index: j,
                                healthOnTurnProc: *healthOnTurnProcsEntity[j],
                            }
                        )
                    );
                    j += 1;
                };
                i += 1;
            };
            
        }
    }
}