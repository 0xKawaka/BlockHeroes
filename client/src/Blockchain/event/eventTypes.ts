import { BlockchainRune } from "../../Types/blockchainTypes"

type NewBattleEvent = {owner: string, healthsArray: number[]}
type StartTurnEvent = {owner: string, entityId: number, damages: number[], heals: number[], buffs: Array<{name: string, duration: number}>, status: Array<{name: string, duration: number}>, isDead: boolean}
type SkillEvent = {owner: string, casterId: number, targetId: number, skillIndex: number, damagesDict: {[key: number]: {value: number}}, healsDict: {[key: number]: {value: number}}, deathArray: number[]}
type EndTurnEvent = {owner: string, buffsDict: {[key: number]: Array<{name: string, duration: number}>}, statusDict: {[key: number]: Array<{name: string, duration: number}>}, speedsDict: {[key: number]: number},}
type EndBattleEvent = {owner: string, hasPlayerWon: boolean}
type RuneBonusEvent = {owner: string, id: number, rank: number, procStat: string, isPercent: boolean}
type ExperienceGainEvent = {owner: string,  entityId: number, experienceGained: number, levelAfter: number, experienceAfter: number }
type LootEvent = {owner: string, crystals: number}
type RuneMintedEvent = {owner: string, blockchainRune: BlockchainRune}
type RankChangeEvent = {owner: string, rank: number}
export type {NewBattleEvent, StartTurnEvent, SkillEvent, EndTurnEvent, EndBattleEvent, RuneBonusEvent, ExperienceGainEvent, LootEvent, RuneMintedEvent, RankChangeEvent }