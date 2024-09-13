import "./Summons.css"
// import {Image} from 'react-native';
import ArrowBack from "../../assets/misc/arrowback.png"
import Soul from "../../assets/misc/soul.png"
import SummonChest from "../../assets/misc/summonChest.png"
import SummonChestGif from "../../assets/gif/summonChest.gif"
import { Sender } from "../../Blockchain/Sender"
import { useState } from "react"
import { Getter } from "../../Blockchain/Getter"
import { HeroBlockchain } from "../../Types/blockchainTypes"
import HeroMiniature from "./HeroMiniature"
import portraitsDict from "../../assets/portraits/portraitsDict"
import { useDojo } from "../../dojo/useDojo"
import { BaseHeroInfos, HeroesFactory } from '../../Classes/Heroes/HeroesFactory'
import { HeroInfos } from "../../Types/apiTypes"
import { Account } from "starknet"

type SummonsProps = {
  account: Account,
  setShowSummons: React.Dispatch<React.SetStateAction<boolean>>
  handleNewHeroEvent: (hero: HeroInfos) => void
}

export default function Summons({account, setShowSummons, handleNewHeroEvent }: SummonsProps) {
  const [isSummoning, setIsSummoning] = useState(false);
  const [showSummongAnimation, setShowSummonAnimation] = useState(false);
  const [showSummonResult, setShowSummonResult] = useState(false);
  const [heroSummoned, setHeroSummoned] = useState<HeroInfos>();

  const {setup: {systemCalls: { mintHero }}} = useDojo();

  async function handleSummon() {
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

    setIsSummoning(true);
    const {id, name} = await mintHero(account);
    let hero = HeroesFactory.createSummonedHero(id, name.toString());
    if(!hero)
      return;
    setHeroSummoned(hero);
    while(!animationDone){
      await new Promise(r => setTimeout(r, 100));
    }
    setShowSummonAnimation(false);
    setIsSummoning(false);
    handleNewHeroEvent(hero);
  }

  return(
    <div className="WorldSelectArrowBackAndSummonsContainer">
      <div className="ArrowBackContainer">
        <img className="ArrowBack" src={ArrowBack} onClick={() => setShowSummons(false)} />
      </div>
      <div className="SummonsContainer">
        {/* <div className="SummonsCount">
          10 summons
        </div> */}
        <div className="SummonImageAndButton">
          {!showSummongAnimation &&
            <img key={"SummonChest"} className="SummonImage" src={SummonChest} />
          }
          {showSummongAnimation &&
            <img key={"SummonChest"} className="SummonImage" src={SummonChestGif} />
          }
          {isSummoning &&
            <div className="SummonButton">Summoning ...</div>
          }
          {!isSummoning &&
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