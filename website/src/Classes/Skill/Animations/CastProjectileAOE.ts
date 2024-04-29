import AnimationsHandler from "../../Animations/AnimationsHandler";
import Battle from "../../Battle";
import IBattleEntity from "../../Entity/IBattleEntity";
import { projectilesDict } from "../../../GameDatas/Skills/skills";
import { spellAnimDict } from "../../../GameDatas/Skills/skills";
import SpriteWrapper from "../../Animations/SpriteWrapper";
import ISkillAnimation from "./ISkillAnimation";

export default class CastProjectileAOE implements ISkillAnimation {
  constructor() {}
  async play(animationHandler: AnimationsHandler, battle: Battle, animation: string,  casterEntity: IBattleEntity,
    targetEntity: IBattleEntity, damageDict: {[key: number]: {value: number}},
    healDict: {[key: number]: {value: number}}, statusDict: {[key: number]: Array<{name: string, duration: number}>},
    buffsDict: {[key: number]: Array<{name: string, duration: number}>}, deathArray: Array<number>): Promise<void> {
    
    await animationHandler.waitAndPlayAnim(casterEntity, animation)
    let allies = battle.getAlliesOf(targetEntity.getIndex())
    for (let ally of allies) {
      animationHandler.playSpellEffectOnEntity(ally,
        spellAnimDict[animation + casterEntity.getName()].name,
        battle.scaler.getScaleFactor(),
        spellAnimDict[animation + casterEntity.getName()].framerate,
      )
    }

    battle.applyDamages(damageDict)
    battle.applyHeals(healDict)
    battle.applyBuffsAndStatus(buffsDict, statusDict)
    battle.updateHealths()
    battle.applyDeaths(deathArray)
    await animationHandler.waitAndIdle(casterEntity)
  }
}
