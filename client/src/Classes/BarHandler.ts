export default class BarHandler {
  bar: Phaser.GameObjects.Graphics
  width: number
  height: number
  style: Phaser.GameObjects.Graphics
  rectangle: Phaser.GameObjects.Graphics

  constructor(battleScene: Phaser.Scene, x:number, y:number, color:number, width:number, height: number, depth: number= 1) {
    this.width = width
    this.height = height
    this.bar = this.createBar(battleScene, x, y, color, width, height)
    this.bar.setDepth(depth)
    this.rectangle.setDepth(depth)
    this.style.setDepth(depth)
  }

  createBar(battleScene: Phaser.Scene, x:number, y:number, color:number, width:number, height: number): Phaser.GameObjects.Graphics {
    let bar = this.makeBar(battleScene, x, y, color, width, height);
    return bar
  }

  setBarPercentageValue(percentage: number) {
    this.bar.scaleX = percentage;
    this.bar.update()
  }

  makeBar(battleScene: Phaser.Scene, x: number, y: number, color: number, width: number, height: number) {
    let bar = battleScene.add.graphics();
    this.style = bar.fillStyle(color, 1);
    this.rectangle = bar.fillRect(0, 0, width, height);
    bar.x = x;
    bar.y = y;
    return bar;
  }

  setColor(color: number, alpha: number) {
    this.bar.fillStyle(color, alpha);
    this.bar.fillRect(0, 0, this.width, this.height);
    this.bar.update()
  }

  hideBar() {
    this.bar.setVisible(false)
  }

  showBar() {
    this.bar.setVisible(true)
  }

  updateBar() {
    this.bar.update()
  }

}