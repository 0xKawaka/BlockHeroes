export default class Zoomer {
    screenWidth:number;
    screenHeight:number;
    backgroundBaseWidth: number;
    backgroundBaseHeight: number;
    scaleFactor: number;
    mainCameraZoom: number = 1;

    constructor(screenWidth: number, screenHeight: number,  backgroundBaseWidth: number, backgroundBaseHeight: number ,scaleFactor: number){
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.backgroundBaseWidth = backgroundBaseWidth
        this.backgroundBaseHeight = backgroundBaseHeight
        this.scaleFactor = scaleFactor
    }

    moveMainCamera(mainCamera: Phaser.Cameras.Scene2D.Camera, scaleFactor: number){
        const yOverflow = (this.backgroundBaseHeight * scaleFactor - this.screenHeight) / scaleFactor
        // mainCamera.setScroll(scrollX, scrollY) 
        mainCamera.scrollX = (-this.screenWidth + this.backgroundBaseWidth) / 2
        mainCamera.scrollY = (-this.screenHeight + this.backgroundBaseHeight + yOverflow) / 2
    }

    getBackgroundOffset(): number {
        return (this.backgroundBaseWidth * this.scaleFactor - this.screenWidth) / 2
    }
}