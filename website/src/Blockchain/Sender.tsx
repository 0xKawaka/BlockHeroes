import { Account, Contract, TransactionFinalityStatus, shortString } from "starknet"
import {AccountsAdrs, GameAdrs, EventEmitterAdrs } from './data/contracts'
import AccountsAbi from './abi/Accounts.json'
import GameAbi from './abi/Game.json'
import EventEmitterAbi from './abi/EventEmitter.json'
import GameEventHandler from "./event/GameEventHandler";
import EventHandler from "./event/EventHandler";
import { RuneBonusEvent } from "./event/eventTypes";
import { RuneInfos } from "../Types/apiTypes";

export abstract class Sender {

  public static async setPvpTeam(wallet: Account, heroesIds: number[]) {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.setPvpTeam(heroesIds, { fee: 0, maxFee: 0 });
      await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      return true;
    }
    catch(error: any){
      console.log('setPvpTeam ', error.message)
      return false;
    }
  }

  public static async initPvp(wallet: Account, heroesIds: number[]) {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.initPvp(heroesIds, { fee: 0, maxFee: 0 });
      await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      return true;
    }
    catch(error: any){
      console.log('initPvp ', error.message)
      return false;
    }
  }

  public static async unequipRune(wallet: Account, rune: RuneInfos) {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.unequipRune(rune.id, { fee: 0, maxFee: 0 });
      const res: any = await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      if(res.execution_status == "SUCCEEDED")
        return true;
      return false;
    }
    catch(error: any){
      console.log('Sender unequipRune ', error.message)
      return false;
    }
  }

  public static async equipRune(wallet: Account, runeId: number, heroId: number) {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.equipRune(runeId, heroId, { fee: 0, maxFee: 0 });
      const res: any = await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      console.log(res.events)
      if(res.execution_status == "SUCCEEDED")
        return true;
      return false;
    }
    catch(error: any){
      console.log('Sender equipRune ', error.message)
      return false;
    }
  }

  public static async upgradeRune(wallet: Account, rune: RuneInfos): Promise<{success: boolean, crystalCost: number, bonus: RuneBonusEvent | undefined }> {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.upgradeRune(rune.id, { fee: 0, maxFee: 0 });
      const res: any = await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      let crystalCost = EventHandler.parseRuneUpgradeEvent(res.events[res.events.length - 1]);
      let bonus;
      if((process.env.REACT_APP_ENV == "PROD" || process.env.REACT_APP_ENV == "TEST") && res.events.length > 2) {
        bonus = EventHandler.parseRuneBonusEvent(res.events[0]);
      }
      else if(process.env.REACT_APP_ENV == "DEV" && res.events.length > 1) {
        bonus = EventHandler.parseRuneBonusEvent(res.events[0]);
      }
      return { success: true, crystalCost: crystalCost, bonus: bonus };
    }
    catch(error: any){
      console.log('Sender upgradeRune ', error.message)
      return { success: false, crystalCost: 0, bonus: undefined };
    }
  }

  public static async playTurn(wallet: Account, spellIndex: number, targetId: number, eventHandler: GameEventHandler) {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.playTurn(spellIndex, targetId, { fee: 0, maxFee: 0 });
      let res: any = await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      const eventContract = new Contract(EventEmitterAbi, EventEmitterAdrs);
      eventHandler.parseAndStore(eventContract.parseEvents(res))
    }
    catch(error: any){
      console.log('Sender playTurn ', error.message)
      return 0;
    }
  }


  public static async startBattle(wallet: Account, heroesId: number[], worldId: number, battleId: number, eventHandler: GameEventHandler): Promise<Boolean> {
    console.log('startBattle')
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.startBattle(heroesId, worldId, battleId, { fee: 0, maxFee: 0 });
      let res: any = await wallet.waitForTransaction(tx.transaction_hash,  {
        retryInterval: 300,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      const eventContract = new Contract(EventEmitterAbi, EventEmitterAdrs);
      eventHandler.parseAndStore(eventContract.parseEvents(res))
      return true;
    }
    catch(error: any){
      console.log('Sender startBattle ', error.message)
      return false;
    }
  }

  public static async mintHero(wallet: Account): Promise<{id: number, name: String}> {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.mintHero({ fee: 0, maxFee: 0 });
      const res: any = await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      return {id: Number(res.events[0].data[1]), name: shortString.decodeShortString(res.events[0].data[2])};
    }
    catch(error: any){
      console.log('mintHero ', error.message)
      return {id: -1, name: ''};
    }
  }
  public static async createAccount(wallet: Account,  username: string) {
    try {
      const contract = new Contract(GameAbi, GameAdrs, wallet);
      const tx = await contract.createAccount(username, { fee: 0, maxFee: 0 });
      await wallet.waitForTransaction(tx.transaction_hash, {
        retryInterval: 200,
        successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
      });
      return;
    }
    catch(error: any){
      console.log('createAccount ', error.message)
      return 0;
    }
  }
}