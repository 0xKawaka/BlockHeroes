import { Account, TransactionFinalityStatus, shortString } from "starknet";
import {
    Entity,
    Has,
    HasValue,
    World,
    defineSystem,
    getComponentValue,
} from "@dojoengine/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import type { IWorld } from "./typescript/contracts.gen";
import stringToFelt252 from "../Pages/utils/stringToFelt252";
import EventHandler from "../Blockchain/event/EventHandler";
import GameEventHandler from "../Blockchain/event/GameEventHandler";
// import { Direction } from "./typescript/models.gen";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { client }: { client: IWorld },
    // { Position, Moves }: ClientComponents,
    { Account }: ClientComponents,
    world: World
) {
    const createAccount = async (account: Account, username: string): Promise<boolean> =>  {
        try {
            let txRes =await client.Game.createAccount({
                account,
                username,
            });
            await account.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            return true;
            // await new Promise<void>((resolve) => {
            //     defineSystem(
            //         world,
            //         [
            //             Has(Account),
            //             HasValue(Account, { owner: BigInt(account.address) }),
            //         ],
            //         () => {
            //             resolve();
            //         }
            //     );
            // });
        } catch (e) {
            console.log(e);
            return false;
        } 
        // finally {
        //     Position.removeOverride(positionId);
        //     Moves.removeOverride(movesId);
        // }
    };

    async function equipRune(account: Account, runeId: number, heroId: number) {
        try {
            let txRes = await client.Game.equipRune({
                account,
                runeId,
                heroId,
            });
            await account.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            return true;

        } catch (e) {
            console.log(e);
            return false;
        }

    }

    async function unequipRune(account: Account, runeId: number) {
        try {
            let txRes = await client.Game.unequipRune({
                account,
                runeId,
            });
            await account.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            return true;

        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async function upgradeRune(account: Account, runeId: number) {
        try {
            let txRes = await client.Game.upgradeRune({
                account,
                runeId,
            });
            let res: any = await account.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            let crystalCost;
            let bonus;

            if(res.events.length == 3) {
                crystalCost = EventHandler.parseRuneUpgradeEvent(res.events[0]);
            }
            else if(res.events.length == 4) {
                crystalCost = EventHandler.parseRuneUpgradeEvent(res.events[1]);
                bonus = EventHandler.parseRuneBonusEvent(res.events[0]);
            }
            else {
                throw new Error("upgradeRune : Error: unexpected number of events");
            }
            return { success: true, crystalCost: crystalCost, bonus: bonus };
        }
        catch(e){
            console.log(e);
            return { success: false, crystalCost: 0, bonus: undefined };
        }
    }

    async function mintHero(account: Account): Promise<{id: number, name: String}>  {
        try {
            let txRes = await client.Game.mintHero({
                account,
            });
            let res: any = await account.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            return {id: Number(res.events[2].data[1]), name: shortString.decodeShortString(res.events[2].data[2])};
        } catch (e) {
            console.log(e);
            return {id: -1, name: ''};
        }
    }

    async function initPvp(account: Account, heroesIds: number[]): Promise<{rank: number, defenseHeroesIds: number[]}> {
        try {
            let txRes = await client.Game.initPvp({
                account,
                heroesIds,
            });
            let res: any = await account.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            let defenseHeroesIds = [];
            let heroesCount = Number(res.events[res.events.length - 1].data[2]);
            for(let i = 0; i < heroesCount; i++) {
                defenseHeroesIds.push(Number(res.events[res.events.length - 1].data[3 + i]));
            }
            return {rank: Number(res.events[res.events.length - 1].data[1]), defenseHeroesIds: defenseHeroesIds};
        } catch (e) {
            console.log(e);
            return {rank: 0, defenseHeroesIds: []};
        }
    }

    async function setPvpTeam(account: Account, heroesIds: number[]): Promise<boolean> {
        try {
            let txRes = await client.Game.setPvpTeam({
                account,
                heroesIds,
            });
            await account.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async function startBattle(account: Account, heroesIds: number[], map: number, level: number, eventHandler: GameEventHandler): Promise<boolean> {
        try {
            let txRes = await client.Game.startBattle({
                account,
                heroesIds,
                map,
                level,
            });
            let res: any = await account.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            console.log(res);
            eventHandler.parseAndStore(res.events);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
    async function playTurn(account: Account, map: number, spellIndex: number, targetIndex: number, eventHandler: GameEventHandler) {
        try {
            let txRes = await client.Game.playTurn({
                account,
                map,
                spellIndex,
                targetIndex,
            });
            let res: any = await account.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            eventHandler.parseAndStore(res.events);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }



    return {
        createAccount,
        equipRune,
        unequipRune,
        upgradeRune,
        mintHero,
        initPvp,
        setPvpTeam,
        startBattle,
        playTurn,
    };
}
