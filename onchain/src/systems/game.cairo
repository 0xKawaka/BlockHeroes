use starknet::ContractAddress;

#[dojo::interface]
trait IGame {
    fn startPvpBattle(enemyOwner: ContractAddress, heroesIds: Array<u32>);
    fn playArenaTurn(spellIndex: u8, targetIndex: u32);
    fn startBattle(heroesIds: Array<u32>, map: u16, level: u16);
    fn playTurn(map: u16, spellIndex: u8, targetIndex: u32);
    fn initPvp(heroesIds: Array<u32>);
    fn setPvpTeam(heroesIds: Array<u32>);
    fn equipRune(runeId: u32, heroId: u32);
    fn unequipRune(runeId: u32);
    fn upgradeRune(runeId: u32);
    fn mintHero();
    fn mintRune();
    fn createAccount(username: felt252);
}

#[dojo::contract]
mod Game {
    use core::array::ArrayTrait;
    use starknet::{get_caller_address,get_block_timestamp, ContractAddress};
    use debug::PrintTrait;

    use game::systems::accounts::Accounts::AccountsImpl;
    use game::systems::entityFactory::EntityFactory::EntityFactoryImpl;
    use game::systems::levels::Levels::LevelsImpl;
    use game::systems::battles::Battles::BattlesImpl;
    use game::systems::arena::Arena::ArenaImpl;
    use game::models::account::{Account, AccountImpl};
    use game::models::hero::{Hero, HeroImpl, HeroTrait};
    use game::models::battle::entity::{Entity, EntityImpl, EntityTrait, AllyOrEnemy};
    use game::models::storage::mapProgress::MapProgress;
    use game::utils::nullableVector::{NullableVector, NullableVectorImpl, VecTrait};

    #[abi(embed_v0)]
    impl GameImpl of super::IGame<ContractState> {
        fn startPvpBattle(world: @IWorldDispatcher, enemyOwner: ContractAddress, heroesIds: Array<u32>) {
            assert(heroesIds.len() < 5 && heroesIds.len() > 0, '1 hero min, 4 heroes max');
            let caller = get_caller_address();
            AccountsImpl::hasAccount(world, caller);
            ArenaImpl::hasAccount(world, caller);
            ArenaImpl::hasAccount(world, enemyOwner);
            ArenaImpl::assertEnemyInRange(world, caller, enemyOwner);
            AccountsImpl::decreasePvpEnergy(world, caller, 1);
            let allyHeroes = AccountsImpl::getHeroes(world, caller, heroesIds.span());
            let allyEntities = EntityFactoryImpl::newEntities(world, caller, 0, allyHeroes, AllyOrEnemy::Ally);
            let enemyHeroesIndex = ArenaImpl::getTeam(world, enemyOwner);
            let enemyHeroes = AccountsImpl::getHeroes(world, enemyOwner, enemyHeroesIndex.span());
            let enemyEntities = EntityFactoryImpl::newEntities(world, enemyOwner, allyEntities.len(), enemyHeroes, AllyOrEnemy::Enemy);
            BattlesImpl::newArenaBattle(world, caller, enemyOwner, allyEntities, enemyEntities);
        }
        fn playArenaTurn(world: @IWorldDispatcher, spellIndex: u8, targetIndex: u32) {
            BattlesImpl::playArenaTurn(world, get_caller_address(), spellIndex, targetIndex);
        }
        fn startBattle(world: @IWorldDispatcher, heroesIds: Array<u32>, map: u16, level: u16) {
            assert(heroesIds.len() < 5 && heroesIds.len() > 0, '1 hero min, 4 heroes max');
            AccountsImpl::hasAccount(world, get_caller_address());
            let caller = get_caller_address();
            let progressLevel = get!(world, (caller, map), MapProgress).level;
            assert(progressLevel >= level, 'level not unlocked');
            let energyCost = LevelsImpl::getEnergyCost(world, map, level);
            AccountsImpl::decreaseEnergy(world, caller, energyCost);
            let allyHeroes = AccountsImpl::getHeroes(world, caller, heroesIds.span());
            let allyEntities = EntityFactoryImpl::newEntities(world, caller, 0, allyHeroes, AllyOrEnemy::Ally);
            let enemyHeroes = LevelsImpl::getEnemies(world, map, level);
            let enemyEntities = EntityFactoryImpl::newEntities(world, caller, allyEntities.len(), enemyHeroes, AllyOrEnemy::Enemy);
            BattlesImpl::newBattle(world, caller, allyEntities, enemyEntities, map, level);
        }
        fn playTurn(world: @IWorldDispatcher, map: u16, spellIndex: u8, targetIndex: u32) {
            BattlesImpl::playTurn(world, get_caller_address(), map, spellIndex, targetIndex);
        }
        fn initPvp(world: @IWorldDispatcher, heroesIds: Array<u32>) {
            assert(heroesIds.len() < 5 && heroesIds.len() > 0, '1 hero min, 4 heroes max');
            AccountsImpl::hasAccount(world, get_caller_address());
            ArenaImpl::hasNoAccount(world, get_caller_address());
            AccountsImpl::isOwnerOfHeroes(world, get_caller_address(), heroesIds.span());
            ArenaImpl::initAccount(world, get_caller_address(), heroesIds);
        }
        fn setPvpTeam(world: @IWorldDispatcher, heroesIds: Array<u32>) {
            assert(heroesIds.len() < 5 && heroesIds.len() > 0, '1 hero min, 4 heroes max');
            AccountsImpl::hasAccount(world, get_caller_address());
            AccountsImpl::isOwnerOfHeroes(world, get_caller_address(), heroesIds.span());
            ArenaImpl::setTeam(world, get_caller_address(), heroesIds.span());
        }
        fn equipRune(world: @IWorldDispatcher, runeId: u32, heroId: u32) {
            AccountsImpl::equipRune(world, get_caller_address(), runeId, heroId);
        }
        fn unequipRune(world: @IWorldDispatcher, runeId: u32) {
            AccountsImpl::unequipRune(world, get_caller_address(), runeId);
        }
        fn upgradeRune(world: @IWorldDispatcher, runeId: u32) {
            AccountsImpl::upgradeRune(world, get_caller_address(), runeId);
        }
        fn mintHero(world: @IWorldDispatcher) {
            AccountsImpl::mintHero(world, get_caller_address());
        }
        fn mintRune(world: @IWorldDispatcher) {
            AccountsImpl::mintRune(world, get_caller_address());
        }
        fn createAccount(world: @IWorldDispatcher, username: felt252) {
            AccountsImpl::createAccount(world,  username, get_caller_address());
        }
    }
}