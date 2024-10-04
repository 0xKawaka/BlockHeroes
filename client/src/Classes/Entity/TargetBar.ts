import BarHandler from "../BarHandler";

export default class TargetBar {
  targetBar: BarHandler

  constructor(battleScene: Phaser.Scene, x:number, y:number, width:number, height: number, depth: number= 0) {
    this.targetBar = new BarHandler(battleScene, x, y, 0x7f8c8d, width, height, depth)
    this.targetBar.hideBar()
  }

  hideBar() {
    this.targetBar.hideBar()
    this.targetBar.updateBar()
  }

  showBar() {
    this.targetBar.showBar()
    this.targetBar.setColor(0xd4d0b8, 1)
  }

  removeHighlightBar() {
    this.targetBar.setColor(0xd4d0b8, 1)
  }

  highlightBar() {
    this.targetBar.setColor(0xffe057, 1)
  }  
}