use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct MapProgress {
    #[key]
    owner: ContractAddress,
    #[key]
    map: u16,
    level: u16,
}