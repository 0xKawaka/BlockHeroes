import { RuneBonusEvent } from "../../Blockchain/event/eventTypes";
import { RuneInfos, RuneStatsDict } from "../../Types/apiTypes";
import { BlockchainRune } from "../../Types/blockchainTypes";
import runeStatsDict from "../../GameDatas/Statistics/runeStats";

export default abstract class RuneFactory {

  static upgradeRune(rune: RuneInfos, bonus: RuneBonusEvent | undefined): RuneInfos {
    rune.rank = rune.rank + 1;
    rune.values[0] = this.computeRuneBaseValue(rune.statistics[0], rune.rank, rune.isPercent[0]);
    if(bonus !== undefined) {
      rune.statistics.push(bonus.procStat);
      rune.isPercent.push(bonus.isPercent);
      rune.values.push(this.computeRuneBonusValue(bonus.procStat, bonus.isPercent))
    }
    return rune;
  }

  static createRunes(blockchainRunes: Array<BlockchainRune>): Array<RuneInfos> {
    let runes: Array<RuneInfos> = [];
    blockchainRunes.forEach((blockchainRune) => {
      runes.push(this.createRune(blockchainRune));
    })
    return runes; 
  }

  static createRune(blockchainRune: BlockchainRune): RuneInfos {
    return {
      id: blockchainRune.id,
      shape: blockchainRune.shape,
      isEquipped: blockchainRune.isEquipped,
      heroEquipped: blockchainRune.heroEquipped,
      statistics: this.getStatistics(blockchainRune),
      isPercent: this.getisPercent(blockchainRune),
      values: this.getValues(blockchainRune),
      rarity: blockchainRune.rarity,
      rank: blockchainRune.rank
    }
  }

  static getStatistics(rune: BlockchainRune): Array<string> {
    let statistics: Array<string> = [];
    statistics.push(rune.statistic);
    if(rune.rank > 3) statistics.push(rune.rank4Bonus!.statistic);
    if(rune.rank > 7) statistics.push(rune.rank8Bonus!.statistic);
    if(rune.rank > 11) statistics.push(rune.rank12Bonus!.statistic);
    if(rune.rank > 15) statistics.push(rune.rank16Bonus!.statistic);
    return statistics;
  }

  static getisPercent(rune: BlockchainRune): Array<boolean> { 
    let isPercent: Array<boolean> = [];
    isPercent.push(rune.isPercent);
    if(rune.rank > 3) isPercent.push(rune.rank4Bonus!.isPercent);
    if(rune.rank > 7) isPercent.push(rune.rank8Bonus!.isPercent);
    if(rune.rank > 11) isPercent.push(rune.rank12Bonus!.isPercent);
    if(rune.rank > 15) isPercent.push(rune.rank16Bonus!.isPercent);
    return isPercent;
  }
  
  static getValues(rune: BlockchainRune): Array<number> {
    let values: Array<number> = [];
    values.push(this.computeRuneBaseValue(rune.statistic, rune.rank, rune.isPercent));
    if(rune.rank > 3) values.push(this.computeRuneBonusValue(rune.rank4Bonus!.statistic, rune.rank4Bonus!.isPercent));
    if(rune.rank > 7) values.push(this.computeRuneBonusValue(rune.rank8Bonus!.statistic, rune.rank8Bonus!.isPercent));
    if(rune.rank > 11) values.push(this.computeRuneBonusValue(rune.rank12Bonus!.statistic, rune.rank12Bonus!.isPercent));
    if(rune.rank > 15) values.push(this.computeRuneBonusValue(rune.rank16Bonus!.statistic, rune.rank16Bonus!.isPercent));
    return values;
  }


  static computeRuneBaseValue(statistic: string, rank: number, isPercent: boolean) {
    if(isPercent) 
      return runeStatsDict.base.common[statistic].percent + (runeStatsDict.base.common[statistic].percent * rank / 10)
    else 
      return runeStatsDict.base.common[statistic].flat + (runeStatsDict.base.common[statistic].flat * rank / 10)
  }

  static computeRuneBonusValue(statistic: string, isPercent: boolean) {
    if(isPercent) 
      return runeStatsDict.bonus.common[statistic].percent
    else 
      return runeStatsDict.bonus.common[statistic].flat
  }
}