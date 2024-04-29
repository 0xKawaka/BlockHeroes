use game::models::battle::entity::skill::Skill;

#[dojo::interface]
trait ISkillFactory {
    fn getSkill(name: felt252) -> Skill;
    fn getSkillSets(names: Array<felt252>) -> Array<Array<Skill>>;
    fn getSkillSet(entityName: felt252) -> Array<Skill>;
    fn initSkills();
    fn initSkillsBuffs();
    fn initHeroSkillNameSet();
}

#[dojo::contract]
mod SkillFactory {

    use core::array::ArrayTrait;
    use starknet::ContractAddress;
    use game::utils::list::{List, ListTrait, ListImpl};
    use game::models::battle::entity::skill::SkillTrait;
    use game::models::hero::{Hero};
    use game::models::battle::{Entity, entity::EntityImpl, entity::EntityTrait, entity::AllyOrEnemy, entity::cooldowns::CooldownsTrait, entity::skillset};
    use game::models::battle::entity::{skill, skill::SkillImpl, skill::Skill, skill::TargetType, skill::damage, skill::heal, skill::buff, skill::buff::Buff, skill::buff::BuffType};
    use game::models::battle::entity::healthOnTurnProc::{HealthOnTurnProc, HealthOnTurnProcImpl};
    use game::models::{baseStatistics, baseStatistics::BaseStatisticsImpl};
    use game::models::storage::skill::skillInfos::SkillInfos;
    use game::models::storage::skill::{skillNameSet::SkillNameSet, skillNameSet};
    use game::models::storage::skill::skillBuff::SkillBuff;
    use debug::PrintTrait;

    #[abi(embed_v0)]
    impl SkillFactoryImpl of super::ISkillFactory<ContractState> {
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
                skills.append(self.getSkillSet(entityName));
                i += 1;
            };
            return skills;
        }
        fn getSkillSet(world: IWorldDispatcher, entityName: felt252) -> Array<Skill> {
            let skillNameSet = get!(world, entityName, (SkillNameSet));
            let mut skillSet: Array<Skill> = Default::default();
            skillSet.append(self.getSkill(skillNameSet.skill0));
            skillSet.append(self.getSkill(skillNameSet.skill1));
            skillSet.append(self.getSkill(skillNameSet.skill2));
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
                    SkillNameSet { heroName: 'knight', skill0: 'Attack Knight', skill1: 'Fire Swing', skill2: 'Fire Strike' },
                    SkillNameSet { heroName: 'priest', skill0: 'Attack Priest', skill1: 'Water Heal', skill2: 'Water Shield' },
                    SkillNameSet { heroName: 'hunter', skill0: 'Attack Hunter', skill1: 'Forest Senses', skill2: 'Arrows Rain' },
                    SkillNameSet { heroName: 'assassin', skill0: 'Attack Assassin', skill1: 'Sand Strike', skill2: 'Sandstorm' },
                )
            );
        }
    }
}