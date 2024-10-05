import { Account } from "starknet"
import "./PvpDefense.css"
import HeroesList from "./HeroesList"
import { HeroInfos } from "../../Types/apiTypes"
import { useEffect, useState } from "react"
import HeroMiniature from "./HeroMiniature"
import portraitsDict from "../../assets/portraits/portraitsDict"
import { useDojo } from "../../dojo/useDojo"
import { set } from "mobx"

type PvpDefenseProps = {
  account: Account,
  rank: number,
  heroesList: Array<HeroInfos>,
  defenseArenaHeroesIds: number[],
  loadPvpInfos(address: string): void
  setDefenseArenaHeroesIds: React.Dispatch<React.SetStateAction<number[]>>
  setArenaAccount: React.Dispatch<React.SetStateAction<{rank: number, lastClaimedRewards: number}>>
  updateGlobalPvpInfos(): void
}

export default function PvpDefense({account, rank, heroesList, defenseArenaHeroesIds, loadPvpInfos, setDefenseArenaHeroesIds, setArenaAccount, updateGlobalPvpInfos}: PvpDefenseProps) {
  const [selectedHeroesIds, setSelectedHeroesIds] = useState<number[]>(defenseArenaHeroesIds)
  const [notSelectedHeroesList, setNotSelectedHeroesList] = useState<HeroInfos[]>(heroesList.filter(hero => !selectedHeroesIds.includes(hero.id)))
  const [isSettingDefenseTeam, setIsSettingDefenseTeam] = useState<boolean>(false)

  const {setup: {systemCalls: { initPvp, setPvpTeam }}} = useDojo();

  useEffect(() => {
    setNotSelectedHeroesList(heroesList.filter(hero => !selectedHeroesIds.includes(hero.id)))
  }, [selectedHeroesIds])

  function handleHeroClick(heroId: number) {
    if(selectedHeroesIds.includes(heroId)){
      setSelectedHeroesIds(selectedHeroesIds.filter(id => id !== heroId))
    }
    else if (selectedHeroesIds.length < 4){
      setSelectedHeroesIds([...selectedHeroesIds, heroId])
    }
  }

  function updatePvpInfos() {
    new Promise(resolve => setTimeout(resolve, 600)).then(() => {
      loadPvpInfos(account.address);
      updateGlobalPvpInfos();
    })
  }

  async function handleSetTeamClick() {
    if(selectedHeroesIds.length == 0){
      console.log("Can't set defense team without heroes")
      return;
    }
    setIsSettingDefenseTeam(true)
    if(rank == 0) {
      // console.log("initPvp", account.address)
      let res = await initPvp(account, selectedHeroesIds)
      if(res.rank != 0){
        setDefenseArenaHeroesIds(res.defenseHeroesIds)
        setArenaAccount({rank: res.rank, lastClaimedRewards: 0})
        updatePvpInfos()
      }
    }
    else {
      let res = await setPvpTeam(account, selectedHeroesIds)
      if(res) {
        setDefenseArenaHeroesIds(selectedHeroesIds)
        updatePvpInfos()
      }
    }
    setIsSettingDefenseTeam(false)
  }

  return(
    <div className="PvpDefenseContainer">
      <div className="PvpDefenseTitleContainer">
        Setup your arena defense
      </div>
      <div className="PvpDefenseHeroesContainer">
        <div className="BattleTeamSelectionHeroesMiniaturesAndButton"> 
          <div className="BattleTeamSelectionHeroesMiniatures">
            {selectedHeroesIds.length > 0 && selectedHeroesIds.map((heroId, i) => {
              const heroInfos = heroesList.find(hero => hero.id === heroId)
              if(heroInfos === undefined) return (<div key={i}></div>)
              return (
                <div className="HeroMiniatureWrapper" key={i} onClick={() =>  handleHeroClick(heroId)}>
                  <HeroMiniature image={portraitsDict[heroInfos.name]} rank={heroInfos.rank} level={heroInfos.level} imageWidth="9rem"></HeroMiniature>
                </div>
              )
            }
          )}
          </div>
          <div className="PvpDefenseHeroesSetButton" onClick={handleSetTeamClick}>{isSettingDefenseTeam ? "Setting Team..." : "Set team"}</div>
        </div>
        <HeroesList heroesList={notSelectedHeroesList} handleHeroClick={handleHeroClick} heroesWidth="7.5rem"/> 
      </div>
    </div>
  )
}