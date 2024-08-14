use game::models::hero::rune::RuneStatistic;
use debug::PrintTrait;

#[derive(Copy, Drop, Serde, Introspect)]
pub struct RuneBonus {
    pub statistic: RuneStatistic,
    pub isPercent: bool,
}

fn new(statistic: RuneStatistic, isPercent: bool) -> RuneBonus {
    RuneBonus {
        statistic,
        isPercent,
    }
}

trait RuneBonusTrait {
    fn print(self: RuneBonus);
    fn statisticToString(self: RuneBonus)-> felt252;
}

impl RuneBonusImpl of RuneBonusTrait {
    fn print(self: RuneBonus) {
        self.statisticToString().print();
    }
    fn statisticToString(self: RuneBonus)-> felt252 {
        let mut statisticStr: felt252 = '';
        match self.statistic {
            RuneStatistic::Health => statisticStr = 'health',
            RuneStatistic::Attack => statisticStr = 'attack',
            RuneStatistic::Defense => statisticStr = 'defense',
            RuneStatistic::Speed => statisticStr = 'speed',
        }
        return statisticStr;
    }
}