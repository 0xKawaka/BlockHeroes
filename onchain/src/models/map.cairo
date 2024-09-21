#[derive(Copy, Drop, Serde, Introspect)]
enum Map {
    Campaign,
    Arena,
}

// fn fromU16(value: u16) -> Map {
//     match value {
//         0 => Map::Campaign,
//         1 => Map::Arena,
//     }
// }

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

