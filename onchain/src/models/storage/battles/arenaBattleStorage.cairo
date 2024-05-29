use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct ArenaBattleStorage {
    #[key]
    owner: ContractAddress,
    enemyOwner: ContractAddress,
}