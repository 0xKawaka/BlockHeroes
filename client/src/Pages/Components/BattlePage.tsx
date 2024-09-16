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

type BattlePageProps = {
  account: Account,
  worldId: number
  battleId: number
  selectedTeam: Entity[]
  selectedHeroesIds: number[]
  enemiesTeam: Entity[]
  heroesList: Array<HeroInfos>
  runesList: RunesList
  eventHandler: GameEventHandler
  setPhaserRunning: React.Dispatch<React.SetStateAction<boolean>>
  stateChangesHandler: StateChangesHandler
  setIsLootPanelVisible: React.Dispatch<React.SetStateAction<boolean>>
  setWinOrLose: React.Dispatch<React.SetStateAction<string>>
  setHeroesBeforeExperienceGained: React.Dispatch<React.SetStateAction<HeroInfos[]>>
}

export default function BattlePage({account, worldId, battleId, selectedTeam, selectedHeroesIds, enemiesTeam, heroesList, runesList, eventHandler, setPhaserRunning, stateChangesHandler, setIsLootPanelVisible, setWinOrLose, setHeroesBeforeExperienceGained}: BattlePageProps) {
  const {setup: {systemCalls: { playTurn }}} = useDojo();

  function handleStartFight() {
    const heroesBeforeExperienceGained = structuredClone(heroesList.filter(hero => selectedHeroesIds.some(id => id === hero.id)))
    setHeroesBeforeExperienceGained(heroesBeforeExperienceGained)
    stateChangesHandler.setIsBattleRunning(true)
    setPhaserRunning(true)
    setIsLootPanelVisible(false)
    const phaserGame = new Phaser.Game(getPhaserConfig(eventHandler, account, playTurn, "0xtest", "GamePhaserContainer", worldId, battleId, selectedTeam, selectedHeroesIds, enemiesTeam))
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
    stateChangesHandler.updateAfterExperience(heroesList, eventHandler.getExperienceGainEventArray())
    let loot = eventHandler.getLootEvent()
    if(loot !== undefined) {
      stateChangesHandler.updateLoot(loot)
    }
    let rune = eventHandler.getRuneMinted()
    if(rune !== undefined) {
      stateChangesHandler.updateNewRune(rune, runesList)
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