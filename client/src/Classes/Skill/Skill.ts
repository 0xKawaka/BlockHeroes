import IHealOrDamage from "./IHealOrDamage";
import ISkill from "./ISkill";
import SkillBuff from "./SkillBuff";
import SkillStatus from "./SkillStatus";

export default class Skill implements ISkill {
    name: string
    description: string
    cooldown: number
    damage: IHealOrDamage
    heal: IHealOrDamage
    targetType: string
    accuracy: number
    aoe: boolean
    image: any
    skillStatusArray: Array<SkillStatus>
    skillBuffArray: Array<SkillBuff>
  
    constructor(name: string, description: string, cooldown: number, damage: IHealOrDamage, heal: IHealOrDamage, targetType: string, accuracy: number, aoe: boolean, image: any, skillStatusArray: Array<SkillStatus>, skillBuffArray: Array<SkillBuff>) {
      this.name = name
      this.description = description
      this.cooldown = cooldown
      this.damage = damage
      this.heal = heal
      this.targetType = targetType
      this.accuracy = accuracy
      this.aoe = aoe
      this.image = image
      this.skillStatusArray = skillStatusArray
      this.skillBuffArray = skillBuffArray
    }
}