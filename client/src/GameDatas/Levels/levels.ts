const levels: { [key: string]: {[key: string]: any} } = {
  0: {
    0: {
      background: "Background_Forest",
    },
    1: {
      background: "Background_Forest",
    },
    2: {
      background: "Background_Forest",
    },
  },
  1: {
    0: {
      background: "Background_Forest",
    },
    1: {
      background: "Background_Forest",
    },
  },
};

function getLevelBackground(worldId: number, battleId: number, canvasWidth: number): string {
  if(canvasWidth > 534){
    if(canvasWidth < 640)
      return levels[worldId][battleId].background + "_640"
    else if(canvasWidth < 750)
      return levels[worldId][battleId].background + "_750"
  }
  else if(canvasWidth > 534 * 2){
    if(canvasWidth < 640 * 2)
      return levels[worldId][battleId].background + "_640"
    else if(canvasWidth < 750 * 2)
      return levels[worldId][battleId].background + "_750"
  }
  else if(canvasWidth > 534 * 3){
    if(canvasWidth < 640 * 3)
      return levels[worldId][battleId].background + "_640"
    else if(canvasWidth < 750 * 3)
      return levels[worldId][battleId].background + "_750"
  }
  else if(canvasWidth > 534 * 4){
    if(canvasWidth < 640 * 4)
      return levels[worldId][battleId].background + "_640"
    else if(canvasWidth < 750 * 4)
      return levels[worldId][battleId].background + "_750"
  }
  return levels[worldId][battleId].background
  // return levels[worldId][battleId].background + "_640"
}

export {getLevelBackground};