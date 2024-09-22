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
const casterProjectile = new CastProjectile("caster")
const skyProjectile = new CastProjectile("sky")
const castEffectAOE = new CastAndEffect("AOE")
const castEffectSelf = new CastAndEffect("Self")
const castEffectTarget = new CastAndEffect("Target")
const castTrueAOE = new CastAndEffect("trueAOE")

const skillAnimsDict: {[key: string]: SkillAnimationWrapper} = {
  "Attack Elandor": new SkillAnimationWrapper("attack", jumpInJumpOutAndCast, 0.1),
  "Attack Marella": new SkillAnimationWrapper("attack", casterProjectile),
  "Attack Wellan": new SkillAnimationWrapper("attack", jumpInJumpOutAndCast, 0.15),
  "Attack Sirocco": new SkillAnimationWrapper("attack", jumpInJumpOutAndCast),
  "Attack Diana": new SkillAnimationWrapper("attack", jumpInJumpOutAndCast, 0.15),
  "Fire Strike": new SkillAnimationWrapper("skill2", runInRunOutAndCast, 0.25),
  "Fire Swing": new SkillAnimationWrapper("skill1", jumpInJumpOutAndCast, 0.15),
  "Sand Strike": new SkillAnimationWrapper("skill1", runInRunOutAndCast),
  "Sandstorm": new SkillAnimationWrapper("skill2", runInRunOutAndCast),
  "Water Heal": new SkillAnimationWrapper("skill1", cast),
  "Water Shield": new SkillAnimationWrapper("skill2", cast),
  "Arrows Rain": new SkillAnimationWrapper("skill2", castEffectAOE),
  "Forest Senses": new SkillAnimationWrapper("skill1", cast),
  "Nature Call": new SkillAnimationWrapper("skill1", castEffectAOE),
  "Wind Pierce": new SkillAnimationWrapper("skill2", runInJumpOutAndCast),
  "Attack Elric": new SkillAnimationWrapper("attack", runInJumpLoopOutAndCast, 0.1),
  "Holy Bastion": new SkillAnimationWrapper("skill1", castEffectAOE),
  "Divine Hammer": new SkillAnimationWrapper("skill2", runInJumpLoopOutAndCast, 0.8),
  "Attack Nereus": new SkillAnimationWrapper("attack", runInJumpLoopOutAndCast, 0.2),
  "Tide Strike": new SkillAnimationWrapper("skill1", runInJumpLoopOutAndCast),
  "Wave Slash": new SkillAnimationWrapper("skill2", runInJumpLoopOutAndCastEffect, 0.7),
  "Attack Rex": new SkillAnimationWrapper("attack", runInJumpLoopOutAndCast, 0.1),
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
  "Meteor Strike": new SkillAnimationWrapper("skill2", skyProjectile),
  "Attack Ember": new SkillAnimationWrapper("attack", castEffectTarget),
  "Ember Infusion": new SkillAnimationWrapper("skill1", castEffectAOE),
  "Fiery Shower": new SkillAnimationWrapper("skill2", runInJumpLoopOutAndCast, 0.7),
  "Attack Molten": new SkillAnimationWrapper("attack", runInJumpLoopOutAndCast),
  "Blazing Rage": new SkillAnimationWrapper("skill1", castEffectSelf),
  "Volcano Flurry": new SkillAnimationWrapper("skill2", runInJumpLoopOutAndCast),
  "Attack Solas": new SkillAnimationWrapper("attack", castEffectTarget),
  "Wisp Infusion": new SkillAnimationWrapper("skill1", castEffectAOE),
  "Divine Storm": new SkillAnimationWrapper("skill2", castEffectTarget),
  "Attack Solveig": new SkillAnimationWrapper("attack", runInJumpLoopOutAndCast, 0.14),
  "Swords Dance": new SkillAnimationWrapper("skill1", castEffectAOE),
  "Celestial Judgement": new SkillAnimationWrapper("skill2", runInJumpLoopOutAndCast, 0.45),
  "Attack Janus": new SkillAnimationWrapper("attack", runInJumpLoopOutAndCast, 0.38),
  "Eclipse Burst": new SkillAnimationWrapper("skill1", runInJumpLoopOutAndCast, 0.65),
  "Void Singularity": new SkillAnimationWrapper("skill2", castTrueAOE),
  "Attack Horus": new SkillAnimationWrapper("attack", castEffectTarget),
  "Ankh Blessing": new SkillAnimationWrapper("skill1", castEffectAOE),
  "Khonsu Blessing": new SkillAnimationWrapper("skill2", castEffectAOE),
  "Attack Jabari": new SkillAnimationWrapper("attack", runInJumpLoopOutAndCast),
  "Scorpion Surge": new SkillAnimationWrapper("skill1", runInJumpLoopOutAndCast, 0.3),
  "Venom Slash": new SkillAnimationWrapper("skill2", runInJumpLoopOutAndCast),
  "Attack Khamsin": new SkillAnimationWrapper("attack", runInJumpLoopOutAndCast, 0.1),
  "Sand Flurry": new SkillAnimationWrapper("skill1", runInJumpLoopOutAndCast, 0.8),
  "Quicksand Ambush": new SkillAnimationWrapper("skill2", castEffectAOE),
}

const projectilesDict: {[key: string]: {name:string, framerate:number, width:number, height:number, frameToCast:number, changeAngle: boolean}} = {
  "attackmarella": {name:"frostbolt", width:200, height:50, framerate:0, frameToCast:-1, changeAngle: true},
  "skill2bane": {name:"baneMeteor", width:288, height:128, framerate:12, frameToCast:-1, changeAngle: false},
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
  "attackember": {name:"emberHeal", framerate:10, width:288, height:128, frameToCast:-1},
  "skill1ember": {name:"emberFireBoost", framerate:10, width:288, height:128, frameToCast:-1},
  "skill1molten": {name:"moltenBuff", framerate:10, width:288, height:128, frameToCast:-1},
  "attacksolas": {name:"AttackSolas", framerate:10, width:288, height:128, frameToCast:-1},
  "skill1solas": {name:"WispInfusion", framerate:10, width:288, height:128, frameToCast:-1},
  "skill2solas": {name:"DivineStorm", framerate:10, width:288, height:128, frameToCast:-1},
  "skill1solveig": {name:"SwordsDance", framerate:10, width:288, height:128, frameToCast:-1},
  "skill2janus": {name:"VoidSingularity", framerate:10, width:288, height:128, frameToCast:-1},
  "attackhorus": {name:"AttackHorus", framerate:10, width:288, height:128, frameToCast:-1},
  "skill1horus": {name:"AnkhBlessing", framerate:10, width:288, height:128, frameToCast:-1},
  "skill2horus": {name:"KhonsuBlessing", framerate:10, width:288, height:128, frameToCast:-1},
  "skill2khamsin": {name:"QuicksandAmbush", framerate:10, width:288, height:128, frameToCast:-1},
}

  // "solas": ["Attack Solas", "Wisp Infusion", "Divine Storm"],
  // "solveig": ["Attack Solveig", "Swords Dance", "Celestial Judgement"],
  // "janus": ["Attack Janus", "Eclipse Burst", "Void Singularity"],
  // "horus": ["Attack Horus", "Ankh Blessing", "Khonsu Blessing"],
  // "jabari": ["Attack Jabari", "Scorpion Surge", "Venom Slash"],
  // "khamsin": ["Attack Khamsin", "Sand Flurry", "Quicksand Ambush"],

const projectileInfos = Object.values(projectilesDict)
const spellAnimInfos = Object.values(spellAnimDict)


export { skillAnimsDict, projectilesDict, spellAnimDict, projectileInfos, spellAnimInfos }