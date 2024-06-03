use game::models::battle::entity::skill::Skill;
use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};

trait ISkillFactory {
    fn getSkill(world: IWorldDispatcher, name: felt252) -> Skill;
    fn getSkillSets(world: IWorldDispatcher, names: Array<felt252>) -> Array<Array<Skill>>;
    fn getSkillSet(world: IWorldDispatcher, entityName: felt252) -> Array<Skill>;
    fn initSkills(world: IWorldDispatcher);
    fn initSkillsBuffs(world: IWorldDispatcher);
    fn initHeroSkillNameSet(world: IWorldDispatcher);
}

mod SkillFactory {

    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use core::array::ArrayTrait;
    use starknet::ContractAddress;
    use game::models::battle::entity::skill::SkillTrait;
    use game::models::hero::{Hero};
    use game::models::battle::{Entity, entity::EntityImpl, entity::EntityTrait, entity::AllyOrEnemy, entity::cooldowns::CooldownsTrait};
    use game::models::battle::entity::{skill, skill::SkillImpl, skill::Skill, skill::TargetType, skill::damage, skill::heal, skill::buff, skill::buff::Buff, skill::buff::BuffType};
    use game::models::battle::entity::healthOnTurnProc::{HealthOnTurnProc, HealthOnTurnProcImpl};
    use game::models::storage::skill::skillInfos::SkillInfos;
    use game::models::storage::skill::{skillNameSet::SkillNameSet, skillNameSet};
    use game::models::storage::skill::skillBuff::SkillBuff;
    use game::models::storage::baseHero::BaseHero;

    impl SkillFactoryImpl of super::ISkillFactory {
        fn getSkill(world: IWorldDispatcher, name: felt252) -> Skill {
            let skillInfos = get!(world, name, (SkillInfos));
            let mut buffs: Array<Buff> = Default::default();
            let mut i = 0;
            loop {
                if(i == skillInfos.buffsCount) {
                    break;
                }
                let skillBuff = get!(world, (name, i), (SkillBuff));
                buffs.append(skillBuff.buff);
                i += 1;
            };
            let skill = skill::new(skillInfos.name, skillInfos.cooldown, skillInfos.damage, skillInfos.heal, skillInfos.targetType, buffs.span());
            return skill;
        }
        fn getSkillSets(world: IWorldDispatcher, names: Array<felt252>) -> Array<Array<Skill>> {
            let mut skills: Array<Array<Skill>> = Default::default();
            let mut i: u32 = 0;
            loop {
                if(i == names.len()) {
                    break;
                }
                let entityName = *names[i];
                skills.append(Self::getSkillSet(world, entityName));
                i += 1;
            };
            return skills;
        }
        fn getSkillSet(world: IWorldDispatcher, entityName: felt252) -> Array<Skill> {
            let skillsCount = get!(world, entityName, (BaseHero)).skillsCount;
            let mut skillSet: Array<Skill> = Default::default();
            let mut i: u8 = 0;
            loop {
                if(i == skillsCount) {
                    break;
                }
                let skillName = get!(world, (entityName, i), (SkillNameSet)).skill;
                skillSet.append(Self::getSkill(world, skillName));
                i += 1;
            };
            return skillSet;
        }
        
        fn initSkills(world: IWorldDispatcher) {
            set!(
                world,
                (
                    SkillInfos { name: 'Attack Knight', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Fire Swing', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Fire Strike', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Attack Priest', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Water Heal', cooldown: 3, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(10, false, true, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Water Shield', cooldown: 4, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Attack Hunter', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Arrows Rain', cooldown: 3, damage: damage::new(0, false, true, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Forest Senses', cooldown: 3, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 2 },
                    SkillInfos { name: 'Attack Assassin', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Sand Strike', cooldown: 2, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Sandstorm', cooldown: 4, damage: damage::new(100, false, true, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 }
                )
            );
        }
        fn initSkillsBuffs(world: IWorldDispatcher) {
            set!(
                world,
                (
                    SkillBuff { skillName: 'Fire Swing', index: 0, buff: buff::new(BuffType::Stun, 0, 2, true, false, false) },
                    SkillBuff { skillName: 'Fire Strike', index: 0, buff: buff::new(BuffType::Poison, 10, 2, true, false, false) },
                    SkillBuff { skillName: 'Water Heal', index: 0, buff: buff::new(BuffType::Regen, 8, 2, false, true, false) },
                    SkillBuff { skillName: 'Water Shield', index: 0, buff: buff::new(BuffType::DefenseUp, 80, 3, true, false, true) },
                    SkillBuff { skillName: 'Arrows Rain', index: 0, buff: buff::new(BuffType::Poison, 10, 2, false, true, false) },
                    SkillBuff { skillName: 'Forest Senses', index: 0, buff: buff::new(BuffType::AttackUp, 80, 2, false, false, true) },
                    SkillBuff { skillName: 'Forest Senses', index: 1, buff: buff::new(BuffType::SpeedUp, 80, 2, false, false, true) },
                    SkillBuff { skillName: 'Sand Strike', index: 0, buff: buff::new(BuffType::AttackUp, 50, 2, false, false, true) },
                    SkillBuff { skillName: 'Sandstorm', index: 0, buff: buff::new(BuffType::SpeedDown, 20, 2, false, true, false) }
                )
            );
        }
        fn initHeroSkillNameSet(world: IWorldDispatcher) {
            set!(
                world,
                (
                    SkillNameSet { heroName: 'knight', index: 0, skill: 'Attack Knight'},
                    SkillNameSet { heroName: 'knight', index: 1, skill: 'Fire Swing'},
                    SkillNameSet { heroName: 'knight', index: 2, skill: 'Fire Strike'},
                    SkillNameSet { heroName: 'priest', index: 0, skill: 'Attack Priest'},
                    SkillNameSet { heroName: 'priest', index: 1, skill: 'Water Heal'},
                    SkillNameSet { heroName: 'priest', index: 2, skill: 'Water Shield'},
                    SkillNameSet { heroName: 'hunter', index: 0, skill: 'Attack Hunter'},
                    SkillNameSet { heroName: 'hunter', index: 1, skill: 'Forest Senses'},
                    SkillNameSet { heroName: 'hunter', index: 2, skill: 'Arrows Rain'},
                    SkillNameSet { heroName: 'assassin', index: 0, skill: 'Attack Assassin'},
                    SkillNameSet { heroName: 'assassin', index: 1, skill: 'Sand Strike'},
                    SkillNameSet { heroName: 'assassin', index: 2, skill: 'Sandstorm'},
                )
            );
        }
    }
}