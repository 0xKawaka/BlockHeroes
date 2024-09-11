import "./BattleOverview.css"
import HeroMiniature from "./HeroMiniature"
import portraitsDict from "../../assets/portraits/portraitsDict"
import energy from "../../assets/icons/energy.png"

type BattleOverviewProps = {
  enemiesNames: string[],
  enemiesLevels: number[],
  // enemiesRanks: number[],
  energyCost: number
}

export default function BattleOverview({enemiesNames, enemiesLevels, energyCost }: BattleOverviewProps) {

  return(
  <div className="BattleOverview">
    <div className="EnemiesOverviewContainer">
      {enemiesNames.map((enemyName, i) => {
        return (
          <HeroMiniature key={i} image={portraitsDict[enemyName]} rank={1} level={enemiesLevels[i]} imageWidth="9rem"></HeroMiniature>
        )
      }
      )}
    </div>
    <div className="EnergyCostContainer">
      <div className="EnergyCostValue">{energyCost}</div>
      <img className="EnergyCostIcon" src={energy} />
    </div>
  </div>
  )
}