import "./Summons.css"
import ArrowBack from "../../assets/misc/arrowback.png"
import SummonChest from "../../assets/misc/summonChest.png"
import SummonChestGif from "../../assets/gif/summonChest.gif"
import { useState } from "react"
import HeroMiniature from "./HeroMiniature"
import portraitsDict from "../../assets/portraits/portraitsDict"
import { HeroesFactory } from '../../Classes/Heroes/HeroesFactory'
import { HeroInfos } from "../../Types/apiTypes"
import { GameAccount } from "../../Types/toriiTypes"
import { useSystemCalls } from "../../dojo/useSystemCalls"

type SummonsProps = {
  gameAccount: GameAccount,
  setShowSummons: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Summons({gameAccount, setShowSummons}: SummonsProps) {
  const [isSummoning, setIsSummoning] = useState(false);
  const [showSummongAnimation, setShowSummonAnimation] = useState(false);
  const [showSummonResult, setShowSummonResult] = useState(false);
  const [heroSummoned, setHeroSummoned] = useState<HeroInfos>();

  const { mintHero } = useSystemCalls();

  async function handleSummon() {
    setIsSummoning(true);
    let animationDone = false;
    setShowSummonResult(false);
    setHeroSummoned(undefined);
    setShowSummonAnimation(true);
    new Promise(r => setTimeout(r, 1900)).then(() => {
      setShowSummonResult(true);
    });
    new Promise(r => setTimeout(r, 2600)).then(() => {
      animationDone = true;
    });

    const {id, name} = await mintHero();
    let hero = HeroesFactory.createSummonedHero(id, name.toString());
    if(!hero)
      return;
    setHeroSummoned(hero);
    while(!animationDone){
      await new Promise(r => setTimeout(r, 100));
    }
    setShowSummonAnimation(false);
    setIsSummoning(false);
  }

  return(
    <div className="WorldSelectArrowBackAndSummonsContainer">
      {gameAccount.heroesCount >= 2 &&
        <div className="ArrowBackContainer">
          <img className="ArrowBack" src={ArrowBack} onClick={() => setShowSummons(false)} />
        </div>
      }
      <div className="SummonsContainer">
        {/* <div className="SummonsCount">
          10 summons
        </div> */}
        <div className="SummonImageAndButton">
          <div className="SummonChestsImageAndCount">
            <img key={"SummonChest"} className="SummonImage" src={showSummongAnimation ? SummonChestGif : SummonChest} />
            {gameAccount.heroesCount < 2 &&
              <div className="SummonFirstHeroesText">Summon your first heroes</div>
            }
            <div className="SummonChestsCount">x{gameAccount.summonChests}</div>
          </div>
          {isSummoning &&
            <div className="SummonButton">Summoning ...</div>
          }
          {!isSummoning && gameAccount.summonChests > 0 &&
            <div className="SummonButton" onClick={handleSummon}>Summon</div>
          }
        </div>
        {showSummonResult && heroSummoned &&
          <div className="summonResultContainer">
            {/* <div className="summonResultTitle">You summoned</div> */}
            <div className="summonResultName">{heroSummoned.name[0].toUpperCase() + heroSummoned.name.slice(1)}</div>
            <HeroMiniature image={portraitsDict[heroSummoned.name]} rank={heroSummoned.rank} level={heroSummoned.level} imageWidth="11rem"/>
          </div>
        }
      </div>
    </div>
  )
}