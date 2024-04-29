import "./Summons.css"
// import {Image} from 'react-native';
import ArrowBack from "../../assets/misc/arrowback.png"
import Soul from "../../assets/misc/soul.png"
import SummonChest from "../../assets/misc/summonChest.png"
import SummonChestGif from "../../assets/gif/summonChest.gif"
import { Sender } from "../../Blockchain/Sender"
import { StarknetWindowObject } from "get-starknet"
import { Account } from "starknet"
import { useState } from "react"
import { Getter } from "../../Blockchain/Getter"
import { HeroBlockchain } from "../../Types/blockchainTypes"
import HeroMiniature from "./HeroMiniature"
import portraitsDict from "../../assets/portraits/portraitsDict"

type SummonsProps = {
  localWallet: Account
  setShowSummons: React.Dispatch<React.SetStateAction<boolean>>
  handleNewHeroEvent: (hero: HeroBlockchain) => void
}

export default function Summons({localWallet, setShowSummons, handleNewHeroEvent }: SummonsProps) {
  const [isSummoning, setIsSummoning] = useState(false);
  const [showSummongAnimation, setShowSummonAnimation] = useState(false);
  const [showSummonResult, setShowSummonResult] = useState(false);
  const [heroSummoned, setHeroSummoned] = useState<HeroBlockchain>();

  async function handleSummon() {
    setShowSummonResult(false);
    setIsSummoning(true);
    const {id, name} = await Sender.mintHero(localWallet);
    let hero = await Getter.getHero(localWallet, id);
    if(!hero)
      return;
    setHeroSummoned(hero);
    setShowSummonAnimation(true);
    await new Promise(r => setTimeout(r, 1900));
    setShowSummonResult(true);
    setIsSummoning(false);
    await new Promise(r => setTimeout(r, 700));
    handleNewHeroEvent(hero);
    setShowSummonAnimation(false);
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