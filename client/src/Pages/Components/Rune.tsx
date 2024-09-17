import { log } from "console"
import RuneFactory from "../../Classes/Runes/RuneFactory"
import { HeroInfos, RuneInfos, RunesList } from "../../Types/apiTypes"
import StateChangesHandler from "../State/StateChangesHandler"
import "./Rune.css"
import RuneMiniature from "./RuneMiniature"
import { useState, useEffect } from "react"
import { Account } from "starknet"
import crystalImg from "../../assets/icons/crystal.png"
import { useDojo } from "../../dojo/useDojo"
import { GameAccount } from "../../Types/toriiTypes"

type RuneProps = {
  account: Account,
  gameAccount: GameAccount,
  runesList: Array<RuneInfos>,
  heroesList: Array<HeroInfos>,
  rune: RuneInfos,
  equipped: boolean,
  image: string,
  heroId: number,
  runeSpotClicked: number,
  alreadyEquippedRune: boolean,
  stateChangesHandler: StateChangesHandler,
}

const maxRankRune = 16


export default function Rune({account, gameAccount, runesList, heroesList, rune, equipped, image, heroId, runeSpotClicked, alreadyEquippedRune, stateChangesHandler}: RuneProps) {
  const equippedString = equipped ? "Remove" : "Equip"
  const processEquippedString = equipped ? "Removing" : "Equiping"

  const [insufficientCrystals, setInsufficientCrystals] = useState<boolean>(false)
  const [showEquipTooltip, setShowEquipTooltip] = useState<boolean>(false)
  const [showWrongShapeTooltip, setShowWrongShapeTooltip] = useState<boolean>(false)
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false)
  const [isEquipping, setIsEquipping] = useState<boolean>(false)
  const {setup: {systemCalls: { equipRune, unequipRune, upgradeRune }}} = useDojo();

  useEffect(() => {
    if (insufficientCrystals) {
      const timer = setTimeout(() => {
        setInsufficientCrystals(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [insufficientCrystals])

  async function handleEquipRune(rune: RuneInfos, heroId: number){
    setIsEquipping(true)
    const isSuccess = await equipRune(account, rune.id, heroId)
    if(isSuccess)
      stateChangesHandler.updateRuneEquip(rune, heroId, runesList, heroesList)
    setIsEquipping(false)
  }
  
  async function handleUnequipRune(rune: RuneInfos){
    setIsEquipping(true)
    const isSuccess = await unequipRune(account, rune.id)
    if(isSuccess)
      stateChangesHandler.updateRuneUnequip(rune, runesList, heroesList)
    setIsEquipping(false)
  }

  async function handleUpgradeRune(rune: RuneInfos){
    if(gameAccount.crystals < 200 + rune.rank * 200){
      setInsufficientCrystals(true)
      return;
    }
    setIsUpgrading(true)
    const upgradeRuneDatas = await upgradeRune(account, rune.id)
    if(upgradeRuneDatas.success == false){
      console.log("Upgrade rune failed")
      return
    }
    stateChangesHandler.updateRuneUpgrade(rune, upgradeRuneDatas.bonus, runesList, heroesList)
    stateChangesHandler.updateCrystals(upgradeRuneDatas.crystalCost)
    setIsUpgrading(false)
  }

  return(
    <div className="RuneContainer">
      <div className="RuneImageStatisticsContainer">
        <RuneMiniature image={image} rank={rune.rank} imageWidth="10rem"/>
        <div className="RuneStatisticsContainer">
          {rune.statistics.map((statistic, i) => {
            return (
              <div className="RuneStatistic" key={i}>
                <div className="RuneStatisticName">{statistic}</div>
                <div className="RuneStatisticValue">+{rune.values[i]}{rune.isPercent[i] ? "%" : ""}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="RuneButtonsContainer">
        {rune.rank < maxRankRune && 
        <div className={`RuneButtonUpgrade ${insufficientCrystals ? 'insufficient-crystals' : ''}`} onClick={() => isUpgrading ? undefined : handleUpgradeRune(rune)}>
          <div className="RuneButtonUpgradeText"> {isUpgrading ? "Upgrading" : "Upgrade"}</div>
          <div className="RuneButtonUpgradeCrystalValue">
            {200 + rune.rank * 200}
            <img className="RuneButtonUpgradeCrystalIcon" src={crystalImg} />
          </div>
          
        </div>}
        {equipped && <div className="RuneButton" onClick={isEquipping ? undefined : () => handleUnequipRune(rune)}>{isEquipping ? processEquippedString : equippedString}</div>}
        {!equipped && !alreadyEquippedRune && !(rune.shape !== runeSpotClicked) &&
          <div className="RuneButton" onClick={() => isEquipping ? undefined : handleEquipRune(rune, heroId)}>{isEquipping ? processEquippedString : equippedString}</div>
        }
        {!equipped && rune.shape !== runeSpotClicked &&
          <div className="RuneButton" onMouseOver={() => setShowWrongShapeTooltip(true)} onMouseOut={() => setShowWrongShapeTooltip(false)}>{isEquipping ? processEquippedString : equippedString}</div>
        }
        {!equipped && alreadyEquippedRune && !(rune.shape !== runeSpotClicked) &&
          <div className="RuneButton" onMouseOver={() => setShowEquipTooltip(true)} onMouseOut={() => setShowEquipTooltip(false)}>{isEquipping ? processEquippedString : equippedString}</div>
        }
      </div>
      {showEquipTooltip && <div className="equipTooltip">Remove the rune first</div>}
      {showWrongShapeTooltip && <div className="equipTooltip">The rune type does not match</div>}
    </div>
  )
}