use game::models::hero::{HeroTrait, Hero, rune::Rune, rune::RuneImpl, rune::RuneRarity, rune::RuneStatistic};

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct BonusRuneStatistics {
    #[key]
    pub statistic: RuneStatistic,
    #[key]
    pub rarity: RuneRarity,
    #[key]
    pub isPercent: bool,
    pub value: u32,
}

fn new(statistic: RuneStatistic, rarity: RuneRarity, isPercent: bool, value: u32) -> BonusRuneStatistics {
    BonusRuneStatistics {
        statistic,
        rarity,
        isPercent,
        value,
    }
}