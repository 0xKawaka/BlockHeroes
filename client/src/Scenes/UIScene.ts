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
    // const selectedTeam: Array<Entity> = this.registry.get('selectedTeam')
    // this.createSkillTooltips(selectedTeam)
  }

  // createSkillTooltips(selectedTeam: Array<Entity>): void {
  //   const width = Math.round(this.sys.canvas.width / 2.7)
  //   const height = this.sys.canvas.height * 0.25
  //   const x = this.sys.canvas.width / 3.2
  //   const y = this.sys.canvas.height - (this.sys.canvas.height / 6)

  //   selectedTeam.forEach((entity: Entity, i) => {
  //     entity.skillArray.forEach((skill: Skill) => {
  //       this.skillTooltipsDict[skill.name + i] = new SkillTooltip(this, skill, width, height, x, y, i)
  //     })
  //   })
  // }

  createSkillTooltip(skill: Skill, entityIndex: number, width: number, position: {x: number, y: number}, zoom: number): void {
    // const width = Math.round(this.sys.canvas.width / 2.7)
    const height = this.sys.canvas.height * 0.35
    this.skillTooltipsDict[skill.name + entityIndex] = new SkillTooltip(this, skill, width, height, position.x, position.y, entityIndex, zoom)
  }

  setTooltipVisibility(skillName: string, entityIndex: number, visible: boolean): void {
    this.skillTooltipsDict[skillName + entityIndex].setVisible(visible)
  }

}