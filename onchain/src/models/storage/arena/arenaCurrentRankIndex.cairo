#[derive(Model, Copy, Drop, Serde)]
struct ArenaCurrentRankIndex {
    #[key]
    id: u8,
    currentRankIndex: u64,
}