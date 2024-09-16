import Phaser from 'phaser'
import Battle from '../Classes/Battle'
import Entity from '../Classes/Entity/Entity'
import Skill from '../Classes/Skill/Skill'
import ClickHandler from '../Classes/ClickHandler'
import Scaler from '../Classes/Camera/Scaler'
import Zoomer from '../Classes/Camera/Zoomer'
import Positionner from '../Classes/Camera/Positionner'
import GameEventHandler from '../Blockchain/event/GameEventHandler'
import Tooltips from './UIScene'
import UIScene from './UIScene'
import BackgroundPick from '../Classes/Camera/BackgroundPick'
import GameSpeedHelper from '../Classes/Animations/GameSpeedHelper'


export default class BattleScene extends Phaser.Scene {
  battle: Battle
  clickHandler: ClickHandler
  battleLoaded: boolean
  eventHandler: GameEventHandler
  characterSpritesGroup: Phaser.GameObjects.Group
  // UISpritesGroup: Phaser.GameObjects.Group

  constructor() {
    super('Battle')
    this.battle = new Battle(this, new GameSpeedHelper(1))
    this.clickHandler = new ClickHandler(this.battle)
    this.battle.setBattleScene(this)
  }

  preload() {
    this.battle.setPlayTurn(this.registry.get('playTurn'))
    this.battle.setWorldId(this.registry.get('worldId'))
    this.battle.setGameEventHandler(this.registry.get('eventHandler'))
    this.battle.setAccountWallet(this.registry.get('account'))
  }

  async create() {
    this.battle.setUIScene(this.scene.get('UIScene') as UIScene)
    this.cameras.main.setRoundPixels(true)

    let backgroundWidth = BackgroundPick.getBackgroundWidth(this.sys.canvas.width)
    let backgroundHeight = BackgroundPick.getBackgroundHeight(this.sys.canvas.width)
    this.battle.setScaler(new Scaler(this.sys.canvas.width))
    this.battle.setZoomer(new Zoomer(this.sys.canvas.width, this.sys.canvas.height, backgroundWidth, backgroundHeight, this.battle.scaler.getScaleFactor()))
    this.battle.setPositionner(new Positionner(backgroundWidth * this.battle.scaler.getScaleFactor(), backgroundHeight * this.battle.scaler.getScaleFactor(), backgroundWidth, backgroundHeight))
    this.battle.setBattleScene(this)

    this.cameras.main.setZoom(this.battle.scaler.getScaleFactor())
    this.battle.zoomer.moveMainCamera(this.cameras.main, this.battle.scaler.getScaleFactor())
    // @ts-ignore
    this.cameras.main.preRender()

    let selectedTeam = this.registry.get('selectedTeam')
    let enemiesTeam = this.registry.get('enemiesTeam')
    
    this.playMusic()

    this.add.image(0, 0, 'background').setOrigin(0, 0)
    
    this.createEntities(selectedTeam, enemiesTeam);

    this.input.on('pointerdown', this.clickHandler.handleClick, this);
    await this.battle.startBattle()
  }

  destroyGame(){
    this.game.destroy(true, false)
  }

  update() {
  }

  playMusic(){
    const music = this.sound.add('battleLoop');
    music.loop = true;
    music.play();
  }

  getEntitiesNameArray(entitiesArray: Array<Entity>): Array<string> {
    let enemiesNameArray: Array<string> = []
    for (let i = 0; i < entitiesArray.length; i++) {
      enemiesNameArray.push(entitiesArray[i].name)
    }
    return enemiesNameArray
  }

  createEntities(selectedTeam: Array<Entity>, enemiesTeam: Array<Entity>) {
    let selectedTeamNameArray: Array<string> = this.getEntitiesNameArray(selectedTeam)
    let enemiesNameArray: Array<string> = this.getEntitiesNameArray(enemiesTeam)

    let entitiesNames = selectedTeamNameArray.concat(enemiesNameArray)
    let entitiesArray = selectedTeam.concat(enemiesTeam)

    let isAllyOrEnemy = []
    for (let i = 0; i < entitiesNames.length; i++) {
      isAllyOrEnemy.push(i < selectedTeamNameArray.length ? 'ally' : 'enemy')
    }
    for (let i = 0; i < entitiesNames.length; i++) {
      this.battle.createEntity(entitiesArray[i], i, isAllyOrEnemy[i], selectedTeam.length, enemiesTeam.length)
    }
  }
}