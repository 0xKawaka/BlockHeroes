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
                    SkillInfos { name: 'Attack Wellan', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Fire Swing', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Fire Strike', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Attack Marella', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Water Heal', cooldown: 3, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(10, false, true, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Water Shield', cooldown: 4, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Attack Elandor', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Arrows Rain', cooldown: 3, damage: damage::new(0, false, true, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Forest Senses', cooldown: 3, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 2 },
                    SkillInfos { name: 'Attack Sirocco', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Sand Strike', cooldown: 2, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Sandstorm', cooldown: 4, damage: damage::new(100, false, true, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Attack Diana', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Nature Call', cooldown: 3, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Wind Pierce', cooldown: 3, damage: damage::new(280, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Attack Elric', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Holy Bastion', cooldown: 4, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Divine Hammer', cooldown: 3, damage: damage::new(230, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 2 },
                    SkillInfos { name: 'Attack Nereus', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Tide Strike', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Wave Slash', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Attack Rex', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Chum Challenge', cooldown: 3, damage: damage::new(0, false, true, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Anchor Stomps', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Attack Celeste', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Ice Shatter', cooldown: 3, damage: damage::new(150, false, true, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Snow Storm', cooldown: 4, damage: damage::new(100, false, true, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Attack Oakheart', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Lignum Hammer', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Buloke Wall', cooldown: 4, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Attack Sylvara', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Silvan Chant', cooldown: 3, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(10, false, true, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Astral Beam', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Attack Bane', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Raging Fire', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Meteor Strike', cooldown: 3, damage: damage::new(160, false, true, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Attack Ember', cooldown: 0, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(5, true, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Ember Infusion', cooldown: 3, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(5, true, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 2 },
                    SkillInfos { name: 'Fiery Shower', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Attack Molten', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Blazing Rage', cooldown: 3, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 2 },
                    SkillInfos { name: 'Volcano Flurry', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Attack Solas', cooldown: 0, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(5, true, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Wisp Infusion', cooldown: 3, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, true, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Divine Storm', cooldown: 3, damage: damage::new(280, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, true, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Attack Solveig', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Swords Dance', cooldown: 3, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Celestial Judgement', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Attack Janus', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Eclipse Burst', cooldown: 3, damage: damage::new(280, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Void Singularity', cooldown: 4, damage: damage::new(200, false, true, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Attack Horus', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Ankh Blessing', cooldown: 3, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Khonsu Blessing', cooldown: 3, damage: damage::new(0, false, false, false, damage::DamageType::Flat), heal: skill::heal::new(10, false, true, false, heal::HealType::Percent), targetType: TargetType::Ally, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Attack Jabari', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Scorpion Surge', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Venom Slash', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Attack Khamsin', cooldown: 0, damage: damage::new(100, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 0 },
                    SkillInfos { name: 'Sand Flurry', cooldown: 3, damage: damage::new(200, true, false, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
                    SkillInfos { name: 'Quicksand Ambush', cooldown: 4, damage: damage::new(100, false, true, false, damage::DamageType::Flat), heal: skill::heal::new(0, false, false, false, heal::HealType::Percent), targetType: TargetType::Enemy, accuracy: 1, buffsCount: 1 },
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
                    SkillBuff { skillName: 'Water Shield', index: 0, buff: buff::new(BuffType::DefenseUp, 70, 3, true, false, true) },
                    SkillBuff { skillName: 'Arrows Rain', index: 0, buff: buff::new(BuffType::Poison, 10, 2, false, true, false) },
                    SkillBuff { skillName: 'Forest Senses', index: 0, buff: buff::new(BuffType::AttackUp, 80, 2, false, false, true) },
                    SkillBuff { skillName: 'Forest Senses', index: 1, buff: buff::new(BuffType::SpeedUp, 80, 2, false, false, true) },
                    SkillBuff { skillName: 'Sand Strike', index: 0, buff: buff::new(BuffType::AttackUp, 50, 2, false, false, true) },
                    SkillBuff { skillName: 'Sandstorm', index: 0, buff: buff::new(BuffType::SpeedDown, 20, 2, false, true, false) },
                    SkillBuff { skillName: 'Nature Call', index: 0, buff: buff::new(BuffType::SpeedUp, 40, 2, false, true, false) },
                    SkillBuff { skillName: 'Holy Bastion', index: 0, buff: buff::new(BuffType::DefenseUp, 50, 3, false, true, false) },
                    SkillBuff { skillName: 'Divine Hammer', index: 0, buff: buff::new(BuffType::SpeedDown, 50, 2, true, false, false) },
                    SkillBuff { skillName: 'Divine Hammer', index: 1, buff: buff::new(BuffType::AttackDown, 50, 2, true, false, false) },
                    SkillBuff { skillName: 'Tide Strike', index: 0, buff: buff::new(BuffType::AttackUp, 50, 2, false, true, false) },
                    SkillBuff { skillName: 'Chum Challenge', index: 0, buff: buff::new(BuffType::DefenseUp, 60, 2, false, false, true) },
                    SkillBuff { skillName: 'Snow Storm', index: 0, buff: buff::new(BuffType::SpeedDown, 50, 2, false, true, false) },   
                    SkillBuff { skillName: 'Lignum Hammer', index: 0, buff: buff::new(BuffType::Stun, 0, 1, true, false, false) },
                    SkillBuff { skillName: 'Buloke Wall', index: 0, buff: buff::new(BuffType::DefenseUp, 50, 2, false, true, false) },
                    SkillBuff { skillName: 'Silvan Chant', index: 0, buff: buff::new(BuffType::Regen, 3, 2, false, true, false) },
                    SkillBuff { skillName: 'Astral Beam', index: 0, buff: buff::new(BuffType::AttackDown, 50, 2, true, false, false) },
                    SkillBuff { skillName: 'Raging Fire', index: 0, buff: buff::new(BuffType::SpeedDown, 50, 2, true, false, false) },
                    SkillBuff { skillName: 'Ember Infusion', index: 0, buff: buff::new(BuffType::SpeedUp, 20, 2, false, true, false) },
                    SkillBuff { skillName: 'Ember Infusion', index: 1, buff: buff::new(BuffType::AttackUp, 20, 2, false, true, false) },
                    SkillBuff { skillName: 'Blazing Rage', index: 0, buff: buff::new(BuffType::DefenseUp, 60, 2, true, false, false) },
                    SkillBuff { skillName: 'Blazing Rage', index: 1, buff: buff::new(BuffType::AttackUp, 60, 2, true, false, false) },
                    SkillBuff { skillName: 'Wisp Infusion', index: 0, buff: buff::new(BuffType::SpeedUp, 30, 2, false, true, false) },
                    SkillBuff { skillName: 'Swords Dance', index: 0, buff: buff::new(BuffType::AttackUp, 30, 2, false, true, false) },
                    SkillBuff { skillName: 'Celestial Judgement', index: 0, buff: buff::new(BuffType::DefenseDown, 50, 2, true, false, false) },
                    SkillBuff { skillName: 'Ankh Blessing', index: 0, buff: buff::new(BuffType::DefenseUp, 50, 2, false, true, false) },
                    SkillBuff { skillName: 'Khonsu Blessing', index: 0, buff: buff::new(BuffType::AttackUp, 30, 2, false, true, false) },
                    SkillBuff { skillName: 'Scorpion Surge', index: 0, buff: buff::new(BuffType::Stun, 0, 2, true, false, false) },
                    SkillBuff { skillName: 'Venom Slash', index: 0, buff: buff::new(BuffType::Poison, 12, 2, true, false, false) },
                    SkillBuff { skillName: 'Sand Flurry', index: 0, buff: buff::new(BuffType::DefenseDown, 50, 2, true, false, false) },
                    SkillBuff { skillName: 'Quicksand Ambush', index: 0, buff: buff::new(BuffType::SpeedDown, 20, 2, true, false, false) },
                )
            );
        }

        fn initHeroSkillNameSet(world: IWorldDispatcher) {
            set!(
                world,
                (
                    SkillNameSet { heroName: 'wellan', index: 0, skill: 'Attack Wellan'},
                    SkillNameSet { heroName: 'wellan', index: 1, skill: 'Fire Swing'},
                    SkillNameSet { heroName: 'wellan', index: 2, skill: 'Fire Strike'},
                    SkillNameSet { heroName: 'marella', index: 0, skill: 'Attack Marella'},
                    SkillNameSet { heroName: 'marella', index: 1, skill: 'Water Heal'},
                    SkillNameSet { heroName: 'marella', index: 2, skill: 'Water Shield'},
                    SkillNameSet { heroName: 'elandor', index: 0, skill: 'Attack Elandor'},
                    SkillNameSet { heroName: 'elandor', index: 1, skill: 'Forest Senses'},
                    SkillNameSet { heroName: 'elandor', index: 2, skill: 'Arrows Rain'},
                    SkillNameSet { heroName: 'sirocco', index: 0, skill: 'Attack Sirocco'},
                    SkillNameSet { heroName: 'sirocco', index: 1, skill: 'Sand Strike'},
                    SkillNameSet { heroName: 'sirocco', index: 2, skill: 'Sandstorm'},
                    SkillNameSet { heroName: 'diana', index: 0, skill: 'Attack Diana'},
                    SkillNameSet { heroName: 'diana', index: 1, skill: 'Nature Call'},
                    SkillNameSet { heroName: 'diana', index: 2, skill: 'Wind Pierce'},
                    SkillNameSet { heroName: 'elric', index: 0, skill: 'Attack Elric'},
                    SkillNameSet { heroName: 'elric', index: 1, skill: 'Holy Bastion'},
                    SkillNameSet { heroName: 'elric', index: 2, skill: 'Divine Hammer'},
                    SkillNameSet { heroName: 'nereus', index: 0, skill: 'Attack Nereus'},
                    SkillNameSet { heroName: 'nereus', index: 1, skill: 'Tide Strike'},
                    SkillNameSet { heroName: 'nereus', index: 2, skill: 'Wave Slash'},
                    SkillNameSet { heroName: 'rex', index: 0, skill: 'Attack Rex'},
                    SkillNameSet { heroName: 'rex', index: 1, skill: 'Chum Challenge'},
                    SkillNameSet { heroName: 'rex', index: 2, skill: 'Anchor Stomps'},
                    SkillNameSet { heroName: 'celeste', index: 0, skill: 'Attack Celeste'},
                    SkillNameSet { heroName: 'celeste', index: 1, skill: 'Ice Shatter'},
                    SkillNameSet { heroName: 'celeste', index: 2, skill: 'Snow Storm'},
                    SkillNameSet { heroName: 'oakheart', index: 0, skill: 'Attack Oakheart'},
                    SkillNameSet { heroName: 'oakheart', index: 1, skill: 'Lignum Hammer'},
                    SkillNameSet { heroName: 'oakheart', index: 2, skill: 'Buloke Wall'},
                    SkillNameSet { heroName: 'sylvara', index: 0, skill: 'Attack Sylvara'},
                    SkillNameSet { heroName: 'sylvara', index: 1, skill: 'Silvan Chant'},
                    SkillNameSet { heroName: 'sylvara', index: 2, skill: 'Astral Beam'},
                    SkillNameSet { heroName: 'bane', index: 0, skill: 'Attack Bane'},
                    SkillNameSet { heroName: 'bane', index: 1, skill: 'Raging Fire'},
                    SkillNameSet { heroName: 'bane', index: 2, skill: 'Meteor Strike'},
                    SkillNameSet { heroName: 'ember', index: 0, skill: 'Attack Ember'},
                    SkillNameSet { heroName: 'ember', index: 1, skill: 'Ember Infusion'},
                    SkillNameSet { heroName: 'ember', index: 2, skill: 'Fiery Shower'},
                    SkillNameSet { heroName: 'molten', index: 0, skill: 'Attack Molten'},
                    SkillNameSet { heroName: 'molten', index: 1, skill: 'Blazing Rage'},
                    SkillNameSet { heroName: 'molten', index: 2, skill: 'Volcano Flurry'},
                    SkillNameSet { heroName: 'solas', index: 0, skill: 'Attack Solas'},
                    SkillNameSet { heroName: 'solas', index: 1, skill: 'Wisp Infusion'},
                    SkillNameSet { heroName: 'solas', index: 2, skill: 'Divine Storm'},
                    SkillNameSet { heroName: 'solveig', index: 0, skill: 'Attack Solveig'},
                    SkillNameSet { heroName: 'solveig', index: 1, skill: 'Swords Dance'},
                    SkillNameSet { heroName: 'solveig', index: 2, skill: 'Celestial Judgement'},
                    SkillNameSet { heroName: 'janus', index: 0, skill: 'Attack Janus'},
                    SkillNameSet { heroName: 'janus', index: 1, skill: 'Eclipse Burst'},
                    SkillNameSet { heroName: 'janus', index: 2, skill: 'Void Singularity'},
                    SkillNameSet { heroName: 'horus', index: 0, skill: 'Attack Horus'},
                    SkillNameSet { heroName: 'horus', index: 1, skill: 'Ankh Blessing'},
                    SkillNameSet { heroName: 'horus', index: 2, skill: 'Khonsu Blessing'},
                    SkillNameSet { heroName: 'jabari', index: 0, skill: 'Attack Jabari'},
                    SkillNameSet { heroName: 'jabari', index: 1, skill: 'Scorpion Surge'},
                    SkillNameSet { heroName: 'jabari', index: 2, skill: 'Venom Slash'},
                    SkillNameSet { heroName: 'khamsin', index: 0, skill: 'Attack Khamsin'},
                    SkillNameSet { heroName: 'khamsin', index: 1, skill: 'Sand Flurry'},
                    SkillNameSet { heroName: 'khamsin', index: 2, skill: 'Quicksand Ambush'},
                )
            );
        }
    }
}