use starknet::ContractAddress;

use game::models::hero::rune::Rune;

#[derive(Drop, starknet::Event)]
enum Event {
    NewBattle: NewBattle,
    Skill: Skill,
    StartTurn: StartTurn,
    EndTurn: EndTurn,
    EndBattle: EndBattle,

    Loot: Loot,
    ExperienceGain: ExperienceGain,

    NewAccount: NewAccount,
    HeroMinted: HeroMinted,

    RuneMinted: RuneMinted,
    RuneUpgraded: RuneUpgraded,
    RuneBonusEvent: RuneBonusEvent,

    ArenaDefense: ArenaDefense,
    RankChange: RankChange,
    InitArena: InitArena,

    TimestampPvpEnergy: TimestampPvpEnergy,
    TimestampEnergy: TimestampEnergy,
}

#[derive(Drop, Serde)]
enum EventKey {
    RuneMinted,
    TimestampEnergy,
    TimestampPvpEnergy,
}

#[derive(Destruct, Serde)]
struct SkillEventParams {
    casterId: u32,
    targetId: u32,
    skillIndex: u8,
    damages: Array<IdAndValue>,
    heals: Array<IdAndValue>,
}

#[derive(Drop, Serde, starknet::Event)]
struct NewBattle {
    owner: ContractAddress,
    healthsArray: Array<u64>,
}
#[derive(Copy, Drop, Serde, starknet::Event)]
struct BuffEvent {
    entityId: u32,
    name: felt252,
    duration: u8,
}
#[derive(Drop, Serde, starknet::Event)]
struct IdAndValue {
    entityId: u32,
    value: u64,
}

#[derive(Drop, Serde, starknet::Event)]
struct Skill {
    owner: ContractAddress,
    casterId: u32,
    targetId: u32,
    skillIndex: u8,
    damages: Array<IdAndValue>,
    heals: Array<IdAndValue>,
    deaths: Array<u32>,
}

#[derive(Drop, Serde, starknet::Event)]
struct EndTurn {
    owner: ContractAddress,
    buffs: Array<BuffEvent>,
    status: Array<BuffEvent>,
    speeds: Array<IdAndValue>,
}

#[derive(Drop, Serde, starknet::Event)]
struct TurnBarEvent {
    entityId: u32,
    value: u64,
}

#[derive(Copy, Drop, Serde, starknet::Event)]
struct EntityBuffEvent {
    name: felt252,
    duration: u8,
}

#[derive(Drop, Serde, starknet::Event)]
struct StartTurn {
    owner: ContractAddress,
    entityId: u32,
    damages: Array<u64>,
    heals: Array<u64>,
    buffs: Array<EntityBuffEvent>,
    status: Array<EntityBuffEvent>,
    isDead: bool,
}

#[derive(Drop, Serde, starknet::Event)]
struct EndBattle {
    owner: ContractAddress,
    playerHasWon: bool,
}

#[derive(Drop, Serde, starknet::Event)]
struct Loot {
    owner: ContractAddress,
    crystals: u32,
}

#[derive(Drop, Serde, starknet::Event)]
struct ExperienceGain {
    owner: ContractAddress,
    entityId: u32,
    experienceGained: u32,
    levelAfter: u16,
    experienceAfter: u32,
}

#[derive(Drop, Serde, starknet::Event)]
struct NewAccount {
    owner: ContractAddress,
    username: felt252,
}
#[derive(Drop, Serde, starknet::Event)]
struct HeroMinted {
    owner: ContractAddress,
    id: u32,
    name: felt252,
}
#[derive(Drop, Serde, starknet::Event)]
struct RuneMinted {
    #[key]
    eventKey: EventKey,
    owner: ContractAddress,
    rune: Rune,
}
#[derive(Drop, Serde, starknet::Event)]
struct RuneUpgraded {
    owner: ContractAddress,
    id: u32,
    rank: u32,
    crystalCost: u32,
}
#[derive(Drop, Serde, starknet::Event)]
struct RuneBonusEvent {
    owner: ContractAddress,
    id: u32,
    rank: u32,
    procStat: felt252,
    isPercent: bool,
}
#[derive(Drop, Serde, starknet::Event)]
struct ArenaDefense {
    owner: ContractAddress,
    heroeIds: Span<u32>,
}
#[derive(Drop, Serde, starknet::Event)]
struct RankChange {
    owner: ContractAddress,
    rank: u64,
}
#[derive(Drop, Serde, starknet::Event)]
struct InitArena {
    owner: ContractAddress,
    rank: u64,
    heroeIds: Array<u32>,
}
#[derive(Drop, Serde, starknet::Event)]
struct TimestampEnergy {
    #[key]
    eventKey: EventKey,
    owner: ContractAddress,
    timestamp: u64,
}
#[derive(Drop, Serde, starknet::Event)]
struct TimestampPvpEnergy {
    #[key]
    eventKey: EventKey,
    owner: ContractAddress,
    timestamp: u64,
}