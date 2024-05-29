use starknet::ContractAddress;
use game::models::battle::entity::Entity;

#[derive(Model, Copy, Drop, Serde)]
struct EntityStorage {
    #[key]
    owner: ContractAddress,
    #[key]
    map: u16,
    #[key]
    entityIndex: u32,
    entity: Entity,
    healthOnTurnProcCount: u32,
}
