#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct ArenaCurrentRankIndex {
    #[key]
    id: u8,
    currentRankIndex: u64,
}