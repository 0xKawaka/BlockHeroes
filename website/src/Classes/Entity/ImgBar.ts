import BarHandler from "../BarHandler";

export default class ImgBar {
  imgBar: Phaser.GameObjects.Image
  outliner: Phaser.GameObjects.Image
  hiddingBar: BarHandler

  constructor(battleScene: Phaser.Scene, x:number, y:number, imgStr:string, scale: number) {
    this.outliner = battleScene.add.image(x, y, imgStr + 'Outline')
    this.outliner.setScale(scale)
    this.imgBar = battleScene.add.image(x, y, imgStr)
    this.imgBar.setScale(scale)
  }

  setBarPercentageValue(percentage: number) {

  }

  hideBar() {
  }

  showBar() {

  }

  updateBothBars() {

  }

  getX(): number {
    return this.imgBar.x
  }
  getY(): number {
    return this.imgBar.y
  }
  getWidth(): number {
    return this.outliner.width
  }
  getHeight(): number {
    return this.outliner.height
  }
}