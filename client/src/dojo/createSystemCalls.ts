import { Account, TransactionFinalityStatus } from "starknet";
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
// import { Direction } from "./typescript/models.gen";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { client }: { client: IWorld },
    // { Position, Moves }: ClientComponents,
    { Account }: ClientComponents,
    world: World
) {
    const createAccount = async (account: Account, username: string) => {
        try {
            await client.Game.createAccount({
                account,
                username,
            });
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
                retryInterval: 200,
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
                retryInterval: 200,
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
            let res = await account.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 200,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            console.log(res)
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
    };
}
