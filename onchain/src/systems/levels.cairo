use game::models::hero::Hero;
use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};

trait ILevels {
    fn getEnemies(world: IWorldDispatcher, map: u16, level: u16) -> Array<Hero>;
    fn getEnergyCost(world: IWorldDispatcher, map: u16, level: u16) -> u16;
    fn getEnemiesLevels(world: IWorldDispatcher, map: u16, level: u16) -> Array<u16>;
    fn init(world: IWorldDispatcher);
}

mod Levels {
    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use game::models::storage::level::{levelEnemy::LevelEnemy, levelInfos::LevelInfos};
    use game::models::{hero, hero::Hero};
    use game::models::map::{MapTrait, Map};

    impl LevelsImpl of super::ILevels {
        fn getEnergyCost(world: IWorldDispatcher, map: u16, level: u16) -> u16 {
            get!(world, (map, level), (LevelInfos)).energyCost
        }
        fn getEnemies(world: IWorldDispatcher, map: u16, level: u16) -> Array<Hero> {
            let mut enemiesCount = get!(world, (map, level), (LevelInfos)).enemiesCount;
            let mut enemies: Array<Hero> = array![];
            loop {
                if(enemiesCount == 0) {
                    break;
                }
                let enemy = get!(world, (map, level, enemiesCount - 1), (LevelEnemy));
                enemiesCount -= 1;
                enemies.append(enemy.hero);
            };
            return enemies;
        }
        fn getEnemiesLevels(world: IWorldDispatcher, map: u16, level: u16) -> Array<u16> {
            let mut enemiesCount = get!(world, (map, level), (LevelInfos)).enemiesCount;
            let mut enemiesLevels: Array<u16> = array![];
            loop {
                if(enemiesCount == 0) {
                    break;
                }
                let enemy = get!(world, (map, level, enemiesCount - 1), (LevelEnemy));
                enemiesCount -= 1;
                enemiesLevels.append(enemy.hero.level);
            };
            return enemiesLevels;
        }

        fn init(world: IWorldDispatcher) {
            // Level 0
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 0, index: 0, hero: hero::new(0, 'knight', 1, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 0, index: 1, hero: hero::new(0, 'knight', 1, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 0, index: 2, hero: hero::new(0, 'hunter', 1, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 0, index: 3, hero: hero::new(0, 'assassin', 1, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 0, energyCost: 1, enemiesCount: 4},
                )
            );

            // Level 1
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 1, index: 0, hero: hero::new(0, 'knight', 5, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 1, index: 1, hero: hero::new(0, 'knight', 5, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 1, index: 2, hero: hero::new(0, 'hunter', 5, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 1, index: 3, hero: hero::new(0, 'assassin', 5, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 1, energyCost: 1, enemiesCount: 4},
                )
            );

            // Level 2
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 2, index: 0, hero: hero::new(0, 'assassin', 1, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 2, energyCost: 0, enemiesCount: 1},
                )
            );

            // Level 3
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 3, index: 0, hero: hero::new(0, 'priest', 10, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 3, index: 1, hero: hero::new(0, 'priest', 10, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 3, index: 2, hero: hero::new(0, 'hunter', 10, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 3, index: 3, hero: hero::new(0, 'assassin', 10, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 3, energyCost: 1, enemiesCount: 4},
                )
            );

            // Level 4
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 4, index: 0, hero: hero::new(0, 'priest', 20, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 4, index: 1, hero: hero::new(0, 'hunter', 20, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 4, index: 2, hero: hero::new(0, 'assassin', 20, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 4, index: 3, hero: hero::new(0, 'assassin', 20, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 4, energyCost: 1, enemiesCount: 4},
                )
            );
        }
    }
}