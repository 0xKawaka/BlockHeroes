import "./ProgressExperience.css"
import {computeExperienceNeeded} from "../../GameDatas/Experience/experience"
import { useEffect, useState } from "react"

type ProgressExperienceProps = {
  startLevel: number,
  endLevel: number,
  startXp: number,
  currentXp: number,
  height: number,
  width: number,
}

export default function ProgressExperience({startLevel, endLevel, startXp, currentXp, height, width}: ProgressExperienceProps) {
  const [currentLevel, setCurrentLevel] = useState<number>(startLevel)
  const [maxXPLevel, setmaxXPLevel] = useState<number>(computeExperienceNeeded(currentLevel))
  const [progress, setProgress] = useState<number>(startXp / maxXPLevel)
  const [endProgress, setEndProgress] = useState<number>(endLevel === currentLevel ? currentXp / maxXPLevel : 1)
  const [showExpText, setShowExpText] = useState<boolean>(false)
  

  useEffect(() => {
    let animation = setInterval(() => {
      if(progress < endProgress) {
        setProgress(progress + 0.01)
      }
      else if (currentLevel < endLevel) {
        const newMaxXpLevel = computeExperienceNeeded(currentLevel + 1)
        setCurrentLevel(currentLevel + 1)
        setProgress(0)
        setmaxXPLevel(newMaxXpLevel)
        setEndProgress(currentLevel + 1 === endLevel ? currentXp / newMaxXpLevel : 1)
        if(currentLevel + 1 === endLevel) {
          setShowExpText(true)
        }
      }
      else {
        setShowExpText(true)
        clearInterval(animation)
        console.log("clearInterval")
      }
    }, 10)
    return () => clearInterval(animation)
  }, [progress])

  return(
    <div className="ProgressExperienceContainer">
      <div className="ProgressExperienceEmpty" style={{height: height + "rem", width: width + "rem"}}>
        <div className="ProgressExperienceFilled" style={{height: height + "rem", width: progress * width + "rem"}}>
          {showExpText && <div className="ProgressExperienceText" style={{height: height + "rem", width: width + "rem"}}>{currentXp}/{maxXPLevel}</div>}
        </div>
      </div>
    </div>
  )
}

