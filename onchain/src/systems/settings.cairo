// #[dojo::interface]
// trait ISettings {
//     fn initSettings(world: IWorldDispatcher);
// }

#[dojo::contract]
mod Settings {
    use game::systems::skillFactory::SkillFactory::SkillFactoryImpl;
    use game::systems::levels::Levels::LevelsImpl;
    use game::systems::entityFactory::EntityFactory::EntityFactoryImpl;
    use game::systems::entityFactory::EntityFactory;
    use game::systems::arena::Arena::ArenaImpl;
    use game::systems::quests::Quests::QuestsImpl;
    use game::models::storage::{config::{ConfigType, Config}, summonRates::SummonRates};
    

    // #[abi(embed_v0)]
    // impl SettingsImpl of super::ISettings<ContractState> {

    // }

    fn initConfig(world: IWorldDispatcher) {
        set!(
            world, 
            (
                Config { key: ConfigType::TimeTickEnergy, value: 1200 },
                Config { key: ConfigType::TimeTickPvpEnergy, value: 1200 },
                Config { key: ConfigType::MaxEnergy, value: 5 },
                Config { key: ConfigType::MaxPvpEnergy, value: 5 },
                Config { key: ConfigType::StartingCrystals, value: 400 },
                Config { key: ConfigType::StartingGems, value: 0 },
                Config { key: ConfigType::StartingSummonChests, value: 2 },
                Config { key: ConfigType::MaxBaseHeroRank, value: 3 },
                Config { key: ConfigType::TotalHeroesCount, value: 20 },
            )
        );
    }

    fn initArena(world: IWorldDispatcher) {
        let minRankGems = array![1, 2, 4, 10];
        let gems = array![1, 2, 4, 10];
        let minRankRange = array![5, 8, 10, 20, 30, 50, 100, 300, 500, 2000, 10000, 100000];
        let range = array![2, 3, 4, 5, 10, 15, 20, 30, 50, 100, 100, 100];
        ArenaImpl::initArena(world, minRankGems, gems, minRankRange, range);
    }

    fn initSettings(world: IWorldDispatcher) {
        SkillFactoryImpl::initSkills(world);
        SkillFactoryImpl::initSkillsBuffs(world);
        SkillFactoryImpl::initHeroSkillNameSet(world);
        LevelsImpl::init(world);
        EntityFactoryImpl::initBaseHeroesDict(world);
        EntityFactoryImpl::initRunesTable(world);
        EntityFactoryImpl::initBonusRunesTable(world);
        EntityFactoryImpl::initHeroesByRankDict(world);
        QuestsImpl::initQuests(world);
        initArena(world);
        initConfig(world);
        set!(world, SummonRates { key: 0, rates: array![1, 10, 89]});
    }



    fn dojo_init(
        ref world: IWorldDispatcher,
    ) {
        initSettings(world);
    }

}