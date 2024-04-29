import BackgroundPick from "./BackgroundPick";

export default class Scaler {
    canvasWidth:number;
    backgroundBaseWidth: number;
    scaleFactor: number;

    constructor(canvasWidth: number){
        this.canvasWidth = canvasWidth
        this.backgroundBaseWidth = BackgroundPick.getBackgroundWidth(canvasWidth)
        this.scaleFactor = this.getScaleFactor()
    }

    scaleBackground(background: Phaser.GameObjects.Image){
        background.setScale(this.scaleFactor)
    }

    getScaleFactor(): number{
        let screenByBackgroundRatio = this.canvasWidth / this.backgroundBaseWidth
        if(screenByBackgroundRatio > 1){
            return Math.trunc(screenByBackgroundRatio) + 1
        }
        return 1
        // else {
        //     if(screenByBackgroundRatio < 0.5){
        //         return 1 / (Math.trunc(this.backgroundBaseWidth / this.canvasWidth) + 1)
        //     }
        //     return 1
        // }
    }

    getBuffStatusScaleFactor(): number{
        // if(this.scaleFactor > 1){
        //     return this.scaleFactor - 1
        // }
        return this.scaleFactor
    }

    getTextBuffStatusScaleFactor() : number{
        // if(this.scaleFactor > 1){
        //     return this.scaleFactor
        // }
        // return 1
        return this.scaleFactor
    }


    getEntitiesScaleFactor(): number{
        return this.scaleFactor
    }
}