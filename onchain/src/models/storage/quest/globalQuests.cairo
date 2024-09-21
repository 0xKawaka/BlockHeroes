use game::models::storage::quest::rewardType::RewardType;
use game::models::map::Map;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct GlobalQuests {
    #[key]
    pub map: Map,
    #[key]
    pub mapProgressRequired: u16,
    pub rewardType: RewardType,
    pub rewardQuantity: u32,
}
