import StatsModifier from "../Statistic/StatsModifier";
import Entity from "./Entity";
import Turnbar from "./Turnbar";
import IBattleEntity from "./IBattleEntity";
import HealthBar from "./HealthBar";
import Battle from "../Battle";
import BattleScene from "../../Scenes/BattleScene";
import { buffsDebuffsStats, onTurnStackableBuffNames, onTurnStackableStatusNames } from "../../GameDatas/Skills/buffsStatus";
import BuffDisplay from "./BuffDisplay";
import StackableBuff from "./StackableBuff";
import SpriteWrapper from "../Animations/SpriteWrapper";
import AnimationsHandler from "../Animations/AnimationsHandler";
import BitmapTextAnim from "../Animations/BitmapTextAnim";
import BarHandler from "../BarHandler";
import { StartTurnEvent } from "../../Blockchain/event/eventTypes";
import TargetBar from "./TargetBar";

export default class BattleEntity implements IBattleEntity {
  Entity: Entity
  index: number
  position: {x: number, y: number}
  battleSpeed: number
  statusArray: Array<StatsModifier>
  buffsArray: Array<StatsModifier>
  stackableBuffsDict: {[key: string]: StackableBuff}
  stackableStatusDict: {[key: string]: StackableBuff}
  buffsByName: {[key: string]: BuffDisplay}
  statusByName: {[key: string]: BuffDisplay}
  currentHealth: number
  turnbar: Turnbar
  sprite: SpriteWrapper
  healthBar: HealthBar
  targetBar: TargetBar
  displayTurnBar: HealthBar
  outlineBarHorizontal:  BarHandler
  outlineBarVertical:  BarHandler
  stunned: boolean
  scaleValue: number
  buffStatusScale: number
  textScaleValue: number
  upscale: number
  countVisible: number
  processDamageAndHealAnimsQueuePromiseArray: Array<Promise<void>>
  isTargetable: boolean

  constructor(Entity:Entity, index: number, alliesCount: number, enemiesCount: number, statusArray: Array<StatsModifier>, buffsArray: Array<StatsModifier>, battleScene: BattleScene, isAlly: boolean, animationIndexes:{[key: string]:{start:number, end:number}}, spriteWidth: number, spriteHeight: number, upscale:number) {
    this.countVisible = 0
    this.stunned = false
    this.Entity = Entity
    this.index = index
    this.battleSpeed = Entity.statistics.speed
    this.statusArray = statusArray
    this.buffsArray = buffsArray
    this.stackableBuffsDict = {}
    this.stackableStatusDict = {}
    this.processDamageAndHealAnimsQueuePromiseArray = []
    this.currentHealth = Entity.statistics.health
    this.scaleValue = battleScene.battle.scaler.getEntitiesScaleFactor()
    this.buffStatusScale = battleScene.battle.scaler.getBuffStatusScaleFactor()
    this.textScaleValue = this.scaleValue
    this.upscale = upscale
    this.position = battleScene.battle.positionner.getEntityPosition(index, alliesCount, enemiesCount, isAlly)
    // console.log("Position for entity ", index, " is ", this.position)
    this.sprite = this.createSprite(battleScene, animationIndexes)
    this.turnbar = new Turnbar(index, this.battleSpeed)
    // this.createTurnAndHealthBars(battleScene)
    // this.createHealthBar(battleScene)
    // this.createTurnBar(battleScene)
    // this.createOutlineBars(battleScene)
    this.createBars(battleScene)
    this.initBuffsDebuffsByName(battleScene)
    this.isTargetable = false
  }

  updateHealth(): void {
    if(this.currentHealth <= 0) {
      this.currentHealth = 0
    }
    else if(this.currentHealth > this.Entity.statistics.health) {
      this.currentHealth = this.Entity.statistics.health
    }
    this.healthBar.setBarPercentageValue(this.currentHealth / this.Entity.statistics.health)
  }

  applyDamage(value: number): void {
    // console.log("Health : ", this.currentHealth, " - ", value)
    this.currentHealth -= value
  }
  applyHeal(value: number): void {
    this.currentHealth += value
  }

  playDamageAnim(isCrit: boolean, value: number, battleScene: Phaser.Scene, animationHandler: AnimationsHandler): void {
    animationHandler.playAnimIfNoneRuning(this, "hurt").then(() => {
      animationHandler.waitAndIdle(this)
    })
    // let fontSize = Math.floor(this.sprite.getHeight() / 3);
    let textAnim = isCrit ? "CRIT " + (~~value).toString() : (~~value).toString()
    let distanceTravel = this.sprite.getHeight() / 1.57
    // new TextAnim(battleScene, distanceTravel, this.position.x, this.position.y - this.sprite.getHeight() / 2, textAnim, { font: fontSize + "px Sans-serif"}, 0xff0000)
    // new BitmapTextAnim(battleScene, distanceTravel, this.scaleValue, this.position.x, this.position.y - this.sprite.getHeight() / 7, textAnim, "Kenney", 0xff0000).setScale(this.textScaleValue)
    new BitmapTextAnim(battleScene, distanceTravel, this.scaleValue, this.position.x, this.position.y - this.sprite.getHeight() / 7, textAnim, "Kenney", 0xff0000)
  }

  playDamageAnimWithoutHurt(isCrit: boolean, value: number, battleScene: Phaser.Scene, animationHandler: AnimationsHandler): void {
    // let fontSize = Math.floor(this.sprite.getHeight() / 3);
    let textAnim = isCrit ? "CRIT " + (~~value).toString() : (~~value).toString()
    let distanceTravel = this.sprite.getHeight() / 1.57
    // new TextAnim(battleScene, distanceTravel, this.position.x, this.position.y - this.sprite.getHeight() / 2, textAnim, { font: fontSize + "px Sans-serif"}, 0xff0000)
    // new BitmapTextAnim(battleScene, distanceTravel, this.scaleValue, this.position.x, this.position.y - this.sprite.getHeight() / 7, textAnim, "Kenney", 0xff0000).setScale(this.textScaleValue)
    new BitmapTextAnim(battleScene, distanceTravel, this.scaleValue, this.position.x, this.position.y - this.sprite.getHeight() / 7, textAnim, "Kenney", 0xff0000)
  }

  playHealAnim(value: number, battleScene: Phaser.Scene): void {
    // let fontSize = Math.floor(this.sprite.getHeight() / 2.6);
    let distanceTravel = this.sprite.getHeight() / 1.57
    // new TextAnim(battleScene, distanceTravel, this.position.x, this.position.y - this.sprite.getHeight() / 2, (~~value).toString(), { font: fontSize + "px Sans-serif"}, 0x07f100)
    // new BitmapTextAnim(battleScene, distanceTravel, this.scaleValue, this.position.x, this.position.y - this.sprite.getHeight() / 7, (~~value).toString(), "Kenney", 0x07f100).setScale(this.textScaleValue)
    new BitmapTextAnim(battleScene, distanceTravel, this.scaleValue, this.position.x, this.position.y - this.sprite.getHeight() / 7, (~~value).toString(), "Kenney", 0x07f100)
  }

  applyDamageAndPlayAnim(isCrit: boolean, value: number, battleScene: Phaser.Scene, animationHandler: AnimationsHandler): void {
    this.applyDamage(value)
    this.playDamageAnim(isCrit, value, battleScene, animationHandler)
  }

  applyHealAndPlayAnim(value: number, battleScene: Phaser.Scene): void {
    this.applyHeal(value)
    this.playHealAnim(value, battleScene)
  }

  applyBuffsAndStatus(buffs: Array<{name: string, duration: number}>, status: Array<{name: string, duration: number}>, battleScene: BattleScene): void {
    this.resetBuffsAndStatus()

    if(buffs.length === 0 && status.length === 0)
      return;

    const scale = this.buffStatusScale
    // const positions = battleScene.battle.positionner.getBuffStatusPosition(this.healthBar.backgroundBar.bar.x, this.healthBar.backgroundBar.bar.y, this.healthBar.backgroundBar.width, this.healthBar.backgroundBar.height, buffs.length, status.length, scale)
    // const positions = battleScene.battle.positionner.getBuffStatusPosition(this.healthBar.getX(), this.healthBar.getY(), this.healthBar.getWidth(), this.healthBar.getHeight(), buffs.length, status.length, scale)
    const positions = battleScene.battle.positionner.getBuffStatusPosition(battleScene.cameras.main, this.outlineBarHorizontal.bar.x, this.outlineBarVertical.bar.y, this.outlineBarHorizontal.width, this.outlineBarVertical.height, buffs.length, status.length, scale)

    for(let i = 0; i < buffs.length; i++) {
      if(buffsDebuffsStats.includes(buffs[i].name)) {
        this.displayBuff(this.buffsByName[buffs[i].name], positions[i], buffs[i].duration, battleScene)
      }
      else if (onTurnStackableBuffNames.includes(buffs[i].name)) {
        this.stackableBuffsDict[buffs[i].name].createOrSetBuff(positions[i], buffs[i].duration, battleScene)
      }
      
    }
    for(let i = 0; i < status.length; i++) {
      if(buffsDebuffsStats.includes(status[i].name)) {
        this.displayBuff(this.statusByName[status[i].name], positions[buffs.length + i], status[i].duration, battleScene)
      }
      else if (onTurnStackableStatusNames.includes(status[i].name)) {
        this.stackableStatusDict[status[i].name].createOrSetBuff(positions[buffs.length + i], status[i].duration, battleScene)
      }
      else if (status[i].name === "stun") {
        this.stunned = true
        // console.log("Display Stunned")
        if(status[i].duration != 0)
          this.displayBuff(this.statusByName[status[i].name], positions[buffs.length + i], status[i].duration, battleScene)
      }
    }
    if(this.isDead())
      this.resetBuffsAndStatus()
  }
  displayBuff(buff: BuffDisplay, position:{image: {x: number, y: number}, text: {x: number, y: number}}, duration: number, battleScene: BattleScene): void {
    buff.setDurationText(duration)
    buff.setVisible(true)
    buff.setXImage(position.image.x)
    buff.setYImage(position.image.y)
    buff.setXText(position.text.x)
    buff.setYText(position.text.y)
  }
  resetBuffsAndStatus(): void {
    for(let key in this.buffsByName) {
      this.buffsByName[key].setVisible(false)
    }
    for(let key in this.statusByName) {
      this.statusByName[key].setVisible(false)
    }
    for(let i = 0; i < onTurnStackableBuffNames.length; i++) {
      this.stackableBuffsDict[onTurnStackableBuffNames[i]].reset()
    }
    for(let i = 0; i < onTurnStackableStatusNames.length; i++) {
      this.stackableStatusDict[onTurnStackableStatusNames[i]].reset()
    }
  }

  die(battle: Battle, battleScene: Phaser.Scene, animationsHandler: AnimationsHandler): void {
    let index = battle.findEntityPositionByIndex(this.getIndex())
    if(index === -1)
      return;
    animationsHandler.playAnim(this, "die")
    this.healthBar.hideBar()
    this.displayTurnBar.hideBar()
    this.outlineBarHorizontal.hideBar()
    this.outlineBarVertical.hideBar()
    console.log('Entity ' + this.getIndex() + ' died!')
    // this.sprite.visible = false
    this.resetBuffsAndStatus()
    this.sprite.setDepth(0)
    // this.sprite.update()
    battle.deadEntities.push(battle.battleEntities.splice(index, 1)[0])
    battle.removeEntityTurnbar(this.getIndex())
    if(battle.alliesIndexes.includes(this.getIndex())){
      battle.alliesIndexes.splice(battle.alliesIndexes.indexOf(this.getIndex()), 1)
    }
    else if(battle.enemiesIndexes.includes(this.getIndex())){
      battle.enemiesIndexes.splice(battle.enemiesIndexes.indexOf(this.getIndex()), 1)
    }
  }

  isDead(): boolean {
    return this.currentHealth <= 0
  }

  initBuffsDebuffsByName(battleScene: BattleScene) {
    this.buffsByName = {}
    this.statusByName = {}
    const textScale = battleScene.battle.scaler.getTextBuffStatusScaleFactor()
    const scale = this.buffStatusScale
    for(let i = 0; i < buffsDebuffsStats.length; i++) {
      this.buffsByName[buffsDebuffsStats[i]] = new BuffDisplay("buff_" + buffsDebuffsStats[i], battleScene, scale, textScale)
      this.statusByName[buffsDebuffsStats[i]] = new BuffDisplay("status_" + buffsDebuffsStats[i], battleScene, scale, textScale)
    }
    for(let i = 0; i < onTurnStackableBuffNames.length; i++) {
      this.stackableBuffsDict[onTurnStackableBuffNames[i]] = new StackableBuff(onTurnStackableBuffNames[i], scale, textScale)
    }
    for(let i = 0; i < onTurnStackableStatusNames.length; i++) {
      this.stackableStatusDict[onTurnStackableStatusNames[i]] = new StackableBuff(onTurnStackableStatusNames[i], scale, textScale)
    }
    this.statusByName["stun"] = new BuffDisplay("status_stun", battleScene, scale, textScale)
  }

  createSprite(battleScene: BattleScene, animationIndexes: {[key: string]:{start:number, end:number}}): SpriteWrapper {
    let sprite = new SpriteWrapper(battleScene, this.position.x, this.position.y, this.Entity.name, this.scaleValue, this.upscale, this.index)
    
    // battleScene.anims.create({key: this.Entity.name + this.index, frames: battleScene.anims.generateFrameNumbers(this.Entity.name), frameRate:20, repeat:-1})
    for (let animationName in animationIndexes) {
      if(animationName === "idle" || animationName === "jumpLoop")
        this.createAnim(battleScene, this.index , this.Entity.name, animationName, -1, animationIndexes[animationName], 20)
      else 
        this.createAnim(battleScene, this.index , this.Entity.name, animationName, 0, animationIndexes[animationName], battleScene.battle.gameSpeedHelper.computeFrameRateEntity(this.Entity.name, animationName))
    }
    sprite.play(this.Entity.name + this.index + 'idle')
    return sprite
  }
  createAnim(battleScene: BattleScene, entityIndex: number, entityName:string, animationName: string, repeat: number, startEnd: {start: number, end: number}, framerate: number): void {
    battleScene.anims.create({
      key: entityName + entityIndex + animationName,
      frames: battleScene.anims.generateFrameNumbers(entityName, {start:startEnd.start, end:startEnd.end}),
      frameRate: framerate,
      repeat: repeat
    });
  }

  playAnim(animationName: string): void {
    console.log("Playing anim " + this.Entity.name + this.index + animationName)
    this.sprite.play(this.Entity.name + this.index + animationName)
  }
  // async playHurtThenIdle(animationHandler: AnimationsHandler): Promise<void> {
  //   await animationHandler.playHurtThenIdle(this)
  // }

  // TODO : change speed after turn in case of buff fading
  async playTurn(battle: Battle, startTurnEvent: StartTurnEvent, animationsHandler: AnimationsHandler): Promise<void> {
    this.sprite.setDepth(3)
    let damageAndHealAnimQueue: Array<{isDamageOrHeal:string, isCrit: boolean, value: number, battleScene: Phaser.Scene, animationHandler: AnimationsHandler}> = []
    if(this.index != startTurnEvent.entityId)
      throw new Error('StartTurn wrong entity index, received : ' + startTurnEvent.entityId + ' expected : ' + this.index)
    this.stunned = false
    // this.setBattleSpeed(onTurnProcs.speed)
    for(let i= 0; i < startTurnEvent.heals.length; i++) {
      damageAndHealAnimQueue.push({isDamageOrHeal:"heal", isCrit: false, value: startTurnEvent.heals[i], battleScene: battle.battleScene, animationHandler: animationsHandler})
      this.applyHeal(startTurnEvent.heals[i])
    }
    for(let i= 0; i < startTurnEvent.damages.length; i++) {
      damageAndHealAnimQueue.push({isDamageOrHeal:"damage", isCrit: false, value: startTurnEvent.damages[i], battleScene: battle.battleScene, animationHandler: animationsHandler})
      this.applyDamage(startTurnEvent.damages[i])
    }
    this.processDamageAndHealAnimsQueuePromiseArray.push(this.processDamageAndHealAnimsQueue(damageAndHealAnimQueue))
    this.updateHealth()
    if(startTurnEvent.isDead) {
      this.die(battle.battleScene.battle, battle.battleScene, animationsHandler)
      // return;
    }
    else {
      this.applyBuffsAndStatus(startTurnEvent.buffs, startTurnEvent.status, battle.battleScene)
    }
    this.sprite.setDepth(2)
  }
  async waitDamageAndHealAnimsDone(): Promise<void> {
    console.log("waitDamageAndHealAnimsDone")
    await Promise.all(this.processDamageAndHealAnimsQueuePromiseArray)
  }

  async processDamageAndHealAnimsQueue(damageAndHealAnimQueue: Array<{isDamageOrHeal:string, isCrit: boolean, value: number, battleScene: Phaser.Scene, animationHandler: AnimationsHandler}>): Promise<void> {
    for(let i = 0; i < damageAndHealAnimQueue.length; i++) {
      if(damageAndHealAnimQueue[i].isDamageOrHeal === "damage"){
        this.playDamageAnimWithoutHurt(damageAndHealAnimQueue[i].isCrit, damageAndHealAnimQueue[i].value, damageAndHealAnimQueue[i].battleScene, damageAndHealAnimQueue[i].animationHandler)
      }
      else if(damageAndHealAnimQueue[i].isDamageOrHeal === "heal")
        this.playHealAnim(damageAndHealAnimQueue[i].value, damageAndHealAnimQueue[i].battleScene)
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  endTurn() {
    this.turnbar.resetTurn()
  }
  updateDisplayTurnBar(turnbarValue: number): void {
    if(turnbarValue > 999)
      this.displayTurnBar.setBarPercentageValue(1)
    else
      this.displayTurnBar.setBarPercentageValue(turnbarValue/999)
  }

  createBars(battleScene: BattleScene): void {
    let turnBarWidth = this.sprite.getWidth() * 0.85
    let turnbarHeight = this.sprite.getHeight() * 0.035
    let turnBarX = this.sprite.getPlaceholderX() - this.sprite.getWidth() * 0.9  / 2
    let turnBarY = this.sprite.getPlaceholderY() - this.sprite.getHeight() - turnbarHeight

    // const turnHealthGap = 2 * this.scaleValue
    const turnHealthGap = 2

    let healthWidth = this.sprite.getWidth() * 0.85
    let healthHeight = this.sprite.getHeight() * 0.115
    let healthX = this.sprite.getPlaceholderX() - this.sprite.getWidth() * 0.9 / 2
    let healthY = this.sprite.getPlaceholderY() - this.sprite.getHeight() - healthHeight - turnbarHeight - turnHealthGap

    let horizontalWidth = healthWidth * 1.07
    let horizontalHeight = healthHeight + turnbarHeight + turnHealthGap
    let horizontalX = healthX - (horizontalWidth - healthWidth) / 2
    let verticalWidth = healthWidth
    let verticalHeight = (horizontalHeight) * 1.34
    let verticalY = healthY - (verticalHeight - horizontalHeight) / 2

    this.outlineBarHorizontal = new BarHandler(battleScene, horizontalX, healthY, 0x000000, horizontalWidth, horizontalHeight)
    this.outlineBarVertical = new BarHandler(battleScene, healthX, verticalY, 0x000000, verticalWidth, verticalHeight)

    this.healthBar = new HealthBar(battleScene, healthX, healthY, 0x2ecc71, 0x134924, healthWidth, healthHeight);
    this.displayTurnBar = new HealthBar(battleScene, turnBarX, turnBarY, 0x3498db, 0x1c506d, turnBarWidth, turnbarHeight);

    let targetBarWidth = this.sprite.getWidth() * 0.75
    let targetBarX = this.sprite.getPlaceholderX() - this.sprite.getWidth() / 2 + (this.sprite.getWidth() - targetBarWidth) / 2
    let targetBarY = this.sprite.getPlaceholderY()
    this.targetBar = new TargetBar(battleScene, targetBarX, targetBarY, targetBarWidth, healthHeight * 0.55);
    this.sprite.placeholder.on('pointerover', () => {
      if(this.isTargetable)
        this.targetBar.highlightBar()
    })
    this.sprite.placeholder.on('pointerout', () => {
      if(this.isTargetable)
        this.targetBar.removeHighlightBar()
    })
  }
  // createOutlineBars(battleScene: BattleScene): void {
  //   let horizontalWidth = this.sprite.getWidth() * 0.9 * 1.2
  //   let horizontalHeight = (this.healthBar.getHeight() + this.displayTurnBar.getHeight())
  //   let verticalHeight = (this.healthBar.getHeight() + this.displayTurnBar.getHeight()) * 1.2
  //   let verticalWidth = this.healthBar.getWidth()
  //   let x = this.healthBar.getX()
  //   let y = this.healthBar.getY()
  //   this.outlineBarHorizontal = new BarHandler(battleScene, x, y, 0x000000, horizontalWidth, horizontalHeight)
  //   // this.outlineBarVertical = new BarHandler(battleScene, x, y, 0x000000, verticalWidth, verticalHeight)
  // }
  // createHealthBar(battleScene: BattleScene): void {
  //   let width = this.sprite.getWidth() * 0.9
  //   let height = this.sprite.getHeight() / 7
  //   let x = this.sprite.getPlaceholderX() - this.sprite.getWidth() * 0.9 / 2
  //   let y = this.sprite.getPlaceholderY() - this.sprite.getHeight() - height
  //   this.healthBar = new HealthBar(battleScene, x, y, 0x2ecc71, width, height);
  // }
  // createTurnBar(battleScene: BattleScene): void {
  //   let width = this.sprite.getWidth() * 0.9
  //   let height = this.sprite.getHeight() * 0.03
  //   let x = this.sprite.getPlaceholderX() - this.sprite.getWidth() * 0.9  / 2
  //   let y = this.sprite.getPlaceholderY() - this.sprite.getHeight() - height
  //   this.displayTurnBar = new HealthBar(battleScene, x, y, 0x3498db, width, height);
  // }
  selectSkill() {}
  endSkillSelection() {}
  // getSkillAnim(skillName: string): ISkillAnimation {
  //   return this.Entity.getSkillAnim(skillName)
  // }
  setOutlineBarsColor(color: number, alpha: number): void {
    this.outlineBarHorizontal.setColor(color, alpha)
    this.outlineBarVertical.setColor(color, alpha)
  }
  setTargetable(isTargetable: boolean): void {
    this.isTargetable = isTargetable
    if(isTargetable)
      this.targetBar.showBar()
    else
      this.targetBar.hideBar()
  }
  getFrontEntityX(): number {
    throw new Error("Method getFrontEntityX not implemented.");
  }
  getFrontEntityXWithOffset(offset: number): number {
    throw new Error("Method getFrontEntityXWithOffset not implemented.");
  }
  getEntity(): Entity {
    return this.Entity
  }
  getIndex(): number {
    return this.index
  }
  getBattleSpeed(): number {
    return this.battleSpeed
  }
  setBattleSpeed(value: number): void {
    this.battleSpeed = value
  }
  setOnCooldown(name: string): void {
    throw new Error("Method setOnCooldown not implemented.");
  }
  getSkillIndexByName(name: string): number {
    return this.Entity.getSkillIndexByName(name)
  }
  getPosition(): {x: number, y: number} {
    return this.position
  }
  getStatusArray(): Array<StatsModifier> {
    return this.statusArray
  }
  getBuffsArray(): Array<StatsModifier> {
    return this.buffsArray
  }
  getCurrentHealth(): number {
    return this.currentHealth
  }
  getTurnbar(): Turnbar {
    return this.turnbar
  }
  getSprite(): SpriteWrapper {
    return this.sprite
  }
  getHealthBar(): HealthBar {
    return this.healthBar
  }
  getTargetBar(): TargetBar {
    return this.targetBar
  }
  getScaledValue(): number {
    return this.scaleValue
  }
  getName(): string {
    return this.Entity.name
  }
  isStunned(): boolean {
    return this.stunned
  }
}