use game::models::hero::rune::Rune;
use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Runes {
    #[key]
    owner: ContractAddress,
    #[key]
    index: u32,
    rune: Rune,
}