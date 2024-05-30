use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct TurnTimelineStorage {
    #[key]
    owner: ContractAddress,
    #[key]
    map: u16,
    #[key]
    index: u16,
    entityIndex: u16,
}