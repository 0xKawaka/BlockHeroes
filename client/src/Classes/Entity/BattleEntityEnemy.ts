import StatsModifier from "../Statistic/StatsModifier";
import Entity from "./Entity";
import Turnbar from "./Turnbar";
import IBattleEntity from "./IBattleEntity";
import HealthBar from "./HealthBar";
import Battle from "../Battle";
import SpriteWrapper from "../Animations/SpriteWrapper";
import AnimationsHandler from "../Animations/AnimationsHandler";
import { StartTurnEvent } from "../../Blockchain/event/eventTypes";
import TargetBar from "./TargetBar";

export default class BattleEntityEnemy implements IBattleEntity {
  battleEntity: IBattleEntity

  constructor(battleEntity: IBattleEntity) {
    this.battleEntity = battleEntity
    this.battleEntity.getSprite().setFlipX(true)
  }

  async playTurn(battle: Battle, startTurnEvent:StartTurnEvent, animationsHandler: AnimationsHandler): Promise<void> {
    console.log("Entity enemy ", this.getIndex(), ' playing')
    await this.battleEntity.playTurn(battle, startTurnEvent, animationsHandler)
    console.log('health: ', this.getCurrentHealth())
    if(!this.battleEntity.isDead() && !this.battleEntity.isStunned()) {
      battle.processNextSkill(this.battleEntity.getIndex())
    }
    else if (this.battleEntity.isStunned()) {
      battle.updateEndTurnInCaseOfStun()
      this.endTurn()
      battle.isTurnPlaying = false
    }
    else {
      console.log('Enemy dead OnTurnProcs')
      this.endTurn()
      battle.isTurnPlaying = false
    }
  }

  async waitDamageAndHealAnimsDone(): Promise<void> {
    await this.battleEntity.waitDamageAndHealAnimsDone()
  }

  async playAnim(animationName: string): Promise<void> {
    this.battleEntity.playAnim(animationName)
  }
  // playHurtThenIdle(animationHandler: AnimationsHandler): void {
  //   this.battleEntity.playHurtThenIdle(animationHandler)
  // }

  endTurn(): void {
    this.battleEntity.endTurn()
  }

  endSkillSelection() {}
  
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

  selectSkill(name: string): void {
  }
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
    return this.battleEntity.getSprite().getPlaceholderX() - this.battleEntity.getSprite().getWidth() / 1.4
  }
  getFrontEntityXWithOffset(offset: number): number {
    return this.getFrontEntityX() - offset
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
  setOnCooldown(name: string): void {
    this.battleEntity.setOnCooldown(name)
  }
  setTargetable(value: boolean): void {
    this.battleEntity.setTargetable(value)
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
  getTargetBar(): TargetBar {
    return this.battleEntity.getTargetBar()
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