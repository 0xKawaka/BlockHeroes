import { Account } from "starknet"
import "./Pvp.css"
import PvpDefense from "./PvpDefense"
import { HeroInfos } from "../../Types/apiTypes"
import ArrowBack from "../../assets/misc/arrowback.png"
import { useState } from "react"
import TeamDisplay from "./TeamDisplay"
import { ArenaFullAccount } from "../../Types/customTypes"
import ArenaLeaderboard from "./ArenaLeaderboard"

type PvpProps = {
  account: Account,
  rank: number,
  heroesList: Array<HeroInfos>,
  defenseArenaHeroesIds: number[],
  arenaFullAccounts: Array<ArenaFullAccount>,
  setDefenseArenaHeroesIds: React.Dispatch<React.SetStateAction<number[]>>
  setArenaAccount: React.Dispatch<React.SetStateAction<{rank: number, lastClaimedRewards: number}>>
  setShowPvp: React.Dispatch<React.SetStateAction<boolean>>
  loadPvpInfos(address: string): void
  updateGlobalPvpInfos(): void
}

export default function Pvp({account, rank, heroesList, defenseArenaHeroesIds, arenaFullAccounts, setDefenseArenaHeroesIds, setArenaAccount, setShowPvp, loadPvpInfos, updateGlobalPvpInfos}: PvpProps) {

  const [showDefense, setShowDefense] = useState<boolean>(false)
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false)

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

  return(
    <div className="PvpAndArrowBackContainer">
      <div className="ArrowBackContainer">
        <img className="ArrowBack" src={ArrowBack} onClick={() => setShowPvp(false)} />
      </div>
      <div className="PvpContainer">
        <div className="PvpRankAndDefenseContainer">
          <div className="MyRank">RANK {rank}</div>
          <div className="MyDefenseContainer">
            <TeamDisplay names={defenseHeroes.map(hero => hero.name)} levels={defenseHeroes.map(hero => hero.level)} imagesWidth="9rem"/>
            <div className="MyDefenseButton" onClick={() => setShowDefense(true)}>
              Modify
            </div>
          </div>
          <div className="PvpSearchBattleButtonContainer">
            <div className="PvpSearchBattleButton" onClick={() => setShowDefense(true)}>Battle</div>
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