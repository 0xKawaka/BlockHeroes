#[derive(Copy, Drop, Serde, Introspect)]
enum RewardType {
    Summon,
    Rune,
    Crystals,
}

trait RewardTypeTrait {
    fn toU16(self: RewardType) -> u16;
}

impl RewardTypeImpl of RewardTypeTrait {
    fn toU16(self: RewardType) -> u16 {
        match self {
            RewardType::Summon => 0,
            RewardType::Rune => 1,
            RewardType::Crystals => 2,
        }
    }
}

