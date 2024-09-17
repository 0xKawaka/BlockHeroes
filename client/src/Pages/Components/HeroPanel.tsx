import "./HeroPanel.css"
import { useState } from 'react'
import ArrowBack from "../../assets/misc/arrowback.png"
import {HeroInfos, RunesList, HeroStats} from '../../Types/apiTypes'
import RunesDisplay from "./RunesDisplay"
import StatsDisplay from "./StatsDisplay"
import SpellsPanel from "./SpellsPanel"
import { GameAccount } from "../../Types/toriiTypes"

type HeroPanelProps = {
  gameAccount: GameAccount,
  heroIndex: number,
  heroInfos: HeroInfos,
  runesList: RunesList,
  setShowingHero: React.Dispatch<React.SetStateAction<boolean>>,
  handleRuneClick(runeIndex: number, runeSpotClicked: number): void
}

export default function HeroPanel({gameAccount, heroIndex, heroInfos, runesList, setShowingHero, handleRuneClick}: HeroPanelProps) {
  const [spellsPanelSelected, setSpellsPanelSelected] = useState<boolean>(false)
  const [statsPanelSelected, setStatsPanelSelected] = useState<boolean>(true)

  function handleSelectSpells() {
    setSpellsPanelSelected(true)
    setStatsPanelSelected(false)
  }
  function handleSelectStats() {
    setSpellsPanelSelected(false)
    setStatsPanelSelected(true)
  }
  function styleStatsPanel(){
    if(statsPanelSelected){
      return {textDecoration: 'underline'}
    }
  }
  function styleSpellsPanel(){
    if(spellsPanelSelected){
      return {textDecoration: 'underline'}
    }
  }

  return(
    <div className="HeroPanelContainer">
      <div className="ArrowBackContainer" >
        <img className="ArrowBack" src={ArrowBack} onClick={() => setShowingHero(false)} />
      </div>
      <div className="HeroPanelMenuRunesStatsContainer">
        <div className="HeroPanelMenu">
          <div className="HeroPanelMenuButton" style={styleStatsPanel()} onClick={handleSelectStats}>Stats</div>
          <div className="HeroPanelMenuButton" style={styleSpellsPanel()} onClick={handleSelectSpells}>Spells</div>
        </div>
        {spellsPanelSelected && <SpellsPanel spells={heroInfos.spells} />}
        {statsPanelSelected &&
        <div className="RunesAndStatsContainer">
          <div className="HeroNameLevelContainer">
            <div className="HeroName">{heroInfos.name[0].toUpperCase() + heroInfos.name.slice(1)}</div>
            <div className="HeroLevel">Lvl {heroInfos.level}</div>
          </div>
          <RunesDisplay heroInfos={heroInfos} runesList={runesList} handleRuneClick={handleRuneClick} />
          <StatsDisplay heroInfos={heroInfos} />
        </div>
        }
      </div>
    </div>
  )
}