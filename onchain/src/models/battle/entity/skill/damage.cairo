use game::utils::iVector::VecTrait;
use game::models::battle::{Battle, BattleTrait};
use game::models::battle::entity::{Entity, EntityImpl, EntityTrait};
use game::models::events::{IdAndValue};

#[derive(Copy, Drop, Serde, Introspect)]
struct Damage {
    value: u64,
    target: bool,
    aoe: bool,
    self: bool,
    damageType: DamageType,
}

#[derive(Copy, Drop, Serde, Introspect)]
enum DamageType {
    Flat,
    Percent,
}

fn new(value: u64, target: bool, aoe: bool, self: bool, damageType: DamageType) -> Damage {
    return Damage { value: value, target: target, aoe: aoe, self: self, damageType: damageType, };
}

trait DamageTrait {
    fn apply(self: Damage, ref caster: Entity, ref target: Entity, ref battle: Battle) -> Array<IdAndValue>;
    fn computeDamage(self: Damage, ref caster: Entity, ref target: Entity) -> u64;
}

impl DamageImpl of DamageTrait {
    fn apply(self: Damage, ref caster: Entity, ref target: Entity, ref battle: Battle) -> Array<IdAndValue> {
        let mut damageByIdArray: Array<IdAndValue> = Default::default();
        if (self.value == 0) {
            return damageByIdArray;
        }

        if (self.aoe) {
            let enemies = battle.getAliveAlliesOf(target.index);
            let mut i: u32 = 0;
            loop {
                if (i >= enemies.len()) {
                    break;
                }
                let mut enemy = *enemies[i];
                
                // Can bug if damage AOE on own team, copy heal impl for that

                // Apply on target direcly to prevent it being overwritten later
                if(target.index == enemy.getIndex()) {
                    let damage = self.computeDamage(ref caster, ref target);
                    target.takeDamage(damage);
                    damageByIdArray.append(IdAndValue { entityId: target.index, value: damage });
                    i += 1;
                    continue;
                }

                let damage = self.computeDamage(ref caster, ref enemy);
                enemy.takeDamage(damage);
                damageByIdArray.append(IdAndValue { entityId: enemy.index, value: damage });
                battle.entities.set(enemy.index, enemy);
                i += 1;
            }
        } else {
            if (self.self) {
                let damage = self.computeDamage(ref caster, ref caster);
                caster.takeDamage(damage);
                damageByIdArray.append(IdAndValue { entityId: caster.index, value: damage });
            }
            if (self.target) {
                // if already damaged self and target is self, return
                if(self.self && target.index == caster.index){
                    return damageByIdArray;
                }
                if(target.index == caster.index) {
                    let damage = self.computeDamage(ref caster, ref caster);
                    caster.takeDamage(damage);
                    damageByIdArray.append(IdAndValue { entityId: caster.index, value: damage });
                }
                else {
                    let damage = self.computeDamage(ref caster, ref target);
                    target.takeDamage(damage);
                    damageByIdArray.append(IdAndValue { entityId: target.index, value: damage });
                }
            }
        }
        return damageByIdArray;
    }
    fn computeDamage(self: Damage, ref caster: Entity, ref target: Entity) -> u64 {
        match self.damageType {
            DamageType::Flat => {
                return (self.value * caster.getAttack()) / target.getDefense();
            },
            DamageType::Percent => {
                return (self.value * target.getMaxHealth()) / 100;
            },
        }
    }
}
