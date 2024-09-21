import { getEntityIdFromKeys } from "@dojoengine/utils";
// import { useComponentValue } from "@dojoengine/react";
import { getComponentValue, type Entity, runQuery, Has } from "@dojoengine/recs";
import { useDojo } from "./useDojo";
import { Hero, Rune, GameAccount, ArenaAccount } from "../Types/toriiTypes";
import { Parser } from "../Blockchain/Parser";
import hexToString from "../Pages/utils/hexToString";
import { ArenaFullAccount, GlobalQuest } from "../Types/customTypes";
import { HeroesFactory } from "../Classes/Heroes/HeroesFactory";
import { HeroBlockchain } from "../Types/blockchainTypes";
import RuneFactory from "../Classes/Runes/RuneFactory";
import { HeroInfos } from "../Types/apiTypes";
import { mapFromString } from "../GameDatas/maps";

export default class ToriiGetter {

  static getGlobalQuests(accountAdrs: string, GlobalQuests: any, AccountQuests: any): GlobalQuest[] {
    // const {setup: {clientComponents: {GlobalQuests, AccountQuests}}} = useDojo();
    const entitiesSet = runQuery([Has(GlobalQuests)]);
    const entitiesArray = Array.from(entitiesSet);
    let quests: Array<GlobalQuest> = [];
    for(let i = 0; i < entitiesArray.length; i++){
      const quest = getComponentValue(GlobalQuests, entitiesArray[i]);

      if(quest){
        const entityId = getEntityIdFromKeys([
          BigInt(accountAdrs), BigInt(quest.map), BigInt(quest.mapProgressRequired)
        ]) as Entity;
        const accountQuest = getComponentValue(AccountQuests, entityId);
        quests.push({map: mapFromString(quest.map), mapProgressRequired: quest.mapProgressRequired, rewardType: quest.rewardType, rewardQuantity: quest.rewardQuantity, hasClaimed: accountQuest ? accountQuest.hasClaimedRewards : false});
      }
    }
    quests.sort((a, b) => a.mapProgressRequired - b.mapProgressRequired);
    return quests;
  }

  static getAllArenaUsernames(entities: Entity[], Account: any): {[key: string]: string} {  
    // const {setup: {clientComponents: {Account}}} = useDojo();
    let usernamesByOwner: {[key: string]: string} = {};
    for(let i = 0; i < entities.length; i++){
      const account = getComponentValue(Account, entities[i]);
      if(account){
        usernamesByOwner[account.owner.toString()] = hexToString(account.username);
      }
    }
    return usernamesByOwner;
  }

  static getAllArenaAccounts(entities: Entity[], ArenaAccount: any): ArenaAccount[] {  
    // const {setup: {clientComponents: {ArenaAccount}}} = useDojo();
    let accounts: ArenaAccount[]= [];
    for(let i = 0; i < entities.length; i++){
      const account = getComponentValue(ArenaAccount, entities[i]);
      if(account){
        accounts.push({owner: account.owner.toString(), rank: account.rank, lastClaimedRewards: account.lastClaimedRewards, teamSize: account.teamSize});
      }
    }
    return accounts;
  }

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
        accounts[accountAdrsArray[i]] = {owner: BigInt(accountAdrsArray[i]), username: hexToString(account.username), energy: account.energy, pvpEnergy: account.pvpEnergy, crystals: account.crystals, gems: account.gems, lastEnergyUpdateTimestamp: account.lastEnergyUpdateTimestamp, lastPvpEnergyUpdateTimestamp: account.lastPvpEnergyUpdateTimestamp, runesCount: account.runesCount, heroesCount: account.heroesCount, summonChests: account.summonChests};
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
      return {owner: BigInt(accountAdrs), username: hexToString(account.username), energy: account.energy, pvpEnergy: account.pvpEnergy, crystals: account.crystals, gems: account.gems, lastEnergyUpdateTimestamp: account.lastEnergyUpdateTimestamp, lastPvpEnergyUpdateTimestamp: account.lastPvpEnergyUpdateTimestamp, runesCount: account.runesCount, heroesCount: account.heroesCount, summonChests: account.summonChests};
    } 
    return {owner: BigInt(accountAdrs), username: "", energy: 0, pvpEnergy: 0, crystals: 0, gems: 0, lastEnergyUpdateTimestamp: 0, lastPvpEnergyUpdateTimestamp: 0, runesCount: 0, heroesCount: 0, summonChests: 0};
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

  static loadGlobalPvpInfos(ArenaAccount: any, Heroes: any, ArenaTeam: any, Account: any, Runes: any): ArenaFullAccount[] {
    // const {setup: {clientComponents: { ArenaAccount, Heroes, ArenaTeam, Account }}} = useDojo();
    const entitiesSet = runQuery([Has(ArenaAccount)]);
    const entitiesArray = Array.from(entitiesSet);
    const allArenaAccounts = ToriiGetter.getAllArenaAccounts(entitiesArray, ArenaAccount);
    const ownersArray = allArenaAccounts.map(allArenaAccounts => allArenaAccounts.owner);
    const accountsByOwner = ToriiGetter.getAllAccounts(ownersArray, Account);
    let runesByOwner: {[key:string]: Rune[]} = {};
    for(let owner in accountsByOwner){
      runesByOwner[owner] = ToriiGetter.getAllRunes(owner, accountsByOwner[owner].runesCount, Runes);
    }

    let entitiesByOwner: {[key:string]: Entity[]} = {};
    for(let arenaAccount of allArenaAccounts){  
      if(entitiesByOwner[arenaAccount.owner] === undefined){
        entitiesByOwner[arenaAccount.owner] = [];
      }
      else {
        throw new Error("loadGlobalPvpInfos error: multiple accounts for same owner");
      }
      for(let i= 0; i < arenaAccount.teamSize; i++){
        const accountEntityId = getEntityIdFromKeys([
          BigInt(arenaAccount.owner), BigInt(i)
        ]) as Entity;
        entitiesByOwner[arenaAccount.owner.toString()].push(accountEntityId);
      }
    }
    // console.log("entitiesByOwner", entitiesByOwner);
    let arenaDefenseHeroesIndexesByOwner: {[key:string]: number[]} = {};
    for(let arenaAccount of allArenaAccounts){
      let arenaDefenseHeroes = ToriiGetter.getArenaDefenseHeroesIndexes(arenaAccount.owner, arenaAccount.teamSize, ArenaTeam);
      arenaDefenseHeroesIndexesByOwner[arenaAccount.owner] = arenaDefenseHeroes;
    }
    // console.log("arenaDefenseHeroesIndexesByOwner", arenaDefenseHeroesIndexesByOwner);
    let arenaDefenseHeroesByOwner: {[key:string]: HeroInfos[]} = {};
    for(let owner in arenaDefenseHeroesIndexesByOwner){
      let heroes: HeroInfos[] = [];
      for(let heroIndex of arenaDefenseHeroesIndexesByOwner[owner]){
        const heroEntityId = getEntityIdFromKeys([
          BigInt(owner), BigInt(heroIndex)
        ]) as Entity;
        let heroTorii = getComponentValue(Heroes, heroEntityId);
        if(heroTorii){
          let runeIds =  Parser.parseRuneIds(heroTorii.hero.runes);
          let spots = Parser.parseSpots(heroTorii.hero.runes);
          let hero: HeroBlockchain = {id: heroTorii.hero.id, name: hexToString(heroTorii.hero.name), level: heroTorii.hero.level, experience: heroTorii.hero.experience, rank: heroTorii.hero.rank, runeIds: runeIds, spots: spots};
          let runes = RuneFactory.createRunes(runesByOwner[owner]);
          let heroInfos = HeroesFactory.createHero(hero, runes);
          heroes.push(heroInfos);
        }
      }
      arenaDefenseHeroesByOwner[owner] = heroes;
    }
    let arenaFullAccounts: ArenaFullAccount[] = [];
    for(let arenaAccount of allArenaAccounts){
      arenaFullAccounts.push({owner: arenaAccount.owner, username: accountsByOwner[arenaAccount.owner].username, rank: arenaAccount.rank, team: arenaDefenseHeroesByOwner[arenaAccount.owner]});
    }
    arenaFullAccounts.sort((a, b) => a.rank - b.rank);
    return arenaFullAccounts;
  }
}