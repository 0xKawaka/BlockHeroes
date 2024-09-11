import Battle from "../Battle"
import IBattleEntity from "../Entity/IBattleEntity"
import SpriteWrapper from "./SpriteWrapper"
import { skillAnimsDict, spellAnimDict } from "../../GameDatas/Skills/skills"
import { projectilesDict } from "../../GameDatas/Skills/skills"

export default class AnimationsHandler {
  animations: { [key: string]: any}
  battle: Battle
  attackAnimationDict:  {[key: string]: boolean}
  deathAnimationDict: {[key: string]: boolean}
  hurtAnimationDict: {[key: string]: boolean}
  jumpAnimationDict: {[key: string]: boolean}
  runAnimationDict: {[key: string]: boolean}
  spellAnimationDict: {[key: string]: boolean}
  // idleAnimationDict: {[key: string]: boolean}
  annimationStateIndexer: {[key: string]: {[key: string]: boolean}}

  constructor(battle: Battle) { 
    this.battle = battle
    this.animations = {}
    this.attackAnimationDict = {}
    this.deathAnimationDict = {}
    this.hurtAnimationDict = {}
    this.jumpAnimationDict = {}
    this.runAnimationDict = {}
    this.spellAnimationDict = {}
    // this.idleAnimationDict = {}
    this.annimationStateIndexer = {
      "attack": this.attackAnimationDict,
      "skill1": this.attackAnimationDict,
      "skill2": this.attackAnimationDict,
      "jump": this.jumpAnimationDict,
      "run": this.runAnimationDict,
      "hurt": this.hurtAnimationDict,
      "die": this.deathAnimationDict,
      // "idle": this.idleAnimationDict
    }
  }

  async playSkillAnim(battle: Battle, skill: string, caster: number, target: number, damageDict: {[key: number]: {value: number}},
    healDict: {[key: number]: {value: number}}, statusDict: {[key: number]: Array<{name: string, duration: number}>},
    buffsDict: {[key: number]: Array<{name: string, duration: number}>} ,deathArray: Array<number>) {
    console.log("Playing skill anim")

    let targetEntity = this.battle.getEntityByIndex(target)
    let casterEntity = this.battle.getEntityByIndex(caster)

    if (!targetEntity || !casterEntity)
      return
    if(skill === "Attack"){
      await skillAnimsDict[skill + casterEntity.getName()].animPlayer.play(this, battle, skillAnimsDict[skill + casterEntity.getName()].animType, casterEntity, targetEntity, damageDict, healDict, statusDict, buffsDict, deathArray)
    }
    else {
      await skillAnimsDict[skill].animPlayer.play(this, battle, skillAnimsDict[skill].animType, casterEntity, targetEntity, damageDict, healDict, statusDict, buffsDict, deathArray)
    }
  }

  addOnAnimationCompleteListener(entity: IBattleEntity){
    entity.getSprite().on('animationcomplete', (anim: any, frame: any) => {
      if(anim.key === entity.getName() + entity.getIndex() + "attack" || anim.key == entity.getName() + entity.getIndex() + "skill1" || anim.key == entity.getName() + entity.getIndex() + "skill2"){
        console.log("attack animation complete : ", anim.key)
        this.attackAnimationDict[entity.getName() + entity.getIndex()] = false
      }
      else if(anim.key === entity.getName() + entity.getIndex() + "die"){
        console.log("die animation complete : ", anim.key)
        this.deathAnimationDict[entity.getName() + entity.getIndex()] = false
      }
      else if(anim.key === entity.getName() + entity.getIndex() + "hurt"){
        console.log("hurt animation complete : ", anim.key)
        this.hurtAnimationDict[entity.getName() + entity.getIndex()] = false
      }
      else if(anim.key === entity.getName() + entity.getIndex() + "jump"){
        this.jumpAnimationDict[entity.getName() + entity.getIndex()] = false
      }
      else if (anim.key === entity.getName() + entity.getIndex() + "run"){
        this.runAnimationDict[entity.getName() + entity.getIndex()] = false
      }
      // else if (anim.key === entity.getName() + entity.getIndex() + "idle"){
      //   this.idleAnimationDict[entity.getName() + entity.getIndex()] = false
      // }
    });
  }

  async moveObjectToPosition(casterSprite: SpriteWrapper, x:number, y:number, maxTime: number) {
    casterSprite.setDestination(x, y)
    this.battle.battleScene.physics.moveTo(casterSprite.getPlaceholder(), x, y, 1, maxTime);
    await this.loopUntilArrival(casterSprite)
  }

  async loopUntilArrival(casterSprite: SpriteWrapper){
    while(casterSprite.isMoving()){
      casterSprite.update()
      // console.log("Not arrived")
      await new Promise(resolve => setTimeout(resolve, 2));
    }
  }

  handleOverlap(bolt: any, target: any){
    bolt.destroy();
  }

  isAnimPlaying(entity: IBattleEntity){
    return (this.attackAnimationDict[entity.getName() + entity.getIndex()] || this.deathAnimationDict[entity.getName() + entity.getIndex()] ||
    this.hurtAnimationDict[entity.getName() + entity.getIndex()] || this.jumpAnimationDict[entity.getName() + entity.getIndex()] ||
    this.runAnimationDict[entity.getName() + entity.getIndex()] || this.spellAnimationDict[entity.getName() + entity.getIndex()])
  }

  async waitForOtherAnimationsToFinish(entity: IBattleEntity){
    while(this.attackAnimationDict[entity.getName() + entity.getIndex()] || this.deathAnimationDict[entity.getName() + entity.getIndex()] ||
    this.hurtAnimationDict[entity.getName() + entity.getIndex()] || this.jumpAnimationDict[entity.getName() + entity.getIndex()] ||
    this.runAnimationDict[entity.getName() + entity.getIndex()] || this.spellAnimationDict[entity.getName() + entity.getIndex()]
    ){
    // while(this.animationPlayingDict[entity.getName() + entity.getIndex()]){
      // console.log("Waiting for other animations to finish ")
      await new Promise(resolve => setTimeout(resolve, 5));
    }
  }

  areAnimationsFinishedBeforeEndGame(){
    for(let key in this.attackAnimationDict){
      if(this.attackAnimationDict[key] || this.deathAnimationDict[key] ||
      this.hurtAnimationDict[key] || this.jumpAnimationDict[key] ||
      this.runAnimationDict[key] || this.spellAnimationDict[key]){
        return false
      }
    }
    return true
  }

  async waitAndPlayAnim(entity: IBattleEntity, animName: string){
    await this.waitForOtherAnimationsToFinish(entity)
    this.setAnimAndResetOtherAnimations(entity.getName(), entity.getIndex(), animName)
    entity.playAnim(animName)
  }

  async playAnim(entity: IBattleEntity, animName: string){
    this.setAnimAndResetOtherAnimations(entity.getName(), entity.getIndex(), animName)
    // console.log('playing anim', entity.getName(), entity.getIndex(), animName)
    entity.getSprite().anims.stop();
    entity.playAnim(animName)
  }

  async playAnimIfNoneRuning(entity: IBattleEntity, animName: string){
    if(!this.isAnimPlaying(entity)){
      this.setAnimAndResetOtherAnimations(entity.getName(), entity.getIndex(), animName)
      entity.playAnim(animName)
    }
  }

  async waitAndIdle(entity: IBattleEntity){
    await this.waitForOtherAnimationsToFinish(entity)
    if(!entity.isDead()){
      entity.playAnim("idle")
      this.resetAllAnimations(entity.getName(), entity.getIndex())
    }
  }

  async waitForHalfAnimation(entity: IBattleEntity){
    let totalFrames = entity.getSprite().anims.getTotalFrames()
    let currentFrameIndex = entity.getSprite().anims.currentFrame?.index

    while(currentFrameIndex && currentFrameIndex <= totalFrames / 2){
      // console.log("Waiting for half animation")
      await new Promise(resolve => setTimeout(resolve, 5));
      totalFrames = entity.getSprite().anims.getTotalFrames()
      currentFrameIndex = entity.getSprite().anims.currentFrame?.index
    }
  }

  playSpellEffectOnEntity(entity: IBattleEntity, spellEffectName: string, scaleValue: number, frameRate: number){
    let spellEffect = this.battle.battleScene.add.sprite(entity.getSprite().x, entity.getSprite().y, spellEffectName);
    spellEffect.setOrigin(0.5, 1);
    // spellEffect.setScale(scaleValue)
    this.battle.battleScene.anims.create({
      key: spellEffectName + entity.getIndex(),
      frames: this.battle.battleScene.anims.generateFrameNumbers(spellEffectName),
      frameRate: frameRate,
      repeat: 0
    });
    this.spellAnimationDict[entity.getName() + entity.getIndex()] = true
    spellEffect.play(spellEffectName + entity.getIndex());
    spellEffect.once('animationcomplete', () => {
      spellEffect.destroy();
      this.spellAnimationDict[entity.getName() + entity.getIndex()] = false
    });
  }

  async createPlayAndWaitProjectile(targetEntity: IBattleEntity, casterEntity: IBattleEntity, animation: string){
    let {projectile, directionX} = this.createAndPlayProjectile(targetEntity, casterEntity, animation)
    await this.waitForCollision(projectile, targetEntity.getSprite(), directionX)
    projectile.destroy()
  }

  createAndPlayProjectile(targetEntity: IBattleEntity, casterEntity: IBattleEntity, animation: string): {projectile:Phaser.GameObjects.Image, directionX:number} {
    let direction = new Phaser.Math.Vector2( targetEntity.getSprite().getPlaceholderX() - casterEntity.getSprite().getPlaceholderX(), targetEntity.getSprite().getPlaceholderY() - casterEntity.getSprite().getPlaceholderY());
    let angle = Phaser.Math.Angle.Between(casterEntity.getSprite().getPlaceholderX(), casterEntity.getSprite().getPlaceholderY(), targetEntity.getSprite().getPlaceholderX(), targetEntity.getSprite().getPlaceholderY())

    let projectile = this.battle.battleScene.add.image(casterEntity.getSprite().getPlaceholderX(), casterEntity.getSprite().getCenterY(), "projectile_" + projectilesDict[animation + casterEntity.getName()].name)
    projectile.rotation = angle;
    
    this.battle.battleScene.physics.add.existing(projectile);

    if(projectile.body){
      projectile.body.velocity.x = direction.x;
      projectile.body.velocity.y = direction.y;
    }
    return {projectile, directionX:direction.x}
  }

  async waitForCollision(projectile: Phaser.GameObjects.Image, entitySprite: SpriteWrapper, directionX: number) {
    while(true) {
      if (directionX >= 0){
        if (projectile.x >= entitySprite.getPlaceholderX()) {
          return;
        }
      }
      else if (directionX < 0){
        if (projectile.x <= entitySprite.getPlaceholderX()) {
          return;
        }
      }
      await new Promise( resolve => setTimeout(resolve, 5));
    }
  }

  getAttackAnimationValue(entityName: string, entityIndex: number){
    return this.attackAnimationDict[entityName + entityIndex]
  }

  
  setAnimAndResetOtherAnimations(entityName: string, entityIndex: number, currentAnim: string){
    this.attackAnimationDict[entityName + entityIndex] = false
    this.deathAnimationDict[entityName + entityIndex] = false
    this.hurtAnimationDict[entityName + entityIndex] = false
    this.jumpAnimationDict[entityName + entityIndex] = false
    this.runAnimationDict[entityName + entityIndex] = false
    // this.idleAnimationDict[entityName + entityIndex] = false
    this.annimationStateIndexer[currentAnim][entityName + entityIndex] = true
  }

  resetAllAnimations(entityName: string, entityIndex: number){
    this.attackAnimationDict[entityName + entityIndex] = false
    this.deathAnimationDict[entityName + entityIndex] = false
    this.hurtAnimationDict[entityName + entityIndex] = false
    this.jumpAnimationDict[entityName + entityIndex] = false
    this.runAnimationDict[entityName + entityIndex] = false
    // this.idleAnimationDict[entityName + entityIndex] = false
  }
    
}


