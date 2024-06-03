#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct SkillNameSet {
    #[key]
    heroName: felt252,
    #[key]
    index: u8,
    skill: felt252,
}

fn new(hero_name: felt252, index: u8, skill: felt252) -> SkillNameSet {
    SkillNameSet {
        heroName: hero_name,
        index: index,
        skill: skill,
    }
}