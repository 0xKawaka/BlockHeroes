export default class TextAnim extends Phaser.GameObjects.Text {
  distance: number
  distanceCount: number

  constructor(scene: Phaser.Scene, distance: number, x: number, y: number, text: string, style: any, color:number) {
    super(scene, x, y, text, style)
    this.setOrigin(0.5, 0.5)
    this.distance = distance
    this.distanceCount = 0
    this.setTint(color)
    scene.add.existing(this)
    scene.events.on('update', this.update, this)
  }

  update(){
    if(this.distanceCount < this.distance){
      this.distanceCount += 1
      this.y -= 1
    }
    else {
      this.alpha -= 0.003
      if(this.alpha <= 0){
        this.destroy()
      }
    }
  }
}