#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct SkillNameSet {
    #[key]
    heroName: felt252,
    skill0: felt252,
    skill1: felt252,
    skill2: felt252,
}

fn new(hero_name: felt252, skill0: felt252, skill1: felt252, skill2: felt252) -> SkillNameSet {
    SkillNameSet {
        heroName: hero_name,
        skill0: skill0,
        skill1: skill1,
        skill2: skill2,
    }
}