import { Account } from "starknet"
import "./Pvp.css"
import PvpDefense from "./PvpDefense"
import { HeroInfos } from "../../Types/apiTypes"
import ArrowBack from "../../assets/misc/arrowback.png"
import { useState } from "react"

type PvpProps = {
  rank: number,
  heroesList: Array<HeroInfos>,
  defensePvpHeroesIds: number[],
  localWallet: Account
  setShowPvp: React.Dispatch<React.SetStateAction<boolean>>
  reloadPvpInfos(): Promise<void>
}

export default function Pvp({localWallet, rank, heroesList, defensePvpHeroesIds, setShowPvp, reloadPvpInfos}: PvpProps) {

  const [showDefense, setShowDefense] = useState<boolean>(false)

  if(rank == 0 || showDefense) {
    return(
      <div className="PvpAndArrowBackContainer">
        <div className="ArrowBackContainer">
          <img className="ArrowBack" src={ArrowBack} onClick={() => setShowPvp(false)} />
        </div>
        <div className="PvpContainer">
          <PvpDefense localWallet={localWallet} rank={rank} heroesList={heroesList} defensePvpHeroesIds={defensePvpHeroesIds} reloadPvpInfos={reloadPvpInfos} />
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
        <div className="MyRank">You're ranked {rank}</div>
        <div className="MyDefenseAndBattleHistoryButtonContainer">
          <div className="MyDefenseButton" onClick={() => setShowDefense(true)}>
            My defense
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