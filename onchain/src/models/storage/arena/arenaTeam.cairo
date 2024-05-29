use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct ArenaTeam {
    #[key]
    owner: ContractAddress,
    #[key]
    index: u32,
    heroIndex: u32,
}