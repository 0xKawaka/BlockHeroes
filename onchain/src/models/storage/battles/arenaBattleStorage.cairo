use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct ArenaBattleStorage {
    #[key]
    owner: ContractAddress,
    enemyOwner: ContractAddress,
}