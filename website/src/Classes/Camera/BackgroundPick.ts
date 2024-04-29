export default abstract class BackgroundPick {
  static getBackgroundWidth(canvasWidth: number): number {
    // return 534
    // if(canvasWidth < 800){
    //   return 534
    // }
    if(canvasWidth > 534){
      if(canvasWidth < 640)
        return 640
      else if(canvasWidth < 750)
        return 750
    }
    else if(canvasWidth > 534 * 2) {
      if(canvasWidth < 640 * 2)
        return 640
      else if(canvasWidth < 750 * 2)
        return 750
    }
    else if(canvasWidth > 534 * 3) {
      if(canvasWidth < 640 * 3)
        return 640
      else if(canvasWidth < 750 * 3)
        return 750
    }
    else if(canvasWidth > 534 * 4) {
      if(canvasWidth < 640 * 4)
        return 640
      else if(canvasWidth < 750 * 4)
        return 750
    }
    return 534
  }

  static getBackgroundHeight(canvasWidth: number): number {
    // return 325
    // if(canvasWidth < 800){
    //   return 325
    // }
    // return 389

    if(canvasWidth > 534){
      if(canvasWidth < 640)
        return 389
      else if(canvasWidth < 750)
        return 456
    }
    else if(canvasWidth > 534 * 2) {
      if(canvasWidth < 640 * 2)
        return 389
      else if(canvasWidth < 750 * 2)
        return 456
    }
    else if(canvasWidth > 534 * 3) {
      if(canvasWidth < 640 * 3)
        return 389
      else if(canvasWidth < 750 * 3)
        return 456
    }
    else if(canvasWidth > 534 * 4) {
      if(canvasWidth < 640 * 4)
        return 389
      else if(canvasWidth < 750 * 4)
        return 456
    }
    return 325
  }
}