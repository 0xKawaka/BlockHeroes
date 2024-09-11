import SkillFactory from "../Skill/SkillFactory"
import Skill from "../Skill/Skill"
import ISkillAnimation from "../Skill/Animations/ISkillAnimation"
import MoveAndCast from "../Skill/Animations/MoveAndCast"
import Cast from "../Skill/Animations/Cast"
import CastProjectile from "../Skill/Animations/CastProjectile"
import CastProjectileAOE from "../Skill/Animations/CastProjectileAOE"
import FlatDamage from "../Skill/FlatDamage"
import PercentHeal from "../Skill/PercentHeal"
import { SkillApi, HeroesListApi, SkillsDict, SkillsDictApi, RunesList, HeroInfos } from "../../Types/apiTypes"
import { computeBonusStats } from "../../Pages/utils/statisticsCompute"
import imageDictSkills from "../../assets/skills/imageDict"

export default class SkillsHandler {
  static createEnemiesSkills(enemiesSkills: Array<Array<SkillApi>>): Array<Array<Skill>> {
    let enemiesSkillsFormatted: Array<Array<Skill>> = []
    for (let i = 0; i < enemiesSkills.length; i++) {
      let enemySkillsArray = new Array<Skill>()
      for (let j = 0; j < enemiesSkills[i].length; j++) {
        enemySkillsArray.push(this.createSkillFromData(enemiesSkills[i][j]))
      }
      enemiesSkillsFormatted.push(enemySkillsArray)
    }
    return enemiesSkillsFormatted
  }

  static createSkillFromData(skillData: SkillApi): Skill {
    return SkillFactory.createSkill(
      skillData.name,
      skillData.description,
      skillData.cooldown,
      this.createDamage(skillData),
      this.createHeal(skillData),
      skillData.targetType,
      skillData.accuracy,
      skillData.aoe,
      imageDictSkills[skillData.imgName],
      skillData.buffsAndStatusArrays[0],
      skillData.buffsAndStatusArrays[1],
      skillData.buffsAndStatusArrays[2],
      skillData.buffsAndStatusArrays[3],
      skillData.buffsAndStatusArrays[4],
      skillData.buffsAndStatusArrays[5],
      skillData.buffsAndStatusArrays[6],
      skillData.buffsAndStatusArrays[7],
      skillData.buffsAndStatusArrays[8],
      skillData.buffsAndStatusArrays[9],
      skillData.buffsAndStatusArrays[10],
      skillData.buffsAndStatusArrays[11],
      skillData.buffsAndStatusArrays[12],
      skillData.buffsAndStatusArrays[13]
    )
  }

  static createDamage(skillData: SkillApi) {
    if(skillData.damage[0] === "flat") {
      return new FlatDamage(skillData.damage[1], skillData.damage[2], skillData.damage[3], skillData.damage[4])
    }
    else {
      return new FlatDamage(skillData.damage[1], skillData.damage[2], skillData.damage[3], skillData.damage[4])
      // return new PercentDamage(skillData.damage[1], skillData.damage[2], skillData.damage[3], skillData.damage[4])
    }
  }

  static createHeal(skillData: SkillApi) {
    if(skillData.heal[0] === "flat") {
      return new PercentHeal(skillData.heal[1], skillData.heal[2], skillData.heal[3], skillData.heal[4])
      // return new FlatHeal(skillData.heal[1], skillData.heal[2], skillData.heal[3], skillData.heal[4])
    }
    else {
      return new PercentHeal(skillData.heal[1], skillData.heal[2], skillData.heal[3], skillData.heal[4])
    }
  }

  static formatSkills(skillsDict: SkillsDictApi): SkillsDict{
    let skillsDictFormatted: SkillsDict = {}
    for (let key in skillsDict) {
      skillsDictFormatted[key] = this.createSkillFromData(skillsDict[key])
    }
    return skillsDictFormatted
  }

  static formatHeroesSkillsAndBonusStats(heroesApiData: HeroesListApi, runesList: RunesList): Array<HeroInfos> {
    let heroesWithFormattedSkills:Array<HeroInfos> = []
    for (let i = 0; i < heroesApiData.length; i++) {
      heroesWithFormattedSkills[i] = {id: heroesApiData[i].id, name: heroesApiData[i].name, level: heroesApiData[i].level, rank: 1, experience: heroesApiData[i].experience, runesIds: heroesApiData[i].runesIds, spots: heroesApiData[i].spots, baseStats:heroesApiData[i].baseStats, bonusStats:computeBonusStats(heroesApiData[i], runesList), spells:[]}
      for (let j = 0; j < heroesApiData[i].spells.length; j++) {
        heroesWithFormattedSkills[i].spells[j] = this.createSkillFromData(heroesApiData[i].spells[j])
      }
    }
    return heroesWithFormattedSkills
  }

}


