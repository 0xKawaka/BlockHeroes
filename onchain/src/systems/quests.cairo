use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
use starknet::ContractAddress;

trait IQuest {
    fn initQuests(world: IWorldDispatcher);
    fn claimGlobalRewards(world: IWorldDispatcher, owner: ContractAddress, map: u16, mapProgressRequired: u16);
}

mod Quests {
    use game::models::storage::quest::{accountQuests::AccountQuests, globalQuests::GlobalQuests, rewardType::{RewardType, RewardTypeImpl}};
    use game::models::map::{MapTrait, Map};
    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use starknet::ContractAddress;
    use game::systems::accounts::Accounts::AccountsImpl;
    use game::models::storage::mapProgress::MapProgress;

    impl QuestsImpl of super::IQuest {
        fn initQuests(world: IWorldDispatcher) {
            let map: u16 = Map::Campaign.toU16();
            set!(
                world,
                (
                GlobalQuests { map: map, mapProgressRequired: 1, rewardType: RewardType::Summon, rewardQuantity: 1 },
                GlobalQuests { map: map, mapProgressRequired: 4, rewardType: RewardType::Summon, rewardQuantity: 1 },
                GlobalQuests { map: map, mapProgressRequired: 6, rewardType: RewardType::Summon, rewardQuantity: 1 },
                GlobalQuests { map: map, mapProgressRequired: 8, rewardType: RewardType::Summon, rewardQuantity: 1 },
                )
            );
        }

        fn claimGlobalRewards(world: IWorldDispatcher, owner: ContractAddress, map: u16, mapProgressRequired: u16) {
            let ownerProgress = get!(world, (owner, map), MapProgress).level;
            assert(ownerProgress >= mapProgressRequired, 'progress not enough');
            let accountGlobalQuest = get!(world, (owner, map, mapProgressRequired), AccountQuests);
            assert(!accountGlobalQuest.hasClaimedRewards, 'quest already claimed');
            set!(world, AccountQuests { owner, map, mapProgressRequired, hasClaimedRewards: true });
            let quest = get!(world, (map, mapProgressRequired), GlobalQuests);

            match quest.rewardType {
                RewardType::Summon => {
                    AccountsImpl::increaseSummonChests(world, owner, quest.rewardQuantity);
                },
                RewardType::Rune => {},
                RewardType::Crystals => {},
            }
        }

    }
}