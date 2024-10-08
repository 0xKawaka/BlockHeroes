mod statistic;
mod statModifier;

use game::models::battle::entity::statistics::statistic::{StatisticTrait, StatisticImpl};
use game::models::battle::entity::statistics::statModifier::{StatModifierTrait, StatModifierImpl};
use game::models::battle::entity::skill::buff::BuffType;
use game::utils::signedIntegers::{i64::i64, i64::i64Impl};

use debug::PrintTrait;

#[derive(Copy, Drop, Serde, Introspect)]
pub struct Statistics {
    pub maxHealth: u64,
    pub health: i64,
    pub attack: statistic::Statistic,
    pub defense: statistic::Statistic,
    pub speed: statistic::Statistic,
    pub criticalChance: statistic::Statistic,
    pub criticalDamage: statistic::Statistic,
}

fn new(
    health: u64, attack: u64, defense: u64, speed: u64, criticalChance: u64, criticalDamage: u64
) -> Statistics {
    Statistics {
        maxHealth: health,
        health: i64Impl::new(health, false),
        attack: statistic::new(attack),
        defense: statistic::new(defense),
        speed: statistic::new(speed),
        criticalChance: statistic::new(criticalChance),
        criticalDamage: statistic::new(criticalDamage),
    }
}

trait StatisticsTrait {
    fn reduceBuffsStatusDuration(ref self: Statistics);
    fn applyStatModifier(
        ref self: Statistics, buffType: BuffType, statModifierValue: u64, statModifierDuration: u8,
    );
    fn resetBonusMalus(ref self: Statistics);
    fn getAttack(self: @Statistics) -> u64;
    fn getDefense(self: @Statistics) -> u64;
    fn getSpeed(self: @Statistics) -> u64;
    fn getCriticalChance(self: @Statistics) -> u64;
    fn getCriticalDamage(self: @Statistics) -> u64;
    fn getHealth(self: @Statistics) -> i64;
    fn getMaxHealth(self: @Statistics) -> u64;
    fn print(self: @Statistics);
}

impl StatisticsImpl of StatisticsTrait {
    fn reduceBuffsStatusDuration(ref self: Statistics) {
        self.attack.bonus.reduceDuration();
        self.defense.bonus.reduceDuration();
        self.speed.bonus.reduceDuration();
        // self.criticalChance.bonus.reduceDuration();
        // self.criticalDamage.bonus.reduceDuration();
        self.attack.malus.reduceDuration();
        self.defense.malus.reduceDuration();
        self.speed.malus.reduceDuration();
        // self.criticalChance.malus.reduceDuration();
        // self.criticalDamage.malus.reduceDuration();
    }
    fn applyStatModifier(
        ref self: Statistics, buffType: BuffType, statModifierValue: u64, statModifierDuration: u8
    ) {
        if(buffType == BuffType::SpeedUp) {
            self.speed.setBonus(statModifierValue, statModifierDuration);
        }
        else if (buffType == BuffType::SpeedDown) {
            self.speed.setMalus(statModifierValue, statModifierDuration);
        }
        else if (buffType == BuffType::AttackUp) {
            self.attack.setBonus(statModifierValue, statModifierDuration);
        }
        else if (buffType == BuffType::AttackDown) {
            self.attack.setMalus(statModifierValue, statModifierDuration);
        }
        else if (buffType == BuffType::DefenseUp) {
            self.defense.setBonus(statModifierValue, statModifierDuration);
        }
        else if (buffType == BuffType::DefenseDown) {
            self.defense.setMalus(statModifierValue, statModifierDuration);
        }      
    }
    fn resetBonusMalus(ref self: Statistics) {
        self.attack.resetBonusMalus();
        self.defense.resetBonusMalus();
        self.speed.resetBonusMalus();
        self.criticalChance.resetBonusMalus();
        self.criticalDamage.resetBonusMalus();
    }
    fn getAttack(self: @Statistics) -> u64 {
        return self.attack.getModifiedValue();
    }
    fn getDefense(self: @Statistics) -> u64 {
        return self.defense.getModifiedValue();
    }
    fn getSpeed(self: @Statistics) -> u64 {
        return self.speed.getModifiedValue();
    }
    fn getCriticalChance(self: @Statistics) -> u64 {
        return self.criticalChance.getModifiedValue();
    }
    fn getCriticalDamage(self: @Statistics) -> u64 {
        return self.criticalDamage.getModifiedValue();
    }
    fn getHealth(self: @Statistics) -> i64 {
        return *self.health;
    }
    fn getMaxHealth(self: @Statistics) -> u64 {
        return *self.maxHealth;
    }
    fn print(self: @Statistics) {
        (*self.health).print();
        (*self.attack.value).print();
        (*self.defense.value).print();
        (*self.speed.value).print();
        (*self.criticalChance.value).print();
        (*self.criticalDamage.value).print();
    }
}
