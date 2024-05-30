const decimals: u64 = 100;
const LEVEL_MULTIPLIER_BY_RANK: u64 = 10;

use game::models::storage::{statistics, statistics::Statistics};

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct BaseStatistics {
    #[key]
    heroName: felt252,
    statistics: Statistics,
}

fn new(
    heroName: felt252, health: u64, attack: u64, defense: u64, speed: u64, criticalRate: u64, criticalDamage: u64
) -> BaseStatistics {
    return BaseStatistics {
        heroName: heroName,
        statistics: statistics::new(health, attack, defense, speed, criticalRate, criticalDamage),
    };
}

trait BaseStatisticsTrait {
    fn computeHealth(self: BaseStatistics, level: u16, rank: u16) -> u64;
    fn computeAttack(self: BaseStatistics, level: u16, rank: u16) -> u64;
    fn computeDefense(self: BaseStatistics, level: u16, rank: u16) -> u64;
    fn computeSpeed(self: BaseStatistics, level: u16, rank: u16) -> u64;
    fn computeCriticalRate(self: BaseStatistics, level: u16, rank: u16) -> u64;
    fn computeCriticalDamage(self: BaseStatistics, level: u16, rank: u16) -> u64;
    fn computeAllStatistics(
        self: BaseStatistics, level: u16, rank: u16
    ) -> Statistics;
}

impl BaseStatisticsImpl of BaseStatisticsTrait {
    fn computeHealth(self: BaseStatistics, level: u16, rank: u16) -> u64 {
        return self.statistics.health + (self.statistics.health * (level.into() - 1) / decimals);
    }
    fn computeAttack(self: BaseStatistics, level: u16, rank: u16) -> u64 {
        return self.statistics.attack + (self.statistics.attack * (level.into() - 1) / decimals);
    }
    fn computeDefense(self: BaseStatistics, level: u16, rank: u16) -> u64 {
        return self.statistics.defense + (self.statistics.defense * (level.into() - 1) / decimals);
    }
    fn computeSpeed(self: BaseStatistics, level: u16, rank: u16) -> u64 {
        return self.statistics.speed + (self.statistics.speed * (level.into() - 1) / decimals);
    }
    fn computeCriticalRate(self: BaseStatistics, level: u16, rank: u16) -> u64 {
        return self.statistics.criticalRate;
    }
    fn computeCriticalDamage(self: BaseStatistics, level: u16, rank: u16) -> u64 {
        return self.statistics.criticalDamage;
    }
    fn computeAllStatistics(
        self: BaseStatistics, level: u16, rank: u16
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

