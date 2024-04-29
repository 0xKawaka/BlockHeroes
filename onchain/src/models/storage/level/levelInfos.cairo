#[derive(Model, Copy, Drop, Serde)]
struct LevelInfos {
    #[key]
    map: u16,
    #[key]
    level: u16,
    energyCost: u16,
    enemiesCount: u16,
}