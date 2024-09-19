import { getPhaserConfig } from "../../Scenes/phaserConfig"
import "./BattlePage.css"
import { useEffect, useState } from "react"
import EndBattlePanel from "./EndBattlePanel"
import { HeroInfos, HeroStats, RunesList } from "../../Types/apiTypes"
import Entity from "../../Classes/Entity/Entity"
import GameEventHandler from "../../Blockchain/event/GameEventHandler"
import { Account } from "starknet"
import StateChangesHandler from "../State/StateChangesHandler"
import { useDojo } from "../../dojo/useDojo"
import Maps from "../../GameDatas/maps"
import { ArenaAccount, ArenaFullAccount } from "../../Types/customTypes"
import { num } from "starknet";

type BattlePageProps = {
  account: Account,
  arenaAccount?: ArenaAccount
  map: Maps
  battleId: number
  selectedTeam: Entity[]
  selectedHeroesIds: number[]
  enemiesTeam: Entity[]
  heroesList: Array<HeroInfos>
  enemyAccountSelected?: ArenaFullAccount
  arenaFullAccounts?: Array<ArenaFullAccount>,
  runesList?: RunesList
  eventHandler: GameEventHandler
  mapProgress?: {[key: number]: number}
  updateGlobalPvpInfos?: () => void
  loadPvpInfos?: (address: string) => void
  setPhaserRunning: React.Dispatch<React.SetStateAction<boolean>>
  stateChangesHandler: StateChangesHandler
  setPreviousArenaRank?: React.Dispatch<React.SetStateAction<number>>
  setEnemyAccountSelected?: React.Dispatch<React.SetStateAction<ArenaFullAccount | undefined>>
  setIsLootPanelVisible: React.Dispatch<React.SetStateAction<boolean>>
  setWinOrLose: React.Dispatch<React.SetStateAction<string>>
  setHeroesBeforeExperienceGained?: React.Dispatch<React.SetStateAction<HeroInfos[]>>
}


export default function BattlePage({account, arenaAccount, map, battleId, selectedTeam, selectedHeroesIds, enemiesTeam, heroesList, enemyAccountSelected, arenaFullAccounts, runesList, eventHandler, mapProgress, updateGlobalPvpInfos, loadPvpInfos, setPhaserRunning, stateChangesHandler, setPreviousArenaRank, setEnemyAccountSelected, setIsLootPanelVisible, setWinOrLose, setHeroesBeforeExperienceGained}: BattlePageProps) {
  const {setup: {systemCalls: { playTurn, playArenaTurn }}} = useDojo();

  function handleStartFight() {
    if(map === Maps.Campaign){
      if(setHeroesBeforeExperienceGained == undefined) {
        throw new Error("BattlePage setHeroesBeforeExperienceGained is undefined")
      }
      const heroesBeforeExperienceGained = structuredClone(heroesList.filter(hero => selectedHeroesIds.some(id => id === hero.id)))
      setHeroesBeforeExperienceGained(heroesBeforeExperienceGained)
    }
    stateChangesHandler.setIsBattleRunning(true)
    setPhaserRunning(true)
    setIsLootPanelVisible(false)
    const phaserGame = new Phaser.Game(getPhaserConfig(eventHandler, account, map == Maps.Campaign ? playTurn : playArenaTurn, "GamePhaserContainer", map, battleId, selectedTeam, enemiesTeam))
    phaserGame.events.on('destroy', () => {
      onDestroyProcs()
    })
  }

  useEffect(() => {
      handleStartFight()
  }, [])
  
  async function onDestroyProcs() {
    console.log("Game destroyed")
    const endBattleEvent = eventHandler.getEndBattleEvent()
    if(endBattleEvent === undefined) {
      console.log("End battle event is undefined")
      return
    }
    console.log('endBattleEvent.hasPlayerWon : ' + endBattleEvent.hasPlayerWon)
    setWinOrLose(endBattleEvent.hasPlayerWon ? "Victory" : "Defeat")
    if(map === Maps.Campaign){
      if(endBattleEvent.hasPlayerWon && mapProgress !== undefined && battleId !== undefined && mapProgress[map] <= battleId){
        mapProgress[map] = battleId + 1
        stateChangesHandler.updateMapProgress(mapProgress)
      }
      stateChangesHandler.updateAfterExperience(heroesList, eventHandler.getExperienceGainEventArray())
      let loot = eventHandler.getLootEvent()
      if(loot !== undefined) {
        stateChangesHandler.updateLoot(loot)
      }
      let rune = eventHandler.getRuneMinted()
      if(rune !== undefined && runesList !== undefined) {
        stateChangesHandler.updateNewRune(rune, runesList)
      }
    }
    else if(map === Maps.Arena) {
      let rankChanges = eventHandler.getRankChange()
      if(rankChanges !== undefined) {
        let enemyAdrsHex = num.toHexString(enemyAccountSelected!.owner)
        let ownerRankChange = rankChanges.find(rankChange => rankChange.owner === account.address)
        let enemyRankChange = rankChanges.find(rankChange => rankChange.owner === enemyAdrsHex)
        // console.log("ownerRankChange", ownerRankChange)
        // console.log("enemyRankChange", enemyRankChange)
        stateChangesHandler.updateArenaFullAccounts(arenaFullAccounts!, rankChanges)
        setPreviousArenaRank && setPreviousArenaRank(arenaAccount!.rank)
        ownerRankChange && stateChangesHandler.setArenaAccount({...arenaAccount!, rank: ownerRankChange.rank})
        enemyRankChange && setEnemyAccountSelected!({...enemyAccountSelected!, rank: enemyRankChange!.rank})
      }
      await new Promise(r => setTimeout(r, 1000));
      loadPvpInfos!(account.address)
      updateGlobalPvpInfos!()
    }
    setPhaserRunning(false)
    stateChangesHandler.setIsBattleRunning(false)
    setIsLootPanelVisible(true)
  }

  return(
  <div className="BattlePageContainer">

  </div>
  )
}