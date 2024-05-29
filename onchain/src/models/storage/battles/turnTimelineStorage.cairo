use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct TurnTimelineStorage {
    #[key]
    owner: ContractAddress,
    #[key]
    map: u16,
    #[key]
    index: u16,
    entityIndex: u16,
}