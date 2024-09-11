// import Battle from "../../Battle";
// import IBattleEntity from "../../Entity/IBattleEntity";

import AnimationsHandler from "../../Animations/AnimationsHandler";
import Battle from "../../Battle";
import IBattleEntity from "../../Entity/IBattleEntity";

export default interface ISkillAnimation {

  play(animationHandler: AnimationsHandler, battle: Battle, animation: string, casterEntity: IBattleEntity,
    targetEntity: IBattleEntity, damageDict: {[key: number]: {value: number}},
    healDict: {[key: number]: {value: number}}, statusDict: {[key: number]: Array<{name: string, duration: number}>},
    buffsDict: {[key: number]: Array<{name: string, duration: number}>}, deathArray: Array<number>): void
}