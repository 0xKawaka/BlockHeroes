import { Account } from "starknet"
import "./Pvp.css"
import PvpDefense from "./PvpDefense"
import { HeroInfos } from "../../Types/apiTypes"
import ArrowBack from "../../assets/misc/arrowback.png"
import { useState, useEffect } from "react"
import TeamDisplay from "./TeamDisplay"
import { ArenaFullAccount } from "../../Types/customTypes"
import ArenaLeaderboard from "./ArenaLeaderboard"
import ArenaBattleSelect from "./ArenaBattleSelect"
import BattleTeamSelection from "./BattleTeamSelection"
import GameEventHandler from "../../Blockchain/event/GameEventHandler"
import StateChangesHandler from "../State/StateChangesHandler"
import { GameAccount } from "../../Types/toriiTypes"
import Maps from "../../GameDatas/maps"

type PvpProps = {
  account: Account,
  gameAccount: GameAccount,
  rank: number,
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

export default function Pvp({account, gameAccount, rank, heroesList, defenseArenaHeroesIds, arenaFullAccounts, stateChangesHandler, setDefenseArenaHeroesIds, setArenaAccount, setShowPvp, loadPvpInfos, updateGlobalPvpInfos}: PvpProps) {

  const [showDefense, setShowDefense] = useState<boolean>(false)
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false)
  const [showArenaBattleSelect, setShowArenaBattleSelect] = useState<boolean>(false)
  const [enemyAccountSelected,  setEnemyAccountSelected] = useState<ArenaFullAccount>()
  const [eventHandler, setGameEventHandler] = useState<GameEventHandler>()

  useEffect(() => {
    setGameEventHandler(new GameEventHandler(stateChangesHandler.getRuneStatsDict()))
  }, [])

  let defenseHeroes: HeroInfos[] = []
  defenseArenaHeroesIds.map((heroId, i) => {
    const heroInfos = heroesList.find(hero => hero.id === heroId)
    if(heroInfos) {
      defenseHeroes.push(heroInfos)
    }
  })

  if(rank == 0 || showDefense) {
    return(
      <div className="PvpAndArrowBackContainer">
        <div className="ArrowBackContainer">
          <img className="ArrowBack" src={ArrowBack} onClick={() => rank == 0 ? setShowPvp(false) : setShowDefense(false)} />
        </div>
        <div className="PvpContainer">
          <PvpDefense account={account} rank={rank} heroesList={heroesList} defenseArenaHeroesIds={defenseArenaHeroesIds} loadPvpInfos={loadPvpInfos} setDefenseArenaHeroesIds={setDefenseArenaHeroesIds} setArenaAccount={setArenaAccount} updateGlobalPvpInfos={updateGlobalPvpInfos} />
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
        <BattleTeamSelection account={account} gameAccount={gameAccount} worldId={Maps.Arena} battleId={0} enemies={enemyAccountSelected.team} enemiesNames={enemyAccountSelected.team.map(hero => hero.name)} enemiesLevels={enemyAccountSelected.team.map(hero => hero.level)} enemyAdrs={enemyAccountSelected.owner} energyCost={0} heroesList={heroesList} selectedHeroesIds={[]} eventHandler={eventHandler!} setSelectedHeroesIds={() => {}} setPhaserRunning={() => {}} stateChangesHandler={stateChangesHandler} />
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
          <ArenaBattleSelect arenaFullAccounts={arenaFullAccounts} setEnemyAccountSelected={setEnemyAccountSelected} />
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
          <div className="MyRank">RANK {rank}</div>
          <div className="MyDefenseContainer">
            <TeamDisplay names={defenseHeroes.map(hero => hero.name)} levels={defenseHeroes.map(hero => hero.level)} imagesWidth="9rem"/>
            <div className="MyDefenseButton" onClick={() => setShowDefense(true)}>
              Modify
            </div>
          </div>
          <div className="PvpSearchBattleButtonContainer">
            <div className="PvpSearchBattleButton" onClick={() => setShowArenaBattleSelect(true)}>Battle</div>
          </div>
          
        </div>
        <div className="LeaderboardAndBattleHistoryButtonContainer">
          <div className="LeaderboardButton" onClick={() => setShowLeaderboard(true)}>
            Leaderboard
          </div>
          <div className="BattleHistoryButton" onClick={() => setShowDefense(true)}>
            Battle History
          </div>
        </div>
        <div className="PvpRankingsContainer">
        </div>
      </div>
    </div>
    )
}