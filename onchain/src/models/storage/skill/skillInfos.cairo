use game::models::battle::entity::skill::damage::Damage;
use game::models::battle::entity::skill::heal::Heal;
use game::models::battle::entity::skill::TargetType;
use game::models::battle::entity::Entity;

#[derive(Model, Copy, Drop, Serde)]
struct SkillInfos {
    #[key]
    name: felt252,
    cooldown: u8,
    damage: Damage,
    heal: Heal,
    targetType: TargetType,
    accuracy: u16,
    buffsCount: u16,
}
