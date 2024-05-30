use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct ArenaTeam {
    #[key]
    owner: ContractAddress,
    #[key]
    index: u32,
    heroIndex: u32,
}