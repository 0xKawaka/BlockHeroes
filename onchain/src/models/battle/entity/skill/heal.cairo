use core::array::ArrayTrait;

use game::utils::iVector::VecTrait;

use game::models::battle::{Battle, BattleTrait};
use game::models::battle::entity::{Entity, EntityImpl, EntityTrait};
// use game::Contracts::EventEmitter::IdAndValueEvent;


#[derive(starknet::Store, Copy, Drop, Serde, Introspect)]
struct Heal {
    value: u64,
    target: bool,
    aoe: bool,
    self: bool,
    healType: HealType,
}

#[derive(starknet::Store, Copy, Drop, Serde, Introspect)]
enum HealType {
    Flat,
    Percent,
}

fn new(value: u64, target: bool, aoe: bool, self: bool, healType: HealType) -> Heal {
    return Heal { value: value, target: target, aoe: aoe, self: self, healType: healType, };
}

trait HealTrait {
    // fn apply(self: Heal, ref caster: Entity, ref target: Entity, ref battle: Battle) -> Array<IdAndValueEvent>;
    fn apply(self: Heal, ref caster: Entity, ref target: Entity, ref battle: Battle);
    fn computeHeal(self: Heal, ref target: Entity) -> u64;
}

impl HealImpl of HealTrait {
    fn apply(self: Heal, ref caster: Entity, ref target: Entity, ref battle: Battle) {
        // let mut healByIdArray: Array<IdAndValueEvent> = Default::default();
        if (self.value == 0) {
            // return healByIdArray;
            return;
        }

        if (self.aoe) {
            let allies = battle.getAliveAlliesOf(caster.index);
            let mut i: u32 = 0;
            loop {
                if (i >= allies.len()) {
                    break;
                }
                let mut ally = *allies[i];


                // Apply on caster direcly to prevent it being overwritten later
                if(caster.index == ally.getIndex()){
                    let heal = self.computeHeal(ref caster);
                    caster.takeHeal(heal);
                    // healByIdArray.append(IdAndValueEvent { entityId: caster.index, value: heal });
                    i += 1;
                    continue;
                }
                // Apply on target direcly to prevent it being overwritten later
                else if(target.index == ally.getIndex()) {
                    let heal = self.computeHeal(ref target);
                    target.takeHeal(heal);
                    // healByIdArray.append(IdAndValueEvent { entityId: target.index, value: heal });
                    i += 1;
                    continue;
                }

                let heal = self.computeHeal(ref ally);
                ally.takeHeal(heal);
                // healByIdArray.append(IdAndValueEvent { entityId: ally.index, value: heal });
                battle.entities.set(ally.index, ally);
                i += 1;
            }
        } else {
            if (self.self) {
                let heal = self.computeHeal(ref caster);
                caster.takeHeal(heal);
                // healByIdArray.append(IdAndValueEvent { entityId: caster.index, value: heal });
            }
            if (self.target) {
                // if already healed self and target is self, return
                if(self.self && target.index == caster.index){
                    // return healByIdArray;
                    return;
                }
                if(target.index == caster.index) {
                    let heal = self.computeHeal(ref caster);
                    caster.takeHeal(heal);
                    // healByIdArray.append(IdAndValueEvent { entityId: caster.index, value: heal });
                }
                else {
                    let heal = self.computeHeal(ref target);
                    target.takeHeal(heal);
                    // healByIdArray.append(IdAndValueEvent { entityId: target.index, value: heal });
                }
            }
        }
        // return healByIdArray;
    }
    fn computeHeal(self: Heal, ref target: Entity) -> u64 {
        match self.healType {
            HealType::Flat => {
                return self.value;
            },
            HealType::Percent => {
                return (self.value * target.getMaxHealth()) / 100;
            },
        }
    }
}