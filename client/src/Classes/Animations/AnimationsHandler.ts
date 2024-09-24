import Battle from "../Battle"
import IBattleEntity from "../Entity/IBattleEntity"
import SpriteWrapper from "./SpriteWrapper"
import { skillAnimsDict } from "../../GameDatas/Skills/skills"
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
    this.annimationStateIndexer = {
      "attack": this.attackAnimationDict,
      "skill1": this.attackAnimationDict,
      "skill2": this.attackAnimationDict,
      "jump": this.jumpAnimationDict,
      "jumpStart": this.jumpAnimationDict,
      "jumpEnd": this.jumpAnimationDict,
      "run": this.runAnimationDict,
      "hurt": this.hurtAnimationDict,
      "die": this.deathAnimationDict,
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
      let skillAnimWrapper = skillAnimsDict[skill + casterEntity.getName()]
      await skillAnimsDict[skill + casterEntity.getName()].animPlayer.play(this, battle, skillAnimWrapper.animType, casterEntity, targetEntity, damageDict, healDict, statusDict, buffsDict, deathArray, skillAnimWrapper.xOffsetPercent)
    }
    else {
      await skillAnimsDict[skill].animPlayer.play(this, battle, skillAnimsDict[skill].animType, casterEntity, targetEntity, damageDict, healDict, statusDict, buffsDict, deathArray, skillAnimsDict[skill].xOffsetPercent)
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
      else if(anim.key === entity.getName() + entity.getIndex() + "jumpStart"){
        this.jumpAnimationDict[entity.getName() + entity.getIndex()] = false
      }
      else if(anim.key === entity.getName() + entity.getIndex() + "jumpEnd"){
        this.jumpAnimationDict[entity.getName() + entity.getIndex()] = false
      }
      else if (anim.key === entity.getName() + entity.getIndex() + "run"){
        this.runAnimationDict[entity.getName() + entity.getIndex()] = false
      }
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

  isHurtBlockingAnimPlaying(entity: IBattleEntity){
    return (this.attackAnimationDict[entity.getName() + entity.getIndex()] || this.deathAnimationDict[entity.getName() + entity.getIndex()] ||
    this.hurtAnimationDict[entity.getName() + entity.getIndex()] || this.jumpAnimationDict[entity.getName() + entity.getIndex()] ||
    this.runAnimationDict[entity.getName() + entity.getIndex()])
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
    entity.getSprite().anims.stop();
    entity.playAnim(animName)
  }

  async playAnimIfNoneRuning(entity: IBattleEntity, animName: string){
    if(animName == "hurt"){
      if(!this.isHurtBlockingAnimPlaying(entity)){
        this.setAnimAndResetOtherAnimations(entity.getName(), entity.getIndex(), animName)
        entity.playAnim(animName)
      }

    }
    else {
      if(!this.isAnimPlaying(entity)){
        this.setAnimAndResetOtherAnimations(entity.getName(), entity.getIndex(), animName)
        entity.playAnim(animName)
      }
    }
  }

  async waitAndPlayNonBlockingAnim(entity: IBattleEntity, animName: string){
    await this.waitForOtherAnimationsToFinish(entity)
    if(!entity.isDead()){
      entity.playAnim(animName)
      this.resetAllAnimations(entity.getName(), entity.getIndex())
    }
  }

  async waitAndIdle(entity: IBattleEntity){
    this.waitAndPlayNonBlockingAnim(entity, "idle")
  }

  async waitForHalfAnimation(entity: IBattleEntity){
    let totalFrames = entity.getSprite().anims.getTotalFrames()
    await this.waitForSpecificFrameNumber(entity, Math.ceil(totalFrames / 2))
  }

  async waitForSpecificFrameNumber(entity: IBattleEntity, frameNumber: number){
    let currentFrameIndex = entity.getSprite().anims.currentFrame?.index
    console.log("Waiting for specific frame number" + frameNumber)

    while(currentFrameIndex && currentFrameIndex <= frameNumber){
      // console.log("Waiting for specific frame number")
      await new Promise(resolve => setTimeout(resolve, 5));
      currentFrameIndex = entity.getSprite().anims.currentFrame?.index
    }
  }

  playSpellEffectOnEntity(entity: IBattleEntity, spellEffectName: string, frameRate: number){
    let spellEffect = this.battle.battleScene.add.sprite(entity.getSprite().x, entity.getSprite().y, spellEffectName);
    spellEffect.setDepth(4)
    spellEffect.setOrigin(0.5, 1);
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
  playSpellEffectOnEntitiesCenter(entities: Array<IBattleEntity>, spellEffectName: string, frameRate: number){
    let x = 0
    let y = 0
    entities.forEach(entity => {
      x += entity.getSprite().x
      y += entity.getSprite().y
    });
    x = x / entities.length
    y = y / entities.length
    let spellEffect = this.battle.battleScene.add.sprite(x, y, spellEffectName);
    spellEffect.setDepth(4)
    spellEffect.setOrigin(0.5, 1);
    this.battle.battleScene.anims.create({
      key: spellEffectName,
      frames: this.battle.battleScene.anims.generateFrameNumbers(spellEffectName),
      frameRate: frameRate,
      repeat: 0
    });
    spellEffect.play(spellEffectName);
    spellEffect.once('animationcomplete', () => {
      spellEffect.destroy();
    });
  }
  

  async createPlayAndWaitProjectile(targetEntity: IBattleEntity, casterEntity: IBattleEntity, startPosition: {x: number, y: number}, animation: string){
    let {projectile, directionX} = this.createAndPlayProjectile(targetEntity, casterEntity, startPosition, animation)
    await this.waitForCollision(projectile, targetEntity.getSprite(), directionX)
    projectile.destroy()
  }

  createAndPlayProjectile(targetEntity: IBattleEntity, casterEntity: IBattleEntity, startPosition: {x: number, y: number}, animation: string): {projectile:Phaser.GameObjects.Image, directionX:number} {
    let direction = new Phaser.Math.Vector2( targetEntity.getSprite().getCenterX() - startPosition.x, targetEntity.getSprite().getCenterY() - startPosition.y);
    let angle = 0;
    if(projectilesDict[animation + casterEntity.getName()].changeAngle)
      angle = Phaser.Math.Angle.Between(startPosition.x, startPosition.y, targetEntity.getSprite().getCenterX(), targetEntity.getSprite().getCenterY())
    let projectile;
    if(projectilesDict[animation + casterEntity.getName()].framerate == 0){
      projectile = this.battle.battleScene.add.image(startPosition.x, startPosition.y, projectilesDict[animation + casterEntity.getName()].name)
    }
    else {
      projectile = this.battle.battleScene.add.sprite(startPosition.x, startPosition.y, projectilesDict[animation + casterEntity.getName()].name)
      this.battle.battleScene.anims.create({
        key: animation + casterEntity.getName(),
        frames: this.battle.battleScene.anims.generateFrameNumbers(projectilesDict[animation + casterEntity.getName()].name),
        frameRate: projectilesDict[animation + casterEntity.getName()].framerate,
        repeat: -1
      });
      projectile.play(animation + casterEntity.getName());
    }
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


