import Phaser from 'phaser'
import Skill from '../Classes/Skill/Skill'
import SkillTooltip from '../Classes/Entity/SkillTooltip'
import Entity from '../Classes/Entity/Entity'

export default class UIScene extends Phaser.Scene {

  skillTooltipsDict: {[key: string]: SkillTooltip} = {}

  constructor() {
    super('UIScene')
  }

  preload() {
  }

  async create() {
    this.cameras.main.setRoundPixels(true)
  }

  createSkillTooltip(skill: Skill, entityIndex: number, width: number, position: {x: number, y: number}, zoom: number): void {
    const height = this.sys.canvas.height * 0.35
    this.skillTooltipsDict[skill.name + entityIndex] = new SkillTooltip(this, skill, width, height, position.x, position.y, entityIndex, zoom)
  }

  setTooltipVisibility(skillName: string, entityIndex: number, visible: boolean): void {
    this.skillTooltipsDict[skillName + entityIndex].setVisible(visible)
  }

}