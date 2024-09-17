import { HeroInfos, HeroesStatsDict, RunesList, BattlesInfosDict } from "../../Types/apiTypes"
import "./WorldSelect.css"
import ArrowBack from "../../assets/misc/arrowback.png"
import { useState } from "react"
import BattlesSelect from "./BattlesSelect"
import { Account } from "starknet"
import StateChangesHandler from "../State/StateChangesHandler"
import EnergyHandler from "../Classes/EnergyHandler"
import { GameAccount } from '../../Types/toriiTypes'


type WorldSelectProps = {
  account: Account,
  gameAccount: GameAccount,
  worldsBattlesList: BattlesInfosDict
  heroesList: Array<HeroInfos>
  runesList: RunesList
  mapProgress: {[key: number]: number}
  stateChangesHandler: StateChangesHandler
}

export default function WorldSelect({account, gameAccount, worldsBattlesList, heroesList, runesList, mapProgress, stateChangesHandler }: WorldSelectProps) {

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
      <BattlesSelect account={account} gameAccount={gameAccount} worldId={worldId} battlesList={worldsBattlesList[worldId]} heroesList={heroesList} runesList={runesList} setWorldId={setWorldId} mapProgress={mapProgress} stateChangesHandler={stateChangesHandler} />
    }
  </div>
  )

}