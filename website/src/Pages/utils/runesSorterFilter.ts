import { RunesList } from "../../Types/apiTypes";

function createRuneListDict(runesList: RunesList){
  let runesListDict: {[key: string]: RunesList} = {}
  runesListDict["rank_asc"] = runesList.sort((a, b) => a.rank - b.rank)
  runesListDict["rank_desc"] = runesList.sort((a, b) => b.rank - a.rank)
  return runesListDict
}

export {createRuneListDict}