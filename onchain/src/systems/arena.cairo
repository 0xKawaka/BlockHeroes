use starknet::ContractAddress;
use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};

trait IArena {
    fn initAccount(world: IWorldDispatcher, owner: ContractAddress, heroeIds: Array<u32>);
    fn setTeam(world: IWorldDispatcher, owner: ContractAddress, heroeIds: Span<u32>);
    fn swapRanks(world: IWorldDispatcher, winner: ContractAddress, looser: ContractAddress, lastClaimedRewards: u64);
    fn setEnemyRangesByRank(world: IWorldDispatcher, minRank: Array<u64>, range: Array<u64>);
    fn setGemsRewards(world: IWorldDispatcher, minRank: Array<u64>, gems: Array<u64>);
    fn getGemsReward(world: IWorldDispatcher, owner: ContractAddress) -> u64;
    fn isEnemyInRange(world: IWorldDispatcher, owner: ContractAddress, enemyOwner: ContractAddress) -> bool;
    fn getTeam(world: IWorldDispatcher, owner: ContractAddress) -> Array<u32>;
    fn getRank(world: IWorldDispatcher, owner: ContractAddress) -> u64;
    fn initArena(world: IWorldDispatcher, minRankGems: Array<u64>, gems: Array<u64>, minRankRange: Array<u64>, range: Array<u64>);
}

mod Arena {
    use game::systems::arena::IArena;
    use {starknet::ContractAddress, starknet::get_block_timestamp};
    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use game::models::storage::arena::{arenaAccount::ArenaAccount, arenaConfig::ArenaConfig, arenaCurrentRankIndex::ArenaCurrentRankIndex, arenaTeam::ArenaTeam, enemyRanges::EnemyRanges, gemsRewards::GemsRewards};
    use game::models::events::{Event, InitArena, ArenaDefense, RankChange};

    #[abi(embed_v0)]
    impl ArenaImpl of super::IArena {
        fn initAccount(world: IWorldDispatcher, owner: ContractAddress, heroeIds: Array<u32>) {
            let arenaCurrentRank = get!(world, 0, ArenaCurrentRankIndex).currentRankIndex;
            set!(world, ArenaAccount { owner: owner, rank: arenaCurrentRank, lastClaimedRewards: get_block_timestamp()});
            set!(world, ArenaCurrentRankIndex { id: 0, currentRankIndex: arenaCurrentRank + 1 });

            ArenaImpl::setTeam(world, owner, heroeIds.span());
            emit!(world, (Event::InitArena(InitArena { owner: owner, rank: arenaCurrentRank, heroeIds: heroeIds })));
        }

        fn setTeam(world: IWorldDispatcher, owner: ContractAddress, heroeIds: Span<u32>) {
            let mut i: u32 = 0;
            loop {
                if i >= heroeIds.len() {
                    break;
                }
                set!(world, ArenaTeam { owner: owner, index: i, heroIndex: *heroeIds[i] });
                i += 1;
            };
            emit!(world, (Event::ArenaDefense(ArenaDefense { owner: owner, heroeIds: heroeIds })));
        }

        fn swapRanks(world: IWorldDispatcher, winner: ContractAddress, looser: ContractAddress, lastClaimedRewards: u64) {
            let winnerRank = get!(world, winner, ArenaAccount).rank;
            let looserRank = get!(world, looser, ArenaAccount).rank;
            set!(world, ArenaAccount { owner: winner, rank: looserRank, lastClaimedRewards: lastClaimedRewards });
            set!(world, ArenaAccount { owner: looser, rank: winnerRank, lastClaimedRewards: lastClaimedRewards });
            emit!(world, (Event::RankChange(RankChange { owner: winner, rank: looserRank })));
            emit!(world, (Event::RankChange(RankChange { owner: looser, rank: winnerRank })));
        }

        fn setEnemyRangesByRank(world: IWorldDispatcher, minRank: Array<u64>, range: Array<u64>) {
            let arenaConfig = get!(world, 0, ArenaConfig);
            set!(world, ArenaConfig { id: 0, gemsRewardsLength: arenaConfig.gemsRewardsLength, enemyRangesByRankLength: minRank.len()});

            let mut i: u32 = 0;
            loop {
                if i >= minRank.len() {
                    break;
                }
                set!(world, EnemyRanges { index: i, minRank: *minRank[i], range: *range[i] });
                i += 1;
            };

        }

        fn setGemsRewards(world: IWorldDispatcher, minRank: Array<u64>, gems: Array<u64>) {
            let arenaConfig = get!(world, 0, ArenaConfig);
            set!(world, ArenaConfig { id: 0, gemsRewardsLength: gems.len(), enemyRangesByRankLength: arenaConfig.enemyRangesByRankLength });

            let mut i: u32 = 0;
            loop {
                if i >= gems.len() {
                    break;
                }
                set!(world, GemsRewards { index: i, minRank: *minRank[i], gems: *gems[i] });
                i += 1;
            };
        }

        fn getGemsReward(world: IWorldDispatcher, owner: ContractAddress) -> u64 {            
            let ownerRank = get!(world, owner, ArenaAccount).rank;
            let gemsRewardsLength = get!(world, 0, ArenaConfig).gemsRewardsLength;
            let mut i: u32 = 0;
            let mut res: u64 = 0;

            loop {
                if i == gemsRewardsLength {
                    break;
                }
                let gemsReward = get!(world, i, GemsRewards);
                if ownerRank <= gemsReward.minRank {
                    res = gemsReward.gems;
                    break;
                }
                i += 1;
            };
            return res;
        }

        fn isEnemyInRange(world: IWorldDispatcher, owner: ContractAddress, enemyOwner: ContractAddress) -> bool {
            let ownerRank = get!(world, owner, ArenaAccount).rank;
            let enemyRank = get!(world, enemyOwner, ArenaAccount).rank;
            let enemyRangesByRankLength = get!(world, 0, ArenaConfig).enemyRangesByRankLength;

            let mut i: u32 = 0;
            let mut res = false;
            loop {
                if i == enemyRangesByRankLength {
                    break;
                }
                let enemyRanges = get!(world, i, EnemyRanges);
                if ownerRank <= enemyRanges.minRank {
                    if enemyRank + enemyRanges.range >= ownerRank {
                        res = true;
                    }
                    break;
                }
                i += 1;
            };
            return res;
        }

        fn getRank(world: IWorldDispatcher, owner: ContractAddress) -> u64 {
            get!(world, owner, ArenaAccount).rank
        }

        fn getTeam(world: IWorldDispatcher, owner: ContractAddress) -> Array<u32> {
            return array![];
        }

        fn initArena(world: IWorldDispatcher, minRankGems: Array<u64>, gems: Array<u64>, minRankRange: Array<u64>, range: Array<u64>) {
            set!(world,
                (
                    ArenaConfig {
                        id: 0,
                        enemyRangesByRankLength: minRankRange.len(),
                        gemsRewardsLength: minRankGems.len()
                    }
                )
            );
            set!(world, ArenaCurrentRankIndex { id: 0, currentRankIndex: 1 });

            let mut i: u32 = 0;
            loop {
                if i == minRankGems.len() {
                    break;
                }
                set!(world, GemsRewards { index: i, minRank: *minRankGems[i], gems: *gems[i] });
                i += 1;
            };

            i = 0;
            loop {
                if i == minRankRange.len() {
                    break;
                }
                set!(world, EnemyRanges { index: i, minRank: *minRankRange[i], range: *range[i] });
                i += 1;
            };
        }

    }

}