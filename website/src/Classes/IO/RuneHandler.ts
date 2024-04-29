import { RunesList } from "../../Types/apiTypes"

export default class RuneHandler {
  setRuneClickedId: React.Dispatch<React.SetStateAction<number>>
  setRuneSelectedId: React.Dispatch<React.SetStateAction<number>>
  handleRuneEquippedRH: (runeId: number, heroId: number, spot: number) => void
  handleRuneUnequippedRH: (runeId: number, heroId: number, spot: number) => void
  handleRuneUpgradedRH: (runeId:number, runesList: RunesList) => void


  constructor() {
  }

  handleRuneEquipped(runeId: number, heroId: number, spot: number) {
    this.setRuneClickedId(runeId)
    this.setRuneSelectedId(0)
    this.handleRuneEquippedRH(runeId, heroId, spot)
  }

  handleRuneUnequipped(runeId: number, heroId: number, spot: number) {
    this.setRuneClickedId(0)
    this.handleRuneUnequippedRH(runeId, heroId, spot)
  }

  handleRuneUpgraded(runeId:number, runesList: RunesList) {
    this.handleRuneUpgradedRH(runeId, runesList)
  }

  setHandleRuneEquippedRH(handleRuneEquippedRH: (runeId: number, heroId: number, spot: number) => void){
    this.handleRuneEquippedRH = handleRuneEquippedRH
  }

  setHandleRuneUnequippedRH(handleRuneUnequippedRH: (runeId: number, heroId: number, spot: number) => void){
    this.handleRuneUnequippedRH = handleRuneUnequippedRH
  }

  setHandleRuneUpgradedRH(handleRuneUpgradedRH: (runeId:number, runesList: RunesList) => void){
    this.handleRuneUpgradedRH = handleRuneUpgradedRH
  }

  setRuneClickedIdSetter(setRuneClickedId: React.Dispatch<React.SetStateAction<number>>){
    this.setRuneClickedId = setRuneClickedId
  }
  setRuneSelectedIdSetter(setRuneSelectedId: React.Dispatch<React.SetStateAction<number>>){
    this.setRuneSelectedId = setRuneSelectedId
  }
  
}