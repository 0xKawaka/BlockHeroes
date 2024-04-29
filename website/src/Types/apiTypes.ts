import Skill from "../Classes/Skill/Skill"
import EnergyHandler from "../Pages/Classes/EnergyHandler"

type GameAccount = {username: string, crystals: number, gems: number}
type RunesList = Array<RuneInfos>
type RuneInfos = {id:number, shape: number, isEquipped: boolean, heroEquipped: number, statistics: Array<string>, isPercent:Array<boolean>, values:Array<number>, rarity:string, rank:number}
type HeroInfos = {id:number, name: string, level:number, rank: number, experience:number, runesIds:Array<number>, spots:Array<number>, spells: Array<Skill>, baseStats:HeroStats, bonusStats:HeroStats}
type EnemyInfos = {name: string, level:number, rank: number, spells: Array<Skill>, stats:HeroStats}
type HeroStats = {health:number, attack:number, defense:number, speed:number, criticalChance:number, criticalDamage:number}
type RuneStatsDict = {base: {common: {[key: string]: {flat: number, percent: number}}}, bonus: {common: {[key: string]: {flat: number, percent: number}}}}
type BattlesInfosDict = {[key : number]: Array<BattleInfos>}
type BattleInfos = {enemies: Array<EnemyInfos>, energyCost:number}
type HeroesStatsDict = {[key: string]: HeroStats}
type SkillsDict = {[key: string]: Skill}
type BaseStatsDict = {[key: string]: HeroStats}
type SkillSets = {[key: string]: Array<string>}


type BattlesInfosApi = {[key : number]: Array<BattleInfosApi>}
type BattleInfosApi = {background: string, names: Array<string>, levels: Array<number>, ranks: Array<number>, energyCost:number}
type HeroesListApi= Array<HeroInfosApi>
type HeroInfosApi = {id:number, name: string, owner:string, level:number, experience:number, runesIds:Array<number>, spots:Array<number>, spells:Array<SkillApi>, baseStats:HeroStats}
type SkillsDictApi = {[key: string]: SkillApi}
type SkillApi = {
  imgName: string,
  name: string,
  description: string,
  cooldown: number,
  damage: [string, number, boolean, boolean, boolean],
  heal: [string, number, boolean, boolean, boolean],
  targetType: string,
  accuracy: number,
  aoe: boolean,
  buffsAndStatusArrays: Array<Array<any>>
}


export type {GameAccount, RunesList, HeroInfos, EnemyInfos, HeroStats, HeroesStatsDict, RuneInfos, RuneStatsDict, BattleInfos, BattlesInfosApi, BattlesInfosDict, SkillApi, HeroInfosApi, HeroesListApi, SkillsDict, SkillsDictApi, BaseStatsDict, SkillSets}
