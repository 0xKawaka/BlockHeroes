use starknet::ContractAddress;
use game::models::battle::entity::healthOnTurnProc::HealthOnTurnProc;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct HealthOnTurnProcStorage {
    #[key]
    owner: ContractAddress,
    #[key]
    map: u16,
    #[key]
    entityIndex: u32,
    #[key]
    index: u32,
    healthOnTurnProc: HealthOnTurnProc,
}
