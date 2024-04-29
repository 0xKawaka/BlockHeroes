import AnimationsHandler from "../../Animations/AnimationsHandler";
import Battle from "../../Battle";
import IBattleEntity from "../../Entity/IBattleEntity";
import ISkillAnimation from "./ISkillAnimation";

export default class MoveAndCast implements ISkillAnimation {
  moveType: string;
  returnMoveType: string;

  constructor(moveType: string, returnMoveType: string){
    this.moveType = moveType
    this.returnMoveType = returnMoveType
  }
  // this, battle, skill, casterEntity, targetEntity, damageDict, healDict, statusDict, buffsDict, deathArray
  async play(animationHandler: AnimationsHandler, battle: Battle, animation: string,  casterEntity: IBattleEntity,
    targetEntity: IBattleEntity, damageDict: {[key: number]: {value: number}},
    healDict: {[key: number]: {value: number}}, statusDict: {[key: number]: Array<{name: string, duration: number}>},
    buffsDict: {[key: number]: Array<{name: string, duration: number}>}, deathArray: Array<number>): Promise<void> {
    let casterSprite = casterEntity.getSprite()
    let targetSprite = targetEntity.getSprite()
    const startX = casterSprite.getPlaceholderX()
    const startY = casterSprite.getPlaceholderY()
    await animationHandler.waitAndPlayAnim(casterEntity, this.moveType)
    await animationHandler.moveObjectToPosition(casterSprite, targetEntity.getFrontEntityX(), targetSprite.getPlaceholderY(), 650)
    await animationHandler.playAnim(casterEntity, animation)
    // await animationHandler.waitForOtherAnimationsToFinish(casterEntity)
    await animationHandler.waitForHalfAnimation(casterEntity)
    battle.applyDamages(damageDict)
    battle.applyHeals(healDict)
    battle.applyBuffsAndStatus(buffsDict, statusDict)
    battle.updateHealths()
    battle.applyDeaths(deathArray)
    // console.log("caster attacking : ",animationHandler.getAttackAnimationValue(casterEntity.getName(), casterEntity.getIndex()))
    await animationHandler.waitAndPlayAnim(casterEntity, this.returnMoveType)
    await animationHandler.moveObjectToPosition(casterSprite, startX, startY, 650)
    await animationHandler.waitAndIdle(casterEntity)
  }
}
