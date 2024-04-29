use game::models::hero::Hero;

#[derive(Model, Copy, Drop, Serde)]
struct LevelEnemy {
    #[key]
    map: u16,
    #[key]
    level: u16,
    #[key]
    index: u16,
    hero: Hero,
}