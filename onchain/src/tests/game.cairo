#[cfg(test)]
mod tests {
    use dojo_cairo_test::WorldStorageTestTrait;
    use dojo::model::{ModelStorage, ModelStorageTest};
    use dojo::world::WorldStorageTrait;
    use dojo_cairo_test::{
        spawn_test_world, NamespaceDef, TestResource, ContractDefTrait, ContractDef,
    };

    // use starknet::class_hash::Felt252TryIntoClassHash;
    // use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    // use dojo::utils::test::{spawn_test_world, deploy_contract};

    use game::systems::game::{Game, IGameDispatcher, IGameDispatcherTrait};
    // use game::systems::settings::{Settings, ISettingsDispatcher, ISettingsDispatcherTrait};
    use game::systems::settings::{Settings, Settings::initSettings};
    use game::models::map::{MapTrait, Map};
    use game::models::account::{heroes::{m_Heroes, Heroes}, runes::{m_Runes, Runes}};
    use game::models::account::{Account, AccountImpl, AccountTrait, m_Account};
    use game::models::storage::baseHero::{BaseHero, m_BaseHero};
    use game::models::storage::skill::{skillBuff::{SkillBuff, m_SkillBuff}, skillInfos::{SkillInfos, m_SkillInfos}, skillNameSet::{SkillNameSet, m_SkillNameSet}};
    use game::models::storage::arena::{arenaAccount::{ArenaAccount, m_ArenaAccount}, arenaConfig::{ArenaConfig, m_ArenaConfig}, arenaCurrentRankIndex::{ArenaCurrentRankIndex, m_ArenaCurrentRankIndex}, arenaTeam::{ArenaTeam, m_ArenaTeam}, enemyRanges::{EnemyRanges, m_EnemyRanges}, gemsRewards::{GemsRewards, m_GemsRewards}};
    use game::models::storage::{mapProgress::{MapProgress, m_MapProgress}};
    use game::models::storage::battles::{arenaBattleStorage::{ArenaBattleStorage, m_ArenaBattleStorage}, battleStorage::{BattleStorage, m_BattleStorage}, entityStorage::{EntityStorage, m_EntityStorage}, healthOnTurnProcStorage::{HealthOnTurnProcStorage, m_HealthOnTurnProcStorage}, turnTimelineStorage::{TurnTimelineStorage, m_TurnTimelineStorage}};
    use game::models::storage::level::{levelEnemy::{LevelEnemy, m_LevelEnemy}, levelInfos::{LevelInfos, m_LevelInfos}};
    use game::models::storage::statistics::{bonusRuneStatistics::{BonusRuneStatistics, m_BonusRuneStatistics}, runeStatistics::{RuneStatistics, m_RuneStatistics}};
    use game::models::storage::{config::{ConfigType, Config, m_Config}, summonRates::{SummonRates, m_SummonRates}};
    use game::models::storage::heroesByRank::{HeroesByRank, m_HeroesByRank};
    use game::models::storage::usernames::{Usernames, m_Usernames};
    use game::models::storage::quest::accountQuests::{AccountQuests, m_AccountQuests};
    // use game::models::storage::quest::dailyQuests::{DailyQuests, m_DailyQuests, DailyQuestsSettings, m_DailyQuestsSettings};
    use game::models::storage::quest::globalQuests::{GlobalQuests, m_GlobalQuests};
    use game::models::events::{e_NewBattle, e_BuffEvent, e_IdAndValue, e_Skill, e_EndTurn, e_TurnBarEvent, e_EntityBuffEvent, e_StartTurn, e_EndBattle, e_Loot, e_ExperienceGain, e_NewAccount, e_HeroMinted, e_RuneMinted, e_RuneUpgraded, e_RuneBonusEvent, e_ArenaDefense, e_RankChange, e_InitArena, e_TimestampEnergy, e_TimestampPvpEnergy};

    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "game",
            resources: [
                TestResource::Model(m_BaseHero::TEST_CLASS_HASH),
                TestResource::Model(m_Heroes::TEST_CLASS_HASH),
                TestResource::Model(m_Runes::TEST_CLASS_HASH),
                TestResource::Model(m_Account::TEST_CLASS_HASH),
                TestResource::Model(m_SkillBuff::TEST_CLASS_HASH),
                TestResource::Model(m_SkillInfos::TEST_CLASS_HASH),
                TestResource::Model(m_SkillNameSet::TEST_CLASS_HASH),
                TestResource::Model(m_ArenaAccount::TEST_CLASS_HASH),
                TestResource::Model(m_ArenaConfig::TEST_CLASS_HASH),
                TestResource::Model(m_ArenaCurrentRankIndex::TEST_CLASS_HASH),
                TestResource::Model(m_ArenaTeam::TEST_CLASS_HASH),
                TestResource::Model(m_EnemyRanges::TEST_CLASS_HASH),
                TestResource::Model(m_GemsRewards::TEST_CLASS_HASH),
                TestResource::Model(m_MapProgress::TEST_CLASS_HASH),
                TestResource::Model(m_ArenaBattleStorage::TEST_CLASS_HASH),
                TestResource::Model(m_BattleStorage::TEST_CLASS_HASH),
                TestResource::Model(m_EntityStorage::TEST_CLASS_HASH),
                TestResource::Model(m_HealthOnTurnProcStorage::TEST_CLASS_HASH),
                TestResource::Model(m_TurnTimelineStorage::TEST_CLASS_HASH),
                TestResource::Model(m_LevelEnemy::TEST_CLASS_HASH),
                TestResource::Model(m_LevelInfos::TEST_CLASS_HASH),
                TestResource::Model(m_AccountQuests::TEST_CLASS_HASH),
                // TestResource::Model(m_DailyQuests::TEST_CLASS_HASH),
                // TestResource::Model(m_DailyQuestsSettings::TEST_CLASS_HASH),
                TestResource::Model(m_GlobalQuests::TEST_CLASS_HASH),
                TestResource::Model(m_BonusRuneStatistics::TEST_CLASS_HASH),
                TestResource::Model(m_RuneStatistics::TEST_CLASS_HASH),
                TestResource::Model(m_Config::TEST_CLASS_HASH),
                TestResource::Model(m_SummonRates::TEST_CLASS_HASH),
                TestResource::Model(m_HeroesByRank::TEST_CLASS_HASH),
                TestResource::Model(m_Usernames::TEST_CLASS_HASH),
                TestResource::Event(e_NewBattle::TEST_CLASS_HASH),
                TestResource::Event(e_BuffEvent::TEST_CLASS_HASH),
                TestResource::Event(e_IdAndValue::TEST_CLASS_HASH),
                TestResource::Event(e_Skill::TEST_CLASS_HASH),
                TestResource::Event(e_EndTurn::TEST_CLASS_HASH),
                TestResource::Event(e_TurnBarEvent::TEST_CLASS_HASH),
                TestResource::Event(e_EntityBuffEvent::TEST_CLASS_HASH),
                TestResource::Event(e_StartTurn::TEST_CLASS_HASH),
                TestResource::Event(e_EndBattle::TEST_CLASS_HASH),
                TestResource::Event(e_Loot::TEST_CLASS_HASH),
                TestResource::Event(e_ExperienceGain::TEST_CLASS_HASH),
                TestResource::Event(e_NewAccount::TEST_CLASS_HASH),
                TestResource::Event(e_HeroMinted::TEST_CLASS_HASH),
                TestResource::Event(e_RuneMinted::TEST_CLASS_HASH),
                TestResource::Event(e_RuneUpgraded::TEST_CLASS_HASH),
                TestResource::Event(e_RuneBonusEvent::TEST_CLASS_HASH),
                TestResource::Event(e_ArenaDefense::TEST_CLASS_HASH),
                TestResource::Event(e_RankChange::TEST_CLASS_HASH),
                TestResource::Event(e_InitArena::TEST_CLASS_HASH),
                TestResource::Event(e_TimestampEnergy::TEST_CLASS_HASH),
                TestResource::Event(e_TimestampPvpEnergy::TEST_CLASS_HASH),
                TestResource::Contract(Game::TEST_CLASS_HASH),
                TestResource::Contract(Settings::TEST_CLASS_HASH),
            ]
                .span(),
        };

        ndef
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"game", @"Game")
                .with_writer_of([dojo::utils::bytearray_hash(@"ns")].span()),
            // ContractDefTrait::new(@"ns", @"Settings")
            //     .with_writer_of([dojo::utils::bytearray_hash(@"ns")].span()),
        ]
            .span()
    }

    #[test]
    fn test_world_test_set() {
        // Initialize test environment
        let caller = starknet::contract_address_const::<0x0>();
        let ndef = namespace_def();

        // Register the resources.
        let mut world = spawn_test_world([ndef].span());

        // Ensures permissions and initializations are synced.
        world.sync_perms_and_inits(contract_defs());

        world.write_model_test(@Config { key: ConfigType::TimeTickEnergy, value: 1200 });
        world.write_model_test(@Config { key: ConfigType::TimeTickPvpEnergy, value: 1200 });
        world.write_model_test(@Config { key: ConfigType::MaxEnergy, value: 5 });
        world.write_model_test(@Config { key: ConfigType::MaxPvpEnergy, value: 5 });
        world.write_model_test(@Config { key: ConfigType::StartingCrystals, value: 50000 });
        world.write_model_test(@Config { key: ConfigType::StartingGems, value: 0 });
        world.write_model_test(@Config { key: ConfigType::StartingSummonChests, value: 2 });
        world.write_model_test(@Config { key: ConfigType::TotalHeroesCount, value: 20 });

        let (contract_address, _) = world.dns(@"Game").unwrap();
        let game = IGameDispatcher { contract_address };

        game.createAccount('testuser');
        let acc: Account = world.read_model(caller);
        assert(acc.username == 'testuser', 'Username incorrect');

//         // game.mintHero();
//         // let mut newAccState = get!(world, caller, Account);
//         // assert(newAccState.heroesCount == acc.heroesCount + 1, 'Hero not minted');

//         // game.mintRune();
//         // game.mintRune();
//         // newAccState = get!(world, caller, Account);
//         // assert(newAccState.runesCount == acc.runesCount + 2, 'Rune not minted');
//         // let rune = get!(world, (caller, 1), Runes).rune;
//         // assert(rune.id == 1, 'Rune id incorrect');

//         let initial = testing::get_available_gas();
//         gas::withdraw_gas().unwrap();
//         game.startBattle(array![12, 13], Map::Campaign.toU16(), 0);
//         println!("{}\n", initial - testing::get_available_gas());
//         // game.playTurn(Map::Campaign.toU16(), 0, 5);
    }

}
