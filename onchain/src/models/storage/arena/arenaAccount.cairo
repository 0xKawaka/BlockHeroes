use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct ArenaAccount {
    #[key]
    owner: ContractAddress,
    rank: u64,
    lastClaimedRewards: u64,
    // teamSize: u32,
}