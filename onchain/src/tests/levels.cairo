// #[cfg(test)]
// mod levelsTest {
//     use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
//     use dojo::test_utils::{spawn_test_world, deploy_contract};
//     use game::systems::{levels::{Levels, Levels::LevelsImpl, ILevelsDispatcherTrait, ILevelsDispatcher}};
//     use game::models::storage::level::{levelEnemy::{level_enemy, LevelEnemy}, levelInfos::{level_infos, LevelInfos}};
//     use game::models::hero::{Hero, HeroImpl, HeroTrait};

//     fn setup_world() -> ILevelsDispatcher {
//         let mut models = array![level_enemy::TEST_CLASS_HASH, level_infos::TEST_CLASS_HASH];
 
//         let world = spawn_test_world(models);
 
//         let contract_address = world
//             .deploy_contract('salt', Levels::TEST_CLASS_HASH.try_into().unwrap());
//         let levels_system = ILevelsDispatcher { contract_address };
 
//         levels_system
//     }
 
 
//     #[test]
//     #[available_gas(900000000)]
//     fn test_levels() {
//         let caller = starknet::contract_address_const::<0x0>();
//         let levels_system = setup_world();
//         levels_system.init();
//         let energyCost = levels_system.getEnergyCost(0, 1);
//         println!("energyCost: {:?}", energyCost);
//         let enemies: Array<Hero> = levels_system.getEnemies(0, 1);
//         let mut i = 0;
//         loop {
//             if(i >= enemies.len()) {
//                 break;
//             }
//             let enemy = *enemies[i];
//             // let name = enemy.getName();
//             println!("enemy: {:?}", enemy.getName());
//             i += 1;
//         }
//     }
// }