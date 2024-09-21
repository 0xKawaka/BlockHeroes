import GameEventHandler from "../../Blockchain/event/GameEventHandler"
import { HeroInfos } from "../../Types/apiTypes"
import StateChangesHandler from "../State/StateChangesHandler"
import "./EndBattlePanel.css"
import ExperiencePanel from "./ExperiencePanel"
import LootItem from "./LootItem"
import { useEffect } from "react"
import LootPanel from "./LootPanel"
import {Maps} from "../../GameDatas/maps"
import { ArenaAccount, ArenaFullAccount } from "../../Types/customTypes"

type EndBattlePanelProps = {
  title:string,
  map: Maps,
  arenaAccount?: ArenaAccount,
  previousArenaRank?: number,
  heroesList: Array<HeroInfos>,
  heroesBeforeExperienceGained?: Array<HeroInfos>,
  eventHandler: GameEventHandler,
  setWinOrLose: React.Dispatch<React.SetStateAction<string>>,
  setIsLootPanelVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setEnemyAccountSelected?: React.Dispatch<React.SetStateAction<ArenaFullAccount | undefined>>,
  setShowArenaBattleSelect?: React.Dispatch<React.SetStateAction<boolean>>,
  stateChangesHandler: StateChangesHandler
}

// const imagesByItemName: {[key: string]: string} = {
//   "Emblem": emblemPng,
// }

export default function EndBattlePanel({title, map, arenaAccount, previousArenaRank, eventHandler, heroesList, heroesBeforeExperienceGained, setWinOrLose, setIsLootPanelVisible, setEnemyAccountSelected, setShowArenaBattleSelect, stateChangesHandler}: EndBattlePanelProps) {

  function handleContinue() {
    setShowArenaBattleSelect && setShowArenaBattleSelect(false)
    setEnemyAccountSelected && setEnemyAccountSelected(undefined)
    setWinOrLose("")
    setIsLootPanelVisible(false)
    stateChangesHandler.setIsBattleRunning(false)
  }

  return(
  <div className="EndBattlePanelContainer">
    {title === "Defeat" && 
    <div className="EndBattlePanelTitleDefeat">{title.toUpperCase()}</div>
    }
    {title === "Victory" && 
    <div className="EndBattlePanelVictoryContainer">
      <div className="EndBattlePanelTitleVictory">{title.toUpperCase()}</div>
      {previousArenaRank !== undefined && arenaAccount !== undefined &&
        <div className="EndBattlePanelNewRank">rank : {previousArenaRank} {`=>`} {arenaAccount.rank}</div>
      }
      {heroesBeforeExperienceGained !== undefined && 
        <ExperiencePanel heroesList={heroesList} eventHandler={eventHandler} heroesBeforeExperienceGained={heroesBeforeExperienceGained} />
      }
      <LootPanel eventHandler={eventHandler} />
    </div>
  
    }
    <div className="buttonContinue" onClick={handleContinue}>Continue</div>
  </div>
  )
}