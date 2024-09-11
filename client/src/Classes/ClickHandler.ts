import Battle from "./Battle";
export default class ClickHandler {
  battle: Battle

  constructor(battle: Battle){
    this.battle = battle
  }

  handleClick(pointer: Phaser.Input.Pointer, currentlyOver: Array<Phaser.GameObjects.GameObject>) {
    if(currentlyOver[0]?.name === undefined) {
      console.log('PointerDown', currentlyOver[0]?.name );
      return
    }
    const splitedObjectName = ClickHandler.splitName(currentlyOver[0]?.name)
    if(splitedObjectName[0] === "skill"){
      // console.log("Skill clicked", splitedObjectName)
      this.battle.processSkillClick(splitedObjectName)
    }
    else if(splitedObjectName[0] === "entity"){
      this.battle.processEntityClick(splitedObjectName)
    }
  }

  static splitName(name: string) {
    return name.split('_')
  }
}