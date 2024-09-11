type GameAccount = {
  owner: BigInt;
  username: string;
  energy: number;
  pvpEnergy: number;
  crystals: number;
  gems: number;
  lastEnergyUpdateTimestamp: number;
  lastPvpEnergyUpdateTimestamp: number;
  runesCount: number;
  heroesCount: number;
}
type Rune = { id: number, statistic: string, isPercent: boolean, rank: number, rarity: string, shape: number, isEquipped: boolean, heroEquipped: number, rank4Bonus?: {statistic: string, isPercent: boolean}, rank8Bonus?: {statistic: string, isPercent: boolean}, rank12Bonus?: {statistic: string, isPercent: boolean}, rank16Bonus?: {statistic: string, isPercent: boolean}};
type Hero = {id:number, name: string, level:number, experience: number, rank: number, runeIds: Array<number>, spots:Array<number>}

export type {GameAccount, Rune, Hero};