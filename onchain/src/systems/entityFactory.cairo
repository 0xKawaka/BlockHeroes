mod statisticsWrapper;

use game::models::battle::entity::{Entity, AllyOrEnemy};
use game::models::hero::Hero;
use starknet::ContractAddress;

#[starknet::interface]
trait IEntityFactory<TContractState> {
    fn newEntities(ref self: TContractState, owner: ContractAddress, startIndex: u32, heroes: Array<Hero>, allyOrEnemy: AllyOrEnemy) -> Array<Entity>;
    fn newEntity(ref self: TContractState, owner: ContractAddress, index: u32, hero: Hero, allyOrEnemy: AllyOrEnemy) -> Entity;
    fn setAccountsAdrs(ref self: TContractState, accountsAdrs: ContractAddress);
}


#[starknet::contract]
mod EntityFactory {
    use core::option::OptionTrait;
    use starknet::ContractAddress;

    use game::models::hero::{HeroTrait, Hero, rune::Rune, rune::RuneImpl, rune::RuneRarity, rune::RuneStatistic};
    use game::models::battle::{entity, entity::Entity, entity::EntityImpl, entity::EntityTrait, entity::AllyOrEnemy, entity::cooldowns::CooldownsTrait, entity::skillset};
    use game::models::battle::entity::{skill, skill::SkillImpl, skill::TargetType, skill::damage, skill::heal};
    use game::models::battle::entity::healthOnTurnProc::{HealthOnTurnProc, HealthOnTurnProcImpl};
    use game::models::{baseStatistics, baseStatistics::BaseStatisticsImpl, baseStatistics::BaseStatistics};
    use game::systems::entityFactory::{statisticsWrapper, statisticsWrapper::StatisticsWrapper};
    use game::systems::accounts::{IAccountsDispatcher, IAccountsDispatcherTrait};

    use game::utils::list::{List, ListTrait};

    use debug::PrintTrait;

    impl RuneStatisticRarityIsPercentLegacyHash of hash::LegacyHash::<(RuneStatistic, RuneRarity, bool)> {
        fn hash(state: felt252, value: (RuneStatistic, RuneRarity, bool)) -> felt252 {
            let mut buf: Array<felt252> = array![];
            value.serialize(ref buf);
            let k = poseidon::poseidon_hash_span(buf.span());
            hash::LegacyHash::hash(state, k)
        }
    }

    #[storage]
    struct Storage {
        baseStatistics: LegacyMap<felt252, BaseStatistics>,
        runesStatsTable: LegacyMap<(RuneStatistic, RuneRarity, bool), u32>,
        runesBonusStatsTable: LegacyMap<(RuneStatistic, RuneRarity, bool), u32>,
        accountsAdrs: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.initBaseStatisticsDict();
        self.initRunesTable();
        self.initBonusRunesTable();
    }

    #[abi(embed_v0)]
    impl EntityFactoryImpl of super::IEntityFactory<ContractState> {
        fn newEntities(ref self: ContractState, owner: ContractAddress, startIndex: u32, heroes: Array<Hero>, allyOrEnemy: AllyOrEnemy) -> Array<Entity> {
            let mut entities: Array<Entity> = Default::default();
            let mut i: u32 = 0;
            loop {
                if i == heroes.len() {
                    break;
                }
                let entity = self.newEntity(owner, startIndex + i, *heroes[i], allyOrEnemy);
                entities.append(entity);
                i += 1;
            };
            return entities;
        }
        fn newEntity(ref self: ContractState, owner: ContractAddress, index: u32, hero: Hero, allyOrEnemy: AllyOrEnemy) -> Entity {
            let baseStats = self.baseStatistics.read(hero.name);
            let baseStatsValues = baseStats.getAllStatistics(hero.level, hero.rank);
            let runesIndex = hero.getRunesIndexArray();
            let runes = IAccountsDispatcher { contract_address: self.accountsAdrs.read()}.getRunes(owner, runesIndex);
            let runesStatsValues = self.computeRunesBonuses(runes, baseStatsValues);

            return entity::new(
                index,
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
        fn setAccountsAdrs(ref self: ContractState, accountsAdrs: ContractAddress) {
            self.accountsAdrs.write(accountsAdrs);
        }
    }

    #[generate_trait]
    impl InternalEntityFactoryImpl of InternalEntityFactoryTrait {
        fn computeRunesBonuses(ref self: ContractState, runes: Array<Rune>, baseStats: BaseStatistics) -> StatisticsWrapper {
            let mut runesTotalBonusStats = statisticsWrapper::new(0, 0, 0, 0, 0, 0);
            let mut i: u32 = 0;
            loop {
                if i == runes.len() {
                    break;
                }
                let rune = *runes[i];
                let runeStatWithoutRank = self.runesStatsTable.read((rune.statistic, rune.rarity, rune.isPercent));
                let runeStat = runeStatWithoutRank + ((runeStatWithoutRank * rune.rank) / 10);
                self.matchAndAddStat(ref runesTotalBonusStats, rune.statistic, runeStat.into(), rune.isPercent, baseStats);
                if (rune.rank > 3) {
                    let bonusRank4 = rune.rank4Bonus;
                    let runeBonusStat = self.runesBonusStatsTable.read((bonusRank4.statistic, rune.rarity, bonusRank4.isPercent));
                    self.matchAndAddStat(ref runesTotalBonusStats, bonusRank4.statistic, runeBonusStat.into(), bonusRank4.isPercent, baseStats);
                }
                if (rune.rank > 7) {
                    let bonusRank8 = rune.rank8Bonus;
                    let runeBonusStat = self.runesBonusStatsTable.read((bonusRank8.statistic, rune.rarity, bonusRank8.isPercent));
                    self.matchAndAddStat(ref runesTotalBonusStats, bonusRank8.statistic, runeBonusStat.into(), bonusRank8.isPercent, baseStats);
                }
                if (rune.rank > 11) {
                    let bonusRank12 = rune.rank12Bonus;
                    let runeBonusStat = self.runesBonusStatsTable.read((bonusRank12.statistic, rune.rarity, bonusRank12.isPercent));
                    self.matchAndAddStat(ref runesTotalBonusStats, bonusRank12.statistic, runeBonusStat.into(), bonusRank12.isPercent, baseStats);
                }
                if (rune.rank > 15) {
                    let bonusRank16 = rune.rank16Bonus;
                    let runeBonusStat = self.runesBonusStatsTable.read((bonusRank16.statistic, rune.rarity, bonusRank16.isPercent));
                    self.matchAndAddStat(ref runesTotalBonusStats, bonusRank16.statistic, runeBonusStat.into(), bonusRank16.isPercent, baseStats);
                }
                i += 1;
            };
            return runesTotalBonusStats;
        }
        fn matchAndAddStat(ref self: ContractState, ref runesTotalBonusStats: StatisticsWrapper, statType: RuneStatistic, bonusStat: u64, isPercent: bool, baseStats: BaseStatistics) {
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

        fn initBaseStatisticsDict(ref self: ContractState) {
            self.baseStatistics.write('assassin', baseStatistics::new(1500, 200, 100, 185, 10, 100));
            self.baseStatistics.write('knight', baseStatistics::new(2000, 120, 180, 150, 10, 100));
            self.baseStatistics.write('priest', baseStatistics::new(1700, 150, 150, 160, 10, 100));
            self.baseStatistics.write('hunter', baseStatistics::new(1500, 170, 130, 170, 10, 200));
        }
        fn initRunesTable(ref self: ContractState) {
            self.runesStatsTable.write((RuneStatistic::Health, RuneRarity::Common, false), 300);
            self.runesStatsTable.write((RuneStatistic::Attack, RuneRarity::Common, false), 30);
            self.runesStatsTable.write((RuneStatistic::Defense, RuneRarity::Common, false), 30);
            self.runesStatsTable.write((RuneStatistic::Speed, RuneRarity::Common, false), 20);

            self.runesStatsTable.write((RuneStatistic::Health, RuneRarity::Common, true), 10);
            self.runesStatsTable.write((RuneStatistic::Attack, RuneRarity::Common, true), 10);
            self.runesStatsTable.write((RuneStatistic::Defense, RuneRarity::Common, true), 10);
            self.runesStatsTable.write((RuneStatistic::Speed, RuneRarity::Common, true), 10);
        }
        fn initBonusRunesTable(ref self: ContractState) {
            self.runesBonusStatsTable.write((RuneStatistic::Health, RuneRarity::Common, false), 50);
            self.runesBonusStatsTable.write((RuneStatistic::Attack, RuneRarity::Common, false), 5);
            self.runesBonusStatsTable.write((RuneStatistic::Defense, RuneRarity::Common, false), 5);
            self.runesBonusStatsTable.write((RuneStatistic::Speed, RuneRarity::Common, false), 3);

            self.runesBonusStatsTable.write((RuneStatistic::Health, RuneRarity::Common, true), 2);
            self.runesBonusStatsTable.write((RuneStatistic::Attack, RuneRarity::Common, true), 2);
            self.runesBonusStatsTable.write((RuneStatistic::Defense, RuneRarity::Common, true), 2);
            self.runesBonusStatsTable.write((RuneStatistic::Speed, RuneRarity::Common, true), 2);
        }

    }

}