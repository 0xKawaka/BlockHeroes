import "./BattleOverview.css"
import HeroMiniature from "./HeroMiniature"
import portraitsDict from "../../assets/portraits/portraitsDict"
import energy from "../../assets/icons/energy.png"
import { EnemyInfos } from "../../Types/apiTypes"

type BattleOverviewProps = {
  enemies: EnemyInfos[],
  energyCost: number
}

export default function BattleOverview({enemies, energyCost }: BattleOverviewProps) {

  return(
  <div className="BattleOverview">
    <div className="EnemiesOverviewContainer">
      {enemies.map((enemy, i) => {
        return (
          <HeroMiniature key={i} image={portraitsDict[enemy.name]} rank={enemy.rank} level={enemy.level} imageWidth="9rem"></HeroMiniature>
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