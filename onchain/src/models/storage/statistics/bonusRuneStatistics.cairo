use game::models::hero::{HeroTrait, Hero, rune::Rune, rune::RuneImpl, rune::RuneRarity, rune::RuneStatistic};

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct BonusRuneStatistics {
    #[key]
    statistic: RuneStatistic,
    #[key]
    rarity: RuneRarity,
    #[key]
    isPercent: bool,
    value: u32,
}

fn new(statistic: RuneStatistic, rarity: RuneRarity, isPercent: bool, value: u32) -> BonusRuneStatistics {
    BonusRuneStatistics {
        statistic,
        rarity,
        isPercent,
        value,
    }
}