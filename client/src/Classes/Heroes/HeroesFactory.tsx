import { HeroInfos, SkillsDict, BaseStatsDict, SkillSets, HeroStats, BattlesInfosDict, EnemyInfos, BattlesInfosApi, RuneInfos } from "../../Types/apiTypes";
import { HeroBlockchain } from "../../Types/blockchainTypes";
import Skill from "../Skill/Skill";
import truncOrRoundDecimalPoint from "../MathInteger/MathInteger"
import skillsDict from '../../GameDatas/Skills/skillsDict'
import skillSets from '../../GameDatas/Skills/skillSets'
import baseStatsDict from '../../GameDatas/Statistics/baseStats'
import { attackBonusPerLevel, statsBonusPerLevel } from "../../GameDatas/constants";
import { BaseHeroInfos } from "../../Types/customTypes";
import baseRankByHeroName from "../../GameDatas/ranks";

export abstract class HeroesFactory {
  public static createBaseHeroes(): Array<BaseHeroInfos> {
    let baseHeroes = new Array<BaseHeroInfos>();
    Object.keys(skillSets).forEach((heroName) => {
      let baseStats = baseStatsDict[heroName];
      let baseHero: BaseHeroInfos = {
        name: heroName,
        rank: baseRankByHeroName[heroName],
        spells: HeroesFactory.getSkills(skillSets[heroName], skillsDict),
        stats: baseStats
      }
      baseHeroes.push(baseHero)
    })
    return baseHeroes;
  }

  public static createHeroes(heroes: Array<HeroBlockchain>, runes: Array<RuneInfos>): Array<HeroInfos> {
    let heroesWithStatsAndSkills = new Array<HeroInfos>();
    heroes.forEach((hero) => {
      let heroWithStatsAndSkills: HeroInfos = this.createHero(hero, runes)
      heroesWithStatsAndSkills.push(heroWithStatsAndSkills)
    })
    return heroesWithStatsAndSkills;
  }

  public static createHero(hero: HeroBlockchain, runes: Array<RuneInfos>): HeroInfos {
    let heroRunes = runes.filter(rune => hero.runeIds.includes(rune.id))
    let baseStats = HeroesFactory.computeBaseStats(hero.level, hero.rank, baseStatsDict[hero.name])
    let heroWithStatsAndSkills: HeroInfos = {
      id: hero.id,
      name: hero.name,
      level: hero.level,
      rank: hero.rank,
      experience: hero.experience,
      runesIds: hero.runeIds,
      spots: hero.spots,
      spells: HeroesFactory.getSkills(skillSets[hero.name], skillsDict),
      baseStats: baseStats,
      bonusStats: HeroesFactory.computeBonusStats(baseStats, heroRunes)
    }
    return heroWithStatsAndSkills;
  }

  public static createSummonedHero(id: number, name: string): HeroInfos {
    let baseStats = HeroesFactory.computeBaseStats(1, 1, baseStatsDict[name])
    let baseRank = baseRankByHeroName[name]
    let heroWithStatsAndSkills: HeroInfos = {
      id: id,
      name: name,
      level: 1,
      rank: baseRank,
      experience: 0,
      runesIds: [],
      spots: [],
      spells: HeroesFactory.getSkills(skillSets[name], skillsDict),
      baseStats: baseStats,
      bonusStats: HeroesFactory.computeBonusStats(baseStats, [])
    }
    return heroWithStatsAndSkills;
  }

  public static createEnemyHeroes(battlesInfos: BattlesInfosApi): BattlesInfosDict {
    let battlesWithEnemyStatsAndSkills: BattlesInfosDict = {};
    Object.keys(battlesInfos).forEach((worldIdKey) => {
      // console.log(worldIdKey)
      const worldId = Number(worldIdKey)
      battlesWithEnemyStatsAndSkills[worldId] = [];
      battlesInfos[worldId].forEach((battle) => {
        let enemiesWithStatsAndSkills = new Array<EnemyInfos>();
        for(let i = 0; i < battle.names.length; i++){
          let enemyWithStatsAndSkills: EnemyInfos = {
            name: battle.names[i],
            level: battle.levels[i],
            rank: baseRankByHeroName[battle.names[i]],
            stats: HeroesFactory.computeBaseStats(battle.levels[i],battle.ranks[i], baseStatsDict[battle.names[i]]),
            spells: HeroesFactory.getSkills(skillSets[battle.names[i]], skillsDict),
          }
          enemiesWithStatsAndSkills.push(enemyWithStatsAndSkills)
        }
        battlesWithEnemyStatsAndSkills[worldId].push({enemies: enemiesWithStatsAndSkills, energyCost: battle.energyCost})
      })
    })
    return battlesWithEnemyStatsAndSkills;
  }

  static getSkills(skillSet: Array<string>, skillsDict: SkillsDict): Array<Skill> {
    let skills = new Array<Skill>();
    skillSet.forEach((skillName) => {
      skills.push(skillsDict[skillName])
    })
    return skills;
  }

  static computeBaseStats(level: number, rank: number, baseStats: HeroStats): HeroStats {
    return {
      health: HeroesFactory.computeBaseStatFromLevelRank(level, rank, baseStats.health),
      attack: HeroesFactory.computeBaseStatFromLevelRank(level, rank, baseStats.attack),
      defense: HeroesFactory.computeBaseStatFromLevelRank(level, rank, baseStats.defense),
      speed: HeroesFactory.computeBaseStatFromLevelRank(level, rank, baseStats.speed),
      criticalChance: baseStats.criticalChance, criticalDamage: baseStats.criticalDamage
    };
  }

  static computeBaseStatFromLevelRank(level: number, rank: number, stat: number): number {
    return truncOrRoundDecimalPoint(stat + stat * (level - 1) * statsBonusPerLevel / 100);
  }

  static computeBaseAttackFromLevelRank(level: number, rank: number, attack: number): number {
    return truncOrRoundDecimalPoint(attack + attack * (level - 1) * attackBonusPerLevel / 100);
  }

  static computeBonusStats(baseStats: HeroStats, runes: Array<RuneInfos>): HeroStats {
    let bonusStats: HeroStats = {health: 0, attack: 0, defense: 0, speed: 0, criticalChance: 0, criticalDamage: 0};
    runes.forEach((rune) => {
      rune.statistics.forEach((stat, i) => {
        switch (stat) {
          case "Health":
            bonusStats.health += truncOrRoundDecimalPoint(rune.isPercent[i] ? baseStats.health * rune.values[i] / 100  : rune.values[i]);
            break;
          case "Attack":
            bonusStats.attack += truncOrRoundDecimalPoint(rune.isPercent[i] ? baseStats.attack * rune.values[i] / 100  : rune.values[i]);
            break;
          case "Defense":
            bonusStats.defense += truncOrRoundDecimalPoint(rune.isPercent[i] ? baseStats.defense * rune.values[i] / 100  : rune.values[i]);
            break;
          case "Speed":
            bonusStats.speed += truncOrRoundDecimalPoint(rune.isPercent[i] ? baseStats.speed * rune.values[i] / 100  : rune.values[i]);
            break;
          case "CriticalChance":
            bonusStats.criticalChance += truncOrRoundDecimalPoint(rune.isPercent[i] ? baseStats.criticalChance * rune.values[i] / 100  : rune.values[i]);
            break;
          case "CriticalDamage":
            bonusStats.criticalDamage += truncOrRoundDecimalPoint(rune.isPercent[i] ? baseStats.criticalDamage * rune.values[i] / 100  : rune.values[i]);
            break;
          default:
            break;
        }
      })
    })
    return bonusStats;
  }

}