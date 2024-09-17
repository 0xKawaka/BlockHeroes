import { ExperienceGainEvent, LootEvent, RuneBonusEvent } from "../../Blockchain/event/eventTypes"
import { HeroesFactory } from "../../Classes/Heroes/HeroesFactory"
import RuneFactory from "../../Classes/Runes/RuneFactory"
import { BaseStatsDict, HeroInfos, RuneInfos, RuneStatsDict } from "../../Types/apiTypes"
import { GameAccount } from "../../Types/toriiTypes"
import EnergyHandler from "../Classes/EnergyHandler"
import runeStatsDict from '../../GameDatas/Statistics/runeStats'
import baseStatsDict from '../../GameDatas/Statistics/baseStats'


export default class StateChangesHandler {
  energyHandler: EnergyHandler
  pvpEnergyHandler: EnergyHandler
  setHeroesList: React.Dispatch<React.SetStateAction<HeroInfos[]>>
  setRunesList: React.Dispatch<React.SetStateAction<RuneInfos[]>>
  setGameAccount: React.Dispatch<React.SetStateAction<GameAccount>>
  setShowMyHeroes: React.Dispatch<React.SetStateAction<boolean>>
  setShowWorldSelect: React.Dispatch<React.SetStateAction<boolean>>
  setIsBattleRunning: React.Dispatch<React.SetStateAction<boolean>>
  setMapProgress: React.Dispatch<React.SetStateAction<{[key: number]: number;}>>


  constructor(setHeroesList: React.Dispatch<React.SetStateAction<HeroInfos[]>>, setRunesList: React.Dispatch<React.SetStateAction<RuneInfos[]>>, setGameAccount: React.Dispatch<React.SetStateAction<GameAccount>>, setShowMyHeroes: React.Dispatch<React.SetStateAction<boolean>>, setShowWorldSelect: React.Dispatch<React.SetStateAction<boolean>>, setIsBattleRunning: React.Dispatch<React.SetStateAction<boolean>>, setMapProgress: React.Dispatch<React.SetStateAction<{[key: number]: number;}>>) {
    this.setHeroesList = setHeroesList
    this.setRunesList = setRunesList
    this.setGameAccount = setGameAccount
    this.setShowMyHeroes = setShowMyHeroes
    this.setShowWorldSelect = setShowWorldSelect
    this.setIsBattleRunning = setIsBattleRunning
    this.setMapProgress = setMapProgress
  }

  updateMapProgress(mapProgress: {[key: number]: number}) {
    this.setMapProgress(mapProgress)
  }

  updateLoot(loot: LootEvent) {
    this.setGameAccount((prevState: GameAccount) => {
      return {...prevState, crystals: prevState.crystals + loot.crystals}
    })
  }

  updateCrystals(crystalCost: number) {
    this.setGameAccount((prevState: GameAccount) => {
      return {...prevState, crystals: prevState.crystals - crystalCost}
    })
  }

  updateAfterExperience(heroesList: Array<HeroInfos>, experienceGainArray: ExperienceGainEvent[]) {
    let newHeroesList = [...heroesList]
    experienceGainArray.forEach((experienceGain: ExperienceGainEvent) => {
      const indexHero = newHeroesList.findIndex(h => h.id === experienceGain.entityId)
      newHeroesList[indexHero].experience = experienceGain.experienceAfter
      newHeroesList[indexHero].level = experienceGain.levelAfter
      newHeroesList[indexHero].baseStats = HeroesFactory.computeBaseStats(newHeroesList[indexHero].level, newHeroesList[indexHero].rank, baseStatsDict[newHeroesList[indexHero].name])
    })
    this.setHeroesList(newHeroesList)
  }

  async updateEnergyHandler(energy: number, lastEnergyUpdateTimestamp: number) {
    this.energyHandler.updateEnergy(energy, lastEnergyUpdateTimestamp)
  }

  async updatePvpEnergyHandler(pvpEnergy: number, lastPvpEnergyUpdateTimestamp: number) {
    this.pvpEnergyHandler.updateEnergy(pvpEnergy, lastPvpEnergyUpdateTimestamp)
  }

  updateNewRune(rune: RuneInfos, runesList: Array<RuneInfos>) {
    let newRunesList = [...runesList]
    newRunesList.push(rune)
    this.setRunesList(newRunesList)
  }

  updateRuneUpgrade(rune: RuneInfos, bonus: RuneBonusEvent | undefined, runesList: Array<RuneInfos>, heroesList: Array<HeroInfos>) {
    let upgradedRune = RuneFactory.upgradeRune(rune, bonus, runeStatsDict)
    let newRunesList = [...runesList]
    const indexRune = newRunesList.findIndex(r => r.id === rune.id)
    newRunesList[indexRune] = upgradedRune
    this.setRunesList(newRunesList)
    if(upgradedRune.isEquipped) {
      let newHeroesList = [...heroesList]
      const indexHero = newHeroesList.findIndex(h => h.id === upgradedRune.heroEquipped)
      let hero = newHeroesList[indexHero]
      let heroRunes = runesList.filter(rune => hero.runesIds.includes(rune.id))
      newHeroesList[indexHero].bonusStats = HeroesFactory.computeBonusStats(newHeroesList[indexHero].baseStats, heroRunes)
      this.setHeroesList(newHeroesList)
    }
    console.log("Upgraded rune:", rune.id)
  }
  
  updateRuneEquip(runeEquipped: RuneInfos, heroId: number, runesList: Array<RuneInfos>, heroesList: Array<HeroInfos>) {
    let newHeroesList = [...heroesList]
    let newRunesList = [...runesList]

    const indexHero = newHeroesList.findIndex(h => h.id === heroId)
    let hero = newHeroesList[indexHero]

    // const heroIndexRuneUnequipped = hero.spots.findIndex(spot => spot === runeEquipped.shape)
    // if(heroIndexRuneUnequipped !== -1) {
    //   const idRuneUnequipped = hero.runesIds.splice(heroIndexRuneUnequipped, 1)[0]
    //   hero.spots.splice(heroIndexRuneUnequipped, 1)
    //   const indexRuneUnequipped = newRunesList.findIndex(r => r.id === idRuneUnequipped)
    //   newRunesList[indexRuneUnequipped].isEquipped = false
    //   newRunesList[indexRuneUnequipped].heroEquipped = -1
    // }

    hero.runesIds.push(runeEquipped.id)
    hero.spots.push(runeEquipped.shape)
    let heroRunes = runesList.filter(rune => hero.runesIds.includes(rune.id))
    newHeroesList[indexHero].bonusStats = HeroesFactory.computeBonusStats(newHeroesList[indexHero].baseStats, heroRunes)

    const indexRuneEquipped = newRunesList.findIndex(r => r.id === runeEquipped.id)
    newRunesList[indexRuneEquipped].isEquipped = true
    newRunesList[indexRuneEquipped].heroEquipped = heroId

    this.setRunesList(newRunesList)
    this.setHeroesList(newHeroesList)

    console.log("Equipped rune:", runeEquipped.id)
  }

  updateRuneUnequip(runeUnequipped: RuneInfos, runesList: Array<RuneInfos>, heroesList: Array<HeroInfos>) {
    let newHeroesList = [...heroesList]
    let newRunesList = [...runesList]

    const indexHero = newHeroesList.findIndex(h => h.id === runeUnequipped.heroEquipped)
    let hero = newHeroesList[indexHero]

    const heroIndexRuneUnequipped = hero.spots.findIndex(spot => spot === runeUnequipped.shape)
    if(heroIndexRuneUnequipped !== -1) {
      const idRuneUnequipped = hero.runesIds.splice(heroIndexRuneUnequipped, 1)[0]
      hero.spots.splice(heroIndexRuneUnequipped, 1)
      const indexRuneUnequipped = newRunesList.findIndex(r => r.id === idRuneUnequipped)
      newRunesList[indexRuneUnequipped].isEquipped = false
      newRunesList[indexRuneUnequipped].heroEquipped = -1
    }
    else {
      throw new Error("updateRuneUnequip : Rune was not equipped")
    }

    let heroRunes = runesList.filter(rune => hero.runesIds.includes(rune.id))
    newHeroesList[indexHero].bonusStats = HeroesFactory.computeBonusStats(newHeroesList[indexHero].baseStats, heroRunes)

    this.setRunesList(newRunesList)
    this.setHeroesList(newHeroesList)

    console.log("Unequipped rune:", runeUnequipped.id)
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