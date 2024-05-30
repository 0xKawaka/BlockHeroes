#[cfg(test)]
mod tests {
    use starknet::class_hash::Felt252TryIntoClassHash;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use dojo::test_utils::{spawn_test_world, deploy_contract};

    use game::systems::game::{Game, IGameDispatcher, IGameDispatcherTrait};
    use game::systems::settings::{Settings, ISettingsDispatcher, ISettingsDispatcherTrait};
    use game::models::account::{heroes::{heroes, Heroes}, runes::{runes, Runes}};
    use game::models::account::{Account, AccountImpl, AccountTrait, account};
    use game::models::storage::battles::{entityStorage::{EntityStorage, entity_storage}};
    use game::models::map::{MapTrait, Map};

    #[test]
    #[available_gas(900000000000)]
    fn test_game() {
        let caller = starknet::contract_address_const::<0x0>();
        let mut models = array![heroes::TEST_CLASS_HASH, runes::TEST_CLASS_HASH, account::TEST_CLASS_HASH, entity_storage::TEST_CLASS_HASH];
        let world = spawn_test_world(models);

        let game_contract_adrs = world.deploy_contract('salt', Game::TEST_CLASS_HASH.try_into().unwrap(), array![].span());
        let game = IGameDispatcher { contract_address: game_contract_adrs };

        let settings_contract_adrs = world.deploy_contract('salt2', Settings::TEST_CLASS_HASH.try_into().unwrap(), array![].span());
        let settings = ISettingsDispatcher { contract_address: settings_contract_adrs };

        settings.initSettings();

        game.createAccount('testuser');
        let mut acc = get!(world, caller, Account);
        assert(acc.username == 'testuser', 'Username incorrect');

        game.mintHero();
        let mut newAccState = get!(world, caller, Account);
        assert(newAccState.heroesCount == acc.heroesCount + 1, 'Hero not minted');

        game.mintRune();
        game.mintRune();
        newAccState = get!(world, caller, Account);
        assert(newAccState.runesCount == acc.runesCount + 2, 'Rune not minted');
        let rune = get!(world, (caller, 1), Runes).rune;
        assert(rune.id == 1, 'Rune id incorrect');

        game.startBattle(array![1, 2, 3], Map::Campaign.toU16(), 0);
        game.playTurn(Map::Campaign.toU16(), 0, 5);
    }
}
