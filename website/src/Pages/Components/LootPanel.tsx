import GameEventHandler from "../../Blockchain/event/GameEventHandler"
import crystalImg from "../../assets/icons/crystal.png"
import "./LootPanel.css"
import runeImgDict from "../../assets/runes/runeImgDict"
import RuneMiniature from "./RuneMiniature"

type LootPanelProps = {
  eventHandler: GameEventHandler,
}

export default function LootPanel({eventHandler} : LootPanelProps) {
  const loot = eventHandler.getLootEvent()
  const rune = eventHandler.getRuneMinted()
  return(
    <div className="LootPanelContainer">
      {loot && loot.crystals > 0 &&
      <div className="LootCrystalsContainer">
          <div className="LootCrystalsValue">{loot.crystals}</div>
          <img className="LootCrystalIcon" src={crystalImg} />
      </div>
      }
      {rune &&
      <div className="LootRuneContainer">
        <RuneMiniature image={runeImgDict[rune.shape]} rank={rune.rank} imageWidth="7rem"/>
      </div>
      }
    </div>
    )
}