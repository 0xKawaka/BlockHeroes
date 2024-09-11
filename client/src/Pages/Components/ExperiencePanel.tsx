import GameEventHandler from "../../Blockchain/event/GameEventHandler"
import { HeroInfos } from "../../Types/apiTypes"
import "./ExperiencePanel.css"
import portraitsDict from "../../assets/portraits/portraitsDict"
import ProgressExperience from "./ProgressExperience"

type ExperiencePanelProps = {
  heroesList: Array<HeroInfos>,
  heroesBeforeExperienceGained: Array<HeroInfos>,
  eventHandler: GameEventHandler,
}

export default function ExperiencePanel({eventHandler, heroesList, heroesBeforeExperienceGained} : ExperiencePanelProps) {
  const experiencePanel = eventHandler.getExperienceGainEventArray().map(event => {
    const hero = heroesList.find(hero => hero.id === event.entityId)
    const heroBeforeExperienceGained = heroesBeforeExperienceGained.find(hero => hero.id === event.entityId)
    if(hero !== undefined) {
      return (
        <div className="experienceHero" key={hero.id}>
          <img className="experienceHeroImage" src={portraitsDict[hero.name]} />
          <ProgressExperience startLevel={heroBeforeExperienceGained!.level} endLevel={hero.level} startXp={heroBeforeExperienceGained!.experience} currentXp={hero.experience} width={15} height={1.8}/>
          <div className="experienceHeroLevelAndExperienceGained">
            {hero.level > heroBeforeExperienceGained!.level ?
            <div className="experienceHeroLevel">
              <div className="experienceHeroPreviousLevel">Lvl {heroBeforeExperienceGained!.level}</div>
              <div className="experienceHeroLevelArrow">&gt;</div>
              <div className="experienceHeroCurrentLevel">Lvl {hero.level}</div>
            </div>
            :
            <div className="experienceHeroLevel">Lvl {hero.level}</div>
            }
            
            {/* <div className="experienceHeroLevel">{heroBeforeExperienceGained!.experience} &gt; </div> */}
            <div className="experienceHeroExperienceGained">+{event.experienceGained} XP</div>
          </div>
        </div>
      )
    }
  })

  return(
    <div className="ExperiencePanelContainer">
      {experiencePanel}
    </div>
    )
}