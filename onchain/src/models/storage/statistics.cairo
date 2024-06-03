mod bonusRuneStatistics;
mod runeStatistics;

#[derive(Copy, Drop, Serde, Introspect)]
struct Statistics {
    health: u64,
    attack: u64,
    defense: u64,
    speed: u64,
    criticalRate: u64,
    criticalDamage: u64,
}

fn new(health: u64, attack: u64, defense: u64, speed: u64, criticalRate: u64, criticalDamage: u64) -> Statistics {
    Statistics {
        health,
        attack,
        defense,
        speed,
        criticalRate,
        criticalDamage,
    }
}