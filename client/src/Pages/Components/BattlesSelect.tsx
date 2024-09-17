import { BattleInfos, HeroInfos, HeroStats, HeroesStatsDict, RunesList } from "../../Types/apiTypes"
import BattleOverview from "./BattleOverview"
import './BattlesSelect.css'
import { useEffect, useState } from "react"
import BattleTeamSelection from "./BattleTeamSelection"
import ArrowBack from "../../assets/misc/arrowback.png"
import BattlePage from "./BattlePage"
import EntityFactory from "../../Classes/Entity/EntityFactory"
import Entity from "../../Classes/Entity/Entity"
import Skill from "../../Classes/Skill/Skill"
import EndBattlePanel from "./EndBattlePanel"
import { Account } from "starknet"
import GameEventHandler from "../../Blockchain/event/GameEventHandler"
import StateChangesHandler from "../State/StateChangesHandler"
import EnergyHandler from "../Classes/EnergyHandler"
import { GameAccount } from "../../Types/toriiTypes"
import Maps from "../../GameDatas/maps"

type BattleSelectProps = {
  account: Account,
  gameAccount: GameAccount,
  worldId: number
  battlesList: Array<BattleInfos>
  heroesList: Array<HeroInfos>
  runesList: RunesList
  setWorldId: React.Dispatch<React.SetStateAction<number>>
  mapProgress: {[key: number]: number}
  stateChangesHandler: StateChangesHandler
}

function computeTotalStats(baseeStats: HeroStats, bonusStats: HeroStats): HeroStats {
  return {
    health: baseeStats.health + bonusStats.health,
    speed: baseeStats.speed + bonusStats.speed,
    attack: baseeStats.attack + bonusStats.attack,
    defense: baseeStats.defense + bonusStats.defense,
    criticalChance: baseeStats.criticalChance + bonusStats.criticalChance,
    criticalDamage: baseeStats.criticalDamage + bonusStats.criticalDamage,
  }
}

function BattlesSelect ({gameAccount, worldId, battlesList, heroesList, runesList, account, setWorldId, mapProgress, stateChangesHandler} : BattleSelectProps) {
  const [selectedBattleIndex, setSelectedBattleIndex] = useState<number>(-1)
  const [selectedHeroesIds, setSelectedHeroesIds] = useState<number[]>([])
  const [heroesBeforeExperienceGained, setHeroesBeforeExperienceGained] = useState<HeroInfos[]>([])
  const [phaserRunning , setPhaserRunning] = useState<boolean>(false)
  const [isLootPanelVisible, setIsLootPanelVisible] = useState<boolean>(false)
  const [winOrLose, setWinOrLose] = useState<string>("")
  const [eventHandler, setGameEventHandler] = useState<GameEventHandler>()

  useEffect(() => {
    setGameEventHandler(new GameEventHandler(stateChangesHandler.getRuneStatsDict()))
  }, [])

  function getSelectedTeam(selectedHeroesIds:number[]): Entity[] {
    let selectedTeamNames = []
    let selectedTeamStats = []
    let selectedTeamSkills = []
    for (let i=0; i<selectedHeroesIds.length; i++){
      const hero = heroesList.find(hero => hero.id === selectedHeroesIds[i])
      if (hero !== undefined){
        selectedTeamNames.push(hero.name)
        selectedTeamSkills.push(hero.spells)
        selectedTeamStats.push(computeTotalStats(hero.baseStats, hero.bonusStats))
      }
    }
    let entities = []
    for(let i =0; i <selectedTeamNames.length; i++){
      entities.push(EntityFactory.createEntity(selectedTeamNames[i], 1, selectedTeamStats[i].health, selectedTeamStats[i].speed, selectedTeamSkills[i]))
    }
    return entities
  }

  function getEnemiesTeam(selectedBattleIndex:number): Entity[] {
    let entities = []
    for (let i=0; i<battlesList[selectedBattleIndex].enemies.length; i++){
      entities.push(EntityFactory.createEntity(battlesList[selectedBattleIndex].enemies[i].name, battlesList[selectedBattleIndex].enemies[i].level, battlesList[selectedBattleIndex].enemies[i].stats.health, battlesList[selectedBattleIndex].enemies[i].stats.speed, battlesList[selectedBattleIndex].enemies[i].spells))
    }
    return entities
  }

  return (
  <div className="BattlesSelectContainer">
    {!phaserRunning && !isLootPanelVisible && selectedBattleIndex == -1  &&
      <div className="BattlesSelectArrowBackAndBattlesListContainer">
        <div className="ArrowBackContainer" >
          <img className="ArrowBack" src={ArrowBack} onClick={() => setWorldId(-1)}/>
        </div>
        <div className="BattlesSelectList">
          {battlesList !== undefined && battlesList.slice(0, mapProgress[Maps.Campaign] + 1).map((battle, i) => {
            return (  
              <div className="BattleOverviewContainer" key={i} onClick={() => setSelectedBattleIndex(i)}>
                <BattleOverview enemiesNames={battle.enemies.map((enemy) => {return enemy.name})} enemiesLevels={battle.enemies.map((enemy) => {return enemy.level})} energyCost={battle.energyCost} />
              </div>
            )
          })}
        </div>
      </div>
    }
    {!phaserRunning && !isLootPanelVisible && selectedBattleIndex !== -1 &&
      <div className="BattleTeamSelectAndArrowBackContainer">
        <div className="ArrowBackContainer">
          <img className="ArrowBack" src={ArrowBack} onClick={() => setSelectedBattleIndex(-1)}/>
        </div>
        <BattleTeamSelection account={account} gameAccount={gameAccount} map={Maps.Campaign} battleId={selectedBattleIndex} enemiesNames={battlesList[selectedBattleIndex].enemies.map((enemy) => {return enemy.name})} enemiesLevels={battlesList[selectedBattleIndex].enemies.map((enemy) => {return enemy.level})} energyCost={battlesList[selectedBattleIndex].energyCost} heroesList={heroesList} selectedHeroesIds={selectedHeroesIds} eventHandler={eventHandler!} setSelectedHeroesIds={setSelectedHeroesIds} setPhaserRunning={setPhaserRunning} stateChangesHandler={stateChangesHandler}/>
      </div>
    }
    {phaserRunning &&
      <BattlePage account={account} worldId={worldId} battleId={selectedBattleIndex} selectedTeam={getSelectedTeam(selectedHeroesIds)} selectedHeroesIds={selectedHeroesIds} enemiesTeam={getEnemiesTeam(selectedBattleIndex)} heroesList={heroesList} runesList={runesList} eventHandler={eventHandler!} mapProgress={mapProgress} map={Maps.Campaign} setPhaserRunning={setPhaserRunning} stateChangesHandler={stateChangesHandler} setIsLootPanelVisible={setIsLootPanelVisible} setWinOrLose={setWinOrLose} setHeroesBeforeExperienceGained={setHeroesBeforeExperienceGained} />
    }
    {!phaserRunning && isLootPanelVisible &&
      <div className="OutOfBattleContainer">
        {winOrLose === "Defeat" &&
          <EndBattlePanel title={winOrLose} heroesList={heroesList} heroesBeforeExperienceGained={heroesBeforeExperienceGained} eventHandler={eventHandler!} setWinOrLose={setWinOrLose} setIsLootPanelVisible={setIsLootPanelVisible} stateChangesHandler={stateChangesHandler} />          
        }
        {winOrLose === "Victory" &&
          <EndBattlePanel title={winOrLose} heroesList={heroesList} heroesBeforeExperienceGained={heroesBeforeExperienceGained} eventHandler={eventHandler!} setWinOrLose={setWinOrLose} setIsLootPanelVisible={setIsLootPanelVisible} stateChangesHandler={stateChangesHandler} />
        }
      </div>
    }
  </div>
  )
}

export default BattlesSelect