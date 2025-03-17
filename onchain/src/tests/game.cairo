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
                TestResource::Model(m_BonusRuneStatistics::TEST_CLASS_HASH),
                TestResource::Model(m_RuneStatistics::TEST_CLASS_HASH),
            ]
                .span(),
        };

        ndef
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"game", @"Game")
                .with_writer_of([dojo::utils::bytearray_hash(@"game")].span()),
            ContractDefTrait::new(@"game", @"Settings")
                .with_writer_of([dojo::utils::bytearray_hash(@"game")].span()),
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
    }

    // #[test]
    // #[available_gas(900000000000)]
    // fn test_game() {
    //     let caller = starknet::contract_address_const::<0x0>();
    //     let mut models = array![
    //         base_hero::TEST_CLASS_HASH,
    //         heroes::TEST_CLASS_HASH, runes::TEST_CLASS_HASH, account::TEST_CLASS_HASH,
    //         skill_buff::TEST_CLASS_HASH, skill_infos::TEST_CLASS_HASH, skill_name_set::TEST_CLASS_HASH,
    //         arena_account::TEST_CLASS_HASH, arena_config::TEST_CLASS_HASH, arena_current_rank_index::TEST_CLASS_HASH, arena_team::TEST_CLASS_HASH, enemy_ranges::TEST_CLASS_HASH, gems_rewards::TEST_CLASS_HASH,
    //         map_progress::TEST_CLASS_HASH,
    //         arena_battle_storage::TEST_CLASS_HASH, battle_storage::TEST_CLASS_HASH, entity_storage::TEST_CLASS_HASH, health_on_turn_proc_storage::TEST_CLASS_HASH, turn_timeline_storage::TEST_CLASS_HASH,
    //         level_enemy::TEST_CLASS_HASH, level_infos::TEST_CLASS_HASH,
    //         bonus_rune_statistics::TEST_CLASS_HASH, rune_statistics::TEST_CLASS_HASH,
    //     ];
    //     // let world = spawn_test_world("game", models);
    //     let world = spawn_test_world!();

    //     let game_contract_adrs = world.deploy_contract('salt', Game::TEST_CLASS_HASH.try_into().unwrap());
    //     let game = IGameDispatcher { contract_address: game_contract_adrs };

    //     let settings_contract_adrs = world.deploy_contract('salt2', Settings::TEST_CLASS_HASH.try_into().unwrap());
    //     // let settings = ISettingsDispatcher { contract_address: settings_contract_adrs };

    //     world.grant_writer(dojo::utils::bytearray_hash(@"game"), game_contract_adrs);
    //     world.grant_writer(dojo::utils::bytearray_hash(@"game"), settings_contract_adrs);

    //     // settings.initSettings();
    //     initSettings(ref world);

    //     game.createAccount('testuser');
    //     let mut acc = get!(ref world, caller, Account);
    //     assert(acc.username == 'testuser', 'Username incorrect');

    //     // game.mintHero();
    //     // let mut newAccState = get!(ref world, caller, Account);
    //     // assert(newAccState.heroesCount == acc.heroesCount + 1, 'Hero not minted');

    //     // game.mintRune();
    //     // game.mintRune();
    //     // newAccState = get!(ref world, caller, Account);
    //     // assert(newAccState.runesCount == acc.runesCount + 2, 'Rune not minted');
    //     // let rune = get!(ref world, (caller, 1), Runes).rune;
    //     // assert(rune.id == 1, 'Rune id incorrect');

    //     let initial = testing::get_available_gas();
    //     gas::withdraw_gas().unwrap();
    //     game.startBattle(array![12, 13], Map::Campaign.toU16(), 0);
    //     println!("{}\n", initial - testing::get_available_gas());
    //     // game.playTurn(Map::Campaign.toU16(), 0, 5);
    // }
}
