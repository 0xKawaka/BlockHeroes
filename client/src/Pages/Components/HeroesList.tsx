import { HeroInfos } from "../../Types/apiTypes"
import "./HeroesList.css"
import portraitsDict from "../../assets/portraits/portraitsDict"  
import HeroMiniature from "./HeroMiniature"
import { BaseHeroInfos } from "../../Classes/Heroes/HeroesFactory"

type HeroesListProps = {
  heroesList: Array<HeroInfos>
  baseHeroesNotOwned: Array<BaseHeroInfos>
  handleHeroClick(heroId: number): void
  handleNotOwnedHeroClick(names: string): void
  heroesWidth: string
}

export default function HeroesList({heroesList, baseHeroesNotOwned, handleHeroClick, handleNotOwnedHeroClick, heroesWidth}: HeroesListProps) {
  return(
    <div className="HeroesListContainer">
    {heroesList.map((hero, i) => {
      return (
        <div className="heroCard" key={i} onClick={() => handleHeroClick(hero.id) }>
          <HeroMiniature image={portraitsDict[hero.name]} rank={1} level={hero.level} imageWidth={heroesWidth}></HeroMiniature>
        </div>
      )
    })}
    {baseHeroesNotOwned && handleNotOwnedHeroClick && baseHeroesNotOwned.map((baseHero, i) => {
      return (
        <div className="heroCard" key={heroesList.length + i} onClick={() => handleNotOwnedHeroClick(baseHero.name) }>
          <HeroMiniature image={portraitsDict[baseHero.name]} imageWidth={heroesWidth} owned={false}></HeroMiniature>
        </div>
      )
    })}
    </div>
  )
}



