import { BlockchainRune, HeroBlockchain } from "../Types/blockchainTypes";
import { shortString } from "starknet";
export abstract class Parser {
  static parseRuneType(type: string): number {
    switch(type) {
      case "First":
        return 1;
      case "Second":
        return 2;
      case "Third":
        return 3;
      case "Fourth":
        return 4;
      case "Fifth":
        return 5;
      case "Sixth":
        return 6;
    }
    return -1;
  }

  static parseHero(hero: any): HeroBlockchain {
    return {
      id: Number(hero.id),
      name: shortString.decodeShortString(hero.name),
      level: Number(hero.level),
      experience: Number(hero.experience),
      rank: Number(hero.rank),
      runeIds : this.parseRuneIds(hero.runes),
      spots: this.parseSpots(hero.runes),
    }
  }

  static parseRuneIds(runes: any): Array<number> {
    let ids: Array<number> = [];
    if(runes.isFirstRuneEquipped) ids.push(Number(runes.first));
    if(runes.isSecondRuneEquipped) ids.push(Number(runes.second));
    if(runes.isThirdRuneEquipped) ids.push(Number(runes.third));
    if(runes.isFourthRuneEquipped) ids.push(Number(runes.fourth));
    if(runes.isFifthRuneEquipped) ids.push(Number(runes.fifth));
    if(runes.isSixthRuneEquipped) ids.push(Number(runes.sixth));
    return ids;
  }

  static parseSpots(runes: any): Array<number> {
    let spots: Array<number> = [];
    if(runes.isFirstRuneEquipped) spots.push(1);
    if(runes.isSecondRuneEquipped) spots.push(2);
    if(runes.isThirdRuneEquipped) spots.push(3);
    if(runes.isFourthRuneEquipped) spots.push(4);
    if(runes.isFifthRuneEquipped) spots.push(5);
    if(runes.isSixthRuneEquipped) spots.push(6);
    return spots;
  }


  static parseRune(rune: any): BlockchainRune {
    const rank = Number(rune.rank);
    return {
      id: Number(rune.id),
      statistic: this.getNotUndefinedKeys(rune.statistic.variant)[0].toLowerCase(),
      isPercent: Boolean(rune.isPercent),
      rank: Number(rune.rank),
      rarity: this.getNotUndefinedKeys(rune.rarity.variant)[0],
      shape: this.typeToShape(this.getNotUndefinedKeys(rune.runeType.variant)[0]),
      isEquipped: Boolean(rune.isEquipped),
      heroEquipped: Number(rune.heroEquipped),
      rank4Bonus: rank > 3 ? this.parseBonusRune(rune.rank4Bonus) : undefined,
      rank8Bonus: rank > 7 ? this.parseBonusRune(rune.rank8Bonus) :  undefined,
      rank12Bonus: rank > 11 ? this.parseBonusRune(rune.rank12Bonus) : undefined,
      rank16Bonus: rank > 15 ? this.parseBonusRune(rune.rank16Bonus) : undefined,
    }
  }


  static parseRawRune(event: any): BlockchainRune {
    const rank = Number(event[4]);
    return {
      id: Number(event[1]),
      statistic: this.parseRuneStatistic(Number(event[2])),
      isPercent: Boolean(Number(event[3])),
      rank: rank,
      rarity: this.parseRuneRarity(Number(event[5])),
      shape: Number(event[6]) + 1,
      isEquipped: Boolean(Number(event[7])),
      heroEquipped: Number(event[8]),
      rank4Bonus: undefined,
      rank8Bonus: undefined,
      rank12Bonus: undefined,
      rank16Bonus: undefined,
    }
  }


  static parseBonusRune(bonus: any) {
    return {
      statistic: this.getNotUndefinedKeys(bonus.statistic.variant)[0],
      isPercent: bonus.isPercent,
    }
  }

  static typeToShape(type: string): number {
    switch(type) {
      case "First":
        return 1;
      case "Second":
        return 2;
      case "Third":
        return 3;
      case "Fourth":
        return 4;
      case "Fifth":
        return 5;
      case "Sixth":
        return 6;
    }
    return -1;
  }

  static parseRuneStatistic(statistic: number): string {
    switch(statistic) {
      case 0:
        return "Health";
      case 1:
        return "Attack";
      case 2:
        return "Defense";
      case 3:
        return "Speed";
    }
    return "Unkown Rune Statistic"
  }

  static parseRuneRarity(rarity: number): string {
    switch(rarity) {
      case 0:
        return "Common";
      case 1:
        return "Uncommon";
      case 2:
        return "Rare";
      case 3:
        return "Epic";
      case 4:
        return "Legendary";
    }
    return "Unkown Rune Rarity"
  }

  static getNotUndefinedKeys(obj: any) {
    return Object.keys(obj).filter((key) => obj[key] !== undefined);
  }
}