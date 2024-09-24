import {Maps} from "../maps";

const campaignMaps: { [key: string]: any} = {
  0: {
    background: "Background_Forest",
  },
  1: {background: "Background_Forest",
  },
  2: {
    background: "Background_Forest",
  },
  3: {
    background: "Background_Forest",
  },
  4: {
    background: "Background_Forest",
  },
};

const arenaMap = "Background_Forest";

function getLevelBackground(map: Maps, battleId: number, canvasWidth: number): string {
  let suffix = "";
  if(map === Maps.Campaign){
    suffix = "Background_Forest"
    // suffix = campaignMaps[battleId].background
  }
  else if(map === Maps.Arena){
    suffix = arenaMap
  }

  if(canvasWidth > 534){
    if(canvasWidth < 640)
      return suffix + "_640"
    else if(canvasWidth < 750)
      return suffix + "_750"
  }
  else if(canvasWidth > 534 * 2){
    if(canvasWidth < 640 * 2)
      return suffix + "_640"
    else if(canvasWidth < 750 * 2)
      return suffix + "_750"
  }
  else if(canvasWidth > 534 * 3){
    if(canvasWidth < 640 * 3)
      return suffix + "_640"
    else if(canvasWidth < 750 * 3)
      return suffix + "_750"
  }
  else if(canvasWidth > 534 * 4){
    if(canvasWidth < 640 * 4)
      return suffix + "_640"
    else if(canvasWidth < 750 * 4)
      return suffix + "_750"
  }
  return suffix
}

export {getLevelBackground};