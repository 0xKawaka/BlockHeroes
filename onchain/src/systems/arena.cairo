use starknet::ContractAddress;
use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};

trait IArena {
    fn initAccount(world: IWorldDispatcher, owner: ContractAddress, heroeIds: Array<u32>);
    fn setTeam(world: IWorldDispatcher, owner: ContractAddress, heroeIds: Span<u32>);
    fn swapRanks(world: IWorldDispatcher, winner: ContractAddress, looser: ContractAddress, lastClaimedRewards: u64);
    fn setEnemyRangesByRank(world: IWorldDispatcher, minRank: Array<u64>, range: Array<u64>);
    fn setGemsRewards(world: IWorldDispatcher, minRank: Array<u64>, gems: Array<u64>);
    fn getGemsReward(world: IWorldDispatcher, owner: ContractAddress) -> u64;
    fn assertEnemyInRange(world: IWorldDispatcher, owner: ContractAddress, enemyOwner: ContractAddress);
    fn getTeam(world: IWorldDispatcher, owner: ContractAddress) -> Array<u32>;
    fn getRank(world: IWorldDispatcher, owner: ContractAddress) -> u64;
    fn initArena(world: IWorldDispatcher, minRankGems: Array<u64>, gems: Array<u64>, minRankRange: Array<u64>, range: Array<u64>);
    fn hasAccount(world: IWorldDispatcher, accountAdrs: ContractAddress);
    fn hasNoAccount(world: IWorldDispatcher, accountAdrs: ContractAddress);
}

mod Arena {
    use game::systems::arena::IArena;
    use {starknet::ContractAddress, starknet::get_block_timestamp};
    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use game::models::storage::arena::{arenaAccount::ArenaAccount, arenaConfig::ArenaConfig, arenaCurrentRankIndex::ArenaCurrentRankIndex, arenaTeam::ArenaTeam, enemyRanges::EnemyRanges, gemsRewards::GemsRewards};
    use game::models::events::{Event, InitArena, ArenaDefense, RankChange};
    use debug::PrintTrait;

    impl ArenaImpl of super::IArena {
        fn initAccount(world: IWorldDispatcher, owner: ContractAddress, heroeIds: Array<u32>) {
            let arenaCurrentRank = get!(world, 0, ArenaCurrentRankIndex).currentRankIndex;
            set!(world, ArenaAccount { owner: owner, rank: arenaCurrentRank, lastClaimedRewards: get_block_timestamp(), teamSize: heroeIds.len() });
            set!(world, ArenaCurrentRankIndex { id: 0, currentRankIndex: arenaCurrentRank + 1 });

            Self::setTeam(world, owner, heroeIds.span());
            emit!(world, (Event::InitArena(InitArena { owner: owner, rank: arenaCurrentRank, heroeIds: heroeIds })));
        }

        fn setTeam(world: IWorldDispatcher, owner: ContractAddress, heroeIds: Span<u32>) {
            let mut i: u32 = 0;
            loop {
                if i >= heroeIds.len() {
                    break;
                }
                set!(world, ArenaTeam { owner: owner, index: i, heroIndex: *heroeIds[i] });
                let arenaAccount = get!(world, owner, ArenaAccount);
                set!(world, ArenaAccount { owner: owner, rank: arenaAccount.rank, lastClaimedRewards: arenaAccount.lastClaimedRewards, teamSize: heroeIds.len() });
                i += 1;
            };
            emit!(world, (Event::ArenaDefense(ArenaDefense { owner: owner, heroeIds: heroeIds })));
        }

        fn swapRanks(world: IWorldDispatcher, winner: ContractAddress, looser: ContractAddress, lastClaimedRewards: u64) {
            let winnerAccount = get!(world, winner, ArenaAccount);
            let looserAccount = get!(world, looser, ArenaAccount);
            if(winnerAccount.rank < looserAccount.rank) {
                return;
            }
            set!(world, ArenaAccount { owner: winner, rank: looserAccount.rank, lastClaimedRewards: lastClaimedRewards, teamSize: winnerAccount.teamSize });
            set!(world, ArenaAccount { owner: looser, rank: winnerAccount.rank, lastClaimedRewards: lastClaimedRewards, teamSize: looserAccount.teamSize });
            emit!(world, (Event::RankChange(RankChange { owner: winner, rank: looserAccount.rank })));
            emit!(world, (Event::RankChange(RankChange { owner: looser, rank: winnerAccount.rank })));
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

        fn assertEnemyInRange(world: IWorldDispatcher, owner: ContractAddress, enemyOwner: ContractAddress) {
            let ownerRank = get!(world, owner, ArenaAccount).rank;
            let enemyRank = get!(world, enemyOwner, ArenaAccount).rank;
            assert(ownerRank > enemyRank, 'Can only fight higher ranks');
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
            assert(res, 'Enemy rank not in range');
        }

        fn getRank(world: IWorldDispatcher, owner: ContractAddress) -> u64 {
            get!(world, owner, ArenaAccount).rank
        }

        fn getTeam(world: IWorldDispatcher, owner: ContractAddress) -> Array<u32> {
            let account = get!(world, owner, ArenaAccount);
            let mut heroIndexes: Array<u32> = Default::default();
            let mut i: u32 = 0;
            loop {
                if i == account.teamSize {
                    break;
                }
                heroIndexes.append(get!(world, (owner, i), ArenaTeam).heroIndex);
                i += 1;
            };
            return heroIndexes;
        }

        fn hasAccount(world: IWorldDispatcher, accountAdrs: ContractAddress) {
            let acc = get!(world, accountAdrs, (ArenaAccount));
            assert(acc.rank != 0, 'Arenaccount not found');
        }

        fn hasNoAccount(world: IWorldDispatcher, accountAdrs: ContractAddress) {
            let acc = get!(world, accountAdrs, (ArenaAccount));
            assert(acc.rank == 0, 'Arenaccount already exists');
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