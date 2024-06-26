#[dojo::interface]
trait ISettings {
    fn initSettings();
}

#[dojo::contract]
mod Settings {
    use game::systems::skillFactory::SkillFactory::SkillFactoryImpl;
    use game::systems::levels::Levels::LevelsImpl;
    use game::systems::entityFactory::EntityFactory::EntityFactoryImpl;
    use game::systems::arena::Arena::ArenaImpl;

    #[abi(embed_v0)]
    impl SettingsImpl of super::ISettings<ContractState> {
        fn initSettings(world: IWorldDispatcher) {
            SkillFactoryImpl::initSkills(world);
            SkillFactoryImpl::initSkillsBuffs(world);
            SkillFactoryImpl::initHeroSkillNameSet(world);
            LevelsImpl::init(world);
            EntityFactoryImpl::initBaseHeroesDict(world);
            EntityFactoryImpl::initRunesTable(world);
            EntityFactoryImpl::initBonusRunesTable(world);
            let minRankGems = array![1, 2, 4, 10];
            let gems = array![1, 2, 4, 10];
            let minRankRange = array![3, 5, 10];
            let range = array![2, 2, 5];
            ArenaImpl::initArena(world, minRankGems, gems, minRankRange, range)
        }
    }
}