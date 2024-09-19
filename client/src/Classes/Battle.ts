import Entity from "./Entity/Entity";
import EntityFactory from "./Entity/EntityFactory";
import Turnbar from "./Entity/Turnbar";
import IBattleEntity from "./Entity/IBattleEntity";
import AnimationsHandler from "./Animations/AnimationsHandler";
import BattleScene from "../Scenes/BattleScene";
import { getSpriteSize } from "../GameDatas/Monsters/spriteSize";
import Scaler from "./Camera/Scaler";
import Zoomer from "./Camera/Zoomer";
import Positionner from "./Camera/Positionner";
import GameEventHandler from "../Blockchain/event/GameEventHandler";
import { Account } from "starknet";
import UIScene from "../Scenes/UIScene";
import GameSpeedHelper from "./Animations/GameSpeedHelper";
import { useDojo } from "../dojo/useDojo";
import Maps from "../GameDatas/maps";

export default class Battle {
  battleEntities: Array<IBattleEntity>
  deadEntities: Array<IBattleEntity>
  alliesIndexes: Array<number>
  enemiesIndexes: Array<number>
  turnTimeline: Array<Turnbar>
  entityFactory: EntityFactory
  battleScene: BattleScene
  UIScene: UIScene
  selectedSkill: string
  skillTargetType: string
  hasSelectedTarget: boolean
  isTurnPlaying: boolean
  eventHandler: GameEventHandler
  account: Account
  animationsHandler: AnimationsHandler
  scaler: Scaler
  zoomer: Zoomer
  positionner: Positionner
  gameSpeedHelper: GameSpeedHelper
  playTurn: any
  map: Maps

  constructor(battleScene: BattleScene, gameSpeedHelper: GameSpeedHelper) {
    this.battleScene = battleScene
    this.battleEntities = []
    this.deadEntities = []
    this.alliesIndexes = []
    this.enemiesIndexes = []
    this.turnTimeline = []
    this.entityFactory = new EntityFactory()
    this.hasSelectedTarget = false
    this.isTurnPlaying = false
    this.animationsHandler = new AnimationsHandler(this)
    this.gameSpeedHelper = gameSpeedHelper
  }

  setPlayTurn(playTurn: any){
    this.playTurn = playTurn
  }

  setMap(map: number){
    this.map = map
  }

  setPositionner(positionner: Positionner){
    this.positionner = positionner
  }

  setScaler(scaler: Scaler){
    this.scaler = scaler
  }

  setGameSpeedHelper(gameSpeedHelper: GameSpeedHelper){
    this.gameSpeedHelper = gameSpeedHelper
  }

  setZoomer(zoomer: Zoomer) {
    this.zoomer = zoomer
  }

  setGameEventHandler(eventHandler: GameEventHandler){
    this.eventHandler = eventHandler
  }

  setAccountWallet(account: Account){
    this.account = account
  }

  setUIScene(UIScene: UIScene){
    this.UIScene = UIScene
  }

  async startBattle() {
    while(true){
      if(this.isBattleOver()) {
        console.log("Battle over")
        await this.waitDamageAndHealAnimsDone()
        await this.waitForAnimationsToFinish()
        this.battleScene.destroyGame()
        return
      }
      // this.battleEntities.forEach(entity => {
      //   console.log("index:", entity.getIndex(), " name:", entity.getName(), " speed:", entity.getBattleSpeed())
      // })
      // console.log('before : ', JSON.parse(JSON.stringify(this.turnTimeline)))
      this.loopUntilNextTurn()
      console.log(this.turnTimeline)
      // console.log('after : ', JSON.parse(JSON.stringify(this.turnTimeline)))
      this.isTurnPlaying = true
      this.updateDisplayTurnBars()
      let currentStartTurnEvent = this.eventHandler.shiftStartTurnEvent()
      if(!currentStartTurnEvent){
        console.log("No start turn event received")
      }
      else {
        console.log("StartTurnEvent : " + JSON.stringify(currentStartTurnEvent))
        await this.getEntityHighestTurn().playTurn(this, currentStartTurnEvent, this.animationsHandler)
        while(this.isTurnPlaying){
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  async waitDamageAndHealAnimsDone(){
    for(let i = 0; i < this.battleEntities.length; i++){
      await this.battleEntities[i].waitDamageAndHealAnimsDone()
    }
    for(let i = 0; i < this.deadEntities.length; i++){
      await this.deadEntities[i].waitDamageAndHealAnimsDone()
    }
  }

  async waitForAnimationsToFinish(){
    while(!this.animationsHandler.areAnimationsFinishedBeforeEndGame()){
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log("Waiting for animations to finish")
    }
  }

  updateDisplayTurnBars(){
    for (let i = 0; i < this.battleEntities.length; i++){
      this.battleEntities[i].updateDisplayTurnBar(this.getTurnBarValue(this.battleEntities[i]))
    }
  }

  getTurnBarValue(entity: IBattleEntity): number{
    return entity.getTurnbar().turnbar
  }

  updateEndTurnInCaseOfStun() {
    let endTurn = this.eventHandler.shiftEndTurnEvent()
    if(!endTurn){
      console.log("No end turn event received")
      return;
    }
    this.applyBuffsAndStatus(endTurn.buffsDict, endTurn.statusDict)
    this.updateSpeeds(endTurn.speedsDict)
  }

  async processNextSkill(entityThatPlaysIndex: number){
    console.log("Processing next skill")
    let skill = this.eventHandler.shiftSkillEvent()
    let endTurn = this.eventHandler.shiftEndTurnEvent()

    console.log('skillEvent : '  + JSON.stringify(skill))
    console.log('endTurnEvent : ' + JSON.stringify(endTurn))

    if(!skill){
      console.log("No skill event received")
      return;
    }
    if(!endTurn){
      console.log("No end turn event received")
      return;
    }
    if(skill.casterId !== entityThatPlaysIndex){
      console.log("Wrong entity playing : ", skill.casterId, " instead of ", entityThatPlaysIndex)
      return;
    }
    let caster = this.getEntityByIndex(skill.casterId)
    if(!caster){
      console.log("Entity not found")
      return;
    }
    const skillName = caster.getEntity().skillArray[skill.skillIndex].name
    
    await this.animationsHandler.playSkillAnim(this, skillName, skill.casterId, skill.targetId, skill.damagesDict, skill.healsDict, endTurn.statusDict, endTurn.buffsDict, skill.deathArray)
    // this.applyBuffsAndStatus(skill.buffsDict, skill.statusDict)
    // this.applyDamages(skill.damagesDict)
    // this.applyHeals(skill.healsDict)
    // this.updateHealths()
    // this.applyDeaths(skill.deathArray)
    this.updateSpeeds(endTurn.speedsDict)
    if (caster){
      if (this.alliesIndexes.includes(caster.getIndex())){
        // console.log("setOnCooldown")
        caster.setOnCooldown(skillName)
        // casterEntity.setOnCooldown(skill, skillsDict[skill].cooldown)
      }
      caster.endTurn()
    }
    this.selectedSkill = ""
    this.isTurnPlaying = false
  }


  applyBuffsAndStatus(buffsDict: {[key: number]: Array<{name: string, duration: number}>}, statusDict: {[key: number]: Array<{name: string, duration: number}>}){
    for (let entityIndex=0; entityIndex < this.battleEntities.length; entityIndex++){
      let entity = this.battleEntities[entityIndex]
      let buffs = buffsDict[entity.getIndex()]
      let status = statusDict[entity.getIndex()]
      if(!buffs)
        buffs = []
      if(!status)
        status = []
      entity.applyBuffsAndStatus(buffs, status, this.battleScene)
    }
  }
  applyDeaths(deathArray: Array<number>){
    for(let i = 0; i < deathArray.length; i++){
      let entity = this.getEntityByIndex(deathArray[i])
      if(entity)
        entity.die(this, this.battleScene, this.animationsHandler)
    }
  }
  applyDamages(damageDict: {[key: number]: {value: number}}){
    for(let key in damageDict){
      let entity = this.getEntityByIndex(parseInt(key))
      if(entity)
        entity.applyDamageAndPlayAnim(false, damageDict[key].value, this.battleScene, this.animationsHandler)
    }
  }
  applyHeals(healDict: {[key: number]: {value: number}}){
    for(let key in healDict){
      let entity = this.getEntityByIndex(parseInt(key))
      if(entity)
        entity.applyHealAndPlayAnim(healDict[key].value, this.battleScene)
    }
  }

  updateHealths(){
    for(let i = 0; i < this.battleEntities.length; i++){
      this.battleEntities[i].updateHealth()
    }
  }

  processSkillClick(nameArray: string[]){
    if(this.isAllyTurn() && !this.hasSelectedTarget){
      this.selectedSkill = nameArray[1]
      this.getEntityHighestTurn().selectSkill(nameArray[1])
      this.getSkillTargetType(nameArray[1])
    }
  }

  async processEntityClick(nameArray: string[]){
    if(this.isAllyTurn() && this.selectedSkill != "" && !this.hasSelectedTarget){
      let entityClickedId = parseInt(nameArray[1])
      if(this.isEntitySelectionValid(entityClickedId)){
        this.hasSelectedTarget = true
        
        this.getEntityHighestTurn().endSkillSelection()
        console.log('cast ' + this.getEntityHighestTurn().getSkillIndexByName(this.selectedSkill) + ' on ' + entityClickedId)
        if(this.map == Maps.Campaign){
          await this.playTurn(this.account, this.map, this.getEntityHighestTurn().getSkillIndexByName(this.selectedSkill), entityClickedId, this.eventHandler)
        } else {
          await this.playTurn(this.account, this.getEntityHighestTurn().getSkillIndexByName(this.selectedSkill), entityClickedId, this.eventHandler)
        }
        await this.processNextSkill(this.getEntityHighestTurn().getIndex())
      }
    }
  }

  isEntitySelectionValid(entityIndex: number): boolean{
    if (this.skillTargetType === "enemy") {
      if(this.enemiesIndexes.includes(entityIndex)){
        return true
      }
    } else if (this.skillTargetType === "ally" || this.skillTargetType === "self") {
      if(this.alliesIndexes.includes(entityIndex)){
        return true
      }
    }
    return false
  }

  getSkillTargetType(selectedSkill: string){
    this.getEntityHighestTurn().getEntity().skillArray.forEach(skill => {
      if(skill.name === selectedSkill){
        if(skill.targetType === "enemy"){
          this.skillTargetType = "enemy"
        } else if(skill.targetType === "ally"){
          this.skillTargetType = "ally"
        } else if(skill.targetType === "self"){
          this.skillTargetType = "self"
        }
      }
    })
  }

  updateSpeeds(speedDict:{[key: number]: number}){
    for(let key in speedDict){
      let entity = this.getEntityByIndex(parseInt(key))
      if(entity)
        entity.setBattleSpeed(speedDict[key])
    }
  }

  updateTurnTimeline() {
    for (let i = 0; i < this.turnTimeline.length; i++) {
      let entity = this.getEntityByIndex(this.turnTimeline[i].entityIndex)
      if(!entity)
        break;
      this.turnTimeline[i].setSpeed(entity.getBattleSpeed())
    }
  }

  createEntity(entity: Entity, entityIndex: number, isAllyOrEnemy: string, alliesCount:number, enemiesCount: number){
    let entityFrameSize = getSpriteSize(entity.name)
    if (isAllyOrEnemy === "ally") {
      let battleEntity = EntityFactory.createBattleEntityAllyOrEnemyFromEntity(entity, entityFrameSize.frameWidth, entityFrameSize.frameHeight, entityFrameSize.upscale, entityIndex, alliesCount, enemiesCount, isAllyOrEnemy, this.battleScene)
      this.animationsHandler.addOnAnimationCompleteListener(battleEntity)
      this.battleEntities.push(battleEntity)
      this.turnTimeline.push(battleEntity.getTurnbar())
      this.alliesIndexes.push(entityIndex)
    } else if (isAllyOrEnemy === "enemy") {
      let battleEntity = EntityFactory.createBattleEntityAllyOrEnemyFromEntity(entity, entityFrameSize.frameWidth, entityFrameSize.frameHeight, entityFrameSize.upscale, entityIndex, alliesCount, enemiesCount, isAllyOrEnemy, this.battleScene)
      this.animationsHandler.addOnAnimationCompleteListener(battleEntity)
      this.battleEntities.push(battleEntity)
      this.turnTimeline.push(battleEntity.getTurnbar())
      this.enemiesIndexes.push(entityIndex)
    }
  }

  loopUntilNextTurn() {
    this.updateTurnTimeline()
    this.sortTurnTimeline()
    while (this.turnTimeline[0].turnbar < 999) {
      this.incrementTurnBars()
      this.sortTurnTimeline()
    }
  }

  sortTurnTimeline() {
    this.turnTimeline.sort((a, b) => {
      if(a.turnbar === b.turnbar){
        return a.entityIndex < b.entityIndex ? -1 : 1
      }
      return a.turnbar > b.turnbar ? -1 : 1
    })
  }

  incrementTurnBars() {
    for (let i = 0; i < this.turnTimeline.length; i++) {
      this.turnTimeline[i].incrementTurnbar()
    }
  }

  removeEntityTurnbar(entityIndex: number) {
    for (let i = 0; i < this.turnTimeline.length; i++) {
      if(this.turnTimeline[i].entityIndex === entityIndex){
        this.turnTimeline.splice(i, 1)
        return;
      }
    }
  }

  isAllyTurn() {
    return this.alliesIndexes.includes(this.turnTimeline[0].entityIndex)
  }

  setBattleScene(battleScene: BattleScene) {
    this.battleScene = battleScene
  }

  getEntityHighestTurn(): IBattleEntity {
    for (let i = 0; i < this.battleEntities.length; i++) {
      if (this.battleEntities[i].getIndex() === this.turnTimeline[0].entityIndex) {
        return this.battleEntities[i]
      }
    }
    console.log('Highest Turn Entity not found')
    return this.battleEntities[0]
  }

  getEntityByIndex(entityIndex: number): IBattleEntity | false {
    for (let i = 0; i < this.battleEntities.length; i++) {
      if (this.battleEntities[i].getIndex() === entityIndex) {
        return this.battleEntities[i]
      }
    }
    return false
  }

  findEntityPositionByIndex(index: number): number {
    for (let i = 0; i < this.battleEntities.length; i++) {
      if(this.battleEntities[i].getIndex() === index)
        return i
    }
    return -1
  }

  getAlliesOf(entityIndex: number) {
    if (this.alliesIndexes.includes(entityIndex)) {
        return this.getAllAllies();
    }
    return this.getAllEnemies();
  }

  getAllAllies() {
    let allies = new Array();
    for (let i = 0; i < this.battleEntities.length; i++) {
        if (this.alliesIndexes.includes(this.battleEntities[i].getIndex())) {
            allies.push(this.battleEntities[i]);
        }
    }
    return allies;
  }
  getAllEnemies() {
    let enemies = new Array();
    for (let i = 0; i < this.battleEntities.length; i++) {
        if (this.enemiesIndexes.includes(this.battleEntities[i].getIndex())) {
            enemies.push(this.battleEntities[i]);
        }
    }
    return enemies;
  }

  isBattleOver(): boolean {
    return this.alliesIndexes.length === 0 || this.enemiesIndexes.length === 0
  }
  

}