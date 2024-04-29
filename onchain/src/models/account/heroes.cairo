use game::models::hero::Hero;
use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Model)]
struct Heroes {
    #[key]
    owner: ContractAddress,
    #[key]
    index: u32,
    hero: Hero,
}