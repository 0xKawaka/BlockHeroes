use game::models::battle::entity::{Entity, AllyOrEnemy};
use game::models::storage::{statistics, statistics::{Statistics, runeStatistics::RuneStatistics, bonusRuneStatistics::BonusRuneStatistics}};
use game::models::storage::baseHero::BaseHero;
use game::models::hero::{Hero, rune::Rune, rune::RuneStatistic};
use starknet::ContractAddress;
use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};

trait IEntityFactory {
    fn newEntities(world: IWorldDispatcher, owner: ContractAddress, startIndex: u32, heroes: Array<Hero>, allyOrEnemy: AllyOrEnemy) -> Array<Entity>;
    fn newEntity(world: IWorldDispatcher, owner: ContractAddress, index: u32, hero: Hero, allyOrEnemy: AllyOrEnemy) -> Entity;
    fn computeRunesBonuses(world: IWorldDispatcher, runes: Array<Rune>, baseStats: Statistics) -> Statistics;
    fn initBaseHeroesDict(world: IWorldDispatcher);
    fn initRunesTable(world: IWorldDispatcher);
    fn initBonusRunesTable(world: IWorldDispatcher);
    fn initHeroesByRankDict(world: IWorldDispatcher);
}

mod EntityFactory {
    use core::option::OptionTrait;
    use starknet::ContractAddress;

    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use game::models::hero::{HeroTrait, Hero, rune::Rune, rune::RuneImpl, rune::RuneRarity, rune::RuneStatistic};
    use game::models::battle::{entity, entity::Entity, entity::EntityImpl, entity::EntityTrait, entity::AllyOrEnemy, entity::cooldowns::CooldownsTrait};
    use game::models::battle::entity::{skill, skill::SkillImpl, skill::TargetType, skill::damage, skill::heal};
    use game::models::battle::entity::healthOnTurnProc::{HealthOnTurnProc, HealthOnTurnProcImpl};
    use game::models::storage::{statistics, statistics::{runeStatistics, runeStatistics::RuneStatistics, bonusRuneStatistics, bonusRuneStatistics::BonusRuneStatistics}};
    use game::models::storage::{baseHero, baseHero::{BaseHero, BaseHeroImpl, Statistics}, heroesByRank::HeroesByRank };
    use game::systems::accounts::Accounts::AccountsImpl;

    impl EntityFactoryImpl of super::IEntityFactory {
        fn newEntities(world: IWorldDispatcher, owner: ContractAddress, startIndex: u32, heroes: Array<Hero>, allyOrEnemy: AllyOrEnemy) -> Array<Entity> {
            let mut entities: Array<Entity> = Default::default();
            let mut i: u32 = 0;
            loop {
                if i == heroes.len() {
                    break;
                }
                let entity = Self::newEntity(world, owner, startIndex + i, *heroes[i], allyOrEnemy);
                entities.append(entity);
                i += 1;
            };
            return entities;
        }
        fn newEntity(world: IWorldDispatcher, owner: ContractAddress, index: u32, hero: Hero, allyOrEnemy: AllyOrEnemy) -> Entity {
            let baseStats = get!(world, (hero.name), (BaseHero));
            let baseStatsValues = baseStats.computeAllStatistics(hero.level, hero.rank);
            let runesIndex = hero.getRunesIndexArray();
            let runes = AccountsImpl::getRunes(world, owner, runesIndex);
            let runesStatsValues = Self::computeRunesBonuses(world, runes, baseStatsValues);

            return entity::new(
                index,
                hero.id,
                hero.name,
                baseStatsValues.health + runesStatsValues.health,
                baseStatsValues.attack + runesStatsValues.attack,
                baseStatsValues.defense + runesStatsValues.defense,
                baseStatsValues.speed + runesStatsValues.speed,
                baseStatsValues.criticalRate + runesStatsValues.criticalRate,
                baseStatsValues.criticalDamage + runesStatsValues.criticalDamage,
                allyOrEnemy,
            );
        }

        fn computeRunesBonuses(world: IWorldDispatcher, runes: Array<Rune>, baseStats: Statistics) -> Statistics {
            let mut runesTotalBonusStats = statistics::new(0, 0, 0, 0, 0, 0);
            let mut i: u32 = 0;
            loop {
                if i == runes.len() {
                    break;
                }
                let rune: Rune = *runes[i];
                let runeStatWithoutRank = get!(world, (rune.statistic, rune.rarity, rune.isPercent), (RuneStatistics)).value;
                let runeStat = runeStatWithoutRank + ((runeStatWithoutRank * rune.rank) / 10);
                matchAndAddStat(ref runesTotalBonusStats, rune.statistic, runeStat.into(), rune.isPercent, baseStats);
                if (rune.rank > 3) {
                    let bonusRank4 = rune.rank4Bonus;
                    let runeBonusStat = get!(world, (bonusRank4.statistic, rune.rarity, bonusRank4.isPercent), (BonusRuneStatistics)).value;
                    matchAndAddStat(ref runesTotalBonusStats, bonusRank4.statistic, runeBonusStat.into(), bonusRank4.isPercent, baseStats);
                }
                if (rune.rank > 7) {
                    let bonusRank8 = rune.rank8Bonus;
                    let runeBonusStat = get!(world, (bonusRank8.statistic, rune.rarity, bonusRank8.isPercent), (BonusRuneStatistics)).value;
                    matchAndAddStat(ref runesTotalBonusStats, bonusRank8.statistic, runeBonusStat.into(), bonusRank8.isPercent, baseStats);
                }
                if (rune.rank > 11) {
                    let bonusRank12 = rune.rank12Bonus;
                    let runeBonusStat = get!(world, (bonusRank12.statistic, rune.rarity, bonusRank12.isPercent), (BonusRuneStatistics)).value;
                    matchAndAddStat(ref runesTotalBonusStats, bonusRank12.statistic, runeBonusStat.into(), bonusRank12.isPercent, baseStats);
                }
                if (rune.rank > 15) {
                    let bonusRank16 = rune.rank16Bonus;
                    let runeBonusStat = get!(world, (bonusRank16.statistic, rune.rarity, bonusRank16.isPercent), (BonusRuneStatistics)).value;
                    matchAndAddStat(ref runesTotalBonusStats, bonusRank16.statistic, runeBonusStat.into(), bonusRank16.isPercent, baseStats);
                }
                i += 1;
            };
            return runesTotalBonusStats;
        }

        fn initBaseHeroesDict(world: IWorldDispatcher) {
            set!(
                world,
                (
                    BaseHero { heroName: 'sirocco', rank: 0, statistics: statistics::new(1500, 190, 120, 190, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'wellan', rank: 0, statistics: statistics::new(1500, 165, 160, 175, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'marella', rank: 0, statistics: statistics::new(1500, 150, 170, 180, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'elandor', rank: 0, statistics: statistics::new(1500, 185, 130, 185, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'diana', rank: 0, statistics: statistics::new(1500, 185, 124, 191, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'elric', rank: 0, statistics: statistics::new(1500, 170, 160, 170, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'nereus', rank: 0, statistics: statistics::new(1500, 185, 135, 180, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'rex', rank: 0, statistics: statistics::new(1500, 180, 160, 160, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'celeste', rank: 0, statistics: statistics::new(1500, 185, 130, 185, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'oakheart', rank: 0, statistics: statistics::new(1500, 170, 160, 170, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'sylvara', rank: 0, statistics: statistics::new(1500, 150, 170, 180, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'bane', rank: 0, statistics: statistics::new(1500, 190, 125, 185, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'ember', rank: 0, statistics: statistics::new(1500, 165, 155, 180, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'molten', rank: 2, statistics: statistics::new(1500, 180, 160, 160, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'solas', rank: 2, statistics: statistics::new(1500, 150, 170, 180, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'solveig', rank: 2, statistics: statistics::new(1500, 185, 130, 185, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'janus', rank: 1, statistics: statistics::new(1500, 200, 110, 190, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'horus', rank: 1, statistics: statistics::new(1500, 165, 155, 180, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'jabari', rank: 1, statistics: statistics::new(1500, 185, 135, 180, 10, 200), skillsCount: 3 },
                    BaseHero { heroName: 'khamsin', rank: 1, statistics: statistics::new(1500, 180, 140, 180, 10, 200), skillsCount: 3 },

                )
            )
        }
        fn initHeroesByRankDict(world: IWorldDispatcher) {
            set!(
                world,
                (
                    HeroesByRank { rank: 0, heroes: array!['sirocco', 'wellan', 'marella', 'elandor', 'diana', 'elric', 'nereus', 'rex', 'celeste', 'oakheart', 'sylvara', 'bane', 'ember'] },
                    HeroesByRank { rank: 1, heroes: array!['janus', 'horus', 'jabari', 'khamsin'] },
                    HeroesByRank { rank: 2, heroes: array!['molten', 'solas', 'solveig'] }
                )
            )
        }
        fn initRunesTable(world: IWorldDispatcher) {
            set!(
                world,
                (
                    RuneStatistics { statistic: RuneStatistic::Health, rarity: RuneRarity::Common, isPercent: false, value: 300 },
                    RuneStatistics { statistic: RuneStatistic::Attack, rarity: RuneRarity::Common, isPercent: false, value: 30 },
                    RuneStatistics { statistic: RuneStatistic::Defense, rarity: RuneRarity::Common, isPercent: false, value: 30 },
                    RuneStatistics { statistic: RuneStatistic::Speed, rarity: RuneRarity::Common, isPercent: false, value: 20 },

                    RuneStatistics { statistic: RuneStatistic::Health, rarity: RuneRarity::Common, isPercent: true, value: 10 },
                    RuneStatistics { statistic: RuneStatistic::Attack, rarity: RuneRarity::Common, isPercent: true, value: 10 },
                    RuneStatistics { statistic: RuneStatistic::Defense, rarity: RuneRarity::Common, isPercent: true, value: 10 },
                    RuneStatistics { statistic: RuneStatistic::Speed, rarity: RuneRarity::Common, isPercent: true, value: 10 }
                )
            )
        }
        fn initBonusRunesTable(world: IWorldDispatcher) {
            set!(
                world,
                (
                    BonusRuneStatistics { statistic: RuneStatistic::Health, rarity: RuneRarity::Common, isPercent: false, value: 5 },
                    BonusRuneStatistics { statistic: RuneStatistic::Attack, rarity: RuneRarity::Common, isPercent: false, value: 5 },
                    BonusRuneStatistics { statistic: RuneStatistic::Defense, rarity: RuneRarity::Common, isPercent: false, value: 5 },
                    BonusRuneStatistics { statistic: RuneStatistic::Speed, rarity: RuneRarity::Common, isPercent: false, value: 3 },

                    BonusRuneStatistics { statistic: RuneStatistic::Health, rarity: RuneRarity::Common, isPercent: true, value: 2 },
                    BonusRuneStatistics { statistic: RuneStatistic::Attack, rarity: RuneRarity::Common, isPercent: true, value: 2 },
                    BonusRuneStatistics { statistic: RuneStatistic::Defense, rarity: RuneRarity::Common, isPercent: true, value: 2 },
                    BonusRuneStatistics { statistic: RuneStatistic::Speed, rarity: RuneRarity::Common, isPercent: true, value: 2 }
                )
            )
        }
    }

    fn matchAndAddStat(ref runesTotalBonusStats: Statistics, statType: RuneStatistic, bonusStat: u64, isPercent: bool, baseStats: Statistics) {
        if(isPercent) {
            match statType {
                RuneStatistic::Health => runesTotalBonusStats.health += (baseStats.health * bonusStat) / 100,
                RuneStatistic::Attack => runesTotalBonusStats.attack += (baseStats.attack * bonusStat) / 100,
                RuneStatistic::Defense => runesTotalBonusStats.defense += (baseStats.defense * bonusStat) / 100,
                RuneStatistic::Speed => runesTotalBonusStats.speed += (baseStats.speed * bonusStat) / 100,
            }
        }
        else {
            match statType {
                RuneStatistic::Health => runesTotalBonusStats.health += bonusStat,
                RuneStatistic::Attack => runesTotalBonusStats.attack += bonusStat,
                RuneStatistic::Defense => runesTotalBonusStats.defense += bonusStat,
                RuneStatistic::Speed => runesTotalBonusStats.speed += bonusStat,
            }
        }
    }
    
}