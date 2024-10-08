
// Generated by dojo-bindgen on Sat, 21 Sep 2024 12:18:58 +0000. Do not modify this file manually.
// Import the necessary types from the recs SDK
// generate again with `sozo build --typescript` 
import { Account, byteArray } from "starknet";
import { DojoProvider } from "@dojoengine/core";
import * as models from "./models.gen";

export type IWorld = Awaited<ReturnType<typeof setupWorld>>;

export async function setupWorld(provider: DojoProvider) {
    // System definitions for `game-Game` contract
    function Game() {
        const contract_name = "Game";

        
        // Call the `startPvpBattle` system with the specified Account and calldata
        const startPvpBattle = async (props: { account: Account, enemyOwner: bigint, heroesIds: RecsType.NumberArray }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "startPvpBattle",
                        calldata: [props.enemyOwner,
                ...props.heroesIds],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

    
        // Call the `playArenaTurn` system with the specified Account and calldata
        const playArenaTurn = async (props: { account: Account, spellIndex: number, targetIndex: number }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "playArenaTurn",
                        calldata: [props.spellIndex,
                props.targetIndex],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

    
        // Call the `startBattle` system with the specified Account and calldata
        const startBattle = async (props: { account: Account, heroesIds: RecsType.NumberArray, map: number, level: number }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "startBattle",
                        calldata: [...props.heroesIds,
                props.map,
                props.level],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

    
        // Call the `playTurn` system with the specified Account and calldata
        const playTurn = async (props: { account: Account, map: number, spellIndex: number, targetIndex: number }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "playTurn",
                        calldata: [props.map,
                props.spellIndex,
                props.targetIndex],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

    
        // Call the `claimGlobalRewards` system with the specified Account and calldata
        const claimGlobalRewards = async (props: { account: Account, map: number, mapProgressRequired: number }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "claimGlobalRewards",
                        calldata: [props.map,
                props.mapProgressRequired],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

    
        // Call the `initPvp` system with the specified Account and calldata
        const initPvp = async (props: { account: Account, heroesIds: RecsType.NumberArray }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "initPvp",
                        calldata: [...props.heroesIds],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

    
        // Call the `setPvpTeam` system with the specified Account and calldata
        const setPvpTeam = async (props: { account: Account, heroesIds: RecsType.NumberArray }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "setPvpTeam",
                        calldata: [...props.heroesIds],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

    
        // Call the `equipRune` system with the specified Account and calldata
        const equipRune = async (props: { account: Account, runeId: number, heroId: number }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "equipRune",
                        calldata: [props.runeId,
                props.heroId],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

    
        // Call the `unequipRune` system with the specified Account and calldata
        const unequipRune = async (props: { account: Account, runeId: number }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "unequipRune",
                        calldata: [props.runeId],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

    
        // Call the `upgradeRune` system with the specified Account and calldata
        const upgradeRune = async (props: { account: Account, runeId: number }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "upgradeRune",
                        calldata: [props.runeId],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

    
        // Call the `mintHero` system with the specified Account and calldata
        const mintHero = async (props: { account: Account }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "mintHero",
                        calldata: [],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

    
        // Call the `mintRune` system with the specified Account and calldata
        const mintRune = async (props: { account: Account }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "mintRune",
                        calldata: [],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

    
        // Call the `createAccount` system with the specified Account and calldata
        const createAccount = async (props: { account: Account, username: bigint }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "createAccount",
                        calldata: [props.username],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

    
        // Call the `world` system with the specified Account and calldata
        const world = async (props: { account: Account }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "world",
                        calldata: [],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

        return {
            startPvpBattle, playArenaTurn, startBattle, playTurn, claimGlobalRewards, initPvp, setPvpTeam, equipRune, unequipRune, upgradeRune, mintHero, mintRune, createAccount, world
        };
    }

    // System definitions for `game-Settings` contract
    function Settings() {
        const contract_name = "Settings";

        
        // Call the `world` system with the specified Account and calldata
        const world = async (props: { account: Account }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "world",
                        calldata: [],
                    },
                    "game"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

        return {
            world
        };
    }

    return {
        Game: Game(),
        Settings: Settings()
    };
}
