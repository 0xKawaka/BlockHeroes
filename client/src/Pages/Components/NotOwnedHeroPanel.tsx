import "./NotOwnedHeroPanel.css"
import { useState } from 'react'
import ArrowBack from "../../assets/misc/arrowback.png"
import {BaseHeroInfos} from '../../Classes/Heroes/HeroesFactory'
import SpellsPanel from "./SpellsPanel"


type NotOwnedHeroPanelProps = {
  heroInfos: BaseHeroInfos,
  setShowingHero: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function NotOwnedHeroPanel({heroInfos, setShowingHero}: NotOwnedHeroPanelProps) {
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
  console.log(heroInfos)

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
          </div>
          <div className="NotOwnedBaseStatsContainer">
              <div className="NotOwnedBaseStatsTitle">Base Statistics</div>
              <div className="NotOwnedBaseStatsContent">
                <div className="NotOwnedBaseSingleStatContainer">
                  <div className="NotOwnedBaseSingleStatTitle">Health</div>
                  <div className="NotOwnedBaseSingleStatValue">{heroInfos.stats.health}</div>
                </div>
                <div className="NotOwnedBaseSingleStatContainer">
                  <div className="NotOwnedBaseSingleStatTitle">Attack</div>
                  <div className="NotOwnedBaseSingleStatValue">{heroInfos.stats.attack}</div>
                </div>
                <div className="NotOwnedBaseSingleStatContainer">
                  <div className="NotOwnedBaseSingleStatTitle">Defense</div>
                  <div className="NotOwnedBaseSingleStatValue">{heroInfos.stats.defense}</div>
                </div>
                <div className="NotOwnedBaseSingleStatContainer">
                  <div className="NotOwnedBaseSingleStatTitle">Speed</div>
                  <div className="NotOwnedBaseSingleStatValue">{heroInfos.stats.speed}</div>
                </div>
                <div className="NotOwnedBaseSingleStatContainer">
                  <div className="NotOwnedBaseSingleStatTitle">Critical Chance</div>
                  <div className="NotOwnedBaseSingleStatValue">{heroInfos.stats.criticalChance} %</div>
                </div>
                <div className="NotOwnedBaseSingleStatContainer">
                  <div className="NotOwnedBaseSingleStatTitle">Critical Damage</div>
                  <div className="NotOwnedBaseSingleStatValue">{heroInfos.stats.criticalDamage} %</div>
                </div>
              </div>
          </div>
        </div>
        }
      </div>
    </div>
  )
}