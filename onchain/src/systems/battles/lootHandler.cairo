use game::systems::accounts::Accounts::AccountsImpl;
use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
use game::models::events::{Event, Loot};
use starknet::{ContractAddress, get_block_timestamp};
use game::utils::random::rand32;

const baseCrystalsGivenPerEnemy: u32 = 200;
const crystalsBonusPercentPerLevel: u32 = 20;
const runeLootChance: u32 = 10;

fn computeAndDistributeLoot(world: IWorldDispatcher, owner: ContractAddress, enemyLevels: @Array<u16>) {
    let mut totalLevel: u32 = 0;
    let mut i: u32 = 0;
    let enemiesLen = enemyLevels.len();
    loop {
        if i == enemiesLen {
            break;
        }
        totalLevel += (*enemyLevels[i]).into();
        i += 1;
    };
    let crystals: u32 = baseCrystalsGivenPerEnemy * enemiesLen + ((baseCrystalsGivenPerEnemy * (totalLevel - enemiesLen) * crystalsBonusPercentPerLevel) / 100);
    AccountsImpl::increaseCrystals(world, owner, crystals);
    if(hasLootedRune()) {
        println!("Looted rune");
        AccountsImpl::mintRune(world, owner);
    }
    emit!(world, (Event::Loot(Loot {
        owner: owner,
        crystals: crystals,
    })));
}

fn hasLootedRune() -> bool {
    return rand32(get_block_timestamp() + 111, 10) < runeLootChance;
}