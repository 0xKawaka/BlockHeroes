import Skill from "../Classes/Skill/Skill";
import {Maps} from "../GameDatas/maps";
import { HeroInfos, HeroStats } from "./apiTypes";

type ArenaFullAccount = {
    owner: string,
    username: string,
    rank: number,
    team: Array<HeroInfos>,
}
type ArenaAccount = {rank: number, lastClaimedRewards: number}
type GlobalQuest = { map: Maps, mapProgressRequired: number, rewardType: string, rewardQuantity: number, hasClaimed: boolean}
type BaseHeroInfos = {name: string, rank: number, spells: Array<Skill>, stats:HeroStats}


export type {ArenaFullAccount, ArenaAccount, GlobalQuest, BaseHeroInfos};