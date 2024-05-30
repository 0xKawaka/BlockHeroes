use starknet::ContractAddress;
use game::models::battle::entity::Entity;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct EntityStorage {
    #[key]
    owner: ContractAddress,
    #[key]
    map: u16,
    #[key]
    entityIndex: u32,
    entityVal: Entity,
    healthOnTurnProcCount: u32,
}
