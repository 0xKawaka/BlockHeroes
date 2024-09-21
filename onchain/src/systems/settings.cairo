// #[dojo::interface]
// trait ISettings {
//     fn initSettings();
// }

#[dojo::contract]
mod Settings {
    use game::systems::skillFactory::SkillFactory::SkillFactoryImpl;
    use game::systems::levels::Levels::LevelsImpl;
    use game::systems::entityFactory::EntityFactory::EntityFactoryImpl;
    use game::systems::arena::Arena::ArenaImpl;
    use game::systems::quests::Quests::QuestsImpl;

    // #[abi(embed_v0)]
    // impl SettingsImpl of super::ISettings<ContractState> {
    // }

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
        let minRankRange = array![5, 8, 10, 20, 30];
        let range = array![2, 3, 4, 5, 7];
        ArenaImpl::initArena(world, minRankGems, gems, minRankRange, range)
    }

    fn dojo_init(
        ref world: IWorldDispatcher,
    ) {
        initSettings(world);
    }
}