export default class GameSpeedHelper {
  speed: number
  timeFactor: number = 4

  constructor(speed: number) {
    this.speed = speed
  }

  // computeFrameRateEntity(entityName, animationName)
  computeFrameRateEntity(entityName: string, animationName: string): number {
    if(this.speed == 1) {
      return 14
    }
    else if(this.speed == 2) {
      return 22
    }
    else if(this.speed == 3) {
      return 28
    }
    else {
      return 14
    }
  }

  computeEntityTravelTime(start:{x: number, y:number}, destination:{x:number, y:number}): number {
    let distance = Math.sqrt(Math.pow(destination.x - start.x, 2) + Math.pow(destination.y - start.y, 2)) * this.timeFactor
    let travelTime = distance / this.speed
    return travelTime
  }

  setSpeed(speed: number) {
    this.speed = speed
  }


}