import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_Game_claimGlobalRewards_calldata = (map: BigNumberish, mapProgressRequired: BigNumberish): DojoCall => {
		return {
			contractName: "Game",
			entrypoint: "claimGlobalRewards",
			calldata: [map, mapProgressRequired],
		};
	};

	const Game_claimGlobalRewards = async (snAccount: Account | AccountInterface, map: BigNumberish, mapProgressRequired: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Game_claimGlobalRewards_calldata(map, mapProgressRequired),
				"game",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Game_createAccount_calldata = (username: BigNumberish): DojoCall => {
		return {
			contractName: "Game",
			entrypoint: "createAccount",
			calldata: [username],
		};
	};

	const Game_createAccount = async (snAccount: Account | AccountInterface, username: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Game_createAccount_calldata(username),
				"game",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Game_equipRune_calldata = (runeId: BigNumberish, heroId: BigNumberish): DojoCall => {
		return {
			contractName: "Game",
			entrypoint: "equipRune",
			calldata: [runeId, heroId],
		};
	};

	const Game_equipRune = async (snAccount: Account | AccountInterface, runeId: BigNumberish, heroId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Game_equipRune_calldata(runeId, heroId),
				"game",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Game_initPvp_calldata = (heroesIds: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "Game",
			entrypoint: "initPvp",
			calldata: [heroesIds],
		};
	};

	const Game_initPvp = async (snAccount: Account | AccountInterface, heroesIds: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				build_Game_initPvp_calldata(heroesIds),
				"game",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Game_mintHero_calldata = (): DojoCall => {
		return {
			contractName: "Game",
			entrypoint: "mintHero",
			calldata: [],
		};
	};

	const Game_mintHero = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_Game_mintHero_calldata(),
				"game",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Game_mintRune_calldata = (): DojoCall => {
		return {
			contractName: "Game",
			entrypoint: "mintRune",
			calldata: [],
		};
	};

	const Game_mintRune = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_Game_mintRune_calldata(),
				"game",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Game_playArenaTurn_calldata = (spellIndex: BigNumberish, targetIndex: BigNumberish): DojoCall => {
		return {
			contractName: "Game",
			entrypoint: "playArenaTurn",
			calldata: [spellIndex, targetIndex],
		};
	};

	const Game_playArenaTurn = async (snAccount: Account | AccountInterface, spellIndex: BigNumberish, targetIndex: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Game_playArenaTurn_calldata(spellIndex, targetIndex),
				"game",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Game_playTurn_calldata = (map: BigNumberish, spellIndex: BigNumberish, targetIndex: BigNumberish): DojoCall => {
		return {
			contractName: "Game",
			entrypoint: "playTurn",
			calldata: [map, spellIndex, targetIndex],
		};
	};

	const Game_playTurn = async (snAccount: Account | AccountInterface, map: BigNumberish, spellIndex: BigNumberish, targetIndex: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Game_playTurn_calldata(map, spellIndex, targetIndex),
				"game",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Game_setPvpTeam_calldata = (heroesIds: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "Game",
			entrypoint: "setPvpTeam",
			calldata: [heroesIds],
		};
	};

	const Game_setPvpTeam = async (snAccount: Account | AccountInterface, heroesIds: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				build_Game_setPvpTeam_calldata(heroesIds),
				"game",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Game_startBattle_calldata = (heroesIds: Array<BigNumberish>, map: BigNumberish, level: BigNumberish): DojoCall => {
		return {
			contractName: "Game",
			entrypoint: "startBattle",
			calldata: [heroesIds, map, level],
		};
	};

	const Game_startBattle = async (snAccount: Account | AccountInterface, heroesIds: Array<BigNumberish>, map: BigNumberish, level: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Game_startBattle_calldata(heroesIds, map, level),
				"game",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Game_startPvpBattle_calldata = (enemyOwner: string, heroesIds: Array<BigNumberish>): DojoCall => {
		return {
			contractName: "Game",
			entrypoint: "startPvpBattle",
			calldata: [enemyOwner, heroesIds],
		};
	};

	const Game_startPvpBattle = async (snAccount: Account | AccountInterface, enemyOwner: string, heroesIds: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				build_Game_startPvpBattle_calldata(enemyOwner, heroesIds),
				"game",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Game_unequipRune_calldata = (runeId: BigNumberish): DojoCall => {
		return {
			contractName: "Game",
			entrypoint: "unequipRune",
			calldata: [runeId],
		};
	};

	const Game_unequipRune = async (snAccount: Account | AccountInterface, runeId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Game_unequipRune_calldata(runeId),
				"game",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Game_upgradeRune_calldata = (runeId: BigNumberish): DojoCall => {
		return {
			contractName: "Game",
			entrypoint: "upgradeRune",
			calldata: [runeId],
		};
	};

	const Game_upgradeRune = async (snAccount: Account | AccountInterface, runeId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Game_upgradeRune_calldata(runeId),
				"game",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		Game: {
			claimGlobalRewards: Game_claimGlobalRewards,
			buildClaimGlobalRewardsCalldata: build_Game_claimGlobalRewards_calldata,
			createAccount: Game_createAccount,
			buildCreateAccountCalldata: build_Game_createAccount_calldata,
			equipRune: Game_equipRune,
			buildEquipRuneCalldata: build_Game_equipRune_calldata,
			initPvp: Game_initPvp,
			buildInitPvpCalldata: build_Game_initPvp_calldata,
			mintHero: Game_mintHero,
			buildMintHeroCalldata: build_Game_mintHero_calldata,
			mintRune: Game_mintRune,
			buildMintRuneCalldata: build_Game_mintRune_calldata,
			playArenaTurn: Game_playArenaTurn,
			buildPlayArenaTurnCalldata: build_Game_playArenaTurn_calldata,
			playTurn: Game_playTurn,
			buildPlayTurnCalldata: build_Game_playTurn_calldata,
			setPvpTeam: Game_setPvpTeam,
			buildSetPvpTeamCalldata: build_Game_setPvpTeam_calldata,
			startBattle: Game_startBattle,
			buildStartBattleCalldata: build_Game_startBattle_calldata,
			startPvpBattle: Game_startPvpBattle,
			buildStartPvpBattleCalldata: build_Game_startPvpBattle_calldata,
			unequipRune: Game_unequipRune,
			buildUnequipRuneCalldata: build_Game_unequipRune_calldata,
			upgradeRune: Game_upgradeRune,
			buildUpgradeRuneCalldata: build_Game_upgradeRune_calldata,
		},
	};
}