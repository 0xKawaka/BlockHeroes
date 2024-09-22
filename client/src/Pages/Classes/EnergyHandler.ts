import truncOrRoundDecimalPoint from '../../Classes/MathInteger/MathInteger'

export default class EnergyHandler {
  currentBlockchainEnergy: number
  actualEnergy: number
  lastEnergyUpdateTimestamp: number
  setEnergy: (energy: number) => void
  updateProcessCount: number
  maxEnergy: number
  timeTickEnergy: number

  constructor(setEnergy: (energy: number) => void, maxEnergy: number, timeTickEnergy: number) {
    this.currentBlockchainEnergy = 0
    this.actualEnergy = 0
    this.lastEnergyUpdateTimestamp = 0
    this.updateProcessCount = 0
    this.setEnergy = setEnergy
    this.maxEnergy = maxEnergy
    this.timeTickEnergy = timeTickEnergy
  }

  initEnergy(energy: number, lastEnergyUpdateTimestamp: number) {
    this.currentBlockchainEnergy = energy
    this.lastEnergyUpdateTimestamp = lastEnergyUpdateTimestamp
    this.actualEnergy = this.computeActualEnergy()
    this.setEnergy(this.actualEnergy)
    this.updateEnergyOnCd()
  }

  updateEnergy(energy: number, lastEnergyUpdateTimestamp: number) {
    this.currentBlockchainEnergy = energy
    console.log("this.currentBlockchainEnergy :", this.currentBlockchainEnergy)
    this.lastEnergyUpdateTimestamp = lastEnergyUpdateTimestamp
    this.actualEnergy = this.computeActualEnergy()
    console.log("this.actualEnergy :", this.actualEnergy)
    this.setEnergy(this.actualEnergy)
    this.updateEnergyOnCd()
  }

  computeActualEnergy() {
    let now = Date.now() / 1000
    let timeSinceLastUpdate = truncOrRoundDecimalPoint(now - this.lastEnergyUpdateTimestamp)
    let energyToAdd = truncOrRoundDecimalPoint(timeSinceLastUpdate /this.timeTickEnergy)
    let actualEnergy = this.currentBlockchainEnergy + energyToAdd
    if(actualEnergy > this.maxEnergy) {
      actualEnergy = this.maxEnergy
    }
    return actualEnergy
  }

  getTimeUntilNextEnergy() {
    let now = Date.now() / 1000
    let timeSinceLastUpdate = truncOrRoundDecimalPoint(now - this.lastEnergyUpdateTimestamp)
    let timeUntilNextEnergy = truncOrRoundDecimalPoint(this.timeTickEnergy - timeSinceLastUpdate)
    if(timeUntilNextEnergy < 0) {
      timeUntilNextEnergy = 0
    }
    return timeUntilNextEnergy
  }

  async updateEnergyOnCd() {
    if(this.actualEnergy >= this.maxEnergy) {
      return
    }

    this.updateProcessCount += 1
    let processCount = this.updateProcessCount

    while(this.actualEnergy < this.maxEnergy) {
      const now = Date.now() / 1000
      const timeSinceLastUpdate = now - (this.lastEnergyUpdateTimestamp + (this.actualEnergy - this.currentBlockchainEnergy) * this.timeTickEnergy)

      if(timeSinceLastUpdate > this.timeTickEnergy) {
        console.log("timeSinceLastUpdate > timeTickEnergy")
        return
      }

      let remainingTime = this.timeTickEnergy - timeSinceLastUpdate
      console.log("Remaining time:", remainingTime)
      await new Promise(resolve => setTimeout(resolve, remainingTime * 1000))
      console.log("Energy timer ended")
      if(processCount !== this.updateProcessCount) {
        console.log("Not the latest timer process")
        return
      }
      this.actualEnergy += 1
      this.setEnergy(this.actualEnergy)
    }
  }

  getEnergy() {
    return this.actualEnergy
  }

  getMaxEnergy() {
    return this.maxEnergy
  }

  getLastEnergyActionTimestamp() {
    return this.lastEnergyUpdateTimestamp
  }

  setLastEnergyActionTimestamp(timestamp: number) {
    this.lastEnergyUpdateTimestamp = timestamp
  }

}

