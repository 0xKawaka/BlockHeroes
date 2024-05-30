use game::models::hero::Hero;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct LevelEnemy {
    #[key]
    map: u16,
    #[key]
    level: u16,
    #[key]
    index: u16,
    hero: Hero,
}