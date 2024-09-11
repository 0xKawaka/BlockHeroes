export default class SpriteWrapper extends Phaser.GameObjects.Sprite {
  target: {x: number, y: number} | null
  placeholder: Phaser.GameObjects.Rectangle
  placeholderWidth: number
  placeholderHeight: number

  constructor(scene: Phaser.Scene, x: number, y: number, name: string, scaleValue: number, upscale: number, index: number) {
    super(scene, x, y, name);
    scene.add.existing(this);
    this.target = null
    // this.setScale(scaleValue)
    this.setOrigin(0.5, 1)

    this.placeholder = scene.add.rectangle(x, y, this.displayWidth / upscale / 5, this.displayHeight / upscale / 2.5, 0x000000, 0)
    this.placeholder.setOrigin(0.5, 1)
    this.placeholder.setName('entity_'+ index.toString())
    this.placeholder.setInteractive()
    scene.physics.add.existing(this.placeholder);
  }

  update(){
    this.setX(this.getPlaceholderX())
    this.setY(this.getPlaceholderY())
    if (this.target && this.placeholder.body) {
      const movingLeft = this.placeholder.body.velocity.x < 0
      const movingRight = this.placeholder.body.velocity.x > 0
      if ((movingRight && this.getPlaceholderX() >= this.target.x) ||
          (movingLeft && this.getPlaceholderX() <= this.target.x)) {
        this.updateFinalDestination()
        this.stopMoving()
      }
    }
  }

  stopMoving(){
    if(this.placeholder.body){
      this.placeholder.body.velocity.x = 0;
      this.placeholder.body.velocity.y = 0;
      this.target = null
    }
  }

  updateFinalDestination(){
    if(this.target){
      this.placeholder.setX(this.target.x)
      this.placeholder.setY(this.target.y)
      this.setX(this.target.x)
      this.setY(this.target.y)
    }
  }

  setDestination(x: number, y: number){
    this.target = {x: x, y: y}
  }

  isMoving(){
    return this.target != null
  }

  getPlaceholder(){
    return this.placeholder
  }

  getPlaceholderX(){
    return this.placeholder.x
  }

  getPlaceholderY(){
    return this.placeholder.y
  }

  getWidth(){
    return this.placeholder.width
  }

  getHeight(){
    return this.placeholder.height
  }

  getCenterY(): number{
    let y = this.placeholder.getCenter().y
    if (y)
      return y
    return 0
  }

}