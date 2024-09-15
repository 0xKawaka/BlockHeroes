import { Hero } from "./toriiTypes";

type ArenaFullAccount = {
    owner: string,
    username: string,
    rank: number,
    team: Array<Hero>,
}

export type {ArenaFullAccount}