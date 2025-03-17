import EnergyHandler from "../Classes/EnergyHandler"
import runeStatsDict from '../../GameDatas/Statistics/runeStats'


export default class StateChangesHandler {
  energyHandler: EnergyHandler
  pvpEnergyHandler: EnergyHandler
  setShowMyHeroes: React.Dispatch<React.SetStateAction<boolean>>
  setShowWorldSelect: React.Dispatch<React.SetStateAction<boolean>>
  setIsBattleRunning: React.Dispatch<React.SetStateAction<boolean>>

// new StateChangesHandler(setShowMyHeroes, setShowWorldSelect, setIsBattleRunning)
  constructor(setShowMyHeroes: React.Dispatch<React.SetStateAction<boolean>>, setShowWorldSelect: React.Dispatch<React.SetStateAction<boolean>>, setIsBattleRunning: React.Dispatch<React.SetStateAction<boolean>>) {
    this.setShowMyHeroes = setShowMyHeroes
    this.setShowWorldSelect = setShowWorldSelect
    this.setIsBattleRunning = setIsBattleRunning
  }

  async updateEnergyHandler(energy: number, lastEnergyUpdateTimestamp: number) {
    this.energyHandler.updateEnergy(energy, lastEnergyUpdateTimestamp)
  }

  async updatePvpEnergyHandler(pvpEnergy: number, lastPvpEnergyUpdateTimestamp: number) {
    this.pvpEnergyHandler.updateEnergy(pvpEnergy, lastPvpEnergyUpdateTimestamp)
  }

  getTimeUntilNextEnergy() {
    return this.energyHandler.getTimeUntilNextEnergy()
  }

  getTimeUntilNextPvpEnergy() {
    return this.pvpEnergyHandler.getTimeUntilNextEnergy()
  }

  // setRuneStatsDict(runeStatsDict: RuneStatsDict) {
  //   this.runeStatsDict = runeStatsDict
  // }

  // setBaseStatsDict(baseStatsDict: BaseStatsDict) {
  //   this.baseStatsDict = baseStatsDict
  // }

  setEnergyHandler(energyHandler: EnergyHandler) {
    this.energyHandler = energyHandler
  }

  setPvpEnergyHandler(pvpEnergyHandler: EnergyHandler) {
    this.pvpEnergyHandler = pvpEnergyHandler
  }

  getRuneStatsDict() {
    return runeStatsDict
  }
}