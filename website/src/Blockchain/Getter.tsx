import { Account, Contract, shortString } from "starknet"
import {AccountsAdrs, PvpAdrs} from './data/contracts'
import AccountsAbi from './abi/Accounts.json'
import PvpAbi from './abi/Pvp.json'
import { AccountBlockchain, BlockchainRune, HeroBlockchain } from "../Types/blockchainTypes";
import { Parser } from "./Parser";
import EnergyHandler from "../Pages/Classes/EnergyHandler";

export abstract class Getter {

  public static async getTeam(wallet: Account): Promise<Array<number>> {
    try {
      const contract = new Contract(PvpAbi, PvpAdrs, wallet);
      const res = await contract.getTeam(wallet.address);
      return res.map((hero: any) => Number(hero));
    }
    catch(error: any){
      console.log('getTeam ', error.message)
      return [];
    }
  }

  public static async getPvpRank(wallet: Account): Promise<number> {
    try {
      const contract = new Contract(PvpAbi, PvpAdrs, wallet);
      const res = await contract.getRank(wallet.address);
      return Number(res);
    }
    catch(error: any){
      console.log('getPvpRank ', error.message)
      return 0;
    }
  }

  public static async getEnergyInfos(wallet: Account): Promise<{energy: number, lastEnergyUpdateTimestamp: number}> {
    try {
      const contract = new Contract(AccountsAbi, AccountsAdrs, wallet);
      const res = await contract.getEnergyInfos(wallet.address);

      return {
        energy: Number(res[0]),
        lastEnergyUpdateTimestamp: Number(res[1]),
      }
    }
    catch(error: any){
      console.log('getEnergyInfos ', error.message)
      return {energy: 0, lastEnergyUpdateTimestamp: 0};
    }
  }

  public static async getAllRunes(wallet: Account): Promise<Array<BlockchainRune>> {
    try {
      const contract = new Contract(AccountsAbi, AccountsAdrs, wallet);
      const res = await contract.getAllRunes(wallet.address);
      const newRes = res.map((rune: any) => {
        return Parser.parseRune(rune)
      })
      return newRes;
    }
    catch(error: any){
      console.log('getAllRunes ', error.message)
      return [];
    }
  }

  public static async getHero(wallet: Account, heroId: number): Promise<HeroBlockchain | undefined> {
    try {
      const contract = new Contract(AccountsAbi, AccountsAdrs, wallet);
      const res = await contract.getHero(wallet.address, heroId);
      return Parser.parseHero(res)
    }
    catch(error: any){
      console.log('getHero ', error.message)
      return;
    }
  }

  public static async getAllHeroes(wallet: Account): Promise<Array<HeroBlockchain>> {
    try {
      const contract = new Contract(AccountsAbi, AccountsAdrs, wallet);
      const res = await contract.getAllHeroes(wallet.address);
      const newRes = res.map((hero: any) => {
        return Parser.parseHero(hero)
      })
      return newRes;
    }
    catch(error: any){
      console.log('getAllHeroes ', error.message)
      return [];
    }
  }

  public static async getAccount(wallet: Account): Promise<AccountBlockchain | false> {
    try {
      const contract = new Contract(AccountsAbi, AccountsAdrs, wallet);
      const res = await contract.getAccount(wallet.address);
      if(Number(res.owner) === 0)
        return false;

      return {
        username: shortString.decodeShortString(res.username),
        energyInfos: {energy: Number(res.energy), lastEnergyUpdateTimestamp: Number(res.lastEnergyUpdateTimestamp), pvpEnergy: Number(res.pvpEnergy), lastPvpEnergyUpdateTimestamp: Number(res.lastPvpEnergyUpdateTimestamp)},
        crystals: Number(res.crystals),
        gems: Number(res.gems),
      }
    }
    catch(error: any){
      console.log('getAccount ', error.message)
      return false;
    }
  }

}