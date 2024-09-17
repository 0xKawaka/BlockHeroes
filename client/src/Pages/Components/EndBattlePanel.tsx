import GameEventHandler from "../../Blockchain/event/GameEventHandler"
import { HeroInfos } from "../../Types/apiTypes"
import StateChangesHandler from "../State/StateChangesHandler"
import "./EndBattlePanel.css"
import ExperiencePanel from "./ExperiencePanel"
import LootItem from "./LootItem"
import { useEffect } from "react"
import LootPanel from "./LootPanel"
import emblemPng from "../../assets/lootItems/emblem.png"

type EndBattlePanelProps = {
  title:string,
  heroesList: Array<HeroInfos>,
  heroesBeforeExperienceGained: Array<HeroInfos>,
  eventHandler: GameEventHandler,

  setWinOrLose: React.Dispatch<React.SetStateAction<string>>,
  setIsLootPanelVisible: React.Dispatch<React.SetStateAction<boolean>>,
  stateChangesHandler: StateChangesHandler
}

const imagesByItemName: {[key: string]: string} = {
  "Emblem": emblemPng,
}

export default function EndBattlePanel({title, eventHandler, heroesList, heroesBeforeExperienceGained, setWinOrLose, setIsLootPanelVisible, stateChangesHandler}: EndBattlePanelProps) {

  function handleContinue() {
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
      <ExperiencePanel heroesList={heroesList} eventHandler={eventHandler} heroesBeforeExperienceGained={heroesBeforeExperienceGained} />
      <LootPanel eventHandler={eventHandler} />
    </div>
  
    }
    <div className="buttonContinue" onClick={handleContinue}>Continue</div>
  </div>
  )
}