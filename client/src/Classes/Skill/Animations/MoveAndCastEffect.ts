import AnimationsHandler from "../../Animations/AnimationsHandler";
import Battle from "../../Battle";
import IBattleEntity from "../../Entity/IBattleEntity";
import ISkillAnimation from "./ISkillAnimation";
import SpriteWrapper from "../../Animations/SpriteWrapper";
import { spellAnimDict } from "../../../GameDatas/Skills/skills";

export default class MoveAndCastEffect implements ISkillAnimation {
  moveType: string;
  returnMoveType: string;

  constructor(moveType: string, returnMoveType: string) {
    this.moveType = moveType
    this.returnMoveType = returnMoveType
  }
  
  async play(animationHandler: AnimationsHandler, battle: Battle, animation: string, casterEntity: IBattleEntity,
    targetEntity: IBattleEntity, damageDict: {[key: number]: {value: number}},
    healDict: {[key: number]: {value: number}}, statusDict: {[key: number]: Array<{name: string, duration: number}>},
    buffsDict: {[key: number]: Array<{name: string, duration: number}>}, deathArray: Array<number>, xOffsetPercent: number): Promise<void> {
    let casterSprite = casterEntity.getSprite()
    let targetSprite = targetEntity.getSprite()
    const startX = casterSprite.getPlaceholderX()
    const startY = casterSprite.getPlaceholderY()
    let xOffset = casterSprite.getWidth() * xOffsetPercent
    let destination = {x: targetEntity.getFrontEntityXWithOffset(xOffset), y: targetSprite.getPlaceholderY()}
    let travelTime = battle.gameSpeedHelper.computeEntityTravelTime({x: casterSprite.getPlaceholderX(), y: casterSprite.getPlaceholderY()}, destination)

    if(this.moveType === "jumpLoop") {
      await this.playJumpLoopUntilDestination(animationHandler, casterEntity, casterSprite, destination, travelTime)
    }
    else {
      await animationHandler.waitAndPlayAnim(casterEntity, this.moveType)
      await animationHandler.moveObjectToPosition(casterSprite, destination.x, destination.y, travelTime)
    }

    await animationHandler.playAnim(casterEntity, animation)

    // await animationHandler.waitForOtherAnimationsToFinish(casterEntity)
    console.log("waitForSpecificFrameNumber")
    await animationHandler.waitForSpecificFrameNumber(casterEntity, spellAnimDict[animation + casterEntity.getName()].frameToCast)
    console.log("waitForSpecificFrameNumber")

    animationHandler.playSpellEffectOnEntity(targetEntity,
      spellAnimDict[animation + casterEntity.getName()].name,
      spellAnimDict[animation + casterEntity.getName()].framerate,
    )
    // await animationHandler.waitForHalfAnimation(casterEntity)
    battle.applyDamages(damageDict)
    battle.applyHeals(healDict)
    battle.applyBuffsAndStatus(buffsDict, statusDict)
    battle.updateHealths()
    battle.applyDeaths(deathArray)
    // console.log("caster attacking : ",animationHandler.getAttackAnimationValue(casterEntity.getName(), casterEntity.getIndex()))
    
    if(this.returnMoveType === "jumpLoop") {
      await this.playJumpLoopUntilDestination(animationHandler, casterEntity, casterSprite, {x: startX, y: startY}, travelTime)
    }
    else {
      await animationHandler.waitAndPlayAnim(casterEntity, this.returnMoveType)
      await animationHandler.moveObjectToPosition(casterSprite, startX, startY, travelTime)
    }
    await animationHandler.waitAndIdle(casterEntity)
  }

  async playJumpLoopUntilDestination(animationHandler: AnimationsHandler, casterEntity: IBattleEntity, casterSprite: SpriteWrapper, destination: {x: number, y:number}, travelTime: number) {
    await animationHandler.waitAndPlayAnim(casterEntity, "jumpStart")
    let moveToPositionPromise = animationHandler.moveObjectToPosition(casterSprite, destination.x, destination.y, travelTime)
    await animationHandler.waitAndPlayNonBlockingAnim(casterEntity, "jumpLoop")
    await moveToPositionPromise
    await animationHandler.playAnim(casterEntity, "jumpEnd")
  }
}
