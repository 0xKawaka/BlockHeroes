import { ArenaFullAccount } from "../../Types/customTypes"
import "./ArenaBattleSelect.css"
import TeamDisplay from "./TeamDisplay"
import arenaRanges from "../../GameDatas/Arena/arenaRanges"


type ArenaBattleSelectProps = {
  myRank: number
  arenaFullAccounts: Array<ArenaFullAccount>
  setEnemyAccountSelected: React.Dispatch<React.SetStateAction<ArenaFullAccount | undefined>>
}

function getInRangeEnemiesIndexes(myRank: number): number[] {
  let indexes: Array<number> = [];
  for (let i = 0; i < arenaRanges.minRankRange.length; i++) {
    if (myRank <= arenaRanges.minRankRange[i]) {
      const start = Math.max(0, myRank - arenaRanges.range[i] - 1);
      const end = Math.max(0, myRank - 2);
      for (let j = start; j <= end; j++) {
        indexes.push(j);
      }
      break;
    }
  }
  return indexes;
}

export default function ArenaBattleSelect({myRank, arenaFullAccounts, setEnemyAccountSelected}: ArenaBattleSelectProps) {

  const inRangeEnemiesIndexes = getInRangeEnemiesIndexes(myRank)

  return(
    <div className="ArenaBattleSelectContainer">
      {arenaFullAccounts.slice(inRangeEnemiesIndexes[0], inRangeEnemiesIndexes[inRangeEnemiesIndexes.length - 1] + 1).map((account, i) => {
        // const isInRange = inRangeEnemiesIndexes.includes(i)
        return (
          // <div className={isInRange ? "ArenaBattleSelectAccountContainer" : "ArenaBattleSelectAccountContainerGray" } key={i}>
          <div className={"ArenaBattleSelectAccountContainer" } key={i}>
            <div className="ArenaBattleSelectAccount">
              <div className="ArenaBattleSelectRank">Rank {account.rank}</div>
              <div className="ArenaBattleSelectUsername">{account.username}</div>
              <div className="ArenaBattleSelectTeam">
                <TeamDisplay names={account.team.map(hero => hero.name)} levels={account.team.map(hero => hero.level)} imagesWidth="7.5rem" fontSize="1.2rem" bordersTopBottom={false} />
              </div>
              <div className="ArenaBattleSelectButton" onClick={() => (setEnemyAccountSelected(account))}>Battle</div>
              {/* {isInRange ?
                <div className="ArenaBattleSelectButton" onClick={() => (setEnemyAccountSelected(account))}>Battle</div>
                :
                <div className="ArenaBattleSelectPlaceholder"></div>
              } */}
            </div>
          </div>
        )})
      }
    </div>
  )
}