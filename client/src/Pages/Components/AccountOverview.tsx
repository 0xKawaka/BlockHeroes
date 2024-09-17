import "./AccountOverview.css"
import energyImg from "../../assets/icons/energy.png"
import pvpEnergyImg from "../../assets/icons/pvpEnergy.png"
import crystalImg from "../../assets/icons/crystal.png"
import gemImg from "../../assets/icons/gem.png"
import EnergyHandler from "../Classes/EnergyHandler"
import StateChangesHandler from "../State/StateChangesHandler"
import { useState } from "react"
import { GameAccount } from "../../Types/toriiTypes"

type AccountOverviewProps = {
  gameAccount: GameAccount
  maxEnergy: number
  maxPvpEnergy: number
  // stateChangesHandler: StateChangesHandler
}

export default function AccountOverview({gameAccount, maxEnergy, maxPvpEnergy}: AccountOverviewProps) {

  const [isHoveringEnergy, setIsHoveringEnergy] = useState<boolean>(false)
  const [isHoveringPvpEnergy, setIsHoveringPvpEnergy] = useState<boolean>(false)

  return(
  <div className="AccountOverviewContainer">
    <div className="AccountOverview">
      <div className="UsernameContainer">
        <div className="UsernameValue">{gameAccount.username}</div>
      </div>
      <div className="EnergyContainer">
        <div className="EnergyValueIconContainer" onMouseOver={() => {setIsHoveringEnergy(true)}} onMouseOut={() => {setIsHoveringEnergy(false)}}>
          <div className="EnergyValue">{gameAccount.energy} / {maxEnergy}</div>
          <img className="EnergyIcon" src={energyImg} />
        </div>
        {/* {isHoveringEnergy && energy < maxEnergy && <div className="EnergyTooltip">Next energy in {stateChangesHandler.getTimeUntilNextEnergy()} seconds</div>} */}
      </div>
      <div className="EnergyContainer">
        <div className="EnergyValueIconContainer" onMouseOver={() => {setIsHoveringPvpEnergy(true)}} onMouseOut={() => {setIsHoveringPvpEnergy(false)}}>
          <div className="EnergyValue">{gameAccount.pvpEnergy} / {maxEnergy}</div>
          <img className="EnergyIcon" src={pvpEnergyImg} />
        </div>
        {/* {isHoveringPvpEnergy && pvpEnergy < maxPvpEnergy && <div className="EnergyTooltip">Next energy in {stateChangesHandler.getTimeUntilNextPvpEnergy()} seconds</div>} */}
      </div>
      <div className="CrystalsContainer">
        <div className="CrystalsValue">{gameAccount.crystals}</div>
        <img className="CrystalsIcon" src={crystalImg} />
      </div>
      {/* <div className="GemsContainer">
        <div className="GemsValue">{gameAccount.gems}</div>
        <img className="GemsIcon" src={gemImg} />
      </div> */}
    </div>
  </div>
  )
}
