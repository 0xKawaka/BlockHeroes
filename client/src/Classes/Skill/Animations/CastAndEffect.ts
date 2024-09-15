import AnimationsHandler from "../../Animations/AnimationsHandler";
import Battle from "../../Battle";
import IBattleEntity from "../../Entity/IBattleEntity";
import { spellAnimDict } from "../../../GameDatas/Skills/skills";
import ISkillAnimation from "./ISkillAnimation";

export default class CastAndEffect implements ISkillAnimation {
  targetEffect: String;
  constructor(targetEffect: String) {
    this.targetEffect = targetEffect;
  }
  async play(animationHandler: AnimationsHandler, battle: Battle, animation: string,  casterEntity: IBattleEntity,
    targetEntity: IBattleEntity, damageDict: {[key: number]: {value: number}},
    healDict: {[key: number]: {value: number}}, statusDict: {[key: number]: Array<{name: string, duration: number}>},
    buffsDict: {[key: number]: Array<{name: string, duration: number}>}, deathArray: Array<number>, xOffsetPercent: number): Promise<void> {
    
    await animationHandler.waitAndPlayAnim(casterEntity, animation)
    if(this.targetEffect === "AOE") {
      let allies = battle.getAlliesOf(targetEntity.getIndex())
      for (let ally of allies) {
        animationHandler.playSpellEffectOnEntity(ally,
          spellAnimDict[animation + casterEntity.getName()].name,
          spellAnimDict[animation + casterEntity.getName()].framerate,
        )
      }
    }
    if(this.targetEffect === "trueAOE") {
      let allies = battle.getAlliesOf(targetEntity.getIndex())
      animationHandler.playSpellEffectOnEntitiesCenter(allies,
        spellAnimDict[animation + casterEntity.getName()].name,
        spellAnimDict[animation + casterEntity.getName()].framerate,
      )
    }
    else if(this.targetEffect === "Self") {
      animationHandler.playSpellEffectOnEntity(casterEntity,
        spellAnimDict[animation + casterEntity.getName()].name,
        spellAnimDict[animation + casterEntity.getName()].framerate,
      )
    }
    else if(this.targetEffect === "Target") {
      animationHandler.playSpellEffectOnEntity(targetEntity,
        spellAnimDict[animation + casterEntity.getName()].name,
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
