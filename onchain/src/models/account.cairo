mod runes;
mod heroes;

use debug::PrintTrait;

use core::traits::TryInto;
use core::traits::Into;
use option::OptionTrait;

use game::models::hero::{Hero, HeroTrait, HeroImpl};
use game::models::battle::Battle;
use {starknet::ContractAddress, starknet::get_block_timestamp};

const timeTickEnergy: u64 = 1200;
const timeTickPvpEnergy: u64 = 1200;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Account {
    #[key]
    pub owner: ContractAddress,
    pub username: felt252,
    pub energy: u16,
    pub pvpEnergy: u16,
    pub crystals: u32,
    pub gems: u32,
    pub lastEnergyUpdateTimestamp: u64,
    pub lastPvpEnergyUpdateTimestamp: u64,
    pub runesCount: u32,
    pub heroesCount: u32,
    pub summonChests: u32,
}

const maxEnergy: u16 = 5;
const maxPvpEnergy: u16 = 5;

fn new(username: felt252, owner: ContractAddress) -> Account {
    Account {
        owner: owner,
        username: username,
        energy: maxEnergy,
        pvpEnergy: maxPvpEnergy,
        crystals: 10000,
        gems: 0,
        lastEnergyUpdateTimestamp: get_block_timestamp(),
        lastPvpEnergyUpdateTimestamp: get_block_timestamp(),
        runesCount: 0,
        heroesCount: 0,
        summonChests: 2,
    }
}

trait AccountTrait {
    fn updateEnergy(ref self: Account) -> u64;
    fn increaseSummonChests(ref self: Account, summonChestsToAdd: u32);
    fn decreaseEnergy(ref self: Account, energyCost: u16);
    fn increaseEnergy(ref self: Account, energyToAdd: u16);

    fn updatePvpEnergy(ref self: Account) -> u64;
    fn decreasePvpEnergy(ref self: Account, energyCost: u16);
    fn increasePvpEnergy(ref self: Account, energyToAdd: u16);

    fn increaseCrystals(ref self: Account, crystalsToAdd: u32);
    fn decreaseCrystals(ref self: Account, crystalsToSub: u32);
    fn increaseGems(ref self: Account, gemsToAdd: u32);
    fn decreaseGems(ref self: Account, gemsToSub: u32);

    fn getEnergyInfos(self: Account) -> (u16, u64);
    fn getPvpEnergyInfos(self: Account) -> (u16, u64);
    fn print(self: Account);
}

impl AccountImpl of AccountTrait {
    fn updateEnergy(ref self: Account) -> u64 {
        let now = get_block_timestamp();
        
        if(self.energy >= maxEnergy) {
            self.lastEnergyUpdateTimestamp = now;
            return self.lastEnergyUpdateTimestamp;
        }

        println!("lastEnergyUpdateTimestamp {}", self.lastEnergyUpdateTimestamp);
        println!("now {}", now);

        let timeDiff = now - self.lastEnergyUpdateTimestamp;
        let energyToAdd = timeDiff / timeTickEnergy;

        if(energyToAdd == 0) {
            return self.lastEnergyUpdateTimestamp;
        }
        self.energy = self.energy + energyToAdd.try_into().unwrap();

        if(self.energy >= maxEnergy) {
            self.energy = maxEnergy;
            self.lastEnergyUpdateTimestamp = now;
            return self.lastEnergyUpdateTimestamp;
        }

        let timeLeft = timeDiff % timeTickEnergy;
        self.lastEnergyUpdateTimestamp = now - timeLeft;
        return self.lastEnergyUpdateTimestamp;
    }
    fn increaseSummonChests(ref self: Account, summonChestsToAdd: u32) {
        self.summonChests = self.summonChests + summonChestsToAdd;
    }
    fn decreaseEnergy(ref self: Account, energyCost: u16) {
        assert(self.energy >= energyCost, 'Not enough energy');
        self.energy = self.energy - energyCost;
    }
    fn increaseEnergy(ref self: Account, energyToAdd: u16) {
        self.energy = self.energy + energyToAdd;
    }
    fn updatePvpEnergy(ref self: Account) -> u64 {
        let now = get_block_timestamp();
        
        if(self.pvpEnergy >= maxPvpEnergy) {
            self.lastPvpEnergyUpdateTimestamp = now;
            return self.lastPvpEnergyUpdateTimestamp;
        }

        let timeDiff = now - self.lastPvpEnergyUpdateTimestamp;
        let energyToAdd = timeDiff / timeTickPvpEnergy;

        if(energyToAdd == 0) {
            return self.lastPvpEnergyUpdateTimestamp;
        }
        self.pvpEnergy = self.pvpEnergy + energyToAdd.try_into().unwrap();

        if(self.pvpEnergy >= maxPvpEnergy) {
            self.pvpEnergy = maxPvpEnergy;
            self.lastPvpEnergyUpdateTimestamp = now;
            return self.lastPvpEnergyUpdateTimestamp;
        }

        let timeLeft = timeDiff % timeTickPvpEnergy;
        self.lastPvpEnergyUpdateTimestamp = now - timeLeft;
        return self.lastPvpEnergyUpdateTimestamp;
    }
    fn decreasePvpEnergy(ref self: Account, energyCost: u16) {
        assert(self.pvpEnergy >= energyCost, 'Not enough pvp energy');
        self.pvpEnergy = self.pvpEnergy - energyCost;
    }
    fn increasePvpEnergy(ref self: Account, energyToAdd: u16) {
        self.pvpEnergy = self.pvpEnergy + energyToAdd;
    }
    fn increaseCrystals(ref self: Account, crystalsToAdd: u32) {
        self.crystals = self.crystals + crystalsToAdd;
    }
    fn decreaseCrystals(ref self: Account, crystalsToSub: u32) {
        assert(self.crystals >= crystalsToSub, 'Not enough crystals');
        self.crystals = self.crystals - crystalsToSub;
    }
    fn increaseGems(ref self: Account, gemsToAdd: u32) {
        self.gems = self.gems + gemsToAdd;
    }
    fn decreaseGems(ref self: Account, gemsToSub: u32) {
        assert(self.gems >= gemsToSub, 'Not enough gems');
        self.gems = self.gems - gemsToSub;
    }
    fn getEnergyInfos(self: Account) -> (u16, u64) {
        return (self.energy, self.lastEnergyUpdateTimestamp);
    }
    fn getPvpEnergyInfos(self: Account) -> (u16, u64) {
        return (self.pvpEnergy, self.lastPvpEnergyUpdateTimestamp);
    }
    fn print(self: Account) {
        self.crystals.print();
    }
}

