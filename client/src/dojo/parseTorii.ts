import { removePadding } from "../Pages/utils/stringHandler";
import { ArenaAccount, ArenaTeam, Config, GameAccount, Hero, Rune } from "../Types/toriiTypes";
import { Account, ConfigType } from "./generated/models.gen";
import { shortString } from "starknet";
import { Parser } from "./Parser";

function parseAccount(account: Account): GameAccount | null {
  if(!account) {
    return null;
  }
  return {
        owner: BigInt(account.owner),
        username: shortString.decodeShortString(removePadding(account.username.toString())),
        energy: Number(account.energy),
        pvpEnergy: Number(account.pvpEnergy),
        crystals: Number(account.crystals),
        gems: Number(account.gems),
        lastEnergyUpdateTimestamp: Number(account.lastEnergyUpdateTimestamp),
        lastPvpEnergyUpdateTimestamp: Number(account.lastPvpEnergyUpdateTimestamp),
        runesCount: Number(account.runesCount),
        heroesCount: Number(account.heroesCount),
        summonChests: Number(account.summonChests),
    }
}

/**
 * Extracts values from nested objects with a specific structure
 * @param rawData - Object with structure { [entityId: string]: { [key: string]: any } }
 * @returns Array of extracted values
 */
function extractValues(rawData: any): any[] {
  if (!rawData) {
    return [];
  }
  
  return Object.values(rawData)
    .map((obj: any) => {
      const entityId = obj ? Object.keys(obj)[0] : null;
      return entityId ? obj[entityId] : null;
    })
    .filter(Boolean) as any[];
}


/**
 * Unified function to parse config from different input formats
 * @param configRaw - Can be either an array of config objects or entity-formatted config data
 * @returns Config object
 */
function parseConfig(configRaw: any): Config {
  if (!configRaw) {
    return {
      timeTickEnergy: 0,
      timeTickPvpEnergy: 0,
      maxEnergy: 0,
      maxPvpEnergy: 0,
      startingCrystals: 0,
      startingGems: 0,
    };
  }
  
  const result: Config = {
    timeTickEnergy: 0,
    timeTickPvpEnergy: 0,
    maxEnergy: 0,
    maxPvpEnergy: 0,
    startingCrystals: 0,
    startingGems: 0,
  };
  
  // Extract config values using the extractValues function
  const configItems = extractValues(configRaw);
  
  // Process each config item
  configItems.forEach((configData: any) => {
    if (!configData || !configData.key) return;
    
    const value = Number(configData.value);
    
    switch (configData.key) {
      case "TimeTickEnergy":
        result.timeTickEnergy = value;
        break;
      case "TimeTickPvpEnergy":
        result.timeTickPvpEnergy = value;
        break;
      case "MaxEnergy":
        result.maxEnergy = value;
        break;
      case "MaxPvpEnergy":
        result.maxPvpEnergy = value;
        break;
      case "StartingCrystals":
        result.startingCrystals = value;
        break;
      case "StartingGems":
        result.startingGems = value;
        break;
    }
  });
  
  return result;
}

function parseConfigLegacy(config: any[]): Config {
  if (!config || config.length === 0) {
    return {
      timeTickEnergy: 0,
      timeTickPvpEnergy: 0,
      maxEnergy: 0,
      maxPvpEnergy: 0,
      startingCrystals: 0,
      startingGems: 0,
    };
  }

  const result: Config = {
    timeTickEnergy: 0,
    timeTickPvpEnergy: 0,
    maxEnergy: 0,
    maxPvpEnergy: 0,
    startingCrystals: 0,
    startingGems: 0,
  };

  for (const item of config) {
    if (!item || !item.key) continue;
    const value = Number(item.value);
    
    switch (item.key) {
      case "TimeTickEnergy":
        result.timeTickEnergy = value;
        break;
      case "TimeTickPvpEnergy":
        result.timeTickPvpEnergy = value;
        break;
      case "MaxEnergy":
        result.maxEnergy = value;
        break;
      case "MaxPvpEnergy":
        result.maxPvpEnergy = value;
        break;
      case "StartingCrystals":
        result.startingCrystals = value;
        break;
      case "StartingGems":
        result.startingGems = value;
        break;
    }
  }
  return result;
}

/**
 * Unified function to parse runes from different input formats
 * @param runesData - Can be either an array of rune objects or entity-formatted rune data
 * @returns Array of Rune objects
 */
function parseRunes(runesRaw: any): Rune[] {
  if (!runesRaw) return [];
  
  // Use extractValues to get the rune data objects
  return extractValues(runesRaw)
    .map((runeData: any) => {
      if (!runeData || !runeData.rune) return null;
      
      return {
          id: Number(runeData.rune.id),
          statistic: runeData.rune.statistic,
          isPercent: Boolean(Number(runeData.rune.isPercent)),
          rank: Number(runeData.rune.rank),
          rarity: runeData.rune.rarity,
          shape: Parser.parseRuneType(runeData.rune.runeType),
          isEquipped: Boolean(Number(runeData.rune.isEquipped)),
          heroEquipped: Number(runeData.rune.heroEquipped),
          rank4Bonus: {
            statistic: runeData.rune.rank4Bonus.statistic,
            isPercent: Boolean(Number(runeData.rune.rank4Bonus.isPercent)),
          },
          rank8Bonus: {
            statistic: runeData.rune.rank8Bonus.statistic,
            isPercent: Boolean(Number(runeData.rune.rank8Bonus.isPercent)),
          },
          rank12Bonus: {
            statistic: runeData.rune.rank12Bonus.statistic,
            isPercent: Boolean(Number(runeData.rune.rank12Bonus.isPercent)),
          },
          rank16Bonus: {
            statistic: runeData.rune.rank16Bonus.statistic,
            isPercent: Boolean(Number(runeData.rune.rank16Bonus.isPercent)),
          }
      };
    })
    .filter(Boolean) as Rune[]; // Remove any null entries and assert type
}

/**
 * Unified function to parse heroes from different input formats
 * @param heroesRaw - Can be either an array of hero objects or entity-formatted hero data
 * @returns Array of Hero objects
 */
function parseHeroes(heroesRaw: any): Hero[] {
  if (!heroesRaw) return [];
  
  // Use extractValues to get the hero data objects
  return extractValues(heroesRaw)
    .map((heroData: any) => {
      if (!heroData || !heroData.hero) return null;
      
      let runeIds = Parser.parseRuneIds(heroData.hero.runes);
      let spots = Parser.parseSpots(heroData.hero.runes);
      
      return {
        id: Number(heroData.hero.id),
        name: shortString.decodeShortString(removePadding(heroData.hero.name.toString())),
        level: Number(heroData.hero.level),
        experience: Number(heroData.hero.experience),
        rank: Number(heroData.hero.rank),
        runeIds: runeIds,
        spots: spots,
      };
    })
    .filter(Boolean) as Hero[]; // Remove any null entries and assert type
}

function parseMapProgress(mapProgressRaw: any): {[key: number]: number} {
  if (!mapProgressRaw || mapProgressRaw.length === 0) return {0: 0};
  return extractValues(mapProgressRaw).reduce((acc, curr) => {
    acc[Number(curr.mapProgress.id)] = Number(curr.mapProgress.progress);
    return acc;
  }, {});
}

/**
 * Parse ArenaAccount objects from raw data
 * @param arenaAccountsRaw - Raw arena account data from Torii
 * @returns Object mapping owner addresses to ArenaAccount objects
 */
function parseArenaAccountsByOwner(arenaAccountsRaw: any): {[key: string]: ArenaAccount} {
  if (!arenaAccountsRaw || arenaAccountsRaw.length === 0) return {};
  
  return extractValues(arenaAccountsRaw).reduce((acc: {[key: string]: ArenaAccount}, curr: any) => {
    if (!curr) return acc;
    
    acc[curr.owner] = {
      rank: Number(curr.rank),
      lastClaimedRewards: Number(curr.lastClaimedRewards),
      teamSize: Number(curr.teamSize),
    };
    return acc;
  }, {});
}

/**
 * Parse ArenaTeam objects from raw data
 * @param arenaTeamsRaw - Raw arena team data from Torii
 * @returns Object mapping owner addresses to ArenaTeam objects
 */
function parseArenaTeamsByOwner(arenaTeamsRaw: any): {[key: string]: ArenaTeam[]} {
  if (!arenaTeamsRaw || arenaTeamsRaw.length === 0) return {};
  
  return extractValues(arenaTeamsRaw).reduce((acc: {[key: string]: ArenaTeam[]}, curr: any) => {
    if (!curr) return acc;
    
    const owner = curr.owner;
    if (!acc[owner]) {
      acc[owner] = [];
    }
    
    acc[owner].push({
      index: Number(curr.index),
      heroIndex: Number(curr.heroIndex),
    });
    
    return acc;
  }, {});
}





export { parseAccount, parseConfig, parseRunes, parseHeroes, extractValues, parseMapProgress, parseArenaAccountsByOwner, parseArenaTeamsByOwner };