import RuneFactory from "../../Classes/Runes/RuneFactory";
import { RuneInfos, RuneStatsDict } from "../../Types/apiTypes";
import { Parser } from "../Parser";
import RawEvent from "./RawEvent";
import {eventHashes} from "./eventHash";
import {NewBattleEvent, StartTurnEvent, SkillEvent, EndTurnEvent, EndBattleEvent, ExperienceGainEvent, LootEvent} from "./eventTypes";
import { num, shortString, Contract } from "starknet";

export default class GameEventHandler {
  private newBattleEvent: NewBattleEvent | undefined;
  private endBattleEvent: EndBattleEvent | undefined;
  private startTurnEventArray: StartTurnEvent[];
  private skillEventArray: SkillEvent[];
  private endTurnEventArray: EndTurnEvent[];
  private experienceGainEventArray: ExperienceGainEvent[];
  private lootEvent: LootEvent | undefined;
  private runeMinted: RuneInfos | undefined;
  private runesStatsDict: RuneStatsDict;

  constructor(runesStatsDict: RuneStatsDict) {
    this.runesStatsDict = runesStatsDict;
    console.log("GameEventHandler constructor")
    this.newBattleEvent = undefined;
    this.endBattleEvent = undefined;
    this.startTurnEventArray = [];
    this.skillEventArray = [];
    this.endTurnEventArray = [];
    this.experienceGainEventArray = [];

  }

  findNameFromeEventHashes(keys: string[]){
    for (let i = 0; i < eventHashes.length; i++) {
      if (eventHashes[i].keys.every((key: string) => keys.includes(key))) {
        return eventHashes[i].name;
      }
    }
    return undefined;
  }

  retrieveKnownEvents(events: any[]) {
    let knownEvents: Array<{name: string, data: any[]}> = [];
    events.forEach((event: any) => {
      let eventName = this.findNameFromeEventHashes(event.keys);
      if (eventName) {
        knownEvents.push({name: eventName, data: event.data});
      }
    });
    return knownEvents;
  }

  parseAndStore(events: any[]): void {
    let knownEvents = this.retrieveKnownEvents(events);
    knownEvents.forEach((event: any) => {
      // console.log("Eventkey", key)
      if (event.name === "NewBattle") {
        console.log("NewBattle")
        this.parseAndStoreNewBattleEvent(event.data);
      }
      else if (event.name === "StartTurn") {
        this.parseAndStoreStartTurnEvent(event["StartTurn"]);
      }
      else if (event.name === "Skill") {
        this.parseAndStoreSkillEvent(event["Skill"]);
      }
      else if (event.name === "EndTurn") {
        this.parseAndStoreEndTurnEvent(event["EndTurn"]);
      }
      else if (event.name === "EndBattle") {
        this.endBattleEvent = {owner: num.toHexString(event["EndBattle"].owner), hasPlayerWon: Boolean(Number(event["EndBattle"].playerHasWon))};
      }
      else if (event.name === "ExperienceGain") {
        this.experienceGainEventArray.push({owner: num.toHexString(event["ExperienceGain"].owner), entityId: Number(event["ExperienceGain"].entityId), experienceGained: Number(event["ExperienceGain"].experienceGained), levelAfter: Number(event["ExperienceGain"].levelAfter), experienceAfter: Number(event["ExperienceGain"].experienceAfter)})
        // this.experienceGainEventArray.push({owner: num.toHexString(rawEvent.data[0]), entityId: Number(rawEvent.data[1]), experienceGained: Number(rawEvent.data[2]), levelAfter: Number(rawEvent.data[3]), experienceAfter: Number(rawEvent.data[4])})
      }
      else if (event.name === "Loot") {
        this.lootEvent = {owner: num.toHexString(event["Loot"].owner), crystals: Number(event["Loot"].crystals)}
        // this.lootEvent = {owner: num.toHexString(rawEvent.data[0]), crystals: Number(rawEvent.data[1])}
      }
      else if (event.name === "RuneMinted") {
        this.runeMinted = RuneFactory.createRune(Parser.parseRune(event["RuneMinted"].rune), this.runesStatsDict)
      }
      else {
        throw new Error('event ' + event.name + ' not found');
      }
    });
  }

  private parseAndStoreNewBattleEvent(data: any) {
    // this.newBattleEvent = {owner: num.toHexString(data.owner), worldId: Number(data.worldId), battleId: Number(data.battleId)};
    // this.newBattleEvent = {owner: num.toHexString(rawEvent.data[0]), worldId: Number(rawEvent.data[1]), battleId: Number(rawEvent.data[2])};
  }

  private parseAndStoreStartTurnEvent(event: any) {
    event.damages = event.damages.map((x: string) => Number(x));
    event.heals = event.heals.map((x: string) => Number(x));
    let buffs = Array<{name: string, duration: number}>();
    for (let i = 0; i < event.buffs.length; i++) {
      buffs.push({name: shortString.decodeShortString(event.buffs[i].name), duration: Number(event.buffs[i].duration)})
    }
    let status = Array<{name: string, duration: number}>();
    for (let i = 0; i < event.status.length; i++) {
      status.push({name: shortString.decodeShortString(event.status[i].name), duration: Number(event.status[i].duration)})
    }
    event.owner = num.toHexString(event.owner);
    this.startTurnEventArray.push({owner: event.owner, entityId: Number(event.entityId), damages: event.damages, heals: event.heals, buffs: buffs, status: status, isDead: Boolean(event.isDead)});


    // const damagesLength = Number(rawEvent.data[2]);
    // const damages = rawEvent.data.slice(3, 3 + damagesLength).map((x: string) => Number(x));
    // const healsLength = Number(rawEvent.data[3 + damagesLength]);
    // const heals = rawEvent.data.slice(4 + damagesLength, 4 + damagesLength + healsLength).map((x: string) => Number(x));
    // let buffs = Array<{name: string, duration: number}>();
    // let buffStartIndex = 4 + damagesLength + healsLength;
    // for (let i = 0; i < Number(rawEvent.data[buffStartIndex]); i++) {
    //   buffs.push({name: shortString.decodeShortString(rawEvent.data[buffStartIndex + 1 + 2 * i]), duration: Number(rawEvent.data[buffStartIndex + 2 + 2 * i])})
    // }
    // let status = Array<{name: string, duration: number}>();
    // let statusStartIndex = buffStartIndex + 1 + 2 * Number(rawEvent.data[buffStartIndex]);
    // for (let i = 0; i < Number(rawEvent.data[statusStartIndex]); i++) {
    //   status.push({name: shortString.decodeShortString(rawEvent.data[statusStartIndex + 1 + 2 * i]), duration: Number(rawEvent.data[statusStartIndex + 2 + 2 * i])})
    // }
    // let isDead = Boolean(Number(rawEvent.data[statusStartIndex + 1 + 2 * Number(rawEvent.data[statusStartIndex])]));
    // this.startTurnEventArray.push({owner: num.toHexString(rawEvent.data[0]), entityId: Number(rawEvent.data[1]), damages: damages, heals: heals, buffs: buffs, status: status, isDead: isDead});
  }

  private parseAndStoreSkillEvent(event: any) {
    // console.log(event)
    event.damagesDict = this.formatIdValueToDict(event.damages);
    event.healsDict = this.formatIdValueToDict(event.heals);
    event.deathArray = event.deaths.map((x: string) => Number(x));
    event.owner = num.toHexString(event.owner);
    // console.log(event)
    this.skillEventArray.push({owner: event.owner, casterId: Number(event.casterId), targetId: Number(event.targetId), skillIndex: Number(event.skillIndex), damagesDict: event.damagesDict, healsDict: event.healsDict, deathArray: event.deathArray});

    // const damagesLength = Number(rawEvent.data[4]);
    // let damages = Array<{entityId: number, value: number}>();
    // for (let i = 0; i < damagesLength; i++) {
    //   damages.push({entityId: Number(rawEvent.data[5 + 2 * i]), value: Number(rawEvent.data[6 + 2 * i])})
    // }
    // let damagesDict = this.formatIdValueToDict(damages);
    // const healsLength = Number(rawEvent.data[5 + 2 * damagesLength]);
    // let heals = Array<{entityId: number, value: number}>();
    // for (let i = 0; i < healsLength; i++) {
    //   heals.push({entityId: Number(rawEvent.data[6 + 2 * damagesLength + 2 * i]), value: Number(rawEvent.data[7 + 2 * damagesLength + 2 * i])})
    // }
    // let healsDict = this.formatIdValueToDict(heals);
    // let deathLength = Number(rawEvent.data[6 + 2 * damagesLength + 2 * healsLength]);
    // let deaths = Array<number>();
    // for (let i = 0; i < deathLength; i++) {
    //   deaths.push(Number(rawEvent.data[7 + 2 * damagesLength + 2 * healsLength + i]))
    // }
    
    // this.skillEventArray.push({owner: num.toHexString(rawEvent.data[0]), casterId: Number(rawEvent.data[1]), targetId: Number(rawEvent.data[2]), skillIndex: Number(rawEvent.data[3]), damagesDict: damagesDict, healsDict: healsDict, deathArray: deaths});
    
    // console.log('processed : ', this.skillEventArray[this.skillEventArray.length - 1])
  }

  parseAndStoreEndTurnEvent(event: any) {
    event.buffsDict = this.formatIdNameDurationToDict(event.buffs);
    event.statusDict = this.formatIdNameDurationToDict(event.status);
    event.speedsDict = this.formatIdValueWithoutValueTagToDict(event.speeds);
    event.owner = num.toHexString(event.owner);
    // console.log(event)

    this.endTurnEventArray.push({owner: event.owner, buffsDict: event.buffsDict, statusDict: event.statusDict, speedsDict: event.speedsDict});


    // const buffsLength = Number(rawEvent.data[1]);
    // let buffs = Array<{entityId: number, name: string, duration: number}>();
    // for (let i = 0; i < buffsLength; i++) {
    //   buffs.push({entityId: Number(rawEvent.data[2 + 3 * i]), name: shortString.decodeShortString(rawEvent.data[3 + 3 * i]), duration: Number(rawEvent.data[4 + 3 * i])})
    // }
    // let buffsDict = this.formatIdNameDurationToDict(buffs);
    // const statusLength = Number(rawEvent.data[2 + 3 * buffsLength]);
    // let status = Array<{entityId: number, name: string, duration: number}>();
    // for (let i = 0; i < statusLength; i++) {
    //   status.push({entityId: Number(rawEvent.data[3 + 3 * buffsLength + 3 * i]), name: shortString.decodeShortString(rawEvent.data[4 + 3 * buffsLength + 3 * i]), duration: Number(rawEvent.data[5 + 3 * buffsLength + 3 * i])})
    // }
    // let statusDict = this.formatIdNameDurationToDict(status);
    // const speedsLength = Number(rawEvent.data[3 + 3 * buffsLength + 3 * statusLength]);
    // let speeds = Array<{entityId: number, value: number}>();
    // for (let i = 0; i < speedsLength; i++) {
    //   speeds.push({entityId: Number(rawEvent.data[4 + 3 * buffsLength + 3 * statusLength + 2 * i]), value: Number(rawEvent.data[5 + 3 * buffsLength + 3 * statusLength + 2 * i])})
    // }
    // let speedsDict = this.formatIdValueWithoutValueTagToDict(speeds);

    // this.endTurnEventArray.push({owner: num.toHexString(rawEvent.data[0]), buffsDict: buffsDict, statusDict: statusDict, speedsDict: speedsDict});
    // console.log('processed : ', this.endTurnEventArray[this.endTurnEventArray.length - 1])
  }
    

  private formatIdValueWithoutValueTagToDict(valueById: Array<{entityId: number, value: number}>): {[key: number]: number} {
    let dict: {[key: number]: number} = {};
    valueById.forEach((valueById: {entityId: number, value: number}) => {
      dict[Number(valueById.entityId)] = Number(valueById.value);
    });
    return dict;
  }

  private formatIdValueToDict(valueById: Array<{entityId: number, value: number}>): {[key: number]: {value: number}} {
    let dict: {[key: number]: {value: number}} = {};
    valueById.forEach((valueById: {entityId: number, value: number}) => {
      dict[Number(valueById.entityId)] = {value: Number(valueById.value)};
    });
    return dict;
  }

  private formatIdNameDurationToDict(valueById: Array<{entityId: number, name: string, duration: number}>): {[key: number]: Array<{name: string, duration: number}>} {
    let dict: {[key: number]: Array<{name: string, duration: number}>} = {};
    valueById.forEach((valueById: {entityId: number, name: string, duration: number}) => {
      if (dict[valueById.entityId]) {
        dict[Number(valueById.entityId)].push({name: shortString.decodeShortString(valueById.name), duration: Number(valueById.duration)});
      }
      else {
        dict[Number(valueById.entityId)] = [{name: shortString.decodeShortString(valueById.name), duration: Number(valueById.duration)}];
      }
    });
    return dict;
  }

  reset() {
    this.newBattleEvent = undefined;
    this.endBattleEvent = undefined;
    this.startTurnEventArray = [];
    this.skillEventArray = [];
    this.endTurnEventArray = [];
    this.experienceGainEventArray = [];
    this.lootEvent = undefined;
    this.runeMinted = undefined;
  }

  getRuneMinted(): RuneInfos | undefined {
    return this.runeMinted;
  }

  getLootEvent(): LootEvent | undefined {
    return this.lootEvent;
  }

  getExperienceGainEventArray(): ExperienceGainEvent[] {
    return this.experienceGainEventArray;
  }

  getNewBattleEvent(): NewBattleEvent | undefined {
    return this.newBattleEvent;
  }

  getEndBattleEvent(): EndBattleEvent | undefined {
    return this.endBattleEvent;
  }

  shiftStartTurnEvent(): StartTurnEvent | undefined {
    return this.startTurnEventArray.shift();
  }

  shiftSkillEvent(): SkillEvent | undefined {
    return this.skillEventArray.shift();
  }

  shiftEndTurnEvent(): EndTurnEvent | undefined {
    return this.endTurnEventArray.shift();
  }
}

