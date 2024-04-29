import Statistics from "../Statistic/Statistics"
import Skill from "../Skill/Skill"
import ISkillAnimation from "../Skill/Animations/ISkillAnimation"

export default class Entity {
  name: string
  statistics: Statistics
  skillArray: Array<Skill>
  // skillAnimationDict: {[key: string]: ISkillAnimation}

  // constructor(name: string, statistics: Statistics, skillArray: Array<Skill>, skillAnimationDict: {[key: string]: ISkillAnimation}) {
  constructor(name: string, statistics: Statistics, skillArray: Array<Skill>) {
    this.name = name
    this.statistics = statistics
    this.skillArray = skillArray
    // this.skillAnimationDict = skillAnimationDict
  }

  getSkillCooldownByName(name: string): number {
    for (let skill of this.skillArray) {
      if (skill.name === name) {
        return skill.cooldown
      }
    }
    console.log("Skill cooldown  not found")
    return -1
  }

  getSkillIndexByName(name: string): number {
    for (let i = 0; i < this.skillArray.length; i++) {
      if (this.skillArray[i].name === name) {
        return i
      }
    }
    console.log("Skill index not found")
    return -1
  }

  // getSkillAnim(skillName: string): ISkillAnimation {
  //   return this.skillAnimationDict[skillName]
  // }
}
