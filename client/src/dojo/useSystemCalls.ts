import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useAccount } from "@starknet-react/core";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { useEffect, useState } from "react";
import { addAddressPadding, shortString, TransactionFinalityStatus } from "starknet";
import GameEventHandler from "../Blockchain/event/GameEventHandler";

export const useSystemCalls = () => {
    const { useDojoStore, client } = useDojoSDK();
    const state = useDojoStore((state) => state);
    const { account } = useAccount();

    const [entityId, setEntityId] = useState<string>("");

    useEffect(() => {
        if (account) {
            setEntityId(getEntityIdFromKeys([BigInt(account!.address)]));
        }
    }, [account]);

    const createAccount = async (username: string) => {
        try {
            await client.Game.createAccount(account!, username);
            const adrsPadded = addAddressPadding(account!.address);
            const entity = await state.waitForEntityChange(entityId, (entity) => {
                return entity?.models?.game?.Account?.owner === adrsPadded;
            });
            if(entity){
                return {success: true, error: ""};
            }
            return {success: false, error: 'Unkown error'};
        } catch (error: any) {
            console.error("Error creating account:", error);
            if(error.message.includes("username already taken")){
                return {success: false, error: 'Username already taken'};
            }
            return {success: false, error: 'Unkown error'};
        }
    };

    const equipRune = async (runeId: number, heroId: number) => {
        try {
            await client.Game.equipRune(account!, runeId, heroId);
        } catch (error: any) {
            console.error("Error equipping rune:", error);
            return false;
        }
    };

    const unequipRune = async (runeId: number) => {
        try {
            await client.Game.unequipRune(account!, runeId);
        } catch (error: any) {
            console.error("Error unequipping rune:", error);
            return false;
        }
    };
    const upgradeRune = async (runeId: number) => {
        try {
            await client.Game.upgradeRune(account!, runeId);
        } catch (error: any) {
            console.error("Error upgrading rune:", error);
            return false;
        }
    };

    const claimGlobalQuest = async (map: number, mapProgressRequired: number) => {
        try {
            await client.Game.claimGlobalQuest(account!, map, mapProgressRequired);
        } catch (error: any) {
            console.error("Error claiming global quest:", error);
            return false;
        }
    };

    const mintHero = async () => {
        try {
            let txRes = await client.Game.mintHero(account!);
            let res: any = await account!.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            return {id: Number(res.events[0].data[4]), name: shortString.decodeShortString(res.events[0].data[5])};
        } catch (error: any) {
            console.error("Error minting hero:", error);
            return {id: -1, name: ''};
        }
    };
    const startBattle = async (heroesIds: number[], map: number, battleId: number, eventHandler: GameEventHandler) => {
        try {
            let txRes = await client.Game.startBattle(account!, heroesIds, map, battleId);
            let res: any = await account!.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            console.log("start battle event", res.events)
            // eventHandler.parseAndStore(res.events);
            return {success: true, txHash: txRes.transaction_hash};
        } catch (error: any) {
            console.error("Error starting battle:", error);
            return {success: false, txHash: ""};
        }
    };
    const startPvpBattle = async (enemyAdrs: bigint, heroesIds: number[], eventHandler: GameEventHandler) => {
        try {
            let txRes = await client.Game.startPvpBattle(account!, enemyAdrs, heroesIds);
            let res: any = await account!.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            // eventHandler.parseAndStore(res.events);
            return {success: true, txHash: txRes.transaction_hash};
        } catch (error: any) {
            console.error("Error starting pvp battle:", error);
            return {success: false, txHash: ""};
        }
    };

    const playTurn = async (map: number, spellIndex: number, targetIndex: number, eventHandler: GameEventHandler) => {
        try {
            let txRes = await client.Game.playTurn(account!, map, spellIndex, targetIndex);
            let res: any = await account!.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            console.log("play turn event", res.events)
            eventHandler.parseAndStore(res.events);
            return true;
        } catch (error: any) {
            console.error("Error playing turn:", error);
            return false;
        }
    };

    // unction initPvp(account: Account, heroesIds: number[]): Promise<{rank: number, defenseHeroesIds: number[]}
    // let txRes = await client.Game.initPvp({
    //     account,
    //     heroesIds:anyHeroesIds,
    // });

    const initPvp = async (heroesIds: number[]) => {
        try {
            let txRes = await client.Game.initPvp(account!, heroesIds);
            let res: any = await account!.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            return true;
        } catch (error: any) {
            console.error("Error initializing pvp:", error);
            return false;
        }
    }

    return {
        createAccount,
        equipRune,
        unequipRune,
        upgradeRune,
        claimGlobalQuest,
        mintHero,
        startBattle,
        startPvpBattle,
        playTurn,
        initPvp,
    };
};