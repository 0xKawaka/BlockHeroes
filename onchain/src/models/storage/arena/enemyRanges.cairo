#[derive(Model, Copy, Drop, Serde)]
struct EnemyRanges {
    #[key]
    index: u32,
    minRank: u64,
    range: u64,
}