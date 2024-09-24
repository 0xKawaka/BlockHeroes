import BattleScene from "../../Scenes/BattleScene"

const fontSizeByScale: {[key: number]: number } = {
  0.5: 7,
  1: 8,
  2: 14,
  3: 18,
  4: 21,
}

export default class BuffDisplay {
  image: Phaser.GameObjects.Image
  durationText: Phaser.GameObjects.Text
  // durationText: Phaser.GameObjects.BitmapText
  scale: number
  textScale: number
  fontSize: number

  constructor(imageName: string, battleScene: BattleScene, scale:number, textScale:number, visible:boolean = false, position: {image: {x: number, y: number}, text: {x: number, y: number}} = {image: {x: 0, y: 0}, text: {x: 0, y: 0}}, duration: number = 0, depth: number= 5) {
    this.scale = scale
    this.textScale = textScale
    this.image = battleScene.add.image(position.image.x, position.image.y, imageName)
    // this.image.setScale(scale)
    this.image.setVisible(visible)
    this.image.setOrigin(1, 1)
    // this.fontSize = Math.round(8 * textScale)
    this.fontSize = fontSizeByScale[textScale]
    this.durationText = battleScene.battle.UIScene.add.text(position.text.x, position.text.y, duration.toString(), { font: this.fontSize + "px kenney", color: "#e8e8e8" });
    // this.durationText = battleScene.add.text(position.x, position.y, duration.toString(), { font: this.fontSize + "px Arial", color: "#e8e8e8" });
    // this.durationText = battleScene.add.bitmapText(position.x, position.y, "RetroGaming10", duration.toString())
    // console.log("this.textScale ", this.textScale)
    // this.durationText.setScale(this.textScale)
    this.durationText.setOrigin(1, 1)
    this.durationText.setVisible(visible)

    this.durationText.setDepth(depth)
    this.image.setDepth(depth)
  }
  setScale(scale: number) {
    this.image.setScale(scale)
  }
  setVisible(visible: boolean) {
    this.image.setVisible(visible)
    this.durationText.setVisible(visible)
    this.image.update()
    this.durationText.update()
  }
  setXImage(x: number) {
    this.image.x = x
  }
  setYImage(y: number) {
    this.image.y = y
  }
  setXText(x: number) {
    this.durationText.x = x
  }
  setYText(y: number) {
    this.durationText.y = y
  }
  setDurationText(duration: number) {
    this.durationText.setText(duration.toString())
  }
}