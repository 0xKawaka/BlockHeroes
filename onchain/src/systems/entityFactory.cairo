use game::models::battle::entity::{Entity, AllyOrEnemy};
use game::models::storage::{statistics, statistics::{Statistics, baseStatistics::BaseStatistics, runeStatistics::RuneStatistics, bonusRuneStatistics::BonusRuneStatistics}};
use game::models::hero::{Hero, rune::Rune, rune::RuneStatistic};
use starknet::ContractAddress;
use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};

trait IEntityFactory {
    fn newEntities(world: IWorldDispatcher, owner: ContractAddress, startIndex: u32, heroes: Array<Hero>, allyOrEnemy: AllyOrEnemy) -> Array<Entity>;
    fn newEntity(world: IWorldDispatcher, owner: ContractAddress, index: u32, hero: Hero, allyOrEnemy: AllyOrEnemy) -> Entity;
    fn computeRunesBonuses(world: IWorldDispatcher, runes: Array<Rune>, baseStats: Statistics) -> Statistics;
    fn initBaseStatisticsDict(world: IWorldDispatcher);
    fn initRunesTable(world: IWorldDispatcher);
    fn initBonusRunesTable(world: IWorldDispatcher);
}

mod EntityFactory {
    use core::option::OptionTrait;
    use starknet::ContractAddress;

    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use game::models::hero::{HeroTrait, Hero, rune::Rune, rune::RuneImpl, rune::RuneRarity, rune::RuneStatistic};
    use game::models::battle::{entity, entity::Entity, entity::EntityImpl, entity::EntityTrait, entity::AllyOrEnemy, entity::cooldowns::CooldownsTrait, entity::skillset};
    use game::models::battle::entity::{skill, skill::SkillImpl, skill::TargetType, skill::damage, skill::heal};
    use game::models::battle::entity::healthOnTurnProc::{HealthOnTurnProc, HealthOnTurnProcImpl};
    use game::models::storage::{statistics, statistics::{baseStatistics, baseStatistics::Statistics, baseStatistics::BaseStatisticsImpl, baseStatistics::BaseStatistics, runeStatistics, runeStatistics::RuneStatistics, bonusRuneStatistics, bonusRuneStatistics::BonusRuneStatistics}};
    use game::systems::accounts::Accounts::AccountsImpl;

    impl EntityFactoryImpl of super::IEntityFactory {
        fn newEntities(world: IWorldDispatcher, owner: ContractAddress, startIndex: u32, heroes: Array<Hero>, allyOrEnemy: AllyOrEnemy) -> Array<Entity> {
            let mut entities: Array<Entity> = Default::default();
            let mut i: u32 = 0;
            loop {
                if i == heroes.len() {
                    break;
                }
                let entity = EntityFactoryImpl::newEntity(world, owner, startIndex + i, *heroes[i], allyOrEnemy);
                entities.append(entity);
                i += 1;
            };
            return entities;
        }
        fn newEntity(world: IWorldDispatcher, owner: ContractAddress, index: u32, hero: Hero, allyOrEnemy: AllyOrEnemy) -> Entity {
            let baseStats = get!(world, (hero.name), (BaseStatistics));
            let baseStatsValues = baseStats.computeAllStatistics(hero.level, hero.rank);
            let runesIndex = hero.getRunesIndexArray();
            let runes = AccountsImpl::getRunes(world, owner, runesIndex);
            let runesStatsValues = EntityFactoryImpl::computeRunesBonuses(world, runes, baseStatsValues);

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
                let test = rune.statistic;
                let runeStat = runeStatWithoutRank + ((runeStatWithoutRank * rune.rank) / 10);
                InternalEntityFactoryImpl::matchAndAddStat(ref runesTotalBonusStats, rune.statistic, runeStat.into(), rune.isPercent, baseStats);
                if (rune.rank > 3) {
                    let bonusRank4 = rune.rank4Bonus;
                    let runeBonusStat = get!(world, (bonusRank4.statistic, rune.rarity, bonusRank4.isPercent), (BonusRuneStatistics)).value;
                    InternalEntityFactoryImpl::matchAndAddStat(ref runesTotalBonusStats, bonusRank4.statistic, runeBonusStat.into(), bonusRank4.isPercent, baseStats);
                }
                if (rune.rank > 7) {
                    let bonusRank8 = rune.rank8Bonus;
                    let runeBonusStat = get!(world, (bonusRank8.statistic, rune.rarity, bonusRank8.isPercent), (BonusRuneStatistics)).value;
                    InternalEntityFactoryImpl::matchAndAddStat(ref runesTotalBonusStats, bonusRank8.statistic, runeBonusStat.into(), bonusRank8.isPercent, baseStats);
                }
                if (rune.rank > 11) {
                    let bonusRank12 = rune.rank12Bonus;
                    let runeBonusStat = get!(world, (bonusRank12.statistic, rune.rarity, bonusRank12.isPercent), (BonusRuneStatistics)).value;
                    InternalEntityFactoryImpl::matchAndAddStat(ref runesTotalBonusStats, bonusRank12.statistic, runeBonusStat.into(), bonusRank12.isPercent, baseStats);
                }
                if (rune.rank > 15) {
                    let bonusRank16 = rune.rank16Bonus;
                    let runeBonusStat = get!(world, (bonusRank16.statistic, rune.rarity, bonusRank16.isPercent), (BonusRuneStatistics)).value;
                    InternalEntityFactoryImpl::matchAndAddStat(ref runesTotalBonusStats, bonusRank16.statistic, runeBonusStat.into(), bonusRank16.isPercent, baseStats);
                }
                i += 1;
            };
            return runesTotalBonusStats;
        }

        fn initBaseStatisticsDict(world: IWorldDispatcher) {
            set!(
                world,
                (
                    BaseStatistics { heroName: 'assassin', statistics: statistics::new(1500, 200, 100, 185, 10, 100) },
                    BaseStatistics { heroName: 'knight', statistics: statistics::new(2000, 120, 180, 150, 10, 100) },
                    BaseStatistics { heroName: 'priest', statistics: statistics::new(1700, 150, 150, 160, 10, 100) },
                    BaseStatistics { heroName: 'hunter', statistics: statistics::new(1500, 170, 130, 170, 10, 200) }
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
                    BonusRuneStatistics { statistic: RuneStatistic::Health, rarity: RuneRarity::Common, isPercent: false, value: 50 },
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

    #[generate_trait]
    impl InternalEntityFactoryImpl of InternalEntityFactoryTrait {
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
    
}