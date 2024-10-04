import AnimationsHandler from "../../Animations/AnimationsHandler";
import Battle from "../../Battle";
import IBattleEntity from "../../Entity/IBattleEntity";
import SpriteWrapper from "../../Animations/SpriteWrapper";
import ISkillAnimation from "./ISkillAnimation";

export default class CastProjectile implements ISkillAnimation {
  projectileStartType: string
  isAoe: boolean

  constructor(projectileStartType: string, isAoe: boolean) {
    this.projectileStartType = projectileStartType
    this.isAoe = isAoe
  }

  async play(animationHandler: AnimationsHandler, battle: Battle, animation: string,  casterEntity: IBattleEntity,
    targetEntity: IBattleEntity, damageDict: {[key: number]: {value: number}},
    healDict: {[key: number]: {value: number}}, statusDict: {[key: number]: Array<{name: string, duration: number}>},
    buffsDict: {[key: number]: Array<{name: string, duration: number}>}, deathArray: Array<number>, xOffsetPercent: number): Promise<void> {
    
    await animationHandler.waitAndPlayAnim(casterEntity, animation)
    if(!this.isAoe) {
      if(this.projectileStartType === "caster") {
        await animationHandler.createPlayAndWaitProjectile(
          targetEntity, casterEntity,
          {x: casterEntity.getSprite().getPlaceholderX(), y: casterEntity.getSprite().getCenterY()},
          {x: targetEntity.getSprite().getCenterX(), y: targetEntity.getSprite().getCenterY()},
          animation)
      }
      else if(this.projectileStartType === "sky") {
        await animationHandler.createPlayAndWaitProjectile(targetEntity, casterEntity,
          {x: casterEntity.getSprite().getPlaceholderX(), y: 0},
          {x: targetEntity.getSprite().getCenterX(), y: targetEntity.getSprite().getCenterY()},
          animation)
      }
    }
    else {
      let entities = battle.getAlliesOf(targetEntity.getIndex())
      let x = 0
      let y = 0
      entities.forEach(entity => {
        x += entity.getSprite().x
        y += entity.getSprite().y
      });
      x = x / entities.length
      y = y / entities.length

      if(this.projectileStartType === "sky") {
        await animationHandler.createPlayAndWaitProjectile(targetEntity, casterEntity, {x: casterEntity.getSprite().getPlaceholderX(), y: 0}, {x: x, y: y}, animation)
      }
    }

    battle.applyDamages(damageDict)
    battle.applyHeals(healDict)
    battle.applyBuffsAndStatus(buffsDict, statusDict)
    battle.updateHealths()
    battle.applyDeaths(deathArray)
    await animationHandler.waitAndIdle(casterEntity)
  }
}
