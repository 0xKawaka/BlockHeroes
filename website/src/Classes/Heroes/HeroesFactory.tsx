import { HeroInfos, SkillsDict, BaseStatsDict, SkillSets, HeroStats, BattlesInfosDict, EnemyInfos, BattlesInfosApi, RuneInfos } from "../../Types/apiTypes";
import { HeroBlockchain } from "../../Types/blockchainTypes";
import Skill from "../Skill/Skill";
import truncOrRoundDecimalPoint from "../MathInteger/MathInteger"

export abstract class HeroesFactory {
  public static createHeroes(heroes: Array<HeroBlockchain>, runes: Array<RuneInfos>, skillsDict: SkillsDict, skillSets: SkillSets, baseStatsDict: BaseStatsDict): Array<HeroInfos> {
    let heroesWithStatsAndSkills = new Array<HeroInfos>();
    heroes.forEach((hero) => {
      let heroWithStatsAndSkills: HeroInfos = this.createHero(hero, runes, skillsDict, skillSets, baseStatsDict)
      heroesWithStatsAndSkills.push(heroWithStatsAndSkills)
    })
    return heroesWithStatsAndSkills;
  }

  public static createHero(hero: HeroBlockchain, runes: Array<RuneInfos>, skillsDict: SkillsDict, skillSets: SkillSets, baseStatsDict: BaseStatsDict): HeroInfos {
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

  public static createEnemyHeroes(battlesInfos: BattlesInfosApi, skillsDict: SkillsDict, skillSets: SkillSets, baseStatsDict: BaseStatsDict): BattlesInfosDict {
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
            rank: battle.ranks[i],
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
    return truncOrRoundDecimalPoint(stat + (stat * (level - 1)) / 100);
  }

  static computeBonusStats(baseStats: HeroStats, runes: Array<RuneInfos>): HeroStats {
    let bonusStats: HeroStats = {health: 0, attack: 0, defense: 0, speed: 0, criticalChance: 0, criticalDamage: 0};
    runes.forEach((rune) => {
      rune.statistics.forEach((stat, i) => {
        switch (stat) {
          case "health":
            bonusStats.health += truncOrRoundDecimalPoint(rune.isPercent[i] ? baseStats.health * rune.values[i] / 100  : rune.values[i]);
            break;
          case "attack":
            bonusStats.attack += truncOrRoundDecimalPoint(rune.isPercent[i] ? baseStats.attack * rune.values[i] / 100  : rune.values[i]);
            break;
          case "defense":
            bonusStats.defense += truncOrRoundDecimalPoint(rune.isPercent[i] ? baseStats.defense * rune.values[i] / 100  : rune.values[i]);
            break;
          case "speed":
            bonusStats.speed += truncOrRoundDecimalPoint(rune.isPercent[i] ? baseStats.speed * rune.values[i] / 100  : rune.values[i]);
            break;
          case "criticalChance":
            bonusStats.criticalChance += truncOrRoundDecimalPoint(rune.isPercent[i] ? baseStats.criticalChance * rune.values[i] / 100  : rune.values[i]);
            break;
          case "criticalDamage":
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