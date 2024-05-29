use game::models::hero::{HeroTrait, Hero, rune::Rune, rune::RuneImpl, rune::RuneRarity, rune::RuneStatistic};

#[derive(Model, Copy, Drop, Serde)]
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