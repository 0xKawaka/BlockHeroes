import { ArenaFullAccount } from "../../Types/customTypes"
import "./ArenaBattleSelect.css"
import TeamDisplay from "./TeamDisplay"

type ArenaBattleSelectProps = {
  arenaFullAccounts: Array<ArenaFullAccount>
  setEnemyAccountSelected: React.Dispatch<React.SetStateAction<ArenaFullAccount | undefined>>
}

export default function ArenaBattleSelect({arenaFullAccounts, setEnemyAccountSelected}: ArenaBattleSelectProps) {


  return(
    <div className="ArenaBattleSelectContainer">
      {arenaFullAccounts.map((account, i) => {
        return (
          <div className="ArenaBattleSelectAccountContainer" key={i}>
            <div className="ArenaBattleSelectAccount">
              <div className="ArenaBattleSelectRank">Rank {account.rank}</div>
              <div className="ArenaBattleSelectUsername">{account.username}</div>
              <div className="ArenaBattleSelectTeam">
                <TeamDisplay names={account.team.map(hero => hero.name)} levels={account.team.map(hero => hero.level)} imagesWidth="7.5rem" fontSize="1.2rem" bordersTopBottom={false} />
              </div>
              <div className="ArenaBattleSelectButton" onClick={() => (setEnemyAccountSelected(account))}>Battle</div>
            </div>
          </div>
        )})
      }
    </div>
  )
}