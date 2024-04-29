use starknet::ContractAddress;
use game::models::hero::{Hero, rune::Rune};
use game::models::account::Account;

#[dojo::interface]
trait IAccounts {
    fn equipRune(accountAdrs: ContractAddress, runeId: u32, heroId: u32);
    fn unequipRune(accountAdrs: ContractAddress, runeId: u32);
    fn upgradeRune(accountAdrs: ContractAddress, runeId: u32);
    fn mintHero(accountAdrs: ContractAddress);
    fn mintHeroAdmin(accountAdrs: ContractAddress, name: felt252, level: u16, rank: u16);
    fn mintRune(accountAdrs: ContractAddress);
    fn createAccount( username: felt252, accountAdrs: ContractAddress);
    fn addExperienceToHeroId(accountAdrs: ContractAddress, heroId: u32, experience: u32);
    fn decreaseEnergy(accountAdrs: ContractAddress, energyCost: u16);
    fn decreasePvpEnergy(accountAdrs: ContractAddress, energyCost: u16);
    fn increaseCrystals(accountAdrs: ContractAddress, crystalsToAdd: u32);
    fn decreaseCrystals(accountAdrs: ContractAddress, crystalsToSub: u32);
    fn getAccount(accountAdrs: ContractAddress) -> Account;
    fn getHero(accountAdrs: ContractAddress, heroId: u32) -> Hero;
    fn getHeroes(accountAdrs: ContractAddress, heroesIds: Span<u32>) -> Array<Hero>;
    fn getAllHeroes(accountAdrs: ContractAddress) -> Array<Hero>;
    fn getRune(accountAdrs: ContractAddress, runeId: u32) -> Rune;
    fn getRunes(accountAdrs: ContractAddress, runesIds: Array<u32>) -> Array<Rune>;
    fn getAllRunes(accountAdrs: ContractAddress) -> Array<Rune>;
    fn getEnergyInfos(accountAdrs: ContractAddress) -> (u16, u64);
    fn hasAccount(accountAdrs: ContractAddress) -> bool;
    fn isOwnerOfHeroes(accountAdrs: ContractAddress, heroesIndexes: Span<u32>) -> bool;
    // // previously internal
    fn mintStarterHeroes(accountAdrs: ContractAddress) -> u32;
    fn mintStarterRunes(accountAdrs: ContractAddress) -> u32;
}

#[dojo::contract]
mod Accounts {
    use core::array::ArrayTrait;
    use core::option::OptionTrait;
    use core::box::BoxTrait;
    use debug::PrintTrait;
    use core::starknet::event::EventEmitter;
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};

    use game::models::hero::rune::RuneTrait;
    use game::models::hero::HeroTrait;
    use game::models::{account, account::{AccountImpl, AccountTrait, Account, heroes::Heroes, runes::Runes}};
    use game::models::{hero, hero::Hero, hero::HeroImpl, hero::rune, hero::EquippedRunesImpl, hero::rune::RuneImpl, hero::rune::Rune};
    use game::models::hero::rune::{RuneStatistic, RuneRarity, RuneType};

    use super::IAccounts;

    use game::utils::list::{List, ListTrait};
    use game::utils::random::rand32;


    #[abi(embed_v0)]
    impl AccountsImpl of super::IAccounts<ContractState> {
        fn equipRune(world: IWorldDispatcher, accountAdrs: ContractAddress, runeId: u32, heroId: u32) {
            let mut acc = self.getAccount(accountAdrs);
            assert(acc.heroesCount > heroId, 'heroId out of range');
            assert(acc.runesCount > runeId, 'runeId out of range');
            // let mut hero = get!(world, (acc.owner, heroId), (Heroes)).hero;
            // let mut rune = get!(world, (acc.owner, runeId), (Runes)).rune;
            // hero.equipRune(ref rune, ref runesList, world);
            // runesList.set(runeId, rune);
            // heroesList.set(heroId, hero);
        }
        fn unequipRune(world: IWorldDispatcher, accountAdrs: ContractAddress, runeId: u32) {
            let mut acc = self.getAccount(accountAdrs);
            assert(acc.runesCount > runeId, 'runeId out of range');
            let mut rune = get!(world, (acc.owner, runeId), (Runes)).rune;
            assert(rune.isEquipped(), 'Rune not equipped');
            let mut hero = get!(world, (acc.owner, rune.getHeroEquipped()), (Heroes)).hero;
            hero.unequipRune(ref rune);
            set!(world,
                (
                    Runes {owner: acc.owner, index: runeId, rune: rune},
                    Heroes {owner: acc.owner, index: hero.id, hero: hero},
                )
            );
        }
        fn upgradeRune(world: IWorldDispatcher, accountAdrs: ContractAddress, runeId: u32) {
            let mut acc = self.getAccount(accountAdrs);
            assert(acc.runesCount > runeId, 'runeId out of range');
            let mut rune = get!(world, (acc.owner, runeId), (Runes)).rune;
            rune.upgrade(ref acc);
            set!(world,
                (
                    Runes {owner: acc.owner, index: runeId, rune: rune},
                    acc,
                )
            );
        }
        fn mintHero(world: IWorldDispatcher, accountAdrs: ContractAddress) {
            let mut acc = self.getAccount(accountAdrs);
            let heroesPossible: Array<felt252> = array!['priest', 'assassin', 'knight', 'hunter'];
            let randIndex = rand32(get_block_timestamp(), heroesPossible.len());
            let heroName = *heroesPossible[randIndex];
            acc.heroesCount += 1;
            set!(world,
                (
                    Heroes {owner: accountAdrs, index: acc.heroesCount, hero: hero::new(acc.heroesCount, heroName, 1, 1)},
                    acc
                )
            );
            // self.IEventEmitterDispatch.read().heroMinted(accountAdrs, heroesList.len() - 1, heroName);
        }
        fn mintHeroAdmin(world: IWorldDispatcher, accountAdrs: ContractAddress, name: felt252, level: u16, rank: u16) {
            let mut acc = self.getAccount(accountAdrs);
            set!(world, Heroes {owner: accountAdrs, index: acc.heroesCount, hero: hero::new(acc.heroesCount, name, level, rank)});
            acc.heroesCount += 1;
            set!(world, (acc));
            // self.IEventEmitterDispatch.read().heroMinted(accountAdrs, heroesList.len() - 1, name);
        }
        fn mintRune(world: IWorldDispatcher, accountAdrs: ContractAddress) {
            let mut acc = self.getAccount(accountAdrs);
            set!(world, Runes {owner: accountAdrs, index: acc.runesCount, rune: rune::new(acc.runesCount)});
            acc.runesCount += 1;
            set!(world, (acc));
            // self.IEventEmitterDispatch.read().runeMinted(accountAdrs, runesList[runesList.len() - 1]);
        }
        fn createAccount(world: IWorldDispatcher, username: felt252, accountAdrs: ContractAddress) {
            let acc = get!(world, accountAdrs, (Account));
            assert(acc.owner != accountAdrs, 'Account already created');
            let mut acc = account::new(username, accountAdrs);
            // self.IEventEmitterDispatch.read().newAccount(accountAdrs, username);
            let heroesCount = self.mintStarterHeroes(accountAdrs);
            let runesCount = self.mintStarterRunes(accountAdrs);
            acc.heroesCount = heroesCount;
            acc.runesCount = runesCount;
            set!(world, (acc));
        }
        fn addExperienceToHeroId(world: IWorldDispatcher, accountAdrs: ContractAddress, heroId: u32, experience: u32) {
            let acc = self.getAccount(accountAdrs);
            assert(acc.heroesCount > heroId, 'heroId out of range');
            let mut hero = get!(world, (accountAdrs, heroId), (Heroes)).hero;
            hero.gainExperience(experience, accountAdrs);
            set!(world, Heroes {owner: accountAdrs, index: heroId, hero: hero});
        }
        fn decreaseEnergy(world: IWorldDispatcher, accountAdrs: ContractAddress, energyCost: u16) {
            let mut acc = self.getAccount(accountAdrs);
            acc.updateEnergy();
            acc.decreaseEnergy(energyCost);
            set!(world, (acc));
        }
        fn decreasePvpEnergy(world: IWorldDispatcher, accountAdrs: ContractAddress, energyCost: u16) {
            let mut acc = self.getAccount(accountAdrs);
            acc.updatePvpEnergy();
            acc.decreasePvpEnergy(energyCost);
            set!(world, (acc));
        }
        fn increaseCrystals(world: IWorldDispatcher, accountAdrs: ContractAddress, crystalsToAdd: u32) {
            let mut acc = self.getAccount(accountAdrs);
            acc.increaseCrystals(crystalsToAdd);
            set!(world, (acc));
        }
        fn decreaseCrystals(world: IWorldDispatcher, accountAdrs: ContractAddress, crystalsToSub: u32) {
            let mut acc = self.getAccount(accountAdrs);
            acc.decreaseCrystals(crystalsToSub);
            set!(world, (acc));
        }
        fn getAccount(world: IWorldDispatcher, accountAdrs: ContractAddress) -> Account {
            let acc = get!(world, accountAdrs, (Account));
            // assert(acc.owner == accountAdrs, 'Account not created');
            return acc;
        }
        fn getRune(world: IWorldDispatcher, accountAdrs: ContractAddress, runeId: u32) -> Rune {
            let runesCount = get!(world, accountAdrs, (Account)).runesCount;
            assert(runesCount > runeId, 'runeId out of range');
            return get!(world, (accountAdrs, runeId), (Runes)).rune;
        }
        fn getRunes(world: IWorldDispatcher, accountAdrs: ContractAddress, runesIds: Array<u32>) -> Array<Rune> {
            let mut runes: Array<Rune> = Default::default();
            let runesCount = get!(world, accountAdrs, (Account)).runesCount;
            let mut i: u32 = 0;
            loop {
                if i == runesIds.len() {
                    break;
                }
                // assert(runesCount > *runesIds[i], 'runeId out of range');
                runes.append(get!(world, (accountAdrs, *runesIds[i]), (Runes)).rune);
                i += 1;
            };
            return runes;
        }
        fn getAllRunes(world: IWorldDispatcher, accountAdrs: ContractAddress) -> Array<Rune> {
            let runesCount = get!(world, accountAdrs, (Account)).runesCount;
            let mut i: u32 = 0;
            let mut runes: Array<Rune> = Default::default();
            loop {
                if i == runesCount {
                    break;
                }
                let rune = get!(world, (accountAdrs, i), (Runes));
                runes.append(rune.rune);
                i += 1;
            };
            return runes;
        }
        fn getHero(world: IWorldDispatcher, accountAdrs: ContractAddress, heroId: u32) -> Hero {
            let heroesCount = get!(world, accountAdrs, (Account)).heroesCount;
            assert(heroesCount > heroId, 'heroId out of range');
            return get!(world, (accountAdrs, heroId), (Heroes)).hero;
        }
        fn getHeroes(world: IWorldDispatcher, accountAdrs: ContractAddress, heroesIds: Span<u32>) -> Array<Hero> {
            let mut heroes: Array<Hero> = Default::default();
            let heroesCount = get!(world, accountAdrs, (Account)).heroesCount;
            let mut i: u32 = 0;
            loop {
                if i == heroesIds.len() {
                    break;
                }
                // assert(heroesCount > *heroesIds[i], 'heroId out of range');
                heroes.append(get!(world, (accountAdrs, *heroesIds[i]), (Heroes)).hero);
                i += 1;
            };
            return heroes;
        }
        fn getAllHeroes(world: IWorldDispatcher, accountAdrs: ContractAddress) -> Array<Hero> {
            let heroesCount = get!(world, accountAdrs, (Account)).heroesCount;
            let mut i: u32 = 0;
            let mut heroes: Array<Hero> = Default::default();
            loop {
                if i == heroesCount {
                    break;
                }
                let hero = get!(world, (accountAdrs, i), (Heroes));
                heroes.append(hero.hero);
                i += 1;
            };
            return heroes;
        }
        fn getEnergyInfos(world: IWorldDispatcher, accountAdrs: ContractAddress) -> (u16, u64) {
            let acc = get!(world, accountAdrs, (Account));
            return acc.getEnergyInfos();
        }
        fn hasAccount(world: IWorldDispatcher, accountAdrs: ContractAddress) -> bool {
            let acc = get!(world, accountAdrs, (Account));
            return acc.owner == accountAdrs;
        }
        fn isOwnerOfHeroes(world: IWorldDispatcher, accountAdrs: ContractAddress, heroesIndexes: Span<u32>) -> bool {
            let heroesCount = get!(world, accountAdrs, (Account)).heroesCount;
            let mut i: u32 = 0;
            let mut isOwnerOfHeroes = true;
            loop {
                if i == heroesIndexes.len() {
                    break;
                }
                if(*heroesIndexes[i] >= heroesCount) {
                    isOwnerOfHeroes = false;
                    break;
                }
                i += 1;
            };
            return isOwnerOfHeroes;
        }
        fn mintStarterHeroes(world: IWorldDispatcher, accountAdrs: ContractAddress) -> u32 {
            set!(
                world,
                (
                Heroes {owner: accountAdrs, index: 0, hero: hero::new(0, 'priest', 1, 1)},
                Heroes {owner: accountAdrs, index: 1, hero: hero::new(1, 'priest', 1, 1)},
                Heroes {owner: accountAdrs, index: 2, hero: hero::new(2, 'priest', 1, 1)},
                Heroes {owner: accountAdrs, index: 3, hero: hero::new(3, 'priest', 1, 1)},
                Heroes {owner: accountAdrs, index: 4, hero: hero::new(4, 'assassin', 1, 1)},
                Heroes {owner: accountAdrs, index: 5, hero: hero::new(5, 'assassin', 1, 1)},
                Heroes {owner: accountAdrs, index: 6, hero: hero::new(6, 'assassin', 1, 1)},
                Heroes {owner: accountAdrs, index: 7, hero: hero::new(7, 'assassin', 1, 1)},
                Heroes {owner: accountAdrs, index: 8, hero: hero::new(8, 'knight', 1, 1)},
                Heroes {owner: accountAdrs, index: 9, hero: hero::new(9, 'knight', 1, 1)},
                Heroes {owner: accountAdrs, index: 10, hero: hero::new(10, 'knight', 1, 1)},
                Heroes {owner: accountAdrs, index: 11, hero: hero::new(11, 'knight', 1, 1)},
                Heroes {owner: accountAdrs, index: 12, hero: hero::new(12, 'hunter', 1, 1)},
                Heroes {owner: accountAdrs, index: 13, hero: hero::new(13, 'hunter', 1, 1)},
                Heroes {owner: accountAdrs, index: 14, hero: hero::new(14, 'hunter', 1, 1)},
                Heroes {owner: accountAdrs, index: 15, hero: hero::new(15, 'hunter', 1, 1)},
                )
            );
            return 16;
        }
        fn mintStarterRunes(world: IWorldDispatcher, accountAdrs: ContractAddress) -> u32 {
            set!(
                world,
                (
                Runes {owner: accountAdrs, index: 0, rune: rune::newDeterministic(0, RuneStatistic::Attack, false, RuneRarity::Common, RuneType::First)},
                Runes {owner: accountAdrs, index: 1, rune: rune::newDeterministic(1, RuneStatistic::Attack, true, RuneRarity::Common, RuneType::Second)},
                Runes {owner: accountAdrs, index: 2, rune: rune::newDeterministic(2, RuneStatistic::Attack, false, RuneRarity::Common, RuneType::Third)},
                Runes {owner: accountAdrs, index: 3, rune: rune::newDeterministic(3, RuneStatistic::Defense, false, RuneRarity::Common, RuneType::Third)},
                Runes {owner: accountAdrs, index: 4, rune: rune::newDeterministic(4, RuneStatistic::Defense, true, RuneRarity::Common, RuneType::Fourth)},
                Runes {owner: accountAdrs, index: 5, rune: rune::newDeterministic(5, RuneStatistic::Defense, true, RuneRarity::Common, RuneType::Sixth)},
                Runes {owner: accountAdrs, index: 6, rune: rune::newDeterministic(6, RuneStatistic::Health, false, RuneRarity::Common, RuneType::Fifth)},
                Runes {owner: accountAdrs, index: 7, rune: rune::newDeterministic(7, RuneStatistic::Health, true, RuneRarity::Common, RuneType::Fifth)},
                Runes {owner: accountAdrs, index: 8, rune: rune::newDeterministic(8, RuneStatistic::Health, true, RuneRarity::Common, RuneType::Second)},
                Runes {owner: accountAdrs, index: 9, rune: rune::newDeterministic(9, RuneStatistic::Speed, false, RuneRarity::Common, RuneType::Sixth)},
                Runes {owner: accountAdrs, index: 10, rune: rune::newDeterministic(10, RuneStatistic::Speed, false, RuneRarity::Common, RuneType::First)},
                Runes {owner: accountAdrs, index: 11, rune: rune::newDeterministic(11, RuneStatistic::Speed, true, RuneRarity::Common, RuneType::Fourth)},
                )
            );
            return 12;
        }
    }
}