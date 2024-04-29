use game::models::battle::entity::skill::buff::Buff;

#[derive(Model, Copy, Drop, Serde)]
struct SkillBuff {
    #[key]
    skillName: felt252,
    #[key]
    index: u16,
    buff: Buff,
}