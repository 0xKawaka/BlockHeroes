import {Maps} from "../GameDatas/maps";
import { HeroInfos } from "./apiTypes";

type ArenaFullAccount = {
    owner: string,
    username: string,
    rank: number,
    team: Array<HeroInfos>,
}

type ArenaAccount = {rank: number, lastClaimedRewards: number}

type GlobalQuest = { map: Maps, mapProgressRequired: number, rewardType: string, rewardQuantity: number, hasClaimed: boolean}

export type {ArenaFullAccount, ArenaAccount, GlobalQuest};