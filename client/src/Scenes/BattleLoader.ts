import Phaser from 'phaser'
import {getLevelBackground} from '../GameDatas/Levels/levels'
import { projectileInfos, spellAnimInfos } from '../GameDatas/Skills/skills'
import { buffsDebuffsStats, onTurnStackableBuffNames, onTurnStackableStatusNames } from '../GameDatas/Skills/buffsStatus'
import Entity from '../Classes/Entity/Entity'
import Skill from '../Classes/Skill/Skill'
import { getSpriteSize } from '../GameDatas/Monsters/spriteSize'
import SkillSelected from "../assets/battleUI/SkillSelected.png"
import LifeBar from "../assets/battleUI/LifeBar.png"
import LifeBarOutline from "../assets/battleUI/LifeBarOutline.png"
import TurnBar from "../assets/battleUI/TurnBar.png"
import TurnBarOutline from "../assets/battleUI/TurnBarOutline.png"
import BackgroundPick from '../Classes/Camera/BackgroundPick'
import speedBuff from '../assets/buffs/speed.png'
import attackBuff from '../assets/buffs/attack.png'
import defenseBuff from '../assets/buffs/defense.png'
import regenBuff from '../assets/buffs/regen.png'
import attackStatus from '../assets/status/attack.png'
import defenseStatus from '../assets/status/defense.png'
import speedStatus from '../assets/status/speed.png'
import poisonStatus from '../assets/status/poison.png'
import stunStatus from '../assets/status/stun.png'
import music from '../assets/sound/music/battle.mp3'

const spellAnimImages: Record<string, { default: string }> = import.meta.glob('../assets/spellAnim/*.png', { eager: true });
const monstersImages: Record<string, { default: string }> = import.meta.glob('../assets/monsters/*.png', { eager: true });
const backgroundsImages: Record<string, { default: string }> = import.meta.glob('../assets/backgrounds/*.png', { eager: true });

export default class BattleLoader extends Phaser.Scene {
  constructor() {
    super('BattleLoader')
  }

  preload() {
    this.createLoadingScreen()
    let map = this.registry.get('map')
    let battleId = this.registry.get('battleId')
    let img = backgroundsImages[`../assets/backgrounds/${getLevelBackground(map, battleId, this.sys.canvas.width)}.png`].default;
    // let img = new URL('../assets/backgrounds/' +  getLevelBackground(map, battleId, this.sys.canvas.width) + '.png', import.meta.url).href
    this.load.image('background', img)
    this.loadMusicLoop()
    this.loadSpellAnimations()
    this.loadProjectiles() 
    this.loadBuffsStatus()
    let selectedTeam = this.registry.get('selectedTeam')
    let enemiesTeam = this.registry.get('enemiesTeam')
    this.loadEntities(enemiesTeam, selectedTeam)
    this.load.image('skillSelected', SkillSelected)
    this.load.image('lifeBar', LifeBar)
    this.load.image('lifeBarOutline', LifeBarOutline)
    this.load.image('turnBar', TurnBar)
    this.load.image('turnBarOutline', TurnBarOutline)
  }

  create() {
    this.cameras.main.setRoundPixels(true)
    this.game.scene.start('UIScene')
    this.scene.start('Battle')
  }

  loadEntities(enemiesTeam: Array<Entity>, selectedTeam: Array<Entity>) {
    this.loadSkills(enemiesTeam)
    this.loadSkills(selectedTeam)
    let enemiesNameArray: Array<string> = this.getEntitiesNameArray(enemiesTeam)

    let loadedNames: Array<string> = []
    for (let i = 0; i < enemiesNameArray.length; i++) {
      if (!loadedNames.includes(enemiesNameArray[i])) {
        let spritesheet = monstersImages[`../assets/monsters/${enemiesNameArray[i]}.png`].default;
        // const spritesheet  = new URL('../assets/monsters/' + enemiesNameArray[i] + '.png', import.meta.url).href
        this.load.spritesheet(enemiesNameArray[i], spritesheet, getSpriteSize(enemiesNameArray[i]))
        loadedNames.push(enemiesNameArray[i])
      }
    }
    for(let i = 0; i < selectedTeam.length; i++){
      if(!loadedNames.includes(selectedTeam[i].name)){
        let spritesheet = monstersImages[`../assets/monsters/${selectedTeam[i].name}.png`].default;
        // const spritesheet  = new URL('../assets/monsters/' + selectedTeam[i].name + '.png', import.meta.url).href
        this.load.spritesheet(selectedTeam[i].name, spritesheet, getSpriteSize(selectedTeam[i].name))
        loadedNames.push(selectedTeam[i].name)
      }
    }
  }

  getEntitiesNameArray(entitiesArray: Array<Entity>): Array<string> {
    let enemiesNameArray: Array<string> = []
    for (let i = 0; i < entitiesArray.length; i++) {
      enemiesNameArray.push(entitiesArray[i].name)
    }
    return enemiesNameArray
  }

  loadSkills(entitiesArray: Array<Entity>) {
    let loadedSkills: Array<string> = []
    for (let i = 0; i < entitiesArray.length; i++) {
      entitiesArray[i].skillArray.forEach((skill: Skill) => {
        if (!loadedSkills.includes(skill.name)) {
          loadedSkills.push(skill.name)
          this.load.image(skill.name, skill.image)
        }
      })
    }
  }

  loadSpellAnimations(){
    spellAnimInfos.forEach((spellAnimInfo) => {

      let spellName = spellAnimInfo.name;
      let img = spellAnimImages[`../assets/spellAnim/${spellName}.png`].default;

      // let img = new URL('../assets/spellAnim/' + spellAnimInfo.name + '.png', import.meta.url).href
      this.load.spritesheet(spellAnimInfo.name, img, { frameWidth: spellAnimInfo.width, frameHeight: spellAnimInfo.height })
    })
  }

  loadProjectiles(){
    projectileInfos.forEach((projectileInfo) => {
      let spellName = projectileInfo.name;
      let img = spellAnimImages[`../assets/spellAnim/${spellName}.png`].default;

      // let img = new URL('../assets/spellAnim/' + projectileInfo.name + '.png', import.meta.url).href
      if(projectileInfo.framerate === 0) {
        this.load.image(projectileInfo.name, img)
      }
      else {
        this.load.spritesheet(projectileInfo.name, img, { frameWidth: projectileInfo.width, frameHeight: projectileInfo.height })
      }
    })
  }

  loadBuffsStatus(){
    this.load.image("buff_speed", speedBuff)
    this.load.image("buff_attack", attackBuff)
    this.load.image("buff_defense", defenseBuff)
    this.load.image("buff_regen", regenBuff)
    this.load.image("status_attack", attackStatus)
    this.load.image("status_defense", defenseStatus)
    this.load.image("status_speed", speedStatus)
    this.load.image("buff_poison", poisonStatus)
    this.load.image("status_poison", poisonStatus)
    this.load.image("status_stun", stunStatus)
    // buffsDebuffsStats.forEach((stat: string) => {
    //   let imgBuff = new URL('../assets/buffs/' + stat + '.png', import.meta.url).href

    //   let imgDebuff = new URL('../assets/status/' + stat + '.png', import.meta.url).href
    //   this.load.image("buff_" + stat, imgBuff)
    //   this.load.image("status_" + stat, imgDebuff)
    // })

    // onTurnStackableBuffNames.forEach((stackableBuffName) => {
    //   let img = new URL('../assets/buffs/' + stackableBuffName + '.png', import.meta.url).href
    //   this.load.image("buff_" + stackableBuffName, img)
    // })
    // onTurnStackableStatusNames.forEach((stackableStatusName) => {
    //   let img = new URL('../assets/status/' + stackableStatusName + '.png', import.meta.url).href
    //   console.log("buff_" + stackableStatusName)
    //   this.load.image("buff_" + stackableStatusName, img)
    // })
    // let img = new URL('../assets/status/stun.png', import.meta.url).href
    // this.load.image("status_stun", img)
  }

  loadMusicLoop(musicName: string = 'battle'){
    // let music = new URL('../assets/sound/music/' + musicName + '.mp3', import.meta.url).href
    this.load.audio('battleLoop', music);
  }

  createLoadingScreen(){
    let progressBar = this.add.graphics();
    // let progressBox = this.add.graphics();

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const scale = Math.round(width / BackgroundPick.getBackgroundWidth(width))

    const progressBarWidth = width / 4
    const progressBarHeight = height / 20
    const progressBarX = width / 2 - (progressBarWidth / 2)
    const progressBarY = height / 2

    // progressBox.fillStyle(0xFFFFFF, 0.3);
    // progressBox.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

    const fontName = 'RetroGaming'
    const textSize = 10

    // let loadingText = this.add.bitmapText(progressBarX + progressBarWidth / 2, progressBarY + 10, 'arcade', 'Loading...', 32);
    let loadingText = this.add.bitmapText(width / 2, height / 2 - progressBarHeight, fontName + textSize, 'Loading...').setScale(scale);
    loadingText.setOrigin(0.5, 0.5);

    let percentText = this.add.bitmapText(progressBarX + progressBarWidth / 2, progressBarY + progressBarHeight / 2, fontName + textSize, '0%').setScale(scale);
    percentText.setOrigin(0.5, 0.5);
    
    let assetText = this.add.bitmapText(width / 2, height / 2 + progressBarHeight * 2, fontName + textSize, '').setScale(scale);
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value:any) {
      percentText.setText(Math.round(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xeab676, 1);
      progressBar.fillRect(progressBarX + (progressBarWidth/100), progressBarY + (progressBarHeight/10), (progressBarWidth - (progressBarWidth/50)) * value, progressBarHeight - (progressBarHeight/5));
      // progressBar.fillRect(progressBarX + progressBarWidthOffset, progressBarY + progressBarHeightOffset, progressBarWidth - (progressBarWidthOffset*2) * value, progressBarHeight - (progressBarHeightOffset*2));
    });
    
    this.load.on('fileprogress', function (file:any) {
        assetText.setText('Loading asset: ' + file.key);
    });
    this.load.on('complete', function () {
        progressBar.destroy();
        // progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
    });
  }
}