import { useState, useEffect } from 'react'
import "./Quests.css"
import StateChangesHandler from '../State/StateChangesHandler'
import { Account } from 'starknet'
import { GlobalQuest } from '../../Types/customTypes'
import SummonChest from "../../assets/misc/summonChest.png"
import ArrowBack from "../../assets/misc/arrowback.png"
import { GameAccount } from '../../Types/toriiTypes'
import { useSystemCalls } from '../../dojo/useSystemCalls'

type QuestsProps = {
  gameAccount: GameAccount
  globalQuests: GlobalQuest[]
  mapProgress: {[key: number]: number}
  setShowQuests: React.Dispatch<React.SetStateAction<boolean>>
}


function Quests ( {gameAccount, globalQuests, mapProgress, setShowQuests } : QuestsProps) {

  const [indexClaimingArray, setIsClaimingArray] = useState<number[]>([])
  const { claimGlobalQuest } = useSystemCalls();

  async function claimQuest(quest: GlobalQuest, index: number) {
    let newClaimingArray = [...indexClaimingArray]
    newClaimingArray[newClaimingArray.length] = index
    setIsClaimingArray(newClaimingArray)

    let res = await claimGlobalQuest(quest.map, quest.mapProgressRequired)
    if(res) {
      console.log("Quest claimed successfully")
    }
    newClaimingArray = newClaimingArray.filter((value) => value !== index)
    setIsClaimingArray(newClaimingArray)
  }

  return (
  <div className="QuestsAndArrowBackContainer">
    <div className="ArrowBackContainer">
      <img className="ArrowBack" src={ArrowBack} onClick={() => setShowQuests(false)} />
    </div>
    <div className="QuestsContainer">
      <div className="QuestsList">
        <div className="QuestContainer" key={0}>
          <div className="QuestMap">Progress</div>
          <div className="QuestReward">Reward</div>
          <div className="QuestClaimButtonContainer"></div>
        </div>
        {globalQuests.map((quest, index) => {
          return (
            <div className={quest.hasClaimed || mapProgress[quest.map] < quest.mapProgressRequired ? "QuestContainerGrayed" : "QuestContainer"}  key={index + 1}>
              <div className="QuestMap">Reach campaign level {quest.mapProgressRequired + 1}</div>
                {quest.rewardType == "Summon" && 
                  <div className="QuestReward">
                    <div className="QuestRewardType">{quest.rewardQuantity} Summon Chest</div>
                    <div className="QuestRewardImageContainer">
                      <img src={SummonChest} className="QuestRewardImage" alt="summonChest" />
                    </div>
                  </div>
                }

              <div className="QuestClaimButtonContainer">
                {indexClaimingArray.includes(index) &&
                  <div className="QuestClaimButton">Claiming...</div>
                }
                {mapProgress[quest.map] >= quest.mapProgressRequired && !quest.hasClaimed && !indexClaimingArray.includes(index) &&
                  <div className="QuestClaimButton" onClick={() => claimQuest(quest, index)}>Claim</div>
                }
                {mapProgress[quest.map] >= quest.mapProgressRequired && quest.hasClaimed &&
                  <div className="QuestClaimButtonDisabled">Claimed</div>
                }
                {mapProgress[quest.map] < quest.mapProgressRequired &&
                  <div className="QuestClaimButtonDisabled">Claim</div>
                }
                
                
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </div>
  )
}

export default Quests;