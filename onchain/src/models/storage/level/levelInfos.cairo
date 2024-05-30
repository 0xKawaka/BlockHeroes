#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct LevelInfos {
    #[key]
    map: u16,
    #[key]
    level: u16,
    energyCost: u16,
    enemiesCount: u16,
}