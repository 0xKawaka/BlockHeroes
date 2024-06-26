const decimals: u64 = 100;
const LEVEL_MULTIPLIER_BY_RANK: u64 = 10;

use game::models::storage::{statistics, statistics::Statistics};

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct BaseHero {
    #[key]
    heroName: felt252,
    statistics: Statistics,
    skillsCount: u8,
}

fn new(
    heroName: felt252, health: u64, attack: u64, defense: u64, speed: u64, criticalRate: u64, criticalDamage: u64, skillsCount: u8
) -> BaseHero {
    return BaseHero {
        heroName: heroName,
        statistics: statistics::new(health, attack, defense, speed, criticalRate, criticalDamage),
        skillsCount: skillsCount,
    };
}

trait BaseHeroTrait {
    fn computeHealth(self: BaseHero, level: u16, rank: u16) -> u64;
    fn computeAttack(self: BaseHero, level: u16, rank: u16) -> u64;
    fn computeDefense(self: BaseHero, level: u16, rank: u16) -> u64;
    fn computeSpeed(self: BaseHero, level: u16, rank: u16) -> u64;
    fn computeCriticalRate(self: BaseHero, level: u16, rank: u16) -> u64;
    fn computeCriticalDamage(self: BaseHero, level: u16, rank: u16) -> u64;
    fn computeAllStatistics(
        self: BaseHero, level: u16, rank: u16
    ) -> Statistics;
}

impl BaseHeroImpl of BaseHeroTrait {
    fn computeHealth(self: BaseHero, level: u16, rank: u16) -> u64 {
        return self.statistics.health + (self.statistics.health * (level.into() - 1) / decimals);
    }
    fn computeAttack(self: BaseHero, level: u16, rank: u16) -> u64 {
        return self.statistics.attack + (self.statistics.attack * (level.into() - 1) / decimals);
    }
    fn computeDefense(self: BaseHero, level: u16, rank: u16) -> u64 {
        return self.statistics.defense + (self.statistics.defense * (level.into() - 1) / decimals);
    }
    fn computeSpeed(self: BaseHero, level: u16, rank: u16) -> u64 {
        return self.statistics.speed + (self.statistics.speed * (level.into() - 1) / decimals);
    }
    fn computeCriticalRate(self: BaseHero, level: u16, rank: u16) -> u64 {
        return self.statistics.criticalRate;
    }
    fn computeCriticalDamage(self: BaseHero, level: u16, rank: u16) -> u64 {
        return self.statistics.criticalDamage;
    }
    fn computeAllStatistics(
        self: BaseHero, level: u16, rank: u16
    ) -> Statistics {
        return statistics::new(
            self.computeHealth(level, rank),
            self.computeAttack(level, rank),
            self.computeDefense(level, rank),
            self.computeSpeed(level, rank),
            self.computeCriticalRate(level, rank),
            self.computeCriticalDamage(level, rank)
        );
    }
}

