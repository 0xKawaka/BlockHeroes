#[cfg(test)]
mod accountsTest {
    // use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    // use dojo::test_utils::{spawn_test_world, deploy_contract};
    // use game::systems::{accounts::{Accounts, Accounts::AccountsImpl, IAccountsDispatcherTrait, IAccountsDispatcher}};
    // use game::models::account::{heroes::{heroes, Heroes}, runes::{runes, Runes}};
    // use game::models::account::{Account, AccountImpl, AccountTrait, account};
    // use game::models::hero::{Hero, HeroImpl, HeroTrait};
    // use game::models::battle::entity::skill::Skill;

    // fn setup_world() -> IAccountsDispatcher {
    //     let mut models = array![heroes::TEST_CLASS_HASH, runes::TEST_CLASS_HASH, account::TEST_CLASS_HASH];
 
    //     let world = spawn_test_world(models);
 
    //     let contract_address = world.deploy_contract('salt', Accounts::TEST_CLASS_HASH.try_into().unwrap());
    //     let accounts_system = IAccountsDispatcher { contract_address };
 
    //     accounts_system
    // }

    #[test]
    #[available_gas(900000000)]
    fn test() {
        // let caller = starknet::contract_address_const::<0x0>();
        // let accounts_system = setup_world();
        // accounts_system.initSkills();
    }
}