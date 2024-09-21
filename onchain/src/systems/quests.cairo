use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
use game::models::map::Map;
use starknet::ContractAddress;

trait IQuest {
    fn initQuests(world: IWorldDispatcher);
    fn claimRewards(world: IWorldDispatcher, owner: ContractAddress, map: Map, mapProgressRequired: u16);
}

mod Quests {
    use game::models::storage::quest::{globalQuests::GlobalQuests, rewardType::{RewardType, RewardTypeImpl}};
    use game::models::map::{MapTrait, Map};
    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use starknet::ContractAddress;
    use game::systems::accounts::Accounts::AccountsImpl;
    use game::models::storage::mapProgress::MapProgress;

    impl QuestsImpl of super::IQuest {
        fn initQuests(world: IWorldDispatcher) {
            let map: Map = Map::Campaign;
            set!(
                world,
                (
                GlobalQuests { map: map, mapProgressRequired: 1, rewardType: RewardType::Summon, rewardQuantity: 1 },
                GlobalQuests { map: map, mapProgressRequired: 5, rewardType: RewardType::Summon, rewardQuantity: 1 },
                GlobalQuests { map: map, mapProgressRequired: 10, rewardType: RewardType::Summon, rewardQuantity: 1 },
                GlobalQuests { map: map, mapProgressRequired: 20, rewardType: RewardType::Summon, rewardQuantity: 1 },
                )
            );
        }

        fn claimRewards(world: IWorldDispatcher, owner: ContractAddress, map: Map, mapProgressRequired: u16) {
            let ownerProgress = get!(world, (owner, map), MapProgress).level;
            assert(ownerProgress >= mapProgressRequired, 'progress not enough');
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