import { useState, useEffect } from 'react'
import "./MyHeroes.css"
import HeroPanel from "./HeroPanel"
import {HeroesStatsDict, HeroInfos, RuneInfos, RunesList} from '../../Types/apiTypes'
import RunePanel from "./RunePanel"
import HeroesList from "./HeroesList"
import ArrowBack from "../../assets/misc/arrowback.png"
import { Account } from 'starknet'
import StateChangesHandler from '../State/StateChangesHandler'
import { BurnerAccount } from '@dojoengine/create-burner'
import { BaseHeroInfos } from '../../Classes/Heroes/HeroesFactory'
import NotOwnedHeroPanel from './NotOwnedHeroPanel'

type MyHeroesProps = {
  account: BurnerAccount,
  heroesList: Array<HeroInfos>
  runesList: Array<RuneInfos>
  baseHeroes: BaseHeroInfos[]
  stateChangesHandler: StateChangesHandler
}

function getUnequipedRunes(runesList:RunesList, heroesList:Array<HeroInfos>){
  const runesIdsEquiped = heroesList.map(hero => hero.runesIds).flat()
  return runesList.filter(rune => !runesIdsEquiped.includes(rune.id))
}

function getHeroById(heroId:number, heroesList:Array<HeroInfos>){
  return heroesList.find(hero => hero.id === heroId)
}


function MyHeroes ( {account, heroesList, runesList, baseHeroes, stateChangesHandler } : MyHeroesProps) {
  const [showingHero, setShowingHero] = useState<boolean>(false)
  const [heroId, setHeroId] = useState<number>(-1)
  const [heroNotOwned, setHeroNotOwned] = useState<BaseHeroInfos>()
  const [showingRunes, setShowingRunes] = useState<boolean>(false)
  const [runeSelectId, setRuneSelectId] = useState<number>(-1)
  const [runeSpotClicked, setRuneSpotClicked] = useState<number>(0)

  const baseHeroesNotOwned = baseHeroes.filter(baseHero => !heroesList.some(hero => hero.name === baseHero.name))

  const runeListUnequiped = getUnequipedRunes(runesList, heroesList)

  function handleHeroClick(heroId: number) {
    setHeroId(heroId)
    setShowingHero(true)
  }

  function handleNotOwnedHeroClick(name: string) {
    setHeroId(-1)
    setHeroNotOwned(baseHeroes.find(baseHero => baseHero.name === name)!)
    setShowingHero(true)
  }

  function handleRuneClick(runeId: number, runeSpotClicked: number) {
    setRuneSelectId(runeId)
    setRuneSpotClicked(runeSpotClicked)
    setShowingRunes(true)
  }

  const heroInfos = getHeroById(heroId, heroesList)
  
  function getRuneEquipped(hero: HeroInfos, spotClicked: number){
    const index = hero.spots.findIndex(spot => spot === spotClicked)
    const runeIdClicked = hero.runesIds[index]
    const runeClicked = runesList.find(rune => rune.id === runeIdClicked)
    return runeClicked
  }


  return (
  <div className="myHeroesContainer">
    {!showingHero && !showingRunes &&
      <div className="myHeroesMenuAndHeroesListContainer">
        <div className="ArrowBackContainer" >
          <img className="ArrowBack" src={ArrowBack} onClick={() => stateChangesHandler.setShowMyHeroes(false)}/>
        </div>
        <div className="myHeroesListContainer">
          <HeroesList heroesList={heroesList} baseHeroesNotOwned={baseHeroesNotOwned} handleHeroClick={handleHeroClick} handleNotOwnedHeroClick={handleNotOwnedHeroClick} heroesWidth="8.8rem"></HeroesList>
        </div>
      </div>
    }
    {showingHero && !showingRunes && heroInfos &&
      <HeroPanel heroIndex={heroId} heroInfos={heroInfos} runesList={runesList} setShowingHero={setShowingHero} handleRuneClick={handleRuneClick}></HeroPanel>
    }
    {showingHero && !showingRunes && heroId === -1 && heroNotOwned &&
      <NotOwnedHeroPanel heroInfos={heroNotOwned} setShowingHero={setShowingHero}></NotOwnedHeroPanel>
    }
    {showingRunes &&
      <RunePanel account={account} runesList={runesList} heroesList={heroesList} runeClicked={getRuneEquipped(heroInfos!, runeSpotClicked)} runeSpotClicked={runeSpotClicked} runeListUnequiped={runeListUnequiped} heroId={heroId} setShowingRunes={setShowingRunes} stateChangesHandler={stateChangesHandler}></RunePanel>
    }

  </div>)
}

export default MyHeroes 