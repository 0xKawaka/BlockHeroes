import { HeroInfos } from "./apiTypes";

type ArenaFullAccount = {
    owner: string,
    username: string,
    rank: number,
    team: Array<HeroInfos>,
}

type ArenaAccount = {rank: number, lastClaimedRewards: number}

export type {ArenaFullAccount, ArenaAccount}