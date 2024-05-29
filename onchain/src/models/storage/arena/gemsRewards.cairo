#[derive(Model, Copy, Drop, Serde)]
struct GemsRewards {
    #[key]
    index: u32,
    minRank: u64,
    gems: u64,
}