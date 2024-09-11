import { HeroInfos, HeroInfosApi, RunesList } from "../../Types/apiTypes"

function computePercentOrFlat(baseStat:number, value:number, isPercent:boolean): number{
  if(isPercent){
    return baseStat * value / 100
  }
  else{
    return value
  }
}

function computeBonusStats(heroInfos:HeroInfos |  HeroInfosApi, runesList:RunesList){
  const bonusStats = {
    health: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    criticalChance: 0,
    criticalDamage: 0
  }
  for(let i = 0; i < heroInfos.runesIds.length; i++){
    const rune = runesList.find(rune => rune.id === heroInfos.runesIds[i])
    if(rune){
      for(let j = 0; j < rune.statistics.length; j++){
        bonusStats[rune.statistics[j].toLowerCase() as keyof typeof bonusStats] += computePercentOrFlat(heroInfos.baseStats[rune.statistics[j].toLowerCase() as keyof typeof heroInfos.baseStats], rune.values[j], rune.isPercent[j])
      }
    }
  }
  return bonusStats
}

export { computeBonusStats }