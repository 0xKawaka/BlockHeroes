import RawEvent from "./RawEvent";
import { RuneBonusEvent } from "./eventTypes";
import { shortString }  from "starknet";

export default abstract class EventHandler {
  static parseRuneBonusEvent(rawEvent: RawEvent): RuneBonusEvent {
    const id = Number(rawEvent.data[1]);
    const rank = Number(rawEvent.data[2]);
    const procStat = shortString.decodeShortString(rawEvent.data[3]);
    const isPercent = Boolean(Number(rawEvent.data[4]));
    return {owner: rawEvent.keys[0], id: id, rank: rank, procStat: procStat, isPercent: isPercent};
  }

  static parseRuneUpgradeEvent(rawEvent: RawEvent): number {
    return Number(rawEvent.data[3]);
  }

  static parseRuneMintedEvent(rawEvent: RawEvent) {
  }
  
}