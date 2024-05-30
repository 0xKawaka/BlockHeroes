#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct ArenaConfig {
    #[key]
    id: u8,
    enemyRangesByRankLength: u32,
    gemsRewardsLength: u32,
}