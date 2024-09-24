export default class BitmapTextAnim extends Phaser.GameObjects.BitmapText {
  distance: number
  scaleValue: number
  distanceCount: number
  atTopStay: number
  atTopStayCount: number
  notIncreaseDistanceWhenCount: number
  increaseDistanceCount: number

  constructor(scene: Phaser.Scene, distance: number, scaleValue: number, x: number, y: number, text: string, font: string, color:number, depth: number= 6) {
    super(scene, x, y, font, text)
    this.setOrigin(0.5, 0.5)
    this.distance = distance
    this.scaleValue = scaleValue
    this.atTopStay = 40
    this.atTopStayCount = 0
    this.distanceCount = 0
    this.notIncreaseDistanceWhenCount = 3
    this.increaseDistanceCount = 0
    this.setTint(color)
    scene.add.existing(this)
    this.setDepth(depth)
    scene.events.on('update', this.update, this)
  }

  update(){
    if(this.distanceCount < this.distance){
      if(this.increaseDistanceCount % this.notIncreaseDistanceWhenCount == 0){
        this.increaseDistanceCount += 1
      }
      else {
        this.increaseDistanceCount += 1
        this.distanceCount += this.scaleValue
        this.y -= this.scaleValue
      }
    }
    else if (this.atTopStayCount < this.atTopStay) {
      this.atTopStayCount += 1
    }
    else {
      this.alpha -= 0.01
      if(this.alpha <= 0.15){
        this.destroy()
      }
    }
  }
}