import BarHandler from "../BarHandler";

export default class HealthBar{
  healthBar: BarHandler
  backgroundBar: BarHandler

  constructor(battleScene: Phaser.Scene, x:number, y:number, color:number, backgroundColor: number, width:number, height: number) {
    this.backgroundBar = new BarHandler(battleScene, x, y, backgroundColor, width, height)
    this.healthBar = new BarHandler(battleScene, x, y, color, width, height)
  }

  setBarPercentageValue(percentage: number) {
    this.healthBar.setBarPercentageValue(percentage);
  }

  hideBar() {
    this.healthBar.hideBar()
    this.backgroundBar.hideBar()
    this.updateBothBars()
  }

  showBar() {
    this.healthBar.showBar()
    this.backgroundBar.showBar()
    this.updateBothBars()
  }

  updateBothBars() {
    this.healthBar.updateBar()
    // this.backgroundBar.updateBar()
  }

  getX(): number {
    return this.healthBar.bar.x
  }
  getY(): number {
    return this.healthBar.bar.y
  }
  getWidth(): number {
    return this.healthBar.width
  }
  getHeight(): number {
    return this.healthBar.height
  }
}