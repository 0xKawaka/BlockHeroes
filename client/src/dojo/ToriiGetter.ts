import { getEntityIdFromKeys } from "@dojoengine/utils";
// import { useComponentValue } from "@dojoengine/react";
import { getComponentValue, type Entity } from "@dojoengine/recs";
import { useDojo } from "./useDojo";
import { Hero, Rune, GameAccount } from "../Types/toriiTypes";
import { Parser } from "../Blockchain/Parser";
import hexToString from "../Pages/utils/hexToString";

export default class ToriiGetter {

  static getArenaDefenseHeroesIndexes(accountAdrs: string, teamSize: number, ArenaTeam: any): number[] {
    // const {setup: {clientComponents: {ArenaTeam}}} = useDojo();
    let heroesIndexes: number[] = [];
    for(let i = 0; i < teamSize; i++){
      const entityId = getEntityIdFromKeys([
        BigInt(accountAdrs), BigInt(i)
      ]) as Entity;
      const heroIndex = getComponentValue(ArenaTeam, entityId);
      if(heroIndex){
        heroesIndexes.push(heroIndex.heroIndex);
      }
    }
    return heroesIndexes;
  }
  static getAllAccounts(accountAdrsArray: string[], Account: any): {[key: string]: GameAccount} {
    let accounts: {[key: string]: GameAccount} = {};
    // const {setup: {clientComponents: {Account}}} = useDojo();
    for(let i = 0; i < accountAdrsArray.length; i++){
      const entityId = getEntityIdFromKeys([
        BigInt(accountAdrsArray[i])
      ]) as Entity; 
      const account = getComponentValue(Account, entityId);
      if(account){
        accounts[accountAdrsArray[i]] = {owner: BigInt(accountAdrsArray[i]), username: hexToString(account.username), energy: account.energy, pvpEnergy: account.pvpEnergy, crystals: account.crystals, gems: account.gems, lastEnergyUpdateTimestamp: account.lastEnergyUpdateTimestamp, lastPvpEnergyUpdateTimestamp: account.lastPvpEnergyUpdateTimestamp, runesCount: account.runesCount, heroesCount: account.heroesCount};
      }
    }
    return accounts;
  }

  static getGameAccount(accountAdrs: string, Account: any): GameAccount {
    // const {setup: {clientComponents: {Account}}} = useDojo();
    const entityId = getEntityIdFromKeys([
      BigInt(accountAdrs)
    ]) as Entity; 
    const account = getComponentValue(Account, entityId);
    if(account){
      return {owner: BigInt(accountAdrs), username: hexToString(account.username), energy: account.energy, pvpEnergy: account.pvpEnergy, crystals: account.crystals, gems: account.gems, lastEnergyUpdateTimestamp: account.lastEnergyUpdateTimestamp, lastPvpEnergyUpdateTimestamp: account.lastPvpEnergyUpdateTimestamp, runesCount: account.runesCount, heroesCount: account.heroesCount};
    } 
    return {owner: BigInt(accountAdrs), username: "", energy: 0, pvpEnergy: 0, crystals: 0, gems: 0, lastEnergyUpdateTimestamp: 0, lastPvpEnergyUpdateTimestamp: 0, runesCount: 0, heroesCount: 0};
  }

  static getAllRunes(accountAdrs: string, runesCount: number, Runes: any): Rune[] {
    // const {setup: {clientComponents: {Runes}}} = useDojo();
    
    let runes: Rune[] = [];
    for(let i = 0; i < runesCount; i++){
      const entityId = getEntityIdFromKeys([
        BigInt(accountAdrs), BigInt(i)
      ]) as Entity;
      const rune = getComponentValue(Runes, entityId);
      if(rune){
        runes.push({id: rune.rune.id, statistic: rune.rune.statistic.toString(), isPercent: rune.rune.isPercent, rank: rune.rune.rank, rarity: rune.rune.rarity, shape: Parser.parseRuneType(rune.rune.runeType), isEquipped: rune.rune.isEquipped, heroEquipped: rune.rune.heroEquipped, rank4Bonus: {statistic: rune.rune.rank4Bonus.statistic.toString(), isPercent: rune.rune.rank4Bonus.isPercent}, rank8Bonus: {statistic: rune.rune.rank8Bonus.statistic.toString(), isPercent: rune.rune.rank8Bonus.isPercent}, rank12Bonus: {statistic: rune.rune.rank12Bonus.statistic.toString(), isPercent: rune.rune.rank12Bonus.isPercent}, rank16Bonus: {statistic: rune.rune.rank16Bonus.statistic.toString(), isPercent: rune.rune.rank16Bonus.isPercent}});
      }
    }
    return runes;
  }

  static getAllHeroes(accountAdrs: string, heroesCount: number, Heroes:any): Hero[] {
    // const {setup: {clientComponents: {Heroes}}} = useDojo();
    
    let heroes: Hero[] = [];
    for(let i = 0; i < heroesCount; i++){
      const entityId = getEntityIdFromKeys([
        BigInt(accountAdrs), BigInt(i)
      ]) as Entity;
      const hero = getComponentValue(Heroes, entityId);
      if(hero){
        let runeIds =  Parser.parseRuneIds(hero.hero.runes);
        let spots = Parser.parseSpots(hero.hero.runes);
        heroes.push({id: hero.hero.id, name: hexToString(hero.hero.name), level: hero.hero.level, experience: hero.hero.experience, rank: hero.hero.rank, runeIds: runeIds, spots: spots});
      }
    }
    return heroes;
  }
}