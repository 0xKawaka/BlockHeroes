import "./RunePanel.css"
import {HeroInfos, RuneInfos, RunesList} from '../../Types/apiTypes'
import RuneMiniature from "./RuneMiniature"
import runeImg from "../../assets/runes/testRune.png"
import runesImgDict from "../../assets/runes/runeImgDict"
import ArrowBack from "../../assets/misc/arrowback.png"  
import Rune from "./Rune"
import { useState, useEffect } from 'react'
import { log } from "console"
import { createRuneListDict } from "../utils/runesSorterFilter"
import { Account } from "starknet"
import StateChangesHandler from "../State/StateChangesHandler"
import arrowup from "../../assets/icons/arrowup.png"
import arrowdown from "../../assets/icons/arrowdown.png"
import checkmark from "../../assets/icons/checkmark.png"
import { GameAccount } from "../../Types/toriiTypes"


type RunePanelProps = {
  account: Account,
  gameAccount: GameAccount,
  runesList: Array<RuneInfos>,
  heroesList: Array<HeroInfos>,
  runeClicked: RuneInfos |  undefined,
  runeSpotClicked: number,
  runeListUnequiped: RunesList,
  heroId: number, 
  setShowingRunes: React.Dispatch<React.SetStateAction<boolean>>,
  stateChangesHandler: StateChangesHandler,
}


export default function RunePanel({account, gameAccount, runesList, heroesList, runeClicked, runeSpotClicked, runeListUnequiped, heroId, setShowingRunes, stateChangesHandler}: RunePanelProps) {
  const [runeSelectedId, setRuneSelectedId] = useState<number>(-1)
  const [sortedRank, setSortedRank] = useState<string>("rank_desc")
  const [onlyEquippable, setOnlyEquippable] = useState<boolean>(true)
  const [filters, setFilters] = useState<Array<string>>([])

  const [runesUnequiped, setRuneListUnequiped] = useState<RunesList>(filterAndSortRunes(runeListUnequiped, filters, sortedRank))

  const runeSelected = runeListUnequiped.find(rune => rune.id === runeSelectedId)

  function addOrRemoveFilter(filter: string) {
    if(filters.includes(filter)) {
      setFilters(filters.filter(f => f !== filter))
    }
    else {
      setFilters([...filters, filter])
    }
  }

  function filterAndSortRunes(runesList: RunesList, filters: Array<string>, sort: string): RunesList {
    if(onlyEquippable) {
      runesList = runesList.filter(rune => rune.shape == runeSpotClicked)
    }

    if(sort == "rank_desc") {
      runesList.sort((a, b) => b.rank - a.rank)
    }
    else if(sort == "rank_asc") {
      runesList.sort((a, b) => a.rank - b.rank)
    }

    if(filters.length == 0) {
      return runesList
    }

    filters.forEach(filter => {
      runesList = runesList.filter(rune => rune.statistics.includes(filter))
    })

    return runesList
  }


  useEffect(() => {
    setRuneListUnequiped(filterAndSortRunes(runeListUnequiped, filters, sortedRank))
  }, [runeListUnequiped, filters, sortedRank, onlyEquippable]);
  
  
  return(
  <div className="RunePanelContainer">
    <div className="ArrowBackContainer" >
      <img className="ArrowBack" src={ArrowBack} onClick={() => setShowingRunes(false)}/>
    </div>
    <div className="RuneDetailsAndListContainer">
      <div className="RuneDetailsContainer">
        <div className="RuneEquippedWrapper">
        {runeClicked && 
          <Rune 
          gameAccount={gameAccount}
          runesList={runesList}
          heroesList={heroesList}
          rune={runeClicked}
          equipped={true}
          image={runesImgDict[runeClicked.shape]}
          heroId={heroId} 
          runeSpotClicked={runeSpotClicked}
          alreadyEquippedRune={true}
          account={account}
          stateChangesHandler={stateChangesHandler}
           />
        }
        {!runeClicked &&
          <div className="TransparentRuneImg">
            <RuneMiniature image={runesImgDict[runeSpotClicked]} rank={-1} imageWidth="10rem"/>
          </div>
        }
        </div>
        <div className="RuneSelectedWrapper">
          {runeSelectedId > -1 && runeSelected &&
          <Rune 
            gameAccount={gameAccount}
            runesList={runesList}
            heroesList={heroesList}
            rune={runeSelected!}
            equipped={false}
            image={runesImgDict[runeSelected.shape]} 
            heroId={heroId}
            runeSpotClicked={runeSpotClicked}
            alreadyEquippedRune={runeClicked !== undefined}
            account={account}
            stateChangesHandler={stateChangesHandler}
            />
          }
        </div>
      </div>
      <div className="RuneListContainer">
        <div className="RuneListFiltersContainer">
          <div className="RuneListFilterRankContainer" onClick={() => setSortedRank(sortedRank == "rank_desc" ? "rank_asc" : "rank_desc")}>
            <div className="RuneListFilterRank">Rank</div>
            <img className="RuneListFilterRankArrow" src={sortedRank == "rank_desc" ? arrowdown : arrowup}></img>
          </div>
          <div className="RuneListFilterStatsContainer">
            <div className="RuneListFilterStatAndCheckmarkContainer" onClick={() => setOnlyEquippable(!onlyEquippable)}>
              <div className="RuneListFilterStat" >Equippable</div>
              <div className="RuneListFilterCheckmarkContainer">
                {onlyEquippable &&<img className="RuneListFilterCheckmarkImg" src={checkmark} /> }
              </div>
            </div>
            <div className="RuneListFilterStatAndCheckmarkContainer" onClick={() => addOrRemoveFilter("Attack")}>
              <div className="RuneListFilterStat" >Attack</div>
              <div className="RuneListFilterCheckmarkContainer">
                {filters.includes("Attack") &&<img className="RuneListFilterCheckmarkImg" src={checkmark} /> }
              </div>
            </div>
            <div className="RuneListFilterStatAndCheckmarkContainer" onClick={() => addOrRemoveFilter("Health")}>
              <div className="RuneListFilterStat" >Health</div>
              <div className="RuneListFilterCheckmarkContainer">
                {filters.includes("Health") &&<img className="RuneListFilterCheckmarkImg" src={checkmark} /> }
              </div>
            </div>
            <div className="RuneListFilterStatAndCheckmarkContainer" onClick={() => addOrRemoveFilter("Defense")}>
              <div className="RuneListFilterStat" >Defense</div>
              <div className="RuneListFilterCheckmarkContainer">
                {filters.includes("Defense") &&<img className="RuneListFilterCheckmarkImg" src={checkmark} /> }
              </div>
            </div>
            <div className="RuneListFilterStatAndCheckmarkContainer" onClick={() => addOrRemoveFilter("Speed")}>
              <div className="RuneListFilterStat" >Speed</div>
              <div className="RuneListFilterCheckmarkContainer">
                {filters.includes("Speed") &&<img className="RuneListFilterCheckmarkImg" src={checkmark} /> }
              </div>
            </div>
          </div>
        </div>
        <div className="RunesList">
          {runesUnequiped.map((rune) => {
            return (
              <div className="RuneMiniatureWrapper" key={rune.id} onClick={() => setRuneSelectedId(rune.id)}>
                <RuneMiniature image={runesImgDict[rune.shape]} rank={rune.rank} imageWidth="7.5rem"/>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  </div>
  )
}