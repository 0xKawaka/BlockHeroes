use game::models::battle::entity::skill::buff::Buff;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct SkillBuff {
    #[key]
    skillName: felt252,
    #[key]
    index: u16,
    buff: Buff,
}