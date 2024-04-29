import Statistics from "../Statistic/Statistics"
import Skill from "../Skill/Skill"
import StatsModifier from "../Statistic/StatsModifier"
import BattleEntity from "./BattleEntity"
import Entity from "./Entity"
// import skillsetByMonsterName from "../../GameDatas/Monsters/skillsets"
// import {skillsDict} from "../../GameDatas/Skills/skills"
import BattleEntityAlly from "./BattleEntityAlly"
import BattleEntityEnemy from "./BattleEntityEnemy"
import IBattleEntity from "./IBattleEntity"
import BattleScene from "../../Scenes/BattleScene"
import {animsByEntityName} from "../Animations/spritesheetParser"
import ISkillAnimation from "../Skill/Animations/ISkillAnimation"

export default class EntityFactory {

  static createBattleEntityAllyOrEnemyFromEntity(entity: Entity, width: number, height: number, upscale: number, entityIndex:number, alliesCount: number, enemiesCount: number, isAllyOrEnemy: string, battleScene: BattleScene): IBattleEntity {
    let statusArray = new Array<StatsModifier>()
    let buffsArray = new Array<StatsModifier>()
    if (isAllyOrEnemy === "ally") {
      return new BattleEntityAlly(new BattleEntity(entity, entityIndex, alliesCount, enemiesCount, statusArray, buffsArray, battleScene, true, animsByEntityName[entity.name], width, height, upscale), battleScene)
    }
    return new BattleEntityEnemy(new BattleEntity(entity, entityIndex, alliesCount, enemiesCount, statusArray, buffsArray, battleScene, false, animsByEntityName[entity.name], width, height, upscale))
  }

  // static createEntityFromScratch(name: string, level: number, health: number, speed: number) {
  //   let skillArray = this.getSkills(name)
  //   // let skillAnimationDict = this.getSkillAnimations(name)
  //   // return new Entity(name, new Statistics(level, health, speed), skillArray, skillAnimationDict)
  //   return new Entity(name, new Statistics(level, health, speed), skillArray)
  // }

  static createEntity(name: string, level: number, health: number, speed: number, skillArray: Array<Skill>) {
    return new Entity(name, new Statistics(level, health, speed), skillArray)
  }

  // static getSkills(entityName: string): Array<Skill> {
  //   let skillArray = new Array<Skill>()
  //   let skillIdsArray = skillsetByMonsterName[entityName]
  //   for (let i = 0; i < skillIdsArray.length; i++) {
  //     let skill = skillsDict[skillIdsArray[i]]
  //     skillArray.push(skill)
  //   }
  //   return skillArray
  // }

  // static getSkillAnimations(entityName: string): {[key: string]: ISkillAnimation} {
  //   let skillAnimDict: { [key: string]: ISkillAnimation } = {};
  //   let skillIdsArray = skillsetByMonsterName[entityName]
  //   for (let i = 0; i < skillIdsArray.length; i++) {
  //     let skillAnim = skillAnimsDict[skillIdsArray[i]]
  //     skillAnimDict[skillIdsArray[i]] = skillAnim
  //   }
  //   return skillAnimDict
  // }
}
