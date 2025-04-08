import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, BigNumberish } from 'starknet';

// Type definition for `game::models::account::Account` struct
export interface Account {
	owner: string;
	username: BigNumberish;
	energy: BigNumberish;
	pvpEnergy: BigNumberish;
	crystals: BigNumberish;
	gems: BigNumberish;
	lastEnergyUpdateTimestamp: BigNumberish;
	lastPvpEnergyUpdateTimestamp: BigNumberish;
	runesCount: BigNumberish;
	heroesCount: BigNumberish;
	summonChests: BigNumberish;
	lastBattleId: BigNumberish;
}

// Type definition for `game::models::account::AccountValue` struct
export interface AccountValue {
	username: BigNumberish;
	energy: BigNumberish;
	pvpEnergy: BigNumberish;
	crystals: BigNumberish;
	gems: BigNumberish;
	lastEnergyUpdateTimestamp: BigNumberish;
	lastPvpEnergyUpdateTimestamp: BigNumberish;
	runesCount: BigNumberish;
	heroesCount: BigNumberish;
	summonChests: BigNumberish;
	lastBattleId: BigNumberish;
}

// Type definition for `game::models::account::heroes::Heroes` struct
export interface Heroes {
	owner: string;
	index: BigNumberish;
	hero: Hero;
}

// Type definition for `game::models::account::heroes::HeroesValue` struct
export interface HeroesValue {
	hero: Hero;
}

// Type definition for `game::models::account::runes::Runes` struct
export interface Runes {
	owner: string;
	index: BigNumberish;
	rune: Rune;
}

// Type definition for `game::models::account::runes::RunesValue` struct
export interface RunesValue {
	rune: Rune;
}

// Type definition for `game::models::battle::entity::Entity` struct
export interface Entity {
	index: BigNumberish;
	heroId: BigNumberish;
	name: BigNumberish;
	turnBar: TurnBar;
	statistics: BattleStatistics;
	cooldowns: Cooldowns;
	stunOnTurnProc: StunOnTurnProc;
	allyOrEnemy: AllyOrEnemyEnum;
}

// Type definition for `game::models::battle::entity::battleStatistics::BattleStatistics` struct
export interface BattleStatistics {
	maxHealth: BigNumberish;
	health: BigNumberish;
	attack: BattleStatistic;
	defense: BattleStatistic;
	speed: BattleStatistic;
	criticalChance: BattleStatistic;
	criticalDamage: BattleStatistic;
}

// Type definition for `game::models::battle::entity::battleStatistics::battleStatistic::BattleStatistic` struct
export interface BattleStatistic {
	value: BigNumberish;
	malus: StatModifier;
	bonus: StatModifier;
}

// Type definition for `game::models::battle::entity::battleStatistics::statModifier::StatModifier` struct
export interface StatModifier {
	value: BigNumberish;
	duration: BigNumberish;
}

// Type definition for `game::models::battle::entity::cooldowns::Cooldowns` struct
export interface Cooldowns {
	skill1: BigNumberish;
	skill2: BigNumberish;
}

// Type definition for `game::models::battle::entity::healthOnTurnProc::HealthOnTurnProc` struct
export interface HealthOnTurnProc {
	entityIndex: BigNumberish;
	value: BigNumberish;
	duration: BigNumberish;
	damageOrHeal: DamageOrHealEnumEnum;
}

// Type definition for `game::models::battle::entity::skill::buff::Buff` struct
export interface Buff {
	buffType: BuffTypeEnum;
	value: BigNumberish;
	duration: BigNumberish;
	target: boolean;
	aoe: boolean;
	self: boolean;
}

// Type definition for `game::models::battle::entity::skill::damage::Damage` struct
export interface Damage {
	value: BigNumberish;
	target: boolean;
	aoe: boolean;
	self: boolean;
	damageType: DamageTypeEnum;
}

// Type definition for `game::models::battle::entity::skill::heal::Heal` struct
export interface Heal {
	value: BigNumberish;
	target: boolean;
	aoe: boolean;
	self: boolean;
	healType: HealTypeEnum;
}

// Type definition for `game::models::battle::entity::stunOnTurnProc::StunOnTurnProc` struct
export interface StunOnTurnProc {
	duration: BigNumberish;
	stunned: boolean;
}

// Type definition for `game::models::battle::entity::turnBar::TurnBar` struct
export interface TurnBar {
	entityIndex: BigNumberish;
	speed: BigNumberish;
	turnbar: BigNumberish;
	incrementStep: BigNumberish;
	decimals: BigNumberish;
}

// Type definition for `game::models::hero::Hero` struct
export interface Hero {
	id: BigNumberish;
	name: BigNumberish;
	level: BigNumberish;
	rank: BigNumberish;
	experience: BigNumberish;
	runes: EquippedRunes;
}

// Type definition for `game::models::hero::equippedRunes::EquippedRunes` struct
export interface EquippedRunes {
	isFirstRuneEquipped: boolean;
	first: BigNumberish;
	isSecondRuneEquipped: boolean;
	second: BigNumberish;
	isThirdRuneEquipped: boolean;
	third: BigNumberish;
	isFourthRuneEquipped: boolean;
	fourth: BigNumberish;
	isFifthRuneEquipped: boolean;
	fifth: BigNumberish;
	isSixthRuneEquipped: boolean;
	sixth: BigNumberish;
}

// Type definition for `game::models::hero::rune::Rune` struct
export interface Rune {
	id: BigNumberish;
	statistic: RuneStatisticEnum;
	isPercent: boolean;
	rank: BigNumberish;
	rarity: RuneRarityEnum;
	runeType: RuneTypeEnum;
	isEquipped: boolean;
	heroEquipped: BigNumberish;
	rank4Bonus: RuneBonus;
	rank8Bonus: RuneBonus;
	rank12Bonus: RuneBonus;
	rank16Bonus: RuneBonus;
}

// Type definition for `game::models::hero::rune::runeBonus::RuneBonus` struct
export interface RuneBonus {
	statistic: RuneStatisticEnum;
	isPercent: boolean;
}

// Type definition for `game::models::storage::arena::arenaAccount::ArenaAccount` struct
export interface ArenaAccount {
	owner: string;
	rank: BigNumberish;
	lastClaimedRewards: BigNumberish;
	teamSize: BigNumberish;
}

// Type definition for `game::models::storage::arena::arenaAccount::ArenaAccountValue` struct
export interface ArenaAccountValue {
	rank: BigNumberish;
	lastClaimedRewards: BigNumberish;
	teamSize: BigNumberish;
}

// Type definition for `game::models::storage::arena::arenaConfig::ArenaConfig` struct
export interface ArenaConfig {
	id: BigNumberish;
	enemyRangesByRankLength: BigNumberish;
	gemsRewardsLength: BigNumberish;
}

// Type definition for `game::models::storage::arena::arenaConfig::ArenaConfigValue` struct
export interface ArenaConfigValue {
	enemyRangesByRankLength: BigNumberish;
	gemsRewardsLength: BigNumberish;
}

// Type definition for `game::models::storage::arena::arenaCurrentRankIndex::ArenaCurrentRankIndex` struct
export interface ArenaCurrentRankIndex {
	id: BigNumberish;
	currentRankIndex: BigNumberish;
}

// Type definition for `game::models::storage::arena::arenaCurrentRankIndex::ArenaCurrentRankIndexValue` struct
export interface ArenaCurrentRankIndexValue {
	currentRankIndex: BigNumberish;
}

// Type definition for `game::models::storage::arena::arenaTeam::ArenaTeam` struct
export interface ArenaTeam {
	owner: string;
	index: BigNumberish;
	heroIndex: BigNumberish;
}

// Type definition for `game::models::storage::arena::arenaTeam::ArenaTeamValue` struct
export interface ArenaTeamValue {
	heroIndex: BigNumberish;
}

// Type definition for `game::models::storage::arena::enemyRanges::EnemyRanges` struct
export interface EnemyRanges {
	index: BigNumberish;
	minRank: BigNumberish;
	range: BigNumberish;
}

// Type definition for `game::models::storage::arena::enemyRanges::EnemyRangesValue` struct
export interface EnemyRangesValue {
	minRank: BigNumberish;
	range: BigNumberish;
}

// Type definition for `game::models::storage::arena::gemsRewards::GemsRewards` struct
export interface GemsRewards {
	index: BigNumberish;
	minRank: BigNumberish;
	gems: BigNumberish;
}

// Type definition for `game::models::storage::arena::gemsRewards::GemsRewardsValue` struct
export interface GemsRewardsValue {
	minRank: BigNumberish;
	gems: BigNumberish;
}

// Type definition for `game::models::storage::baseHero::BaseHero` struct
export interface BaseHero {
	heroName: BigNumberish;
	rank: BigNumberish;
	statistics: Statistics;
	skillsCount: BigNumberish;
}

// Type definition for `game::models::storage::baseHero::BaseHeroValue` struct
export interface BaseHeroValue {
	rank: BigNumberish;
	statistics: Statistics;
	skillsCount: BigNumberish;
}

// Type definition for `game::models::storage::battles::arenaBattleStorage::ArenaBattleStorage` struct
export interface ArenaBattleStorage {
	owner: string;
	enemyOwner: string;
}

// Type definition for `game::models::storage::battles::arenaBattleStorage::ArenaBattleStorageValue` struct
export interface ArenaBattleStorageValue {
	enemyOwner: string;
}

// Type definition for `game::models::storage::battles::battleStorage::BattleStorage` struct
export interface BattleStorage {
	owner: string;
	map: BigNumberish;
	battleId: BigNumberish;
	level: BigNumberish;
	entitiesCount: BigNumberish;
	aliveEntitiesCount: BigNumberish;
	isBattleOver: boolean;
	isWaitingForPlayerAction: boolean;
}

// Type definition for `game::models::storage::battles::battleStorage::BattleStorageValue` struct
export interface BattleStorageValue {
	battleId: BigNumberish;
	level: BigNumberish;
	entitiesCount: BigNumberish;
	aliveEntitiesCount: BigNumberish;
	isBattleOver: boolean;
	isWaitingForPlayerAction: boolean;
}

// Type definition for `game::models::storage::battles::entityStorage::EntityStorage` struct
export interface EntityStorage {
	owner: string;
	map: BigNumberish;
	entityIndex: BigNumberish;
	entityVal: Entity;
	healthOnTurnProcCount: BigNumberish;
}

// Type definition for `game::models::storage::battles::entityStorage::EntityStorageValue` struct
export interface EntityStorageValue {
	entityVal: Entity;
	healthOnTurnProcCount: BigNumberish;
}

// Type definition for `game::models::storage::battles::healthOnTurnProcStorage::HealthOnTurnProcStorage` struct
export interface HealthOnTurnProcStorage {
	owner: string;
	map: BigNumberish;
	entityIndex: BigNumberish;
	index: BigNumberish;
	healthOnTurnProc: HealthOnTurnProc;
}

// Type definition for `game::models::storage::battles::healthOnTurnProcStorage::HealthOnTurnProcStorageValue` struct
export interface HealthOnTurnProcStorageValue {
	healthOnTurnProc: HealthOnTurnProc;
}

// Type definition for `game::models::storage::battles::turnTimelineStorage::TurnTimelineStorage` struct
export interface TurnTimelineStorage {
	owner: string;
	map: BigNumberish;
	index: BigNumberish;
	entityIndex: BigNumberish;
}

// Type definition for `game::models::storage::battles::turnTimelineStorage::TurnTimelineStorageValue` struct
export interface TurnTimelineStorageValue {
	entityIndex: BigNumberish;
}

// Type definition for `game::models::storage::config::Config` struct
export interface Config {
	key: ConfigTypeEnum;
	value: BigNumberish;
}

// Type definition for `game::models::storage::config::ConfigValue` struct
export interface ConfigValue {
	value: BigNumberish;
}

// Type definition for `game::models::storage::heroesByRank::HeroesByRank` struct
export interface HeroesByRank {
	rank: BigNumberish;
	heroes: Array<BigNumberish>;
}

// Type definition for `game::models::storage::heroesByRank::HeroesByRankValue` struct
export interface HeroesByRankValue {
	heroes: Array<BigNumberish>;
}

// Type definition for `game::models::storage::level::levelEnemy::LevelEnemy` struct
export interface LevelEnemy {
	map: BigNumberish;
	level: BigNumberish;
	index: BigNumberish;
	hero: Hero;
}

// Type definition for `game::models::storage::level::levelEnemy::LevelEnemyValue` struct
export interface LevelEnemyValue {
	hero: Hero;
}

// Type definition for `game::models::storage::level::levelInfos::LevelInfos` struct
export interface LevelInfos {
	map: BigNumberish;
	level: BigNumberish;
	energyCost: BigNumberish;
	enemiesCount: BigNumberish;
}

// Type definition for `game::models::storage::level::levelInfos::LevelInfosValue` struct
export interface LevelInfosValue {
	energyCost: BigNumberish;
	enemiesCount: BigNumberish;
}

// Type definition for `game::models::storage::mapProgress::MapProgress` struct
export interface MapProgress {
	owner: string;
	map: BigNumberish;
	level: BigNumberish;
}

// Type definition for `game::models::storage::mapProgress::MapProgressValue` struct
export interface MapProgressValue {
	level: BigNumberish;
}

// Type definition for `game::models::storage::quest::accountQuests::AccountQuests` struct
export interface AccountQuests {
	owner: string;
	map: BigNumberish;
	mapProgressRequired: BigNumberish;
	hasClaimedRewards: boolean;
}

// Type definition for `game::models::storage::quest::accountQuests::AccountQuestsValue` struct
export interface AccountQuestsValue {
	hasClaimedRewards: boolean;
}

// Type definition for `game::models::storage::quest::globalQuests::GlobalQuests` struct
export interface GlobalQuests {
	map: BigNumberish;
	mapProgressRequired: BigNumberish;
	rewardType: RewardTypeEnum;
	rewardQuantity: BigNumberish;
}

// Type definition for `game::models::storage::quest::globalQuests::GlobalQuestsValue` struct
export interface GlobalQuestsValue {
	rewardType: RewardTypeEnum;
	rewardQuantity: BigNumberish;
}

// Type definition for `game::models::storage::skill::skillBuff::SkillBuff` struct
export interface SkillBuff {
	skillName: BigNumberish;
	index: BigNumberish;
	buff: Buff;
}

// Type definition for `game::models::storage::skill::skillBuff::SkillBuffValue` struct
export interface SkillBuffValue {
	buff: Buff;
}

// Type definition for `game::models::storage::skill::skillInfos::SkillInfos` struct
export interface SkillInfos {
	name: BigNumberish;
	cooldown: BigNumberish;
	damage: Damage;
	heal: Heal;
	targetType: TargetTypeEnum;
	accuracy: BigNumberish;
	buffsCount: BigNumberish;
}

// Type definition for `game::models::storage::skill::skillInfos::SkillInfosValue` struct
export interface SkillInfosValue {
	cooldown: BigNumberish;
	damage: Damage;
	heal: Heal;
	targetType: TargetTypeEnum;
	accuracy: BigNumberish;
	buffsCount: BigNumberish;
}

// Type definition for `game::models::storage::skill::skillNameSet::SkillNameSet` struct
export interface SkillNameSet {
	heroName: BigNumberish;
	index: BigNumberish;
	skill: BigNumberish;
}

// Type definition for `game::models::storage::skill::skillNameSet::SkillNameSetValue` struct
export interface SkillNameSetValue {
	skill: BigNumberish;
}

// Type definition for `game::models::storage::statistics::Statistics` struct
export interface Statistics {
	health: BigNumberish;
	attack: BigNumberish;
	defense: BigNumberish;
	speed: BigNumberish;
	criticalRate: BigNumberish;
	criticalDamage: BigNumberish;
}

// Type definition for `game::models::storage::statistics::bonusRuneStatistics::BonusRuneStatistics` struct
export interface BonusRuneStatistics {
	statistic: RuneStatisticEnum;
	rarity: RuneRarityEnum;
	isPercent: boolean;
	value: BigNumberish;
}

// Type definition for `game::models::storage::statistics::bonusRuneStatistics::BonusRuneStatisticsValue` struct
export interface BonusRuneStatisticsValue {
	value: BigNumberish;
}

// Type definition for `game::models::storage::statistics::runeStatistics::RuneStatistics` struct
export interface RuneStatistics {
	statistic: RuneStatisticEnum;
	rarity: RuneRarityEnum;
	isPercent: boolean;
	value: BigNumberish;
}

// Type definition for `game::models::storage::statistics::runeStatistics::RuneStatisticsValue` struct
export interface RuneStatisticsValue {
	value: BigNumberish;
}

// Type definition for `game::models::storage::summonRates::SummonRates` struct
export interface SummonRates {
	key: BigNumberish;
	rates: Array<BigNumberish>;
}

// Type definition for `game::models::storage::summonRates::SummonRatesValue` struct
export interface SummonRatesValue {
	rates: Array<BigNumberish>;
}

// Type definition for `game::models::storage::usernames::Usernames` struct
export interface Usernames {
	username: BigNumberish;
	owner: string;
}

// Type definition for `game::models::storage::usernames::UsernamesValue` struct
export interface UsernamesValue {
	owner: string;
}

// Type definition for `game::models::events::ArenaDefense` struct
export interface ArenaDefense {
	owner: string;
	heroeIds: Array<BigNumberish>;
}

// Type definition for `game::models::events::ArenaDefenseValue` struct
export interface ArenaDefenseValue {
	heroeIds: Array<BigNumberish>;
}

// Type definition for `game::models::events::BuffEvent` struct
export interface BuffEvent {
	entityId: BigNumberish;
	name: BigNumberish;
	duration: BigNumberish;
}

// Type definition for `game::models::events::EndBattle` struct
export interface EndBattle {
	owner: string;
	battleId: BigNumberish;
	playerHasWon: boolean;
}

// Type definition for `game::models::events::EndBattleValue` struct
export interface EndBattleValue {
	playerHasWon: boolean;
}

// Type definition for `game::models::events::EndTurn` struct
export interface EndTurn {
	owner: string;
	battleId: BigNumberish;
	buffs: Array<BuffEvent>;
	status: Array<BuffEvent>;
	speeds: Array<IdAndValue>;
}

// Type definition for `game::models::events::EndTurnValue` struct
export interface EndTurnValue {
	buffs: Array<BuffEvent>;
	status: Array<BuffEvent>;
	speeds: Array<IdAndValue>;
}

// Type definition for `game::models::events::EntityBuffEvent` struct
export interface EntityBuffEvent {
	name: BigNumberish;
	duration: BigNumberish;
}

// Type definition for `game::models::events::ExperienceGain` struct
export interface ExperienceGain {
	owner: string;
	battleId: BigNumberish;
	entityId: BigNumberish;
	experienceGained: BigNumberish;
	levelAfter: BigNumberish;
	experienceAfter: BigNumberish;
}

// Type definition for `game::models::events::ExperienceGainValue` struct
export interface ExperienceGainValue {
	experienceGained: BigNumberish;
	levelAfter: BigNumberish;
	experienceAfter: BigNumberish;
}

// Type definition for `game::models::events::HeroMinted` struct
export interface HeroMinted {
	owner: string;
	id: BigNumberish;
	name: BigNumberish;
}

// Type definition for `game::models::events::HeroMintedValue` struct
export interface HeroMintedValue {
	id: BigNumberish;
	name: BigNumberish;
}

// Type definition for `game::models::events::IdAndValue` struct
export interface IdAndValue {
	entityId: BigNumberish;
	value: BigNumberish;
}

// Type definition for `game::models::events::InitArena` struct
export interface InitArena {
	owner: string;
	rank: BigNumberish;
	heroeIds: Array<BigNumberish>;
}

// Type definition for `game::models::events::InitArenaValue` struct
export interface InitArenaValue {
	rank: BigNumberish;
	heroeIds: Array<BigNumberish>;
}

// Type definition for `game::models::events::Loot` struct
export interface Loot {
	owner: string;
	battleId: BigNumberish;
	crystals: BigNumberish;
}

// Type definition for `game::models::events::LootValue` struct
export interface LootValue {
	crystals: BigNumberish;
}

// Type definition for `game::models::events::NewAccount` struct
export interface NewAccount {
	owner: string;
	username: BigNumberish;
}

// Type definition for `game::models::events::NewAccountValue` struct
export interface NewAccountValue {
	username: BigNumberish;
}

// Type definition for `game::models::events::NewBattle` struct
export interface NewBattle {
	owner: string;
	battleId: BigNumberish;
	healthsArray: Array<BigNumberish>;
}

// Type definition for `game::models::events::NewBattleValue` struct
export interface NewBattleValue {
	healthsArray: Array<BigNumberish>;
}

// Type definition for `game::models::events::RankChange` struct
export interface RankChange {
	owner: string;
	rank: BigNumberish;
}

// Type definition for `game::models::events::RankChangeValue` struct
export interface RankChangeValue {
	rank: BigNumberish;
}

// Type definition for `game::models::events::RuneBonusEvent` struct
export interface RuneBonusEvent {
	owner: string;
	id: BigNumberish;
	rank: BigNumberish;
	procStat: BigNumberish;
	isPercent: boolean;
}

// Type definition for `game::models::events::RuneBonusEventValue` struct
export interface RuneBonusEventValue {
	id: BigNumberish;
	rank: BigNumberish;
	procStat: BigNumberish;
	isPercent: boolean;
}

// Type definition for `game::models::events::RuneMinted` struct
export interface RuneMinted {
	owner: string;
	rune: Rune;
}

// Type definition for `game::models::events::RuneMintedValue` struct
export interface RuneMintedValue {
	rune: Rune;
}

// Type definition for `game::models::events::RuneUpgraded` struct
export interface RuneUpgraded {
	owner: string;
	id: BigNumberish;
	rank: BigNumberish;
	crystalCost: BigNumberish;
}

// Type definition for `game::models::events::RuneUpgradedValue` struct
export interface RuneUpgradedValue {
	id: BigNumberish;
	rank: BigNumberish;
	crystalCost: BigNumberish;
}

// Type definition for `game::models::events::Skill` struct
export interface Skill {
	owner: string;
	battleId: BigNumberish;
	casterId: BigNumberish;
	targetId: BigNumberish;
	skillIndex: BigNumberish;
	damages: Array<IdAndValue>;
	heals: Array<IdAndValue>;
	deaths: Array<BigNumberish>;
}

// Type definition for `game::models::events::SkillValue` struct
export interface SkillValue {
	targetId: BigNumberish;
	skillIndex: BigNumberish;
	damages: Array<IdAndValue>;
	heals: Array<IdAndValue>;
	deaths: Array<BigNumberish>;
}

// Type definition for `game::models::events::StartTurn` struct
export interface StartTurn {
	owner: string;
	battleId: BigNumberish;
	entityId: BigNumberish;
	damages: Array<BigNumberish>;
	heals: Array<BigNumberish>;
	buffs: Array<EntityBuffEvent>;
	status: Array<EntityBuffEvent>;
	isDead: boolean;
}

// Type definition for `game::models::events::StartTurnValue` struct
export interface StartTurnValue {
	damages: Array<BigNumberish>;
	heals: Array<BigNumberish>;
	buffs: Array<EntityBuffEvent>;
	status: Array<EntityBuffEvent>;
	isDead: boolean;
}

// Type definition for `game::models::events::TimestampEnergy` struct
export interface TimestampEnergy {
	owner: string;
	timestamp: BigNumberish;
}

// Type definition for `game::models::events::TimestampEnergyValue` struct
export interface TimestampEnergyValue {
	timestamp: BigNumberish;
}

// Type definition for `game::models::events::TimestampPvpEnergy` struct
export interface TimestampPvpEnergy {
	owner: string;
	timestamp: BigNumberish;
}

// Type definition for `game::models::events::TimestampPvpEnergyValue` struct
export interface TimestampPvpEnergyValue {
	timestamp: BigNumberish;
}

// Type definition for `game::models::battle::entity::AllyOrEnemy` enum
export const allyOrEnemy = [
	'Ally',
	'Enemy',
] as const;
export type AllyOrEnemy = { [key in typeof allyOrEnemy[number]]: string };
export type AllyOrEnemyEnum = CairoCustomEnum;

// Type definition for `game::models::battle::entity::healthOnTurnProc::DamageOrHealEnum` enum
export const damageOrHealEnum = [
	'Damage',
	'Heal',
] as const;
export type DamageOrHealEnum = { [key in typeof damageOrHealEnum[number]]: string };
export type DamageOrHealEnumEnum = CairoCustomEnum;

// Type definition for `game::models::battle::entity::skill::TargetType` enum
export const targetType = [
	'Ally',
	'Enemy',
] as const;
export type TargetType = { [key in typeof targetType[number]]: string };
export type TargetTypeEnum = CairoCustomEnum;

// Type definition for `game::models::battle::entity::skill::buff::BuffType` enum
export const buffType = [
	'SpeedUp',
	'SpeedDown',
	'AttackUp',
	'AttackDown',
	'DefenseUp',
	'DefenseDown',
	'Poison',
	'Regen',
	'Stun',
] as const;
export type BuffType = { [key in typeof buffType[number]]: string };
export type BuffTypeEnum = CairoCustomEnum;

// Type definition for `game::models::battle::entity::skill::damage::DamageType` enum
export const damageType = [
	'Flat',
	'Percent',
] as const;
export type DamageType = { [key in typeof damageType[number]]: string };
export type DamageTypeEnum = CairoCustomEnum;

// Type definition for `game::models::battle::entity::skill::heal::HealType` enum
export const healType = [
	'Flat',
	'Percent',
] as const;
export type HealType = { [key in typeof healType[number]]: string };
export type HealTypeEnum = CairoCustomEnum;

// Type definition for `game::models::hero::rune::RuneRarity` enum
export const runeRarity = [
	'Common',
	'Uncommon',
	'Rare',
	'Epic',
	'Legendary',
] as const;
export type RuneRarity = { [key in typeof runeRarity[number]]: string };
export type RuneRarityEnum = CairoCustomEnum;

// Type definition for `game::models::hero::rune::RuneStatistic` enum
export const runeStatistic = [
	'Health',
	'Attack',
	'Defense',
	'Speed',
] as const;
export type RuneStatistic = { [key in typeof runeStatistic[number]]: string };
export type RuneStatisticEnum = CairoCustomEnum;

// Type definition for `game::models::hero::rune::RuneType` enum
export const runeType = [
	'First',
	'Second',
	'Third',
	'Fourth',
	'Fifth',
	'Sixth',
] as const;
export type RuneType = { [key in typeof runeType[number]]: string };
export type RuneTypeEnum = CairoCustomEnum;

// Type definition for `game::models::storage::config::ConfigType` enum
export const configType = [
	'TimeTickEnergy',
	'TimeTickPvpEnergy',
	'MaxEnergy',
	'MaxPvpEnergy',
	'StartingCrystals',
	'StartingGems',
	'StartingSummonChests',
	'TotalHeroesCount',
] as const;
export type ConfigType = { [key in typeof configType[number]]: string };
export type ConfigTypeEnum = CairoCustomEnum;

// Type definition for `game::models::storage::quest::rewardType::RewardType` enum
export const rewardType = [
	'Summon',
	'Rune',
	'Crystals',
] as const;
export type RewardType = { [key in typeof rewardType[number]]: string };
export type RewardTypeEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
	game: {
		Account: Account,
		AccountValue: AccountValue,
		Heroes: Heroes,
		HeroesValue: HeroesValue,
		Runes: Runes,
		RunesValue: RunesValue,
		Entity: Entity,
		BattleStatistics: BattleStatistics,
		BattleStatistic: BattleStatistic,
		StatModifier: StatModifier,
		Cooldowns: Cooldowns,
		HealthOnTurnProc: HealthOnTurnProc,
		Buff: Buff,
		Damage: Damage,
		Heal: Heal,
		StunOnTurnProc: StunOnTurnProc,
		TurnBar: TurnBar,
		Hero: Hero,
		EquippedRunes: EquippedRunes,
		Rune: Rune,
		RuneBonus: RuneBonus,
		ArenaAccount: ArenaAccount,
		ArenaAccountValue: ArenaAccountValue,
		ArenaConfig: ArenaConfig,
		ArenaConfigValue: ArenaConfigValue,
		ArenaCurrentRankIndex: ArenaCurrentRankIndex,
		ArenaCurrentRankIndexValue: ArenaCurrentRankIndexValue,
		ArenaTeam: ArenaTeam,
		ArenaTeamValue: ArenaTeamValue,
		EnemyRanges: EnemyRanges,
		EnemyRangesValue: EnemyRangesValue,
		GemsRewards: GemsRewards,
		GemsRewardsValue: GemsRewardsValue,
		BaseHero: BaseHero,
		BaseHeroValue: BaseHeroValue,
		ArenaBattleStorage: ArenaBattleStorage,
		ArenaBattleStorageValue: ArenaBattleStorageValue,
		BattleStorage: BattleStorage,
		BattleStorageValue: BattleStorageValue,
		EntityStorage: EntityStorage,
		EntityStorageValue: EntityStorageValue,
		HealthOnTurnProcStorage: HealthOnTurnProcStorage,
		HealthOnTurnProcStorageValue: HealthOnTurnProcStorageValue,
		TurnTimelineStorage: TurnTimelineStorage,
		TurnTimelineStorageValue: TurnTimelineStorageValue,
		Config: Config,
		ConfigValue: ConfigValue,
		HeroesByRank: HeroesByRank,
		HeroesByRankValue: HeroesByRankValue,
		LevelEnemy: LevelEnemy,
		LevelEnemyValue: LevelEnemyValue,
		LevelInfos: LevelInfos,
		LevelInfosValue: LevelInfosValue,
		MapProgress: MapProgress,
		MapProgressValue: MapProgressValue,
		AccountQuests: AccountQuests,
		AccountQuestsValue: AccountQuestsValue,
		GlobalQuests: GlobalQuests,
		GlobalQuestsValue: GlobalQuestsValue,
		SkillBuff: SkillBuff,
		SkillBuffValue: SkillBuffValue,
		SkillInfos: SkillInfos,
		SkillInfosValue: SkillInfosValue,
		SkillNameSet: SkillNameSet,
		SkillNameSetValue: SkillNameSetValue,
		Statistics: Statistics,
		BonusRuneStatistics: BonusRuneStatistics,
		BonusRuneStatisticsValue: BonusRuneStatisticsValue,
		RuneStatistics: RuneStatistics,
		RuneStatisticsValue: RuneStatisticsValue,
		SummonRates: SummonRates,
		SummonRatesValue: SummonRatesValue,
		Usernames: Usernames,
		UsernamesValue: UsernamesValue,
		ArenaDefense: ArenaDefense,
		ArenaDefenseValue: ArenaDefenseValue,
		BuffEvent: BuffEvent,
		EndBattle: EndBattle,
		EndBattleValue: EndBattleValue,
		EndTurn: EndTurn,
		EndTurnValue: EndTurnValue,
		EntityBuffEvent: EntityBuffEvent,
		ExperienceGain: ExperienceGain,
		ExperienceGainValue: ExperienceGainValue,
		HeroMinted: HeroMinted,
		HeroMintedValue: HeroMintedValue,
		IdAndValue: IdAndValue,
		InitArena: InitArena,
		InitArenaValue: InitArenaValue,
		Loot: Loot,
		LootValue: LootValue,
		NewAccount: NewAccount,
		NewAccountValue: NewAccountValue,
		NewBattle: NewBattle,
		NewBattleValue: NewBattleValue,
		RankChange: RankChange,
		RankChangeValue: RankChangeValue,
		RuneBonusEvent: RuneBonusEvent,
		RuneBonusEventValue: RuneBonusEventValue,
		RuneMinted: RuneMinted,
		RuneMintedValue: RuneMintedValue,
		RuneUpgraded: RuneUpgraded,
		RuneUpgradedValue: RuneUpgradedValue,
		Skill: Skill,
		SkillValue: SkillValue,
		StartTurn: StartTurn,
		StartTurnValue: StartTurnValue,
		TimestampEnergy: TimestampEnergy,
		TimestampEnergyValue: TimestampEnergyValue,
		TimestampPvpEnergy: TimestampPvpEnergy,
		TimestampPvpEnergyValue: TimestampPvpEnergyValue,
	},
}
export const schema: SchemaType = {
	game: {
		Account: {
			owner: "",
			username: 0,
			energy: 0,
			pvpEnergy: 0,
			crystals: 0,
			gems: 0,
			lastEnergyUpdateTimestamp: 0,
			lastPvpEnergyUpdateTimestamp: 0,
			runesCount: 0,
			heroesCount: 0,
			summonChests: 0,
			lastBattleId: 0,
		},
		AccountValue: {
			username: 0,
			energy: 0,
			pvpEnergy: 0,
			crystals: 0,
			gems: 0,
			lastEnergyUpdateTimestamp: 0,
			lastPvpEnergyUpdateTimestamp: 0,
			runesCount: 0,
			heroesCount: 0,
			summonChests: 0,
			lastBattleId: 0,
		},
		Heroes: {
			owner: "",
			index: 0,
		hero: { id: 0, name: 0, level: 0, rank: 0, experience: 0, runes: { isFirstRuneEquipped: false, first: 0, isSecondRuneEquipped: false, second: 0, isThirdRuneEquipped: false, third: 0, isFourthRuneEquipped: false, fourth: 0, isFifthRuneEquipped: false, fifth: 0, isSixthRuneEquipped: false, sixth: 0, }, },
		},
		HeroesValue: {
		hero: { id: 0, name: 0, level: 0, rank: 0, experience: 0, runes: { isFirstRuneEquipped: false, first: 0, isSecondRuneEquipped: false, second: 0, isThirdRuneEquipped: false, third: 0, isFourthRuneEquipped: false, fourth: 0, isFifthRuneEquipped: false, fifth: 0, isSixthRuneEquipped: false, sixth: 0, }, },
		},
		Runes: {
			owner: "",
			index: 0,
		rune: { id: 0, statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, rank: 0, rarity: new CairoCustomEnum({ 
					Common: "",
				Uncommon: undefined,
				Rare: undefined,
				Epic: undefined,
				Legendary: undefined, }), runeType: new CairoCustomEnum({ 
					First: "",
				Second: undefined,
				Third: undefined,
				Fourth: undefined,
				Fifth: undefined,
				Sixth: undefined, }), isEquipped: false, heroEquipped: 0, rank4Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, rank8Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, rank12Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, rank16Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, },
		},
		RunesValue: {
		rune: { id: 0, statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, rank: 0, rarity: new CairoCustomEnum({ 
					Common: "",
				Uncommon: undefined,
				Rare: undefined,
				Epic: undefined,
				Legendary: undefined, }), runeType: new CairoCustomEnum({ 
					First: "",
				Second: undefined,
				Third: undefined,
				Fourth: undefined,
				Fifth: undefined,
				Sixth: undefined, }), isEquipped: false, heroEquipped: 0, rank4Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, rank8Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, rank12Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, rank16Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, },
		},
		Entity: {
			index: 0,
			heroId: 0,
			name: 0,
		turnBar: { entityIndex: 0, speed: 0, turnbar: 0, incrementStep: 0, decimals: 0, },
		statistics: { maxHealth: 0, health: 0, attack: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, defense: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, speed: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, criticalChance: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, criticalDamage: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, },
		cooldowns: { skill1: 0, skill2: 0, },
		stunOnTurnProc: { duration: 0, stunned: false, },
		allyOrEnemy: new CairoCustomEnum({ 
					Ally: "",
				Enemy: undefined, }),
		},
		BattleStatistics: {
			maxHealth: 0,
			health: 0,
		attack: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, },
		defense: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, },
		speed: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, },
		criticalChance: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, },
		criticalDamage: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, },
		},
		BattleStatistic: {
			value: 0,
		malus: { value: 0, duration: 0, },
		bonus: { value: 0, duration: 0, },
		},
		StatModifier: {
			value: 0,
			duration: 0,
		},
		Cooldowns: {
			skill1: 0,
			skill2: 0,
		},
		HealthOnTurnProc: {
			entityIndex: 0,
			value: 0,
			duration: 0,
		damageOrHeal: new CairoCustomEnum({ 
					Damage: "",
				Heal: undefined, }),
		},
		Buff: {
		buffType: new CairoCustomEnum({ 
					SpeedUp: "",
				SpeedDown: undefined,
				AttackUp: undefined,
				AttackDown: undefined,
				DefenseUp: undefined,
				DefenseDown: undefined,
				Poison: undefined,
				Regen: undefined,
				Stun: undefined, }),
			value: 0,
			duration: 0,
			target: false,
			aoe: false,
			self: false,
		},
		Damage: {
			value: 0,
			target: false,
			aoe: false,
			self: false,
		damageType: new CairoCustomEnum({ 
					Flat: "",
				Percent: undefined, }),
		},
		Heal: {
			value: 0,
			target: false,
			aoe: false,
			self: false,
		healType: new CairoCustomEnum({ 
					Flat: "",
				Percent: undefined, }),
		},
		StunOnTurnProc: {
			duration: 0,
			stunned: false,
		},
		TurnBar: {
			entityIndex: 0,
			speed: 0,
			turnbar: 0,
			incrementStep: 0,
			decimals: 0,
		},
		Hero: {
			id: 0,
			name: 0,
			level: 0,
			rank: 0,
			experience: 0,
		runes: { isFirstRuneEquipped: false, first: 0, isSecondRuneEquipped: false, second: 0, isThirdRuneEquipped: false, third: 0, isFourthRuneEquipped: false, fourth: 0, isFifthRuneEquipped: false, fifth: 0, isSixthRuneEquipped: false, sixth: 0, },
		},
		EquippedRunes: {
			isFirstRuneEquipped: false,
			first: 0,
			isSecondRuneEquipped: false,
			second: 0,
			isThirdRuneEquipped: false,
			third: 0,
			isFourthRuneEquipped: false,
			fourth: 0,
			isFifthRuneEquipped: false,
			fifth: 0,
			isSixthRuneEquipped: false,
			sixth: 0,
		},
		Rune: {
			id: 0,
		statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }),
			isPercent: false,
			rank: 0,
		rarity: new CairoCustomEnum({ 
					Common: "",
				Uncommon: undefined,
				Rare: undefined,
				Epic: undefined,
				Legendary: undefined, }),
		runeType: new CairoCustomEnum({ 
					First: "",
				Second: undefined,
				Third: undefined,
				Fourth: undefined,
				Fifth: undefined,
				Sixth: undefined, }),
			isEquipped: false,
			heroEquipped: 0,
		rank4Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, },
		rank8Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, },
		rank12Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, },
		rank16Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, },
		},
		RuneBonus: {
		statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }),
			isPercent: false,
		},
		ArenaAccount: {
			owner: "",
			rank: 0,
			lastClaimedRewards: 0,
			teamSize: 0,
		},
		ArenaAccountValue: {
			rank: 0,
			lastClaimedRewards: 0,
			teamSize: 0,
		},
		ArenaConfig: {
			id: 0,
			enemyRangesByRankLength: 0,
			gemsRewardsLength: 0,
		},
		ArenaConfigValue: {
			enemyRangesByRankLength: 0,
			gemsRewardsLength: 0,
		},
		ArenaCurrentRankIndex: {
			id: 0,
			currentRankIndex: 0,
		},
		ArenaCurrentRankIndexValue: {
			currentRankIndex: 0,
		},
		ArenaTeam: {
			owner: "",
			index: 0,
			heroIndex: 0,
		},
		ArenaTeamValue: {
			heroIndex: 0,
		},
		EnemyRanges: {
			index: 0,
			minRank: 0,
			range: 0,
		},
		EnemyRangesValue: {
			minRank: 0,
			range: 0,
		},
		GemsRewards: {
			index: 0,
			minRank: 0,
			gems: 0,
		},
		GemsRewardsValue: {
			minRank: 0,
			gems: 0,
		},
		BaseHero: {
			heroName: 0,
			rank: 0,
		statistics: { health: 0, attack: 0, defense: 0, speed: 0, criticalRate: 0, criticalDamage: 0, },
			skillsCount: 0,
		},
		BaseHeroValue: {
			rank: 0,
		statistics: { health: 0, attack: 0, defense: 0, speed: 0, criticalRate: 0, criticalDamage: 0, },
			skillsCount: 0,
		},
		ArenaBattleStorage: {
			owner: "",
			enemyOwner: "",
		},
		ArenaBattleStorageValue: {
			enemyOwner: "",
		},
		BattleStorage: {
			owner: "",
			map: 0,
			battleId: 0,
			level: 0,
			entitiesCount: 0,
			aliveEntitiesCount: 0,
			isBattleOver: false,
			isWaitingForPlayerAction: false,
		},
		BattleStorageValue: {
			battleId: 0,
			level: 0,
			entitiesCount: 0,
			aliveEntitiesCount: 0,
			isBattleOver: false,
			isWaitingForPlayerAction: false,
		},
		EntityStorage: {
			owner: "",
			map: 0,
			entityIndex: 0,
		entityVal: { index: 0, heroId: 0, name: 0, turnBar: { entityIndex: 0, speed: 0, turnbar: 0, incrementStep: 0, decimals: 0, }, statistics: { maxHealth: 0, health: 0, attack: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, defense: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, speed: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, criticalChance: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, criticalDamage: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, }, cooldowns: { skill1: 0, skill2: 0, }, stunOnTurnProc: { duration: 0, stunned: false, }, allyOrEnemy: new CairoCustomEnum({ 
					Ally: "",
				Enemy: undefined, }), },
			healthOnTurnProcCount: 0,
		},
		EntityStorageValue: {
		entityVal: { index: 0, heroId: 0, name: 0, turnBar: { entityIndex: 0, speed: 0, turnbar: 0, incrementStep: 0, decimals: 0, }, statistics: { maxHealth: 0, health: 0, attack: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, defense: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, speed: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, criticalChance: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, criticalDamage: { value: 0, malus: { value: 0, duration: 0, }, bonus: { value: 0, duration: 0, }, }, }, cooldowns: { skill1: 0, skill2: 0, }, stunOnTurnProc: { duration: 0, stunned: false, }, allyOrEnemy: new CairoCustomEnum({ 
					Ally: "",
				Enemy: undefined, }), },
			healthOnTurnProcCount: 0,
		},
		HealthOnTurnProcStorage: {
			owner: "",
			map: 0,
			entityIndex: 0,
			index: 0,
		healthOnTurnProc: { entityIndex: 0, value: 0, duration: 0, damageOrHeal: new CairoCustomEnum({ 
					Damage: "",
				Heal: undefined, }), },
		},
		HealthOnTurnProcStorageValue: {
		healthOnTurnProc: { entityIndex: 0, value: 0, duration: 0, damageOrHeal: new CairoCustomEnum({ 
					Damage: "",
				Heal: undefined, }), },
		},
		TurnTimelineStorage: {
			owner: "",
			map: 0,
			index: 0,
			entityIndex: 0,
		},
		TurnTimelineStorageValue: {
			entityIndex: 0,
		},
		Config: {
		key: new CairoCustomEnum({ 
					TimeTickEnergy: "",
				TimeTickPvpEnergy: undefined,
				MaxEnergy: undefined,
				MaxPvpEnergy: undefined,
				StartingCrystals: undefined,
				StartingGems: undefined,
				StartingSummonChests: undefined,
				TotalHeroesCount: undefined, }),
			value: 0,
		},
		ConfigValue: {
			value: 0,
		},
		HeroesByRank: {
			rank: 0,
			heroes: [0],
		},
		HeroesByRankValue: {
			heroes: [0],
		},
		LevelEnemy: {
			map: 0,
			level: 0,
			index: 0,
		hero: { id: 0, name: 0, level: 0, rank: 0, experience: 0, runes: { isFirstRuneEquipped: false, first: 0, isSecondRuneEquipped: false, second: 0, isThirdRuneEquipped: false, third: 0, isFourthRuneEquipped: false, fourth: 0, isFifthRuneEquipped: false, fifth: 0, isSixthRuneEquipped: false, sixth: 0, }, },
		},
		LevelEnemyValue: {
		hero: { id: 0, name: 0, level: 0, rank: 0, experience: 0, runes: { isFirstRuneEquipped: false, first: 0, isSecondRuneEquipped: false, second: 0, isThirdRuneEquipped: false, third: 0, isFourthRuneEquipped: false, fourth: 0, isFifthRuneEquipped: false, fifth: 0, isSixthRuneEquipped: false, sixth: 0, }, },
		},
		LevelInfos: {
			map: 0,
			level: 0,
			energyCost: 0,
			enemiesCount: 0,
		},
		LevelInfosValue: {
			energyCost: 0,
			enemiesCount: 0,
		},
		MapProgress: {
			owner: "",
			map: 0,
			level: 0,
		},
		MapProgressValue: {
			level: 0,
		},
		AccountQuests: {
			owner: "",
			map: 0,
			mapProgressRequired: 0,
			hasClaimedRewards: false,
		},
		AccountQuestsValue: {
			hasClaimedRewards: false,
		},
		GlobalQuests: {
			map: 0,
			mapProgressRequired: 0,
		rewardType: new CairoCustomEnum({ 
					Summon: "",
				Rune: undefined,
				Crystals: undefined, }),
			rewardQuantity: 0,
		},
		GlobalQuestsValue: {
		rewardType: new CairoCustomEnum({ 
					Summon: "",
				Rune: undefined,
				Crystals: undefined, }),
			rewardQuantity: 0,
		},
		SkillBuff: {
			skillName: 0,
			index: 0,
		buff: { buffType: new CairoCustomEnum({ 
					SpeedUp: "",
				SpeedDown: undefined,
				AttackUp: undefined,
				AttackDown: undefined,
				DefenseUp: undefined,
				DefenseDown: undefined,
				Poison: undefined,
				Regen: undefined,
				Stun: undefined, }), value: 0, duration: 0, target: false, aoe: false, self: false, },
		},
		SkillBuffValue: {
		buff: { buffType: new CairoCustomEnum({ 
					SpeedUp: "",
				SpeedDown: undefined,
				AttackUp: undefined,
				AttackDown: undefined,
				DefenseUp: undefined,
				DefenseDown: undefined,
				Poison: undefined,
				Regen: undefined,
				Stun: undefined, }), value: 0, duration: 0, target: false, aoe: false, self: false, },
		},
		SkillInfos: {
			name: 0,
			cooldown: 0,
		damage: { value: 0, target: false, aoe: false, self: false, damageType: new CairoCustomEnum({ 
					Flat: "",
				Percent: undefined, }), },
		heal: { value: 0, target: false, aoe: false, self: false, healType: new CairoCustomEnum({ 
					Flat: "",
				Percent: undefined, }), },
		targetType: new CairoCustomEnum({ 
					Ally: "",
				Enemy: undefined, }),
			accuracy: 0,
			buffsCount: 0,
		},
		SkillInfosValue: {
			cooldown: 0,
		damage: { value: 0, target: false, aoe: false, self: false, damageType: new CairoCustomEnum({ 
					Flat: "",
				Percent: undefined, }), },
		heal: { value: 0, target: false, aoe: false, self: false, healType: new CairoCustomEnum({ 
					Flat: "",
				Percent: undefined, }), },
		targetType: new CairoCustomEnum({ 
					Ally: "",
				Enemy: undefined, }),
			accuracy: 0,
			buffsCount: 0,
		},
		SkillNameSet: {
			heroName: 0,
			index: 0,
			skill: 0,
		},
		SkillNameSetValue: {
			skill: 0,
		},
		Statistics: {
			health: 0,
			attack: 0,
			defense: 0,
			speed: 0,
			criticalRate: 0,
			criticalDamage: 0,
		},
		BonusRuneStatistics: {
		statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }),
		rarity: new CairoCustomEnum({ 
					Common: "",
				Uncommon: undefined,
				Rare: undefined,
				Epic: undefined,
				Legendary: undefined, }),
			isPercent: false,
			value: 0,
		},
		BonusRuneStatisticsValue: {
			value: 0,
		},
		RuneStatistics: {
		statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }),
		rarity: new CairoCustomEnum({ 
					Common: "",
				Uncommon: undefined,
				Rare: undefined,
				Epic: undefined,
				Legendary: undefined, }),
			isPercent: false,
			value: 0,
		},
		RuneStatisticsValue: {
			value: 0,
		},
		SummonRates: {
			key: 0,
			rates: [0],
		},
		SummonRatesValue: {
			rates: [0],
		},
		Usernames: {
			username: 0,
			owner: "",
		},
		UsernamesValue: {
			owner: "",
		},
		ArenaDefense: {
			owner: "",
			heroeIds: [0],
		},
		ArenaDefenseValue: {
			heroeIds: [0],
		},
		BuffEvent: {
			entityId: 0,
			name: 0,
			duration: 0,
		},
		EndBattle: {
			owner: "",
			battleId: 0,
			playerHasWon: false,
		},
		EndBattleValue: {
			playerHasWon: false,
		},
		EndTurn: {
			owner: "",
			battleId: 0,
			buffs: [{ entityId: 0, name: 0, duration: 0, }],
			status: [{ entityId: 0, name: 0, duration: 0, }],
			speeds: [{ entityId: 0, value: 0, }],
		},
		EndTurnValue: {
			buffs: [{ entityId: 0, name: 0, duration: 0, }],
			status: [{ entityId: 0, name: 0, duration: 0, }],
			speeds: [{ entityId: 0, value: 0, }],
		},
		EntityBuffEvent: {
			name: 0,
			duration: 0,
		},
		ExperienceGain: {
			owner: "",
			battleId: 0,
			entityId: 0,
			experienceGained: 0,
			levelAfter: 0,
			experienceAfter: 0,
		},
		ExperienceGainValue: {
			experienceGained: 0,
			levelAfter: 0,
			experienceAfter: 0,
		},
		HeroMinted: {
			owner: "",
			id: 0,
			name: 0,
		},
		HeroMintedValue: {
			id: 0,
			name: 0,
		},
		IdAndValue: {
			entityId: 0,
			value: 0,
		},
		InitArena: {
			owner: "",
			rank: 0,
			heroeIds: [0],
		},
		InitArenaValue: {
			rank: 0,
			heroeIds: [0],
		},
		Loot: {
			owner: "",
			battleId: 0,
			crystals: 0,
		},
		LootValue: {
			crystals: 0,
		},
		NewAccount: {
			owner: "",
			username: 0,
		},
		NewAccountValue: {
			username: 0,
		},
		NewBattle: {
			owner: "",
			battleId: 0,
			healthsArray: [0],
		},
		NewBattleValue: {
			healthsArray: [0],
		},
		RankChange: {
			owner: "",
			rank: 0,
		},
		RankChangeValue: {
			rank: 0,
		},
		RuneBonusEvent: {
			owner: "",
			id: 0,
			rank: 0,
			procStat: 0,
			isPercent: false,
		},
		RuneBonusEventValue: {
			id: 0,
			rank: 0,
			procStat: 0,
			isPercent: false,
		},
		RuneMinted: {
			owner: "",
		rune: { id: 0, statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, rank: 0, rarity: new CairoCustomEnum({ 
					Common: "",
				Uncommon: undefined,
				Rare: undefined,
				Epic: undefined,
				Legendary: undefined, }), runeType: new CairoCustomEnum({ 
					First: "",
				Second: undefined,
				Third: undefined,
				Fourth: undefined,
				Fifth: undefined,
				Sixth: undefined, }), isEquipped: false, heroEquipped: 0, rank4Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, rank8Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, rank12Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, rank16Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, },
		},
		RuneMintedValue: {
		rune: { id: 0, statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, rank: 0, rarity: new CairoCustomEnum({ 
					Common: "",
				Uncommon: undefined,
				Rare: undefined,
				Epic: undefined,
				Legendary: undefined, }), runeType: new CairoCustomEnum({ 
					First: "",
				Second: undefined,
				Third: undefined,
				Fourth: undefined,
				Fifth: undefined,
				Sixth: undefined, }), isEquipped: false, heroEquipped: 0, rank4Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, rank8Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, rank12Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, rank16Bonus: { statistic: new CairoCustomEnum({ 
					Health: "",
				Attack: undefined,
				Defense: undefined,
				Speed: undefined, }), isPercent: false, }, },
		},
		RuneUpgraded: {
			owner: "",
			id: 0,
			rank: 0,
			crystalCost: 0,
		},
		RuneUpgradedValue: {
			id: 0,
			rank: 0,
			crystalCost: 0,
		},
		Skill: {
			owner: "",
			battleId: 0,
			casterId: 0,
			targetId: 0,
			skillIndex: 0,
			damages: [{ entityId: 0, value: 0, }],
			heals: [{ entityId: 0, value: 0, }],
			deaths: [0],
		},
		SkillValue: {
			targetId: 0,
			skillIndex: 0,
			damages: [{ entityId: 0, value: 0, }],
			heals: [{ entityId: 0, value: 0, }],
			deaths: [0],
		},
		StartTurn: {
			owner: "",
			battleId: 0,
			entityId: 0,
			damages: [0],
			heals: [0],
			buffs: [{ name: 0, duration: 0, }],
			status: [{ name: 0, duration: 0, }],
			isDead: false,
		},
		StartTurnValue: {
			damages: [0],
			heals: [0],
			buffs: [{ name: 0, duration: 0, }],
			status: [{ name: 0, duration: 0, }],
			isDead: false,
		},
		TimestampEnergy: {
			owner: "",
			timestamp: 0,
		},
		TimestampEnergyValue: {
			timestamp: 0,
		},
		TimestampPvpEnergy: {
			owner: "",
			timestamp: 0,
		},
		TimestampPvpEnergyValue: {
			timestamp: 0,
		},
	},
};
export enum ModelsMapping {
	Account = 'game-Account',
	AccountValue = 'game-AccountValue',
	Heroes = 'game-Heroes',
	HeroesValue = 'game-HeroesValue',
	Runes = 'game-Runes',
	RunesValue = 'game-RunesValue',
	AllyOrEnemy = 'game-AllyOrEnemy',
	Entity = 'game-Entity',
	BattleStatistics = 'game-BattleStatistics',
	BattleStatistic = 'game-BattleStatistic',
	StatModifier = 'game-StatModifier',
	Cooldowns = 'game-Cooldowns',
	DamageOrHealEnum = 'game-DamageOrHealEnum',
	HealthOnTurnProc = 'game-HealthOnTurnProc',
	TargetType = 'game-TargetType',
	Buff = 'game-Buff',
	BuffType = 'game-BuffType',
	Damage = 'game-Damage',
	DamageType = 'game-DamageType',
	Heal = 'game-Heal',
	HealType = 'game-HealType',
	StunOnTurnProc = 'game-StunOnTurnProc',
	TurnBar = 'game-TurnBar',
	Hero = 'game-Hero',
	EquippedRunes = 'game-EquippedRunes',
	Rune = 'game-Rune',
	RuneRarity = 'game-RuneRarity',
	RuneStatistic = 'game-RuneStatistic',
	RuneType = 'game-RuneType',
	RuneBonus = 'game-RuneBonus',
	ArenaAccount = 'game-ArenaAccount',
	ArenaAccountValue = 'game-ArenaAccountValue',
	ArenaConfig = 'game-ArenaConfig',
	ArenaConfigValue = 'game-ArenaConfigValue',
	ArenaCurrentRankIndex = 'game-ArenaCurrentRankIndex',
	ArenaCurrentRankIndexValue = 'game-ArenaCurrentRankIndexValue',
	ArenaTeam = 'game-ArenaTeam',
	ArenaTeamValue = 'game-ArenaTeamValue',
	EnemyRanges = 'game-EnemyRanges',
	EnemyRangesValue = 'game-EnemyRangesValue',
	GemsRewards = 'game-GemsRewards',
	GemsRewardsValue = 'game-GemsRewardsValue',
	BaseHero = 'game-BaseHero',
	BaseHeroValue = 'game-BaseHeroValue',
	ArenaBattleStorage = 'game-ArenaBattleStorage',
	ArenaBattleStorageValue = 'game-ArenaBattleStorageValue',
	BattleStorage = 'game-BattleStorage',
	BattleStorageValue = 'game-BattleStorageValue',
	EntityStorage = 'game-EntityStorage',
	EntityStorageValue = 'game-EntityStorageValue',
	HealthOnTurnProcStorage = 'game-HealthOnTurnProcStorage',
	HealthOnTurnProcStorageValue = 'game-HealthOnTurnProcStorageValue',
	TurnTimelineStorage = 'game-TurnTimelineStorage',
	TurnTimelineStorageValue = 'game-TurnTimelineStorageValue',
	Config = 'game-Config',
	ConfigType = 'game-ConfigType',
	ConfigValue = 'game-ConfigValue',
	HeroesByRank = 'game-HeroesByRank',
	HeroesByRankValue = 'game-HeroesByRankValue',
	LevelEnemy = 'game-LevelEnemy',
	LevelEnemyValue = 'game-LevelEnemyValue',
	LevelInfos = 'game-LevelInfos',
	LevelInfosValue = 'game-LevelInfosValue',
	MapProgress = 'game-MapProgress',
	MapProgressValue = 'game-MapProgressValue',
	AccountQuests = 'game-AccountQuests',
	AccountQuestsValue = 'game-AccountQuestsValue',
	GlobalQuests = 'game-GlobalQuests',
	GlobalQuestsValue = 'game-GlobalQuestsValue',
	RewardType = 'game-RewardType',
	SkillBuff = 'game-SkillBuff',
	SkillBuffValue = 'game-SkillBuffValue',
	SkillInfos = 'game-SkillInfos',
	SkillInfosValue = 'game-SkillInfosValue',
	SkillNameSet = 'game-SkillNameSet',
	SkillNameSetValue = 'game-SkillNameSetValue',
	Statistics = 'game-Statistics',
	BonusRuneStatistics = 'game-BonusRuneStatistics',
	BonusRuneStatisticsValue = 'game-BonusRuneStatisticsValue',
	RuneStatistics = 'game-RuneStatistics',
	RuneStatisticsValue = 'game-RuneStatisticsValue',
	SummonRates = 'game-SummonRates',
	SummonRatesValue = 'game-SummonRatesValue',
	Usernames = 'game-Usernames',
	UsernamesValue = 'game-UsernamesValue',
	ArenaDefense = 'game-ArenaDefense',
	ArenaDefenseValue = 'game-ArenaDefenseValue',
	BuffEvent = 'game-BuffEvent',
	EndBattle = 'game-EndBattle',
	EndBattleValue = 'game-EndBattleValue',
	EndTurn = 'game-EndTurn',
	EndTurnValue = 'game-EndTurnValue',
	EntityBuffEvent = 'game-EntityBuffEvent',
	ExperienceGain = 'game-ExperienceGain',
	ExperienceGainValue = 'game-ExperienceGainValue',
	HeroMinted = 'game-HeroMinted',
	HeroMintedValue = 'game-HeroMintedValue',
	IdAndValue = 'game-IdAndValue',
	InitArena = 'game-InitArena',
	InitArenaValue = 'game-InitArenaValue',
	Loot = 'game-Loot',
	LootValue = 'game-LootValue',
	NewAccount = 'game-NewAccount',
	NewAccountValue = 'game-NewAccountValue',
	NewBattle = 'game-NewBattle',
	NewBattleValue = 'game-NewBattleValue',
	RankChange = 'game-RankChange',
	RankChangeValue = 'game-RankChangeValue',
	RuneBonusEvent = 'game-RuneBonusEvent',
	RuneBonusEventValue = 'game-RuneBonusEventValue',
	RuneMinted = 'game-RuneMinted',
	RuneMintedValue = 'game-RuneMintedValue',
	RuneUpgraded = 'game-RuneUpgraded',
	RuneUpgradedValue = 'game-RuneUpgradedValue',
	Skill = 'game-Skill',
	SkillValue = 'game-SkillValue',
	StartTurn = 'game-StartTurn',
	StartTurnValue = 'game-StartTurnValue',
	TimestampEnergy = 'game-TimestampEnergy',
	TimestampEnergyValue = 'game-TimestampEnergyValue',
	TimestampPvpEnergy = 'game-TimestampPvpEnergy',
	TimestampPvpEnergyValue = 'game-TimestampPvpEnergyValue',
}