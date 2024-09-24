import BattleScene from "../../Scenes/BattleScene"
import Battle from "../Battle"
import BuffDisplay from "./BuffDisplay"

export default class StackableBuff{
  name:string
  scale: number
  textScale: number
  fontSize: number
  visibleBuffs: Array<Boolean>
  buffs: Array<BuffDisplay>

  constructor(name:string, scale: number, textScale: number){
    this.name = name
    this.scale = scale
    this.textScale = textScale

    this.visibleBuffs = []
    this.buffs = []
  }

  createOrSetBuff(position:{image: {x: number, y: number}, text: {x: number, y: number}}, duration: number, battleScene: BattleScene) {
    for(let i= 0; i < this.visibleBuffs.length; i++){
      if(!this.visibleBuffs[i]){
        this.setExistingImage(i, position, duration)
        return
      }
    }
    this.createImage(position, duration,  battleScene)
  }
  createImage(position:{image: {x: number, y: number}, text: {x: number, y: number}}, duration: number, battleScene: BattleScene){
    this.visibleBuffs.push(true)
    this.buffs.push(new BuffDisplay("buff_" + this.name, battleScene, this.scale, this.textScale, true, position, duration))

  }
  setExistingImage(index:number, position:{image: {x: number, y: number}, text: {x: number, y: number}}, duration: number) {
    this.buffs[index].setXImage(position.image.x)
    this.buffs[index].setYImage(position.image.y)
    this.buffs[index].setXText(position.text.x)
    this.buffs[index].setYText(position.text.y)
    this.buffs[index].setDurationText(duration)
    this.visibleBuffs[index] = true
    this.buffs[index].setVisible(true)

  }
  reset() {
    for(let i = 0; i < this.visibleBuffs.length; i++){
      this.visibleBuffs[i] = false
      this.buffs[i].setVisible(false)
    }
  }

}