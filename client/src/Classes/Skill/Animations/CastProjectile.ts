import AnimationsHandler from "../../Animations/AnimationsHandler";
import Battle from "../../Battle";
import IBattleEntity from "../../Entity/IBattleEntity";
import SpriteWrapper from "../../Animations/SpriteWrapper";
import ISkillAnimation from "./ISkillAnimation";

export default class CastProjectile implements ISkillAnimation {
  constructor() {}
  async play(animationHandler: AnimationsHandler, battle: Battle, animation: string,  casterEntity: IBattleEntity,
    targetEntity: IBattleEntity, damageDict: {[key: number]: {value: number}},
    healDict: {[key: number]: {value: number}}, statusDict: {[key: number]: Array<{name: string, duration: number}>},
    buffsDict: {[key: number]: Array<{name: string, duration: number}>}, deathArray: Array<number>, xOffsetPercent: number): Promise<void> {
    
    await animationHandler.waitAndPlayAnim(casterEntity, animation)
    await animationHandler.createPlayAndWaitProjectile(targetEntity, casterEntity, animation)

    battle.applyDamages(damageDict)
    battle.applyHeals(healDict)
    battle.applyBuffsAndStatus(buffsDict, statusDict)
    battle.updateHealths()
    battle.applyDeaths(deathArray)
    await animationHandler.waitAndIdle(casterEntity)
  }
}
