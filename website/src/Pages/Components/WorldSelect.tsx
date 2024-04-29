import { HeroInfos, HeroesStatsDict, RunesList, BattlesInfosDict, GameAccount } from "../../Types/apiTypes"
import "./WorldSelect.css"
import ArrowBack from "../../assets/misc/arrowback.png"
import { useState } from "react"
import BattlesSelect from "./BattlesSelect"
import { Account } from "starknet"
import StateChangesHandler from "../State/StateChangesHandler"
import EnergyHandler from "../Classes/EnergyHandler"


type WorldSelectProps = {
  energy: number
  worldsBattlesList: BattlesInfosDict
  heroesList: Array<HeroInfos>
  runesList: RunesList
  localWallet: Account
  stateChangesHandler: StateChangesHandler
}

export default function WorldSelect({ energy, worldsBattlesList, heroesList, runesList, localWallet, stateChangesHandler }: WorldSelectProps) {

  const [worldId, setWorldId] = useState<number>(-1)

  return(
  <div className="WorldSelectContainer">
    {worldId == -1 &&
      <div className="WorldSelectArrowBackAndWorldsListContainer">
        <div className="ArrowBackContainer" >
          <img className="ArrowBack" src={ArrowBack} onClick={() => stateChangesHandler.setShowWorldSelect(false)}/>
        </div>
        <div className="WorldsList">
          {Object.keys(worldsBattlesList).map((worldIndex, i) => {
            return (
              <div className="worldOverviewContainer" key={i} onClick={() => setWorldId(Number(worldIndex))}>
                <div className="worldName">World {worldIndex}</div>
              </div>
            )
          }
          )}
        </div>
      </div>
    }
    {worldId !== -1 &&
      <BattlesSelect energy={energy} worldId={worldId} battlesList={worldsBattlesList[worldId]} heroesList={heroesList} runesList={runesList} localWallet={localWallet} setWorldId={setWorldId} stateChangesHandler={stateChangesHandler} />
    }
  </div>
  )

}