#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct GemsRewards {
    #[key]
    index: u32,
    minRank: u64,
    gems: u64,
}