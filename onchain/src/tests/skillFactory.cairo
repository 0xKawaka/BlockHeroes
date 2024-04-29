// #[cfg(test)]
// mod skillFactoryTest {
//     use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
//     use dojo::test_utils::{spawn_test_world, deploy_contract};
//     use game::systems::{skillFactory::{SkillFactory, SkillFactory::SkillFactoryImpl, ISkillFactoryDispatcherTrait, ISkillFactoryDispatcher}};
//     use game::models::storage::skill::{skillBuff::{skill_buff, SkillBuff}, skillInfos::{skill_infos, SkillInfos}, skillNameSet::{skill_name_set, SkillNameSet}};
//     use game::models::hero::{Hero, HeroImpl, HeroTrait};
//     use game::models::battle::entity::skill::Skill;

//     fn setup_world() -> ISkillFactoryDispatcher {
//         let mut models = array![skill_buff::TEST_CLASS_HASH, skill_infos::TEST_CLASS_HASH, skill_name_set::TEST_CLASS_HASH];
 
//         let world = spawn_test_world(models);
 
//         let contract_address = world.deploy_contract('salt', SkillFactory::TEST_CLASS_HASH.try_into().unwrap());
//         let skillFactory_system = ISkillFactoryDispatcher { contract_address };
 
//         skillFactory_system
//     }

//     #[test]
//     #[available_gas(900000000)]
//     fn test() {
//         let caller = starknet::contract_address_const::<0x0>();
//         let skillFactory_system = setup_world();
//         skillFactory_system.initSkills();
//         skillFactory_system.initSkillsBuffs();
//         skillFactory_system.initHeroSkillNameSet();

//         let skill = skillFactory_system.getSkill('Water Shield');
//         assert(skill.cooldown == 4, 'skill cooldown should be 4');

//         let skillSet: Array<Skill> = skillFactory_system.getSkillSet('hunter');
//         assert(skillSet.len() == 3, 'skillSet len');

//         let skillSets: Array<Array<Skill>> = skillFactory_system.getSkillSets(array!['hunter', 'priest']);
//         assert(skillSets[1].len() == 3, 'skillSets[1] len');
//     }
// }