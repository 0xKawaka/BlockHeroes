import "./BattleTeamSelection.css"
import HeroMiniature from "./HeroMiniature"
import portraitsDict from "../../assets/portraits/portraitsDict"
import energyImg from "../../assets/icons/energy.png"
import { useState, useEffect } from "react"
import { GameAccount, HeroInfos } from "../../Types/apiTypes"
import HeroesList from "./HeroesList"
import ApiHandler from "../../Classes/IO/ApiHandler"
import Skill from "../../Classes/Skill/Skill"
import { create } from "domain"
import SkillsHandler from "../../Classes/IO/SkillsHandler"
import { Sender } from "../../Blockchain/Sender"
import { Account } from "starknet"
import GameEventHandler from "../../Blockchain/event/GameEventHandler"
import StateChangesHandler from "../State/StateChangesHandler"
import { Getter } from "../../Blockchain/Getter"
import EnergyHandler from "../Classes/EnergyHandler"


type BattleTeamSelectionProps = {
  energy: number,
  worldId:number,
  battleId:number,
  enemiesNames: string[],
  enemiesLevels: number[],
  // enemiesRanks: number[],
  energyCost: number,
  heroesList: Array<HeroInfos>
  selectedHeroesIds: number[],
  localWallet: Account,
  eventHandler: GameEventHandler
  setSelectedHeroesIds: React.Dispatch<React.SetStateAction<number[]>>
  setPhaserRunning: React.Dispatch<React.SetStateAction<boolean>>
  stateChangesHandler: StateChangesHandler
}

export default function BattleTeamSelection({energy, worldId, battleId, enemiesNames, enemiesLevels, energyCost, heroesList, selectedHeroesIds, localWallet, eventHandler, setSelectedHeroesIds, setPhaserRunning, stateChangesHandler }: BattleTeamSelectionProps) {
  const [isStartingBattle, setIsStartingBattle] =  useState<boolean>(false)
  const notSelectedHeroesList = heroesList.filter(hero => !selectedHeroesIds.includes(hero.id))

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
    if(energy < energyCost){
      console.log("Not enough energy")
      return;
    }
    setIsStartingBattle(true)
    eventHandler.reset()
    const isBattleStarted = await Sender.startBattle(localWallet, selectedHeroesIds, worldId, battleId, eventHandler);
    if(isBattleStarted) {
      setIsStartingBattle(false)
      setPhaserRunning(true)
      const energyInfos = await Getter.getEnergyInfos(localWallet);
      console.log("energyInfos: ", energyInfos)
      stateChangesHandler.updateEnergyHandler(energyInfos.energy, energyInfos.lastEnergyUpdateTimestamp)
    }
    else {
      setIsStartingBattle(false)
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
            {enemiesNames.map((enemyName, i) => {
              return (
                <div className="HeroMiniatureWrapper" key={i}>
                  <HeroMiniature image={portraitsDict[enemyName]} rank={1} level={enemiesLevels[i]} imageWidth="9rem"></HeroMiniature>
                </div>
              )
            }
          )}
          </div>
        </div>
      </div>
      {!isStartingBattle && 
      <div className="BattleTeamSelectionPlayButton" onClick={handlePlayClick}>
        {energy < energyCost ?
          <div className="BattleTeamSelectionPlayButtonNotEnoughEnergyText">Not enough energy</div>
          :
          <div className="BattleTeamSelectionPlayButtonText">Play</div>
        }
        <div className="BattleTeamSelectionEnergyCostValueIconContainer">
          <div className="BattleTeamSelectionEnergyCostValue">{energyCost}</div>
          <img className="BattleTeamSelectionEnergyCostIcon" src={energyImg} />
        </div>
      </div>
      }
      {isStartingBattle &&
      <div className="BattleTeamSelectionPlayButton">
        <div className="BattleTeamSelectionPlayButtonText">Loading...</div>
      </div>
      }
    </div>
    <HeroesList heroesList={notSelectedHeroesList} handleHeroClick={handleHeroClick} heroesWidth="7.5rem"/> 
  </div>
  )
}