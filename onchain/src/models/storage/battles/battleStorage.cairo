use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
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