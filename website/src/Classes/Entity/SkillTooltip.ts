import IHealOrDamage from "../Skill/IHealOrDamage";
import Skill from "../Skill/Skill";
import SkillBuff from "../Skill/SkillBuff";

const fontSizeByZoom: {[key: number]: number } = {
  0.5: 8,
  1: 8,
  2: 12,
  3: 16,
  4: 19,
}

export default class SkillTooltip {
  rectangle: Phaser.GameObjects.Graphics
  titleText: Phaser.GameObjects.Text
  text: Phaser.GameObjects.Text
  cooldown: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, skill: Skill, width: number, height: number, x:number, y:number, entityIndex: number, zoom: number) {
    this.rectangle = scene.add.graphics();
    this.rectangle.fillStyle(0x000000, 1);
    this.rectangle.setAlpha(0.7)
    this.rectangle.fillRoundedRect(x, y - height, width, height, 8);
    // this.rectangle.fillRoundedRect(x, y, width, height, 8);

    const startTextY = Math.round(y - height * 0.95)
    const fontSize = fontSizeByZoom[zoom]

    this.cooldown = scene.add.text(Math.round(x + width - width * 0.2), startTextY, skill.cooldown.toString() + " turns", {fontFamily: "RetroGaming", fontSize: fontSize.toString() + "px", color: "#FFFFFF"})
  
    this.titleText = scene.add.text(Math.round(x + scene.sys.canvas.width * 0.01), startTextY, skill.name, {fontFamily: "RetroGaming", fontSize: fontSize.toString()  + "px", color: "#FFFFFF", fontStyle: "bold"})
    this.titleText.setWordWrapWidth(width)
    this.titleText.setName("tooltipTittle_" + skill.name + "_" + entityIndex.toString())

    this.text = scene.add.text(Math.round(x + scene.sys.canvas.width * 0.01), Math.round(startTextY + scene.sys.canvas.height* 0.06), this.createText(skill), {fontFamily: "RetroGaming", fontSize: fontSize.toString() + "px", color: "#FFFFFF"})
    this.text.setWordWrapWidth(width)
    this.text.setName("tooltip_" + skill.name + "_" + entityIndex.toString())
    this.setVisible(false)
    return this;
  }

  setVisible(visible: boolean){
    this.rectangle.setVisible(visible)
    this.text.setVisible(visible)
    this.titleText.setVisible(visible)
    this.cooldown.setVisible(visible)
  }

  private capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  private damageOrHealToString(damageOrHeal: IHealOrDamage, dmgOrHealString: string): string {
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

  private buffsArrayToString(skillBuffArray: SkillBuff[]): string {
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

  private statusArrayToString(skillStatusArray: SkillBuff[]): string {
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


  createText(skill: Skill): string {
    let text = ""

    text += this.damageOrHealToString(skill.damage, "Damages")
    text += this.damageOrHealToString(skill.heal, "Heals")
    
    if(skill.skillBuffArray.length > 0){
      text += this.buffsArrayToString(skill.skillBuffArray)
    }

    if(skill.skillStatusArray.length > 0) {
      text += this.statusArrayToString(skill.skillStatusArray)
    }

    text += skill.description
    return text
  }

  toPlural(word: string): string {
    if(word[word.length - 1] === "y")
      return word.substring(0, word.length - 1) + "ies"
    else
      return word + "s"
  }
}