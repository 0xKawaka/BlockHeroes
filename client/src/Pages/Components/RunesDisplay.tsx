import RunePlaceholder from "./RunePlaceholder"
import "./RunesDisplay.css"
import runeImg from "../../assets/runes/testRune.png"
import runeImgDict from "../../assets/runes/runeImgDict"
import { HeroInfos, RunesList } from "../../Types/apiTypes"

type RunesDisplayProps = {
  heroInfos: HeroInfos,
  runesList: RunesList,
  handleRuneClick(runeIndex: number, runeSpotClicked: number): void,
}

export default function RunesDisplay({heroInfos, runesList, handleRuneClick}: RunesDisplayProps) {


  function createRunePlaceholder(spotIndex: number, runesIds: Array<number>, spots: Array<number>) {
    const index = spots.indexOf(spotIndex)
    if(index === -1){
      return(
      <div className="RunePlaceholderContainer" onClick={() => handleRuneClick(-1, spotIndex)}>
        <RunePlaceholder image={runeImgDict[spotIndex]} rank={-1} imageWidth="100%"/>
      </div>
      )
    }
    else{
      let rune = runesList.find(rune => rune.id === runesIds[index])
      let rank = rune?.rank
      let shape = rune?.shape
      if (rank === undefined) {
        rank = -1
      }
      if (shape === undefined) {
        shape = 0
      }
      return(
      <div className="RunePlaceholderContainer" onClick={() => handleRuneClick(runesIds[index], spotIndex)}>
        <RunePlaceholder image={runeImgDict[shape]} rank={rank} imageWidth="8.2rem"/>
      </div>
      )
    }
  }

  return(
  <div className="RunesDisplayContainer">
    <div className="RuneTypeContainer">
      {createRunePlaceholder(1, heroInfos.runesIds, heroInfos.spots)}
      {createRunePlaceholder(2, heroInfos.runesIds, heroInfos.spots)}
    {/* </div> */}
    {/* <div className="RuneTypeContainer"> */}
      {createRunePlaceholder(3, heroInfos.runesIds, heroInfos.spots)}
      {createRunePlaceholder(4, heroInfos.runesIds, heroInfos.spots)}
    {/* </div> */}
    {/* <div className="RuneTypeContainer"> */}
      {createRunePlaceholder(5, heroInfos.runesIds, heroInfos.spots)}
      {createRunePlaceholder(6, heroInfos.runesIds, heroInfos.spots)}
    </div>
  </div>
  )
}