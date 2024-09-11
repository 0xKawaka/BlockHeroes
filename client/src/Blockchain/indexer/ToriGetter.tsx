import { Account, Contract, shortString } from "starknet"
// import {AccountsAdrs, PvpAdrs} from './data/contracts'
// import AccountsAbi from './abi/Accounts.json'
// import PvpAbi from './abi/Pvp.json'
import { AccountBlockchain, BlockchainRune, HeroBlockchain } from "../../Types/blockchainTypes";
// import { Parser } from "./Parser";
// import EnergyHandler from "../Pages/Classes/EnergyHandler";

export abstract class ToriGetter {
  public static async getAccount(wallet: Account): Promise<AccountBlockchain | false> {
    return false;
  }

}