import StatsModifier from "../Statistic/StatsModifier";
import Entity from "./Entity";
import Turnbar from "./Turnbar";
import IBattleEntity from "./IBattleEntity";
import HealthBar from "./HealthBar";
import BattleScene from "../../Scenes/BattleScene";
import Battle from "../Battle";
import Skill from "../Skill/Skill";
import SpriteWrapper from "../Animations/SpriteWrapper";
import AnimationsHandler from "../Animations/AnimationsHandler";
import ISkillAnimation from "../Skill/Animations/ISkillAnimation";
import SkillTooltip from "./SkillTooltip";
import { StartTurnEvent } from "../../Blockchain/event/eventTypes";
import UIScene from "../../Scenes/UIScene";


export default class BattleEntityAlly implements IBattleEntity {
  battleEntity: IBattleEntity
  skillImageByName: {[key: string]: Phaser.GameObjects.Image}
  skillSelectedImageByName: {[key: string]: Phaser.GameObjects.Image}
  skillScale: number
  skillHoveredByName: {[key: string]:boolean}
  skillTooltipByName: {[key: string]: SkillTooltip}
  skillCooldownByName: {[key: string]: number}
  skillCooldownRectangleByName: {[key: string]: Phaser.GameObjects.Graphics}
  // skillCooldownTextByName: {[key: string]: Phaser.GameObjects.Text}
  skillCooldownTextByName: {[key: string]: Phaser.GameObjects.BitmapText}

  constructor(battleEntity: IBattleEntity, battleScene: BattleScene) {
    this.battleEntity = battleEntity
    // this.createSelectedBar(battleScene)
    // this.skillScale = battleScene.battle.scaler.getScaleFactor()
    this.skillScale = this.battleEntity.getScaledValue()
    this.skillImageByName = {}
    this.skillSelectedImageByName = {}
    this.skillHoveredByName = {}
    this.skillTooltipByName = {}
    this.skillCooldownRectangleByName = {}
    this.skillCooldownTextByName = {}
    this.createSkills(battleScene)
    this.initSkillCooldownByName()
  }

  initSkillCooldownByName(){
    this.skillCooldownByName = {}
    for (let i = 0; i < this.battleEntity.getEntity().skillArray.length; i++) {
      this.skillCooldownByName[this.battleEntity.getEntity().skillArray[i].name] = 0
    }
  }
  setOnCooldown(name: string): void {
    this.skillCooldownByName[name] = this.battleEntity.getEntity().getSkillCooldownByName(name)
  }
  isSkillOnCooldown(name: string): boolean {
    return this.skillCooldownByName[name] > 0
  }
  reduceCooldowns() {
    for(let skillName in this.skillCooldownByName) {
      this.skillCooldownByName[skillName]--
      if(this.skillCooldownByName[skillName] < 0) {
        this.skillCooldownByName[skillName] = 0
      }
    }
  }

  async playTurn(battle: Battle, startTurnEvent: StartTurnEvent, animationsHandler: AnimationsHandler):Promise<void> {
    console.log("Entity ally ", this.getIndex(), ' playing')
    console.log("Entity health before procs : ", this.getCurrentHealth())
    await this.battleEntity.playTurn(battle, startTurnEvent, animationsHandler)
    console.log('health: ', this.getCurrentHealth())
    this.reduceCooldowns()
    console.log("Entity health after procs : ", this.getCurrentHealth())
    if(!this.battleEntity.isDead() && !this.battleEntity.isStunned()) {
      battle.battleScene.battle.hasSelectedTarget = false
      // this.selectedBar.showBar()
      this.setOutlineBarsColor(0xc9cb8d, 1)
      this.showSkills()
    }
    else if (this.battleEntity.isStunned()){
      battle.updateEndTurnInCaseOfStun()
      this.endTurn()
      battle.isTurnPlaying = false
    }
    else {
      console.log('Ally dead OnTurnProcs')
      this.endTurn()
      battle.isTurnPlaying = false
    }
  }

  async waitDamageAndHealAnimsDone(): Promise<void> {
    await this.battleEntity.waitDamageAndHealAnimsDone()
  }

  endSkillSelection(): void {
    this.hideSkills()
    // this.selectedBar.hideBar()
    this.setOutlineBarsColor(0x000000, 1)
    this.resetSkillSelection()
  }
  endTurn(): void {
    this.battleEntity.endTurn()
  }

  applyDamage(value: number): void {
    this.battleEntity.applyDamage(value)
  }
  applyHeal(value: number): void {
    this.battleEntity.applyHeal(value)
  }
  applyDamageAndPlayAnim(isCrit: boolean, value: number, battleScene: Phaser.Scene, animationHandler: AnimationsHandler): void {
    this.battleEntity.applyDamageAndPlayAnim(isCrit, value, battleScene, animationHandler)
  }
  applyHealAndPlayAnim(value: number, battleScene: Phaser.Scene): void {
    this.battleEntity.applyHealAndPlayAnim(value, battleScene)
  }

  applyBuffsAndStatus(buffs: Array<{name: string, duration: number}>, status: Array<{name: string, duration: number}>, battleScene: Phaser.Scene): void {
    this.battleEntity.applyBuffsAndStatus(buffs, status, battleScene)
  }
  die(battle: Battle, battleScene: Phaser.Scene, animationsHandler: AnimationsHandler): void {
    this.battleEntity.die(battle, battleScene, animationsHandler)
  }
  isDead(): boolean {
    return this.battleEntity.isDead()
  }

  createSkills(battleScene: BattleScene): void {
    const skillBaseWidth = 30
    const skillGap = skillBaseWidth / 3
    const totalSizeSkill = skillGap * 2 + skillBaseWidth * 3

    const xSkillBar = battleScene.battle.positionner.getSkillBarStartX(totalSizeSkill)
    const ySkillBar = battleScene.battle.positionner.getSkillBarStartY()
    this.battleEntity.getEntity().skillArray.forEach((skill, index) => {
      let position = {x: 0, y: 0}
      position.x = ((xSkillBar - totalSizeSkill / 2) - battleScene.cameras.main.worldView.x) * battleScene.cameras.main.zoom
      position.y = (ySkillBar - (skillBaseWidth * 0.5 + battleScene.cameras.main.worldView.y)) * battleScene.cameras.main.zoom
      battleScene.battle.UIScene.createSkillTooltip(skill, this.battleEntity.getIndex(), totalSizeSkill * battleScene.cameras.main.zoom * 2, position, battleScene.cameras.main.zoom)

      this.createSkillImage(battleScene, skill.name, xSkillBar + skillBaseWidth * 0.5 + index * skillBaseWidth + index * skillGap, ySkillBar)
    })
    this.createCooldownRectangles(this.battleEntity.getEntity().skillArray, skillBaseWidth, battleScene)
  }

  createCooldownRectangles(skillArray: Skill[], skillwidthScaled:number, battleScene: BattleScene): void {
    skillArray.forEach((skill, index) => {
      this.skillCooldownRectangleByName[skill.name] = battleScene.add.graphics();
      this.skillCooldownRectangleByName[skill.name].setDepth(9)
      this.skillCooldownRectangleByName[skill.name].fillStyle(0x000000, 1);
      this.skillCooldownRectangleByName[skill.name].setAlpha(1)
      this.skillCooldownRectangleByName[skill.name].setVisible(false)
      // this.skillCooldownRectangleByName[skill.name].fillRoundedRect(this.skillImageByName[skill.name].x - skillwidthScaled / 2, this.skillImageByName[skill.name].y - skillwidthScaled / 2, skillwidthScaled, skillwidthScaled, 8);
      this.skillCooldownRectangleByName[skill.name].fillRect(this.skillImageByName[skill.name].x - skillwidthScaled / 2, this.skillImageByName[skill.name].y - skillwidthScaled / 2, skillwidthScaled, skillwidthScaled);
  
      const fontSize = battleScene.sys.canvas.height * 0.04
      // this.skillCooldownTextByName[skill.name] = battleScene.add.text(this.skillImageByName[skill.name].x, this.skillImageByName[skill.name].y, "0", {fontFamily: "Verdana", fontSize: fontSize.toString() + "px", color: "#FFFFFF"})
      this.skillCooldownTextByName[skill.name] = battleScene.add.bitmapText(this.skillImageByName[skill.name].x, this.skillImageByName[skill.name].y, 'RetroGaming10', '0');
      // this.skillCooldownTextByName[skill.name].setScale(this.skillScale)
      this.skillCooldownTextByName[skill.name].setVisible(false)
      this.skillCooldownTextByName[skill.name].setOrigin(0.5, 0.5)
    })
  }

  createSkillImage(battleScene: BattleScene, name: string, x:number, y:number): void {
    this.skillHoveredByName[name] = false

    this.skillImageByName[name] = battleScene.add.image(x, y, name)
    // this.skillImageByName[name].setScale(this.skillScale)
    this.skillImageByName[name].setInteractive();
    this.skillImageByName[name].on("pointerover", () => { this.handlerHoverSkill(name, this.battleEntity.getIndex(), battleScene.battle.UIScene)})
    this.skillImageByName[name].on("pointerout", () => { this.handlerHoverOutSkill(name, this.battleEntity.getIndex(), battleScene.battle.UIScene)});
    this.skillImageByName[name].setName("skill_" + name + "_" + this.battleEntity.getIndex().toString())
    this.skillImageByName[name].setVisible(false)
    this.skillImageByName[name].setInteractive()
    this.skillImageByName[name].setDepth(7)

    this.skillSelectedImageByName[name] = battleScene.add.image(x, y, "skillSelected")
    this.skillSelectedImageByName[name].setDepth(8)
    // this.skillSelectedImageByName[name].setScale(this.skillScale)
    this.skillSelectedImageByName[name].setVisible(false)
  }

  async handlerHoverSkill(name:string, entitIndex:number, UIScene: UIScene){
    if(!this.skillHoveredByName[name]){
      this.skillHoveredByName[name] = true
      await new Promise(resolve => setTimeout(resolve, 1000));
      if(this.skillHoveredByName[name]){
        UIScene.setTooltipVisibility(name, entitIndex, true)
      }
    }
  }
  async handlerHoverOutSkill(name:string, entitIndex: number, UIScene: UIScene){
    this.skillHoveredByName[name] = false
    UIScene.setTooltipVisibility(name, entitIndex, false)
  }

  resetSkillSelection(): void {
    for(let key in this.skillImageByName){
      // this.skillImageByName[key].setScale(this.skillScale)
      this.skillSelectedImageByName[key].setVisible(false)
    }
  }

  showSkills(): void {
    // console.log(this.skillCooldownByName)
    for(let key in  this.skillImageByName){
      if(!this.isSkillOnCooldown(key))
        this.skillImageByName[key].visible = true
      else {
        this.showCooldown(key)
      }
    }
  }
  showCooldown(skillName: string){
    this.skillCooldownRectangleByName[skillName].setVisible(true)
    this.skillCooldownTextByName[skillName].setText(this.skillCooldownByName[skillName].toString())
    this.skillCooldownTextByName[skillName].setVisible(true)
  }

  hideCooldown(skillName: string){
    this.skillCooldownRectangleByName[skillName].setVisible(false)
    this.skillCooldownTextByName[skillName].setVisible(false)
  }

  hideSkills(): void {
    for(let key in  this.skillImageByName){
      this.skillImageByName[key].visible = false
      this.hideCooldown(key)
    }
  }

  selectSkill(name: string){
    for(let key in  this.skillImageByName){
      if(key === name)
        this.skillSelectedImageByName[key].setVisible(true)
        // this.skillImageByName[key].setScale(this.skillScale * 1.15)
      else
        this.skillSelectedImageByName[key].setVisible(false)
        // this.skillImageByName[key].setScale(this.skillScale)
    }
  }
  async playAnim(animationName: string): Promise<void> {
    this.battleEntity.playAnim(animationName)
  }
  // playHurtThenIdle(animationHandler : AnimationsHandler): void {
  //   this.battleEntity.playHurtThenIdle(animationHandler)
  // }
  updateHealth(): void {
    this.battleEntity.updateHealth()
  }
  updateDisplayTurnBar(turnbarValue: number): void {
    this.battleEntity.updateDisplayTurnBar(turnbarValue)
  }
  // getSkillAnim(skillName: string): ISkillAnimation {
  //   return this.battleEntity.getSkillAnim(skillName)
  // }
  setOutlineBarsColor(color: number, alpha: number): void {
    this.battleEntity.setOutlineBarsColor(color, alpha)
  }
  getFrontEntityX(): number {
    return this.battleEntity.getSprite().getPlaceholderX() + this.battleEntity.getSprite().getWidth() / 1.4
  }
  getFrontEntityXWithOffset(offset: number): number {
    return this.getFrontEntityX() + offset
  }

  getEntity(): Entity {
    return this.battleEntity.getEntity()
  }

  getIndex(): number {
    return this.battleEntity.getIndex()
  }
  getBattleSpeed(): number {
    return this.battleEntity.getBattleSpeed()
  }
  setBattleSpeed(value: number): void {
    this.battleEntity.setBattleSpeed(value)
  }
  getSkillIndexByName(name: string): number {
    return this.battleEntity.getSkillIndexByName(name)
  }
  getPosition(): {x: number, y: number} {
    return this.battleEntity.getPosition()
  }

  getStatusArray(): Array<StatsModifier> {
    return this.battleEntity.getStatusArray()
  }

  getBuffsArray(): Array<StatsModifier> {
    return this.battleEntity.getBuffsArray()
  }

  getCurrentHealth(): number {
    return this.battleEntity.getCurrentHealth()
  }

  getTurnbar(): Turnbar {
    return this.battleEntity.getTurnbar()
  }

  getSprite(): SpriteWrapper {
    return this.battleEntity.getSprite()
  }

  getHealthBar(): HealthBar {
    return this.battleEntity.getHealthBar()
  }
  getScaledValue(): number {
    return this.battleEntity.getScaledValue()
  }
  getName(): string {
    return this.battleEntity.getName()
  }
  isStunned(): boolean {
    return this.battleEntity.isStunned()
  }
}