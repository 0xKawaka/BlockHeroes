use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct BattleStorage {
    #[key]
    owner: ContractAddress,
    #[key]
    map: u16,
    level: u16,
    entitiesCount: u32,
    aliveEntitiesCount: u32,
    isBattleOver: bool,
    isWaitingForPlayerAction: bool,
}