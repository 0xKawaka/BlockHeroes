import ISkillAnimation from "../../Classes/Skill/Animations/ISkillAnimation"
import MoveAndCastEffect from "../../Classes/Skill/Animations/MoveAndCastEffect"
import MoveAndCast from "../../Classes/Skill/Animations/MoveAndCast"
import Cast from "../../Classes/Skill/Animations/Cast"
import CastProjectile from "../../Classes/Skill/Animations/CastProjectile"
import CastAndEffect from "../../Classes/Skill/Animations/CastAndEffect"
import SkillAnimationWrapper from "./SkillAnimationWrapper"

const runInRunOutAndCast = new MoveAndCast("run", "run")
const runInJumpOutAndCast = new MoveAndCast("run", "jump")
const runInJumpLoopOutAndCast = new MoveAndCast("run", "jumpLoop")
const jumpInJumpOutAndCast = new MoveAndCast("jump", "jump")
const chargeInJumpOutAndCast = new MoveAndCast("charge", "jump")
const runInJumpLoopOutAndCastEffect = new MoveAndCastEffect("run", "jumpLoop")
const cast = new Cast()
const castProjectile = new CastProjectile()
const castEffectAOE = new CastAndEffect("AOE")
const castEffectSelf = new CastAndEffect("Self")
const castEffectTarget = new CastAndEffect("Target")
const castTrueAOE = new CastAndEffect("trueAOE")

const skillAnimsDict: {[key: string]: SkillAnimationWrapper} = {
  "Attack Elandor": new SkillAnimationWrapper("attack", jumpInJumpOutAndCast),
  "Attack Marella": new SkillAnimationWrapper("attack", castProjectile),
  "Attack Wellan": new SkillAnimationWrapper("attack", jumpInJumpOutAndCast),
  "Attack Sirocco": new SkillAnimationWrapper("attack", jumpInJumpOutAndCast),
  "Attack Diana": new SkillAnimationWrapper("attack", jumpInJumpOutAndCast),
  "Heal": new SkillAnimationWrapper("skill1", cast),
  "Fire Strike": new SkillAnimationWrapper("skill2", runInRunOutAndCast),
  "Fire Swing": new SkillAnimationWrapper("skill1", jumpInJumpOutAndCast),
  "Sand Strike": new SkillAnimationWrapper("skill1", runInRunOutAndCast),
  "Sandstorm": new SkillAnimationWrapper("skill2", runInRunOutAndCast),
  "Water Heal": new SkillAnimationWrapper("skill1", cast),
  "Water Shield": new SkillAnimationWrapper("skill2", cast),
  "Arrows Rain": new SkillAnimationWrapper("skill2", castEffectAOE),
  "Forest Senses": new SkillAnimationWrapper("skill1", cast),
  "Nature Call": new SkillAnimationWrapper("skill1", castEffectAOE),
  "Wind Pierce": new SkillAnimationWrapper("skill2", runInJumpOutAndCast),
  "Attack Elric": new SkillAnimationWrapper("attack", runInJumpLoopOutAndCast),
  "Holy Bastion": new SkillAnimationWrapper("skill1", castEffectAOE),
  "Divine Hammer": new SkillAnimationWrapper("skill2", runInJumpLoopOutAndCast, 0.8),
  "Attack Nereus": new SkillAnimationWrapper("attack", runInJumpLoopOutAndCast),
  "Tide Strike": new SkillAnimationWrapper("skill1", runInJumpLoopOutAndCast),
  "Wave Slash": new SkillAnimationWrapper("skill2", runInJumpLoopOutAndCastEffect, 0.7),
  "Attack Rex": new SkillAnimationWrapper("attack", runInJumpLoopOutAndCast),
  "Chum Challenge": new SkillAnimationWrapper("skill1", castEffectSelf),
  "Anchor Stomps": new SkillAnimationWrapper("skill2", runInJumpLoopOutAndCast, 0.55),
  "Attack Celeste": new SkillAnimationWrapper("attack", runInJumpLoopOutAndCast),
  "Ice Shatter": new SkillAnimationWrapper("skill1", castTrueAOE),
  "Snow Storm": new SkillAnimationWrapper("skill2", castTrueAOE),
  "Attack Oakheart": new SkillAnimationWrapper("attack", runInJumpLoopOutAndCast, 0.7),
  "Lignum Hammer": new SkillAnimationWrapper("skill1", runInJumpLoopOutAndCast, 0.7),
  "Buloke Wall": new SkillAnimationWrapper("skill2", cast),
  "Attack Sylvara": new SkillAnimationWrapper("attack", castEffectTarget),
  "Silvan Chant": new SkillAnimationWrapper("skill1", castEffectAOE),
  "Astral Beam": new SkillAnimationWrapper("skill2", castEffectTarget),
  "Attack Bane": new SkillAnimationWrapper("attack", castEffectTarget),
  "Raging Fire": new SkillAnimationWrapper("skill1", castEffectTarget),
  "Meteor Strike": new SkillAnimationWrapper("skill2", castTrueAOE),
  "Attack Ember": new SkillAnimationWrapper("attack", castEffectTarget),
  "Ember Infusion": new SkillAnimationWrapper("skill1", castEffectAOE),
  "Fiery Shower": new SkillAnimationWrapper("skill2", runInJumpLoopOutAndCast, 0.7),
  "Attack Molten": new SkillAnimationWrapper("attack", runInJumpLoopOutAndCast),
  "Blazing Rage": new SkillAnimationWrapper("skill1", castEffectSelf),
  "Volcano Flurry": new SkillAnimationWrapper("skill2", runInJumpLoopOutAndCast),
}

const projectilesDict: {[key: string]: {name:string, width:number, height:number, widthRatio: number, heightRatio: number}} = {
  "attackmarella": {name:"frostbolt", width:200, height:50, widthRatio: 0.2, heightRatio: 0.08}
}

const spellAnimDict: {[key: string]: {name:string, framerate:number, width:number, height:number, frameToCast:number}} = {
  "skill2elandor": {name:"arrowShower", framerate:11, width:256, height:128, frameToCast:-1},
  "skill1diana": {name:"dianaBuff", framerate:8, width:288, height:128, frameToCast:-1},
  "skill1elric": {name:"elricBuff", framerate:8, width:288, height:128, frameToCast:-1},
  "skill2nereus": {name:"nereusWave", framerate:10, width:288, height:128, frameToCast:9},
  "skill1rex": {name:"rexTaunt", framerate:10, width:288, height:128, frameToCast:-1},
  "skill1celeste": {name:"celesteIcePikes", framerate:10, width:288, height:128, frameToCast:-1},
  "skill2celeste": {name:"celesteSnowStorm", framerate:10, width:288, height:128, frameToCast:-1},
  "attacksylvara": {name:"sylvaraThorn", framerate:10, width:288, height:128, frameToCast:-1},
  "skill1sylvara": {name:"sylvaraHeal", framerate:10, width:288, height:128, frameToCast:-1},
  "skill2sylvara": {name:"sylvaraBeam", framerate:10, width:288, height:128, frameToCast:-1},
  "attackbane": {name:"baneSmallFlame", framerate:10, width:288, height:128, frameToCast:-1},
  "skill1bane": {name:"baneTornado", framerate:10, width:288, height:128, frameToCast:-1},
  "skill2bane": {name:"baneMeteor", framerate:10, width:288, height:128, frameToCast:-1},
  "attackember": {name:"emberHeal", framerate:10, width:288, height:128, frameToCast:-1},
  "skill1ember": {name:"emberFireBoost", framerate:10, width:288, height:128, frameToCast:-1},
  "skill1molten": {name:"moltenBuff", framerate:10, width:288, height:128, frameToCast:-1},
}

const projectileInfos = Object.values(projectilesDict)
const spellAnimInfos = Object.values(spellAnimDict)


export { skillAnimsDict, projectilesDict, spellAnimDict, projectileInfos, spellAnimInfos }