#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct EnemyRanges {
    #[key]
    index: u32,
    minRank: u64,
    range: u64,
}