use game::models::battle::entity::{EntityTrait, EntityImpl, Entity};

#[derive(starknet::Store, Copy, Drop, Serde)]
enum DamageOrHealEnum {
    Damage,
    Heal,
}

#[derive(starknet::Store, Copy, Drop)]
struct HealthOnTurnProc {
    entityIndex: u32,
    value: u64,
    duration: u8,
    damageOrHeal: DamageOrHealEnum,
}

fn new(entityIndex: u32, value: u64, duration: u8, damageOrHeal: DamageOrHealEnum) -> HealthOnTurnProc {
    HealthOnTurnProc {
        entityIndex: entityIndex,
        value: value,
        duration: duration,
        damageOrHeal: damageOrHeal,
    }
}

trait HealthOnTurnProcTrait {
    fn proc(ref self: HealthOnTurnProc, ref entity: Entity) -> u64;
    fn isExpired(ref self: HealthOnTurnProc) -> bool;
    fn reduceDuration(ref self: HealthOnTurnProc);
    fn getDamageOrHeal(self: HealthOnTurnProc) -> DamageOrHealEnum;
    fn getEntityIndex(self: HealthOnTurnProc) -> u32;
}

impl HealthOnTurnProcImpl of HealthOnTurnProcTrait {
    fn proc(ref self: HealthOnTurnProc, ref entity: Entity) -> u64 {
        self.reduceDuration();
        let damageOrHealValue = (self.value.into() * entity.getMaxHealth()) / 100;
        match self.damageOrHeal {
            DamageOrHealEnum::Damage => entity.takeDamage(damageOrHealValue),
            DamageOrHealEnum::Heal => entity.takeHealAllowOverheal(damageOrHealValue),
        }
        return damageOrHealValue;
    }
    fn isExpired(ref self: HealthOnTurnProc) -> bool {
        self.duration == 0
    }
    fn reduceDuration(ref self: HealthOnTurnProc) {
        self.duration -= 1;
    }
    fn getDamageOrHeal(self: HealthOnTurnProc) -> DamageOrHealEnum {
        self.damageOrHeal
    }
    fn getEntityIndex(self: HealthOnTurnProc) -> u32 {
        self.entityIndex
    }
}