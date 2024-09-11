import ISkillAnimation from "../../Classes/Skill/Animations/ISkillAnimation"
import MoveAndCast from "../../Classes/Skill/Animations/MoveAndCast"
import Cast from "../../Classes/Skill/Animations/Cast"
import CastProjectile from "../../Classes/Skill/Animations/CastProjectile"
import CastProjectileAOE from "../../Classes/Skill/Animations/CastProjectileAOE"



const runInRunOutAndCast = new MoveAndCast("run", "run")
const runInJumpOutAndCast = new MoveAndCast("run", "jump")
const jumpInJumpOutAndCast = new MoveAndCast("jump", "jump")
const cast = new Cast()
const castProjectile = new CastProjectile()
const castProjectileAOE = new CastProjectileAOE()


const skillAnimsDict: {[key: string]: {animType: string, animPlayer:ISkillAnimation}} = {
  "Attack Hunter": {animType: "attack", animPlayer:jumpInJumpOutAndCast},
  "Attack Priest": {animType: "attack", animPlayer:castProjectile},
  "Attack Knight": {animType: "attack", animPlayer:jumpInJumpOutAndCast},
  "Attack Assassin": {animType: "attack", animPlayer:jumpInJumpOutAndCast},
  "Heal": {animType: "skill1", animPlayer:cast},
  "Fire Strike": {animType: "skill2", animPlayer:runInRunOutAndCast},
  "Fire Swing": {animType: "skill1", animPlayer:jumpInJumpOutAndCast},
  "Sand Strike": {animType: "skill1", animPlayer:runInRunOutAndCast},
  "Sandstorm": {animType: "skill2", animPlayer:runInRunOutAndCast},
  "Water Heal": {animType: "skill1", animPlayer:cast},
  "Water Shield": {animType: "skill2", animPlayer:cast},
  "Arrows Rain": {animType: "skill2", animPlayer:castProjectileAOE},
  "Forest Senses": {animType: "skill1", animPlayer:cast},
}

const projectilesDict: {[key: string]: {name:string, width:number, height:number, widthRatio: number, heightRatio: number}} = {
  "attackpriest": {name:"frostbolt", width:200, height:50, widthRatio: 0.2, heightRatio: 0.08}
}

const spellAnimDict: {[key: string]: {name:string, framerate:number, width:number, height:number}} = {
  "skill2hunter": {name:"arrowShower", framerate:11, width:256, height:128},
}

const projectileInfos = Object.values(projectilesDict)
const spellAnimInfos = Object.values(spellAnimDict)


export { skillAnimsDict, projectilesDict, spellAnimDict, projectileInfos, spellAnimInfos }