#[derive(Introspect, Copy, Drop, Serde)]
enum Map {
    Campaign,
    Arena,
}

trait MapTrait {
    fn toU16(self: Map) -> u16;
}

impl MapImpl of MapTrait {
    fn toU16(self: Map) -> u16 {
        match self {
            Map::Campaign => 0,
            Map::Arena => 1,
        }
    }
}

