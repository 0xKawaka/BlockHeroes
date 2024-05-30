use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct ArenaAccount {
    #[key]
    owner: ContractAddress,
    rank: u64,
    lastClaimedRewards: u64,
    // teamSize: u32,
}