import "./BattleTeamSelection.css"
import HeroMiniature from "./HeroMiniature"
import portraitsDict from "../../assets/portraits/portraitsDict"
import energyImg from "../../assets/icons/energy.png"
import pvpEnergyImg from "../../assets/icons/pvpEnergy.png"
import { useState, useEffect } from "react"
import { HeroInfos } from "../../Types/apiTypes"
import HeroesList from "./HeroesList"
import { Account } from "starknet"
import GameEventHandler from "../../Blockchain/event/GameEventHandler"
import StateChangesHandler from "../State/StateChangesHandler"
import { GameAccount, Hero } from "../../Types/toriiTypes"
import { useDojo } from "../../dojo/useDojo"
import {Maps} from "../../GameDatas/maps"
import { pvpBattleEnergyCost } from "../../GameDatas/constants"


type BattleTeamSelectionProps = {
  account: Account,
  gameAccount: GameAccount,
  map:Maps,
  battleId:number,
  enemies?: HeroInfos[],
  enemiesNames?: string[],
  enemiesLevels?: number[],
  enemyAdrs?: string,
  energyCost: number,
  heroesList: Array<HeroInfos>
  selectedHeroesIds: number[],
  eventHandler: GameEventHandler
  setSelectedHeroesIds: React.Dispatch<React.SetStateAction<number[]>>
  setPhaserRunning: React.Dispatch<React.SetStateAction<boolean>>
  stateChangesHandler: StateChangesHandler
}

export default function BattleTeamSelection({account, gameAccount, map, battleId, enemies, enemiesNames, enemiesLevels, enemyAdrs, energyCost, heroesList, selectedHeroesIds, eventHandler, setSelectedHeroesIds, setPhaserRunning, stateChangesHandler }: BattleTeamSelectionProps) {
  const [isStartingBattle, setIsStartingBattle] =  useState<boolean>(false)
  const notSelectedHeroesList = heroesList.filter(hero => !selectedHeroesIds.includes(hero.id))

  const {setup: {systemCalls: { startBattle, startPvpBattle }}} = useDojo();

  function handleHeroClick(heroId: number) {
    if(selectedHeroesIds.includes(heroId)){
      setSelectedHeroesIds(selectedHeroesIds.filter(id => id !== heroId))
    }
    else if (selectedHeroesIds.length < 4){
      setSelectedHeroesIds([...selectedHeroesIds, heroId])
    }
  }
  async function handlePlayClick() {
    if(selectedHeroesIds.length == 0){
      console.log("Can't start battle without heroes")
      return;
    }
    if((map == Maps.Campaign && gameAccount.energy < energyCost) || (map == Maps.Arena && gameAccount.pvpEnergy < energyCost) ){
      console.log("Not enough energy")
      return;
    }
    setIsStartingBattle(true)
    eventHandler.reset()
    let isBattleStarted = false;
    if(map === Maps.Arena && enemyAdrs) {
      isBattleStarted = await startPvpBattle(account, BigInt(enemyAdrs), selectedHeroesIds, eventHandler)
    }
    else if (map === Maps.Campaign) {
      isBattleStarted = await startBattle(account, selectedHeroesIds, map, battleId, eventHandler);
    }
    if(isBattleStarted) {
      setIsStartingBattle(false)
      setPhaserRunning(true)
      if(map === Maps.Campaign) {
        let updateTimestamp = eventHandler.getEnergyTimestamp()
        if(updateTimestamp != undefined){
          stateChangesHandler.updateEnergyHandler(gameAccount.energy - energyCost, updateTimestamp)
          stateChangesHandler.setGameAccount({...gameAccount, energy: gameAccount.energy - energyCost, lastEnergyUpdateTimestamp: updateTimestamp})
          console.log("account energy: ", gameAccount.energy - energyCost, " ", updateTimestamp)
        } 
      }
      else if(map === Maps.Arena) {
        let updateTimestamp = eventHandler.getPvpEnergyTimestamp()
        if(updateTimestamp != undefined){
          stateChangesHandler.updatePvpEnergyHandler(gameAccount.pvpEnergy - pvpBattleEnergyCost, updateTimestamp)
          stateChangesHandler.setGameAccount({...gameAccount, pvpEnergy: gameAccount.pvpEnergy - pvpBattleEnergyCost, lastPvpEnergyUpdateTimestamp: updateTimestamp})
          console.log("account pvp energy: ", gameAccount.pvpEnergy - pvpBattleEnergyCost, " ", updateTimestamp)
        }
      }
    }
    else {
      setIsStartingBattle(false)
      throw new Error("Battle not started")
    }
  }

  return(
  <div className="BattleTeamSelectionContainer">
    <div className="BattleTeamSelectionAndPlayButtonContainer">  
      <div className="BattleTeamSelectionTeamsContainer">
        <div className="BattleTeamSelectionMiniaturesAndTitleContainer">
          <div className="BattleTeamSelectionHeroesMiniatures">
            {selectedHeroesIds.length > 0 && selectedHeroesIds.map((heroId, i) => {
              const heroInfos = heroesList.find(hero => hero.id === heroId)
              if(heroInfos === undefined) return (<></>)
              return (
                <div className="HeroMiniatureWrapper" key={i} onClick={() =>  handleHeroClick(heroId)}>
                  <HeroMiniature image={portraitsDict[heroInfos.name]} rank={1} level={heroInfos.level} imageWidth="9rem"></HeroMiniature>
                </div>
              )
            }
          )}
          </div>
        </div>
        <div className="BattleTeamSelectionVersusText">VS</div>
        <div className="BattleTeamSelectionMiniaturesAndTitleContainer">
          <div className="BattleTeamSelectionEnemiesMiniatures">
            {enemies == undefined && enemiesNames && enemiesLevels && enemiesNames.map((enemyName, i) => {
              return (
                <div className="HeroMiniatureWrapper" key={i}>
                  <HeroMiniature image={portraitsDict[enemyName]} rank={1} level={enemiesLevels[i]} imageWidth="9rem"></HeroMiniature>
                </div>
              )
            })}
            {enemies && enemies.map((enemy, i) => {
              return (
                <div className="HeroMiniatureWrapper" key={i}>
                  <HeroMiniature image={portraitsDict[enemy.name]} rank={1} level={enemy.level} imageWidth="9rem"></HeroMiniature>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {!isStartingBattle && 
      <div className="BattleTeamSelectionPlayButton" onClick={handlePlayClick}>
        {gameAccount.energy < energyCost ?
          <div className="BattleTeamSelectionPlayButtonNotEnoughEnergyText">Not enough energy</div>
          :
          <div className="BattleTeamSelectionPlayButtonText">Play</div>
        }
        <div className="BattleTeamSelectionEnergyCostValueIconContainer">
          <div className="BattleTeamSelectionEnergyCostValue">{energyCost}</div>
          <img className="BattleTeamSelectionEnergyCostIcon" src={map == Maps.Campaign ? energyImg : pvpEnergyImg} />
        </div>
      </div>
      }
      {isStartingBattle &&
      <div className="BattleTeamSelectionPlayButton">
        <div className="BattleTeamSelectionPlayButtonText">Loading...</div>
      </div>
      }
    </div>
    <HeroesList heroesList={notSelectedHeroesList} baseHeroesNotOwned={[]} handleHeroClick={handleHeroClick} heroesWidth="7.5rem"/> 
  </div>
  )
}