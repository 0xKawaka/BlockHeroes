#[derive(Model, Copy, Drop, Serde)]
struct ArenaConfig {
    #[key]
    id: u8,
    enemyRangesByRankLength: u32,
    gemsRewardsLength: u32,
}