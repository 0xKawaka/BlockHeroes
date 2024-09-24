use starknet::ContractAddress;
use game::models::hero::{Hero, rune::Rune};
use game::models::account::Account;
use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};

trait IAccounts {
    fn equipRune(world: IWorldDispatcher, accountAdrs: ContractAddress, runeId: u32, heroId: u32);
    fn unequipRune(world: IWorldDispatcher, accountAdrs: ContractAddress, runeId: u32);
    fn upgradeRune(world: IWorldDispatcher, accountAdrs: ContractAddress, runeId: u32);
    fn mintHero(world: IWorldDispatcher, accountAdrs: ContractAddress);
    fn mintRune(world: IWorldDispatcher, accountAdrs: ContractAddress);
    fn createAccount(world: IWorldDispatcher, username: felt252, accountAdrs: ContractAddress);
    fn addExperienceToHeroId(world: IWorldDispatcher, accountAdrs: ContractAddress, heroId: u32, experience: u32);
    fn increaseSummonChests(world: IWorldDispatcher, accountAdrs: ContractAddress, summonChestsToAdd: u32);
    fn decreaseEnergy(world: IWorldDispatcher, accountAdrs: ContractAddress, energyCost: u16);
    fn decreasePvpEnergy(world: IWorldDispatcher, accountAdrs: ContractAddress, energyCost: u16);
    fn increaseCrystals(world: IWorldDispatcher, accountAdrs: ContractAddress, crystalsToAdd: u32);
    fn decreaseCrystals(world: IWorldDispatcher, accountAdrs: ContractAddress, crystalsToSub: u32);
    fn getOwnedHeroesNames(world: IWorldDispatcher, accountAdrs: ContractAddress) -> Array<felt252>;
    fn getAccount(world: IWorldDispatcher, accountAdrs: ContractAddress) -> Account;
    fn getHero(world: IWorldDispatcher, accountAdrs: ContractAddress, heroId: u32) -> Hero;
    fn getHeroes(world: IWorldDispatcher, accountAdrs: ContractAddress, heroesIds: Span<u32>) -> Array<Hero>;
    fn getAllHeroes(world: IWorldDispatcher, accountAdrs: ContractAddress) -> Array<Hero>;
    fn getRune(world: IWorldDispatcher, accountAdrs: ContractAddress, runeId: u32) -> Rune;
    fn getRunes(world: IWorldDispatcher, accountAdrs: ContractAddress, runesIds: Array<u32>) -> Array<Rune>;
    fn getAllRunes(world: IWorldDispatcher, accountAdrs: ContractAddress) -> Array<Rune>;
    fn getEnergyInfos(world: IWorldDispatcher, accountAdrs: ContractAddress) -> (u16, u64);
    fn hasAccount(world: IWorldDispatcher, accountAdrs: ContractAddress);
    fn isOwnerOfHeroes(world: IWorldDispatcher, accountAdrs: ContractAddress, heroesIndexes: Span<u32>) -> bool;
    fn mintStarterHeroes(world: IWorldDispatcher, accountAdrs: ContractAddress) -> u32;
    fn mintStarterRunes(world: IWorldDispatcher, accountAdrs: ContractAddress) -> u32;
}

mod Accounts {
    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use core::array::ArrayTrait;
    use core::option::OptionTrait;
    use core::box::BoxTrait;
    use debug::PrintTrait;
    use core::starknet::event::EventEmitter;
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};

    use game::models::hero::rune::RuneTrait;
    use game::models::hero::HeroTrait;
    use game::models::{account, account::{AccountImpl, AccountTrait, Account, heroes::Heroes, runes::Runes}};
    use game::models::storage::usernames::Usernames;
    use game::models::{hero, hero::Hero, hero::HeroImpl, hero::rune, hero::EquippedRunesImpl, hero::rune::RuneImpl, hero::rune::Rune};
    use game::models::hero::rune::{RuneStatistic, RuneRarity, RuneType};
    use game::models::events::{Event, EventKey, HeroMinted, RuneMinted, NewAccount, TimestampEnergy, TimestampPvpEnergy};

    use super::IAccounts;

    use game::utils::random::rand32;

    #[abi(embed_v0)]
    impl AccountsImpl of super::IAccounts {
        fn equipRune(world: IWorldDispatcher, accountAdrs: ContractAddress, runeId: u32, heroId: u32) {
            let mut acc = Self::getAccount(world, accountAdrs);
            assert(acc.heroesCount > heroId, 'heroId out of range');
            assert(acc.runesCount > runeId, 'runeId out of range');
            let mut hero = get!(world, (acc.owner, heroId), (Heroes)).hero;
            let mut rune = get!(world, (acc.owner, runeId), (Runes)).rune;
            hero.equipRune(ref rune);
            set!(world,
                (
                    Runes {owner: acc.owner, index: runeId, rune: rune},
                    Heroes {owner: acc.owner, index: heroId, hero: hero},
                )
            );
        }
        fn unequipRune(world: IWorldDispatcher, accountAdrs: ContractAddress, runeId: u32) {
            let mut acc = Self::getAccount(world, accountAdrs);
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
            let mut acc = Self::getAccount(world, accountAdrs);
            assert(acc.runesCount > runeId, 'runeId out of range');
            let mut rune = get!(world, (acc.owner, runeId), (Runes)).rune;
            rune.upgrade(world, ref acc);
            set!(world,
                (
                    Runes {owner: acc.owner, index: runeId, rune: rune},
                    acc,
                )
            );
        }
        fn mintHero(world: IWorldDispatcher, accountAdrs: ContractAddress) {
            let mut acc = Self::getAccount(world, accountAdrs);
            assert(acc.summonChests > 0, 'No summon chests');
            acc.summonChests -= 1;
            let ownedHeroesNames = Self::getOwnedHeroesNames(world, accountAdrs);
            let heroesPossible: Array<felt252> = array!['sirocco', 'wellan', 'marella', 'elandor', 'diana', 'elric', 'nereus', 'rex', 'celeste', 'oakheart', 'sylvara', 'bane', 'ember', 'molten', 'solas', 'solveig', 'janus', 'horus', 'jabari', 'khamsin'];
            assert(heroesPossible.len() > ownedHeroesNames.len(), 'All heroes owned');
            let mut notOwnedHeroesIndexes: Array<u32> = Default::default();
            let mut i: u32 = 0;
            loop {
                if i == heroesPossible.len() {
                    break;
                }
                let mut j: u32 = 0;
                let mut isOwned = false;
                loop {
                    if j == ownedHeroesNames.len() {
                        break;
                    }
                    if heroesPossible[i] == ownedHeroesNames[j] {
                        isOwned = true;
                        break;
                    }
                    j += 1;
                };
                if !isOwned {
                    notOwnedHeroesIndexes.append(i);
                }
                i += 1;
            };
            let randIndex = rand32(get_block_timestamp(), notOwnedHeroesIndexes.len());
            let heroName = *heroesPossible[*notOwnedHeroesIndexes[randIndex]];
            set!(world,(Heroes {owner: accountAdrs, index: acc.heroesCount, hero: hero::new(acc.heroesCount, heroName, 1, 1)}));
            acc.heroesCount += 1;
            set!(world, (acc));
            emit!(world, HeroMinted {owner: accountAdrs, id: acc.heroesCount - 1, name: heroName})
        }
        fn mintRune(world: IWorldDispatcher, accountAdrs: ContractAddress) {
            let mut acc = Self::getAccount(world, accountAdrs);
            let mintedRune = rune::new(acc.runesCount);
            set!(world, Runes {owner: accountAdrs, index: acc.runesCount, rune: mintedRune});
            acc.runesCount += 1;
            set!(world, (acc));
            emit!(world, RuneMinted {eventKey: EventKey::RuneMinted, owner: accountAdrs, rune: mintedRune});
        }
        fn createAccount(world: IWorldDispatcher, username: felt252, accountAdrs: ContractAddress) {
            let acc = get!(world, accountAdrs, (Account));
            assert(acc.username == 0x0, 'wallet already has account');
            let usernameStorage = get!(world, username, (Usernames));
            assert(usernameStorage.owner == 0.try_into().unwrap(), 'username already taken');
            let mut acc = account::new(username, accountAdrs);
            emit!(world, NewAccount {owner: accountAdrs, username: username});
            // let heroesCount = Self::mintStarterHeroes(world, accountAdrs);
            // let runesCount = Self::mintStarterRunes(world, accountAdrs);
            acc.heroesCount = 0;
            acc.runesCount = 0;
            set!(world, (acc));
            set!(world, (Usernames {username: username, owner: accountAdrs}));
        }
        fn addExperienceToHeroId(world: IWorldDispatcher, accountAdrs: ContractAddress, heroId: u32, experience: u32) {
            let acc = Self::getAccount(world, accountAdrs);
            assert(acc.heroesCount > heroId, 'heroId out of range');
            let mut hero = get!(world, (accountAdrs, heroId), (Heroes)).hero;
            hero.gainExperience(world, experience, accountAdrs);
            set!(world, Heroes {owner: accountAdrs, index: heroId, hero: hero});
        }
        fn increaseSummonChests(world: IWorldDispatcher, accountAdrs: ContractAddress, summonChestsToAdd: u32) {
            let mut acc = Self::getAccount(world, accountAdrs);
            acc.increaseSummonChests(summonChestsToAdd);
            set!(world, (acc));
        }
        fn decreaseEnergy(world: IWorldDispatcher, accountAdrs: ContractAddress, energyCost: u16) {
            let mut acc = Self::getAccount(world, accountAdrs);
            let timestamp:u64 = acc.updateEnergy();
            emit!(world, TimestampEnergy {eventKey: EventKey::TimestampEnergy, owner: accountAdrs, timestamp: timestamp});
            acc.decreaseEnergy(energyCost);
            set!(world, (acc));
        }
        fn decreasePvpEnergy(world: IWorldDispatcher, accountAdrs: ContractAddress, energyCost: u16) {
            let mut acc = Self::getAccount(world, accountAdrs);
            let timestamp:u64 = acc.updatePvpEnergy();
            emit!(world, TimestampPvpEnergy {eventKey: EventKey::TimestampPvpEnergy, owner: accountAdrs, timestamp: timestamp});
            acc.decreasePvpEnergy(energyCost);
            set!(world, (acc));
        }
        fn increaseCrystals(world: IWorldDispatcher, accountAdrs: ContractAddress, crystalsToAdd: u32) {
            let mut acc = Self::getAccount(world, accountAdrs);
            acc.increaseCrystals(crystalsToAdd);
            set!(world, (acc));
        }
        fn decreaseCrystals(world: IWorldDispatcher, accountAdrs: ContractAddress, crystalsToSub: u32) {
            let mut acc = Self::getAccount(world, accountAdrs);
            acc.decreaseCrystals(crystalsToSub);
            set!(world, (acc));
        }
        fn getOwnedHeroesNames(world: IWorldDispatcher, accountAdrs: ContractAddress) -> Array<felt252> {
            let acc = get!(world, accountAdrs, (Account));
            let mut heroes: Array<felt252> = Default::default();
            let mut i: u32 = 0;
            loop {
                if i == acc.heroesCount {
                    break;
                }
                let heroName = get!(world, (accountAdrs, i), (Heroes)).hero.name;
                heroes.append(heroName);
                i += 1;
            };
            return heroes;
        }


        fn getAccount(world: IWorldDispatcher, accountAdrs: ContractAddress) -> Account {
            let acc = get!(world, accountAdrs, (Account));
            assert(acc.owner == accountAdrs, 'Account not created');
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
                let runeId: u32 = *runesIds[i];
                assert(runeId <= runesCount - 1, 'runeId out of range');
                runes.append(get!(world, (accountAdrs, runeId), (Runes)).rune);
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
                let heroeId: u32 = *heroesIds[i];
                assert(heroeId <= heroesCount - 1, 'heroId out of range');
                heroes.append(get!(world, (accountAdrs, heroeId), (Heroes)).hero);
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
        fn hasAccount(world: IWorldDispatcher, accountAdrs: ContractAddress) {
            let acc = get!(world, accountAdrs, (Account));
            assert(acc.username != 0x0, 'Account not found');
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
                Heroes {owner: accountAdrs, index: 0, hero: hero::new(0, 'marella', 1, 1)},
                Heroes {owner: accountAdrs, index: 1, hero: hero::new(1, 'sirocco', 1, 1)},
                Heroes {owner: accountAdrs, index: 2, hero: hero::new(2, 'wellan', 1, 1)},
                Heroes {owner: accountAdrs, index: 3, hero: hero::new(3, 'elandor', 1, 1)},
                Heroes {owner: accountAdrs, index: 4, hero: hero::new(4, 'diana', 1, 1)},
                Heroes {owner: accountAdrs, index: 5, hero: hero::new(5, 'elric', 1, 1)},
                Heroes {owner: accountAdrs, index: 6, hero: hero::new(6, 'nereus', 1, 1)},
                Heroes {owner: accountAdrs, index: 7, hero: hero::new(7, 'rex', 1, 1)},
                Heroes {owner: accountAdrs, index: 8, hero: hero::new(8, 'celeste', 1, 1)},
                Heroes {owner: accountAdrs, index: 9, hero: hero::new(9, 'oakheart', 1, 1)},
                Heroes {owner: accountAdrs, index: 10, hero: hero::new(10, 'sylvara', 1, 1)},
                Heroes {owner: accountAdrs, index: 11, hero: hero::new(11, 'bane', 1, 1)},
                Heroes {owner: accountAdrs, index: 12, hero: hero::new(12, 'ember', 1, 1)},
                Heroes {owner: accountAdrs, index: 13, hero: hero::new(13, 'molten', 1, 1)},
                Heroes {owner: accountAdrs, index: 14, hero: hero::new(14, 'solas', 1, 1)},
                Heroes {owner: accountAdrs, index: 15, hero: hero::new(15, 'solveig', 1, 1)},
                Heroes {owner: accountAdrs, index: 16, hero: hero::new(16, 'janus', 1, 1)},
                Heroes {owner: accountAdrs, index: 17, hero: hero::new(17, 'horus', 1, 1)},
                Heroes {owner: accountAdrs, index: 18, hero: hero::new(18, 'jabari', 1, 1)},
                Heroes {owner: accountAdrs, index: 19, hero: hero::new(19, 'khamsin', 1, 1)},
                )
            );
            return 20;
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