const spriteSize: {[key: string]: {frameWidth: number, frameHeight: number, upscale: number}} = {
  'priest': {frameWidth: 360, frameHeight: 160, upscale: 1.25},
  'assassin': {frameWidth: 360, frameHeight: 160, upscale: 1.25},
}
function getSpriteSize(name: string): {frameWidth: number, frameHeight: number, upscale: number} {
  if(spriteSize[name]){
    return spriteSize[name]
  }else {
    return {frameWidth: 288, frameHeight: 128, upscale: 1}
  }
}
export {getSpriteSize};