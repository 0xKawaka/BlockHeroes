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
            let mut i = 0;
            loop {
                if(i == enemiesCount) {
                    break;
                }
                let enemy = get!(world, (map, level, i), (LevelEnemy));
                i += 1;
                enemies.append(enemy.hero);
            };
            return enemies;
        }
        fn getEnemiesLevels(world: IWorldDispatcher, map: u16, level: u16) -> Array<u16> {
            let mut enemiesCount = get!(world, (map, level), (LevelInfos)).enemiesCount;
            let mut enemiesLevels: Array<u16> = array![];
            let mut i = 0;
            loop {
                if(i == enemiesCount) {
                    break;
                }
                let enemy = get!(world, (map, level, i), (LevelEnemy));
                i += 1;
                enemiesLevels.append(enemy.hero.level);
            };
            return enemiesLevels;
        }

        fn init(world: IWorldDispatcher) {
            // Level 0
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 0, index: 0, hero: hero::new(0, 'nereus', 1, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 0, energyCost: 0, enemiesCount: 1},
                )
            );


            // Level 1
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 1, index: 0, hero: hero::new(0, 'wellan', 1, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 1, index: 1, hero: hero::new(0, 'ember', 1, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 1, energyCost: 0, enemiesCount: 2},
                )
            );


            // Level 2
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 2, index: 0, hero: hero::new(0, 'wellan', 2, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 2, index: 1, hero: hero::new(0, 'molten', 1, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 2, index: 2, hero: hero::new(0, 'bane', 2, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 2, energyCost: 0, enemiesCount: 3},
                )
            );


            // Level 3
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 3, index: 0, hero: hero::new(0, 'rex', 7, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 3, energyCost: 0, enemiesCount: 1},
                )
            );

            // Level 4
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 4, index: 0, hero: hero::new(0, 'nereus', 3, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 4, index: 1, hero: hero::new(0, 'marella', 3, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 4, index: 2, hero: hero::new(0, 'celeste', 3, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 4, energyCost: 0, enemiesCount: 3},
                )
            );

            // Level 5
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 5, index: 0, hero: hero::new(0, 'wellan', 3, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 5, index: 1, hero: hero::new(0, 'bane', 3, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 5, index: 2, hero: hero::new(0, 'molten', 3, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 5, index: 3, hero: hero::new(0, 'ember', 3, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 5, energyCost: 0, enemiesCount: 4},
                )
            );

            // Level 6
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 6, index: 0, hero: hero::new(0, 'nereus', 4, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 6, index: 1, hero: hero::new(0, 'rex', 4, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 6, index: 2, hero: hero::new(0, 'marella', 4, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 6, index: 3, hero: hero::new(0, 'celeste', 4, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 6, energyCost: 0, enemiesCount: 4},
                )
            );

            // Level 7
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 7, index: 0, hero: hero::new(0, 'elric', 5, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 7, index: 1, hero: hero::new(0, 'marella', 5, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 7, index: 2, hero: hero::new(0, 'sirocco', 5, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 7, index: 3, hero: hero::new(0, 'celeste', 5, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 7, energyCost: 0, enemiesCount: 4},
                )
            );

            // Level 8
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 8, index: 0, hero: hero::new(0, 'elric', 7, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 8, index: 1, hero: hero::new(0, 'sirocco', 7, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 8, index: 2, hero: hero::new(0, 'ember', 7, 1) },
                LevelEnemy { map: Map::Campaign.toU16(), level: 8, index: 3, hero: hero::new(0, 'diana', 7, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 8, energyCost: 0, enemiesCount: 4},
                )
            );

            // Level 9
            set!(
                world,
                (
                LevelEnemy { map: Map::Campaign.toU16(), level: 9, index: 0, hero: hero::new(0, 'janus', 25, 1) },
                LevelInfos { map: Map::Campaign.toU16(), level: 9, energyCost: 0, enemiesCount: 1},
                )
            );


            // // Level 0
            // set!(
            //     world,
            //     (
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 0, index: 0, hero: hero::new(0, 'sirocco', 1, 1) },
            //     LevelInfos { map: Map::Campaign.toU16(), level: 0, energyCost: 1, enemiesCount: 1},
            //     )
            // );


            // // Level 1
            // set!(
            //     world,
            //     (
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 1, index: 0, hero: hero::new(0, 'wellan', 1, 1) },
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 1, index: 1, hero: hero::new(0, 'wellan', 1, 1) },
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 1, index: 2, hero: hero::new(0, 'marella', 1, 1) },
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 1, index: 3, hero: hero::new(0, 'sirocco', 1, 1) },
            //     LevelInfos { map: Map::Campaign.toU16(), level: 1, energyCost: 1, enemiesCount: 4},
            //     )
            // );


            // // Level 2
            // set!(
            //     world,
            //     (
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 2, index: 0, hero: hero::new(0, 'wellan', 5, 1) },
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 2, index: 1, hero: hero::new(0, 'wellan', 5, 1) },
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 2, index: 2, hero: hero::new(0, 'elandor', 5, 1) },
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 2, index: 3, hero: hero::new(0, 'sirocco', 5, 1) },
            //     LevelInfos { map: Map::Campaign.toU16(), level: 2, energyCost: 1, enemiesCount: 4},
            //     )
            // );


            // // Level 3
            // set!(
            //     world,
            //     (
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 3, index: 0, hero: hero::new(0, 'marella', 10, 1) },
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 3, index: 1, hero: hero::new(0, 'marella', 10, 1) },
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 3, index: 2, hero: hero::new(0, 'elandor', 10, 1) },
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 3, index: 3, hero: hero::new(0, 'sirocco', 10, 1) },
            //     LevelInfos { map: Map::Campaign.toU16(), level: 3, energyCost: 1, enemiesCount: 4},
            //     )
            // );

            // // Level 4
            // set!(
            //     world,
            //     (
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 4, index: 0, hero: hero::new(0, 'marella', 20, 1) },
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 4, index: 1, hero: hero::new(0, 'elandor', 20, 1) },
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 4, index: 2, hero: hero::new(0, 'sirocco', 20, 1) },
            //     LevelEnemy { map: Map::Campaign.toU16(), level: 4, index: 3, hero: hero::new(0, 'sirocco', 20, 1) },
            //     LevelInfos { map: Map::Campaign.toU16(), level: 4, energyCost: 1, enemiesCount: 4},
            //     )
            // );
        }
    }
}