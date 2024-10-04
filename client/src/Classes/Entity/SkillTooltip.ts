import Skill from "../Skill/Skill";
import SkillTooltipText from "./SkillTooltipText";

const fontSizeByZoom: {[key: number]: number } = {
  0.5: 8,
  1: 8,
  2: 12,
  3: 16,
  4: 19,
  5: 22,
  6: 25,
  7: 28,
  8: 31,
  9: 34,
  10: 37,
  11: 40,
  12: 43,
  13: 46,
  14: 49,
  15: 52,
  16: 55,
  17: 58,
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

    this.text = scene.add.text(Math.round(x + scene.sys.canvas.width * 0.01), Math.round(startTextY + scene.sys.canvas.height* 0.06), SkillTooltipText.createText(skill), {fontFamily: "RetroGaming", fontSize: fontSize.toString() + "px", color: "#FFFFFF"})
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
}