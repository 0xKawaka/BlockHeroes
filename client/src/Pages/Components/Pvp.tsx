import { Account } from "starknet"
import "./Pvp.css"
import PvpDefense from "./PvpDefense"
import { HeroInfos, HeroStats } from "../../Types/apiTypes"
import ArrowBack from "../../assets/misc/arrowback.png"
import { useState, useEffect } from "react"
import TeamDisplay from "./TeamDisplay"
import { ArenaAccount, ArenaFullAccount } from "../../Types/customTypes"
import ArenaLeaderboard from "./ArenaLeaderboard"
import ArenaBattleSelect from "./ArenaBattleSelect"
import BattleTeamSelection from "./BattleTeamSelection"
import GameEventHandler from "../../Blockchain/event/GameEventHandler"
import StateChangesHandler from "../State/StateChangesHandler"
import { GameAccount } from "../../Types/toriiTypes"
import {Maps} from "../../GameDatas/maps"
import EntityFactory from "../../Classes/Entity/EntityFactory"
import Entity from "../../Classes/Entity/Entity"
import BattlePage from "./BattlePage"
import EndBattlePanel from "./EndBattlePanel"

type PvpProps = {
  account: Account,
  gameAccount: GameAccount,
  arenaAccount: ArenaAccount,
  heroesList: Array<HeroInfos>,
  defenseArenaHeroesIds: number[],
  arenaFullAccounts: Array<ArenaFullAccount>,
  stateChangesHandler: StateChangesHandler
  setDefenseArenaHeroesIds: React.Dispatch<React.SetStateAction<number[]>>
  setArenaAccount: React.Dispatch<React.SetStateAction<{rank: number, lastClaimedRewards: number}>>
  setShowPvp: React.Dispatch<React.SetStateAction<boolean>>
  loadPvpInfos(address: string): void
  updateGlobalPvpInfos(): void
}

function computeTotalStats(baseStats: HeroStats, bonusStats: HeroStats): HeroStats {
  return {
    health: baseStats.health + bonusStats.health,
    speed: baseStats.speed + bonusStats.speed,
    attack: baseStats.attack + bonusStats.attack,
    defense: baseStats.defense + bonusStats.defense,
    criticalChance: baseStats.criticalChance + bonusStats.criticalChance,
    criticalDamage: baseStats.criticalDamage + bonusStats.criticalDamage,
  }
}

function getSelectedTeam(selectedHeroesIds:number[], heroesList: Array<HeroInfos>): Entity[] {
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

function getEnemiesTeam(enemies: HeroInfos[]): Entity[] {
  let entities: Entity[] = []
  enemies.forEach((enemy) => {
    let totalStats = computeTotalStats(enemy.baseStats, enemy.bonusStats)
    entities.push(EntityFactory.createEntity(enemy.name, enemy.level, totalStats.health, totalStats.speed, enemy.spells))
  })
  return entities
}

export default function Pvp({account, gameAccount, arenaAccount, heroesList, defenseArenaHeroesIds, arenaFullAccounts, stateChangesHandler, setDefenseArenaHeroesIds, setArenaAccount, setShowPvp, loadPvpInfos, updateGlobalPvpInfos}: PvpProps) {

  const [showDefense, setShowDefense] = useState<boolean>(false)
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false)
  const [showArenaBattleSelect, setShowArenaBattleSelect] = useState<boolean>(false)
  const [selectedHeroesIds, setSelectedHeroesIds] = useState<number[]>([])
  const [enemyAccountSelected,  setEnemyAccountSelected] = useState<ArenaFullAccount>()
  const [eventHandler, setGameEventHandler] = useState<GameEventHandler>()
  const [phaserRunning , setPhaserRunning] = useState<boolean>(false)
  const [isLootPanelVisible, setIsLootPanelVisible] = useState<boolean>(false)
  const [winOrLose, setWinOrLose] = useState<string>("")
  const [previousArenaRank, setPreviousArenaRank] = useState<number>(arenaAccount.rank)

  useEffect(() => {
    setGameEventHandler(new GameEventHandler(stateChangesHandler.getRuneStatsDict()))
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if(!phaserRunning) {
        updateGlobalPvpInfos();
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, [updateGlobalPvpInfos]); 

  let defenseHeroes: HeroInfos[] = []
  defenseArenaHeroesIds.map((heroId, i) => {
    const heroInfos = heroesList.find(hero => hero.id === heroId)
    if(heroInfos) {
      defenseHeroes.push(heroInfos)
    }
  })

  if(phaserRunning && enemyAccountSelected) {
    return(
      <BattlePage account={account} arenaAccount={arenaAccount} map={Maps.Arena} battleId={0} selectedTeam={getSelectedTeam(selectedHeroesIds, heroesList)} selectedHeroesIds={selectedHeroesIds} enemiesTeam={getEnemiesTeam(enemyAccountSelected.team)} heroesList={heroesList} enemyAccountSelected={enemyAccountSelected} arenaFullAccounts={arenaFullAccounts} eventHandler={eventHandler!} updateGlobalPvpInfos={updateGlobalPvpInfos} loadPvpInfos={loadPvpInfos} setPhaserRunning={setPhaserRunning} stateChangesHandler={stateChangesHandler} setPreviousArenaRank={setPreviousArenaRank} setIsLootPanelVisible={setIsLootPanelVisible} setWinOrLose={setWinOrLose} setEnemyAccountSelected={setEnemyAccountSelected} />
    )
  }

  if(isLootPanelVisible) {
    return(
    <div className="OutOfBattleContainer">
        <EndBattlePanel title={winOrLose} map={Maps.Arena} arenaAccount={arenaAccount} heroesList={heroesList} previousArenaRank={previousArenaRank} eventHandler={eventHandler!} setWinOrLose={setWinOrLose} setIsLootPanelVisible={setIsLootPanelVisible} setShowArenaBattleSelect={setShowArenaBattleSelect} stateChangesHandler={stateChangesHandler} setEnemyAccountSelected={setEnemyAccountSelected} />
    </div>
    )
  }

  if(arenaAccount.rank == 0 || showDefense) {
    return(
      <div className="PvpAndArrowBackContainer">
        <div className="ArrowBackContainer">
          <img className="ArrowBack" src={ArrowBack} onClick={() => arenaAccount.rank == 0 ? setShowPvp(false) : setShowDefense(false)} />
        </div>
        <div className="PvpContainer">
          <PvpDefense account={account} rank={arenaAccount.rank} heroesList={heroesList} defenseArenaHeroesIds={defenseArenaHeroesIds} loadPvpInfos={loadPvpInfos} setDefenseArenaHeroesIds={setDefenseArenaHeroesIds} setArenaAccount={setArenaAccount} updateGlobalPvpInfos={updateGlobalPvpInfos} />
        </div>
      </div>
    )
  }

  if(enemyAccountSelected) {
    return(
      <div className="PvpAndArrowBackContainer">
        <div className="ArrowBackContainer">
          <img className="ArrowBack" src={ArrowBack} onClick={() => setEnemyAccountSelected(undefined)} />
        </div>
        <BattleTeamSelection account={account} gameAccount={gameAccount} map={Maps.Arena} battleId={0} enemies={enemyAccountSelected.team} enemyAdrs={enemyAccountSelected.owner} energyCost={1} heroesList={heroesList} selectedHeroesIds={selectedHeroesIds} eventHandler={eventHandler!} setSelectedHeroesIds={setSelectedHeroesIds} setPhaserRunning={setPhaserRunning} stateChangesHandler={stateChangesHandler} />
      </div>
    )
  }

  if(showLeaderboard) {
    return(
      <div className="PvpAndArrowBackContainer">
        <div className="ArrowBackContainer">
          <img className="ArrowBack" src={ArrowBack} onClick={() => setShowLeaderboard(false)} />
        </div>
        <div className="PvpContainer">
          <ArenaLeaderboard arenaFullAccounts={arenaFullAccounts} />
        </div>
      </div>
    )
  }

  if(showArenaBattleSelect) {
    return(
      <div className="PvpAndArrowBackContainer">
        <div className="ArrowBackContainer">
          <img className="ArrowBack" src={ArrowBack} onClick={() => setShowArenaBattleSelect(false)} />
        </div>
        <div className="PvpContainer">
          <ArenaBattleSelect myRank={arenaAccount.rank} arenaFullAccounts={arenaFullAccounts} setEnemyAccountSelected={setEnemyAccountSelected} />
        </div>
      </div>
    )
  }

  return(
    <div className="PvpAndArrowBackContainer">
      <div className="ArrowBackContainer">
        <img className="ArrowBack" src={ArrowBack} onClick={() => setShowPvp(false)} />
      </div>
      <div className="PvpContainer">
        {showLeaderboard && <ArenaLeaderboard arenaFullAccounts={arenaFullAccounts} />}
        <div className="PvpRankAndDefenseContainer">
          <div className="MyRank">RANK {arenaAccount.rank}</div>
          <div className="MyDefenseContainer">
            <TeamDisplay names={defenseHeroes.map(hero => hero.name)} levels={defenseHeroes.map(hero => hero.level)} imagesWidth="9rem"/>
            <div className="MyDefenseButton" onClick={() => setShowDefense(true)}>
              Modify
            </div>
          </div>
          <div className="PvpSearchBattleButtonContainer">
            {arenaAccount.rank != 1 && <div className="PvpSearchBattleButton" onClick={() => setShowArenaBattleSelect(true)}>Battle</div>}
          </div>
          
        </div>
        <div className="LeaderboardAndBattleHistoryButtonContainer">
          <div className="LeaderboardButton" onClick={() => setShowLeaderboard(true)}>
            Leaderboard
          </div>
          {/* <div className="BattleHistoryButton" onClick={() => setShowDefense(true)}>
            Battle History
          </div> */}
        </div>
        <div className="PvpRankingsContainer">
        </div>
      </div>
    </div>
    )
}