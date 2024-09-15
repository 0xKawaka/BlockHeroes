import { ArenaFullAccount } from "../../Types/customTypes"
import "./ArenaLeaderboard.css"
import TeamDisplay from "./TeamDisplay"

type ArenaLeaderboardProps = {
  arenaFullAccounts: Array<ArenaFullAccount>
}

export default function ArenaLeaderboard({arenaFullAccounts}: ArenaLeaderboardProps) {
  return(
    <div className="ArenaLeaderboardContainer">
      {arenaFullAccounts.map((account, i) => {
        return (
          <div className="ArenaLeaderboardAccountContainer" key={i}>
            <div className="ArenaLeaderboardAccount">
              <div className="ArenaLeaderboardRank">Rank {account.rank}</div>
              <div className="ArenaLeaderboardUsername">{account.username}</div>
              <div className="ArenaLeaderboardTeam">
                <TeamDisplay names={account.team.map(hero => hero.name)} levels={account.team.map(hero => hero.level)} imagesWidth="7.5rem" fontSize="1.2rem" bordersTopBottom={false} />
              </div>
            </div>
          </div>
        )})
      }
    </div>
  )
}