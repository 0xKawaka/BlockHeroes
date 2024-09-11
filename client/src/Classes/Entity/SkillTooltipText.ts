import IHealOrDamage from "../Skill/IHealOrDamage";
import Skill from "../Skill/Skill";
import SkillBuff from "../Skill/SkillBuff";

export default class SkillTooltipText {
  static createText(skill: Skill): string {
    let text = ""

    text += this.damageOrHealToString(skill.damage, "Damages")
    text += this.damageOrHealToString(skill.heal, "Heals")
    
    if(skill.skillBuffArray.length > 0){
      text += this.buffsArrayToString(skill.skillBuffArray)
    }

    if(skill.skillStatusArray.length > 0) {
      text += this.statusArrayToString(skill.skillStatusArray)
    }

    // text += skill.description
    return text
  }

  static damageOrHealToString(damageOrHeal: IHealOrDamage, dmgOrHealString: string): string {
    let text = ""
    if(damageOrHeal.value > 0){
      text += dmgOrHealString + " : " + damageOrHeal.getStringifiedValue() + " to "
      if(damageOrHeal.aoe)
        text += "all " + (dmgOrHealString == "Damages" ?  "ennemies" : "allies") + "\n"
      if(damageOrHeal.target)
        text += "target \n"
      if(damageOrHeal.self)
        text += "self \n"
      text += "\n"
    } 
    return text
  }

  static buffsArrayToString(skillBuffArray: SkillBuff[]): string {
    let text = "Buffs : "
    skillBuffArray.forEach(skillBuff => {
      text += skillBuff.value * 100 + "% "+ skillBuff.name + " "
      if(skillBuff.aoe)
        text += "AOE "
      if(skillBuff.self)
        text += "self "
      if(skillBuff.target)
        text += "target "
      text += "for " + skillBuff.duration + " turns" + "\n"
    })
    text += "\n"
    return text
  }

  static statusArrayToString(skillStatusArray: SkillBuff[]): string {
    let text = "Status : "
    skillStatusArray.forEach(skillStatus => {
      if(skillStatus.value > 0)
        text += skillStatus.value * 100 + "% "
      text += skillStatus.name + " "
      if(skillStatus.aoe)
        text += "AOE "
      if(skillStatus.self)
        text += "self "
      if(skillStatus.target)
        text += "target "
      text += "for " + skillStatus.duration + " turns" + "\n"
    })
    text += "\n"
    return text
  }

  toPlural(word: string): string {
    if(word[word.length - 1] === "y")
      return word.substring(0, word.length - 1) + "ies"
    else
      return word + "s"
  }

  private capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}