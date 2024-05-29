mod runeBonus;

use starknet::{ContractAddress, get_block_timestamp};
use debug::PrintTrait;

use game::models::hero::rune::runeBonus::{RuneBonus, RuneBonusTrait, RuneBonusImpl};
use game::models::account::{Account, AccountImpl};
use game::models::events::{Event, RuneBonusEvent, RuneUpgraded};

use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};

use game::utils::random::rand32;


#[derive(Copy, Drop, Serde, Introspect)]
enum RuneType {
    First,
    Second,
    Third,
    Fourth,
    Fifth,
    Sixth,
}

#[derive(Copy, Drop, Serde, hash::LegacyHash, Introspect)]
enum RuneRarity {
    Common,
    Uncommon,
    Rare,
    Epic,
    Legendary,
}

#[derive(Copy, Drop, Serde, PrintTrait, hash::LegacyHash, Introspect)]
enum RuneStatistic {
    Health,
    Attack,
    Defense,
    Speed,
    // CriticalRate,
    // CriticalDamage,
}

#[derive(Introspect, Copy, Drop, Serde)]
struct Rune {
    id: u32,
    statistic: RuneStatistic,
    isPercent: bool,
    rank: u32,
    rarity: RuneRarity,
    runeType: RuneType,
    isEquipped: bool,
    heroEquipped: u32,
    rank4Bonus: RuneBonus,
    rank8Bonus: RuneBonus,
    rank12Bonus: RuneBonus,
    rank16Bonus: RuneBonus,
}

const RUNE_STAT_COUNT: u32 = 4;
const RUNE_RARITY_COUNT: u32 = 5;
const RUNE_TYPE_COUNT: u32 = 6;

fn new(id: u32) -> Rune {
    let seed = get_block_timestamp();
    let statistic = getRandomStat(seed);
    let isPercent = getRandomIsPercent(seed);
    let rarity = getRandomRarity(seed);
    let runeType = getRandomType(seed);

    Rune {
        id: id,
        statistic: statistic,
        isPercent: isPercent,
        rank: 0,
        rarity: rarity,
        runeType: runeType,
        isEquipped: false,
        heroEquipped: 0,
        rank4Bonus: runeBonus::new(RuneStatistic::Attack, false),
        rank8Bonus: runeBonus::new(RuneStatistic::Attack, false),
        rank12Bonus: runeBonus::new(RuneStatistic::Attack, false),
        rank16Bonus: runeBonus::new(RuneStatistic::Attack, false),
    }
}

fn newDeterministic(id: u32, statistic: RuneStatistic, isPercent: bool, rarity: RuneRarity, runeType: RuneType) -> Rune {
    Rune {
        id: id,
        statistic: statistic,
        isPercent: isPercent,
        rank: 0,
        rarity: rarity,
        runeType: runeType,
        isEquipped: false,
        heroEquipped: 0,
        rank4Bonus: runeBonus::new(RuneStatistic::Attack, false),
        rank8Bonus: runeBonus::new(RuneStatistic::Attack, false),
        rank12Bonus: runeBonus::new(RuneStatistic::Attack, false),
        rank16Bonus: runeBonus::new(RuneStatistic::Attack, false),
    }
}

fn getRandomStat(seed: u64) -> RuneStatistic {
    let rand = rand32(seed, RUNE_STAT_COUNT);
    if rand == 0 {
        return RuneStatistic::Attack;
    } else if rand == 1 {
        return RuneStatistic::Defense;
    } else if rand == 2 {
        return RuneStatistic::Health;
    } else if rand == 3 {
        return RuneStatistic::Speed;
    }
    return RuneStatistic::Attack;
}
fn getRandomRarity(seed: u64) -> RuneRarity {
    return RuneRarity::Common;
    // let rand = rand32(seed, RUNE_RARITY_COUNT);
    // if rand == 0 {
    //     return RuneRarity::Common;
    // } else if rand == 1 {
    //     return RuneRarity::Uncommon;
    // } else if rand == 2 {
    //     return RuneRarity::Rare;
    // } else if rand == 3 {
    //     return RuneRarity::Epic;
    // } else if rand == 4 {
    //     return RuneRarity::Legendary;
    // }
    // return RuneRarity::Common;
}

fn getRandomType(seed: u64) ->  RuneType {
    let rand = rand32(seed, RUNE_TYPE_COUNT);
    if rand == 0 {
        return RuneType::First;
    } else if rand == 1 {
        return RuneType::Second;
    } else if rand == 2 {
        return RuneType::Third;
    } else if rand == 3 {
        return RuneType::Fourth;
    } else if rand == 4 {
        return RuneType::Fifth;
    } else if rand == 5 {
        return RuneType::Sixth;
    }
    return RuneType::First;
}

fn getRandomIsPercent(seed: u64) -> bool {
    let rand = rand32(seed, 2);
    if rand == 0 {
        return true;
    }
    return false;
}

trait RuneTrait {
    fn upgrade(ref self: Rune, world: IWorldDispatcher, ref account: Account);
    fn setEquippedBy(ref self: Rune, heroId: u32);
    fn unequip(ref self: Rune);
    fn isEquipped(self: Rune)-> bool;
    fn getHeroEquipped(self: Rune)-> u32;
    fn computeCrystalCostUpgrade(self: Rune)-> u32;
    fn print(self: Rune);
    fn printBonuses(self: Rune);
    fn statisticToString(self: Rune)-> felt252;
    fn typeToString(self: Rune)-> felt252;
}

const maxRank: u32 = 16;

impl RuneImpl of RuneTrait {
    fn upgrade(ref self: Rune, world: IWorldDispatcher, ref account: Account) {
        assert(self.rank < maxRank, 'Rune already max rank');

        let crystalCost = self.computeCrystalCostUpgrade();
        account.decreaseCrystals(crystalCost);
        
        self.rank += 1;

        let seed = get_block_timestamp();
        if self.rank == 4 {
            self.rank4Bonus = runeBonus::new(getRandomStat(seed), getRandomIsPercent(seed));
            emit!(world, (Event::RuneBonusEvent(RuneBonusEvent {
                owner: account.owner,
                id: self.id,
                rank: self.rank,
                procStat: self.rank4Bonus.statisticToString(),
                isPercent: self.rank4Bonus.isPercent,
            })));
        } else if self.rank == 8 {
            self.rank8Bonus = runeBonus::new(getRandomStat(seed), getRandomIsPercent(seed));
            emit!(world, (Event::RuneBonusEvent(RuneBonusEvent {
                owner: account.owner,
                id: self.id,
                rank: self.rank,
                procStat: self.rank8Bonus.statisticToString(),
                isPercent: self.rank8Bonus.isPercent,
            })));
        } else if self.rank == 12 {
            self.rank12Bonus = runeBonus::new(getRandomStat(seed), getRandomIsPercent(seed));
            emit!(world, (Event::RuneBonusEvent(RuneBonusEvent {
                owner: account.owner,
                id: self.id,
                rank: self.rank,
                procStat: self.rank12Bonus.statisticToString(),
                isPercent: self.rank12Bonus.isPercent,
            })));
        } else if self.rank == 16 {
            self.rank16Bonus = runeBonus::new(getRandomStat(seed), getRandomIsPercent(seed));
            emit!(world, (Event::RuneBonusEvent(RuneBonusEvent {
                owner: account.owner,
                id: self.id,
                rank: self.rank,
                procStat: self.rank16Bonus.statisticToString(),
                isPercent: self.rank16Bonus.isPercent,
            })));
        }
        emit!(world, (Event::RuneUpgraded(RuneUpgraded {
            owner: account.owner,
            id: self.id,
            rank: self.rank,
            crystalCost: crystalCost,
        })));
    }
    fn setEquippedBy(ref self: Rune, heroId: u32) {
        assert(self.isEquipped() == false, 'Rune already equipped');
        self.isEquipped = true;
        self.heroEquipped = heroId;
    }
    fn unequip(ref self: Rune) {
        self.isEquipped = false;
    }
    fn isEquipped(self: Rune)-> bool {
        return self.isEquipped;
    }
    fn getHeroEquipped(self: Rune)-> u32 {
        return self.heroEquipped;
    }
    fn computeCrystalCostUpgrade(self: Rune)-> u32 {
        let mut crystalCost: u32 = 200 + self.rank * 200;
        return crystalCost;
    }
    fn print(self: Rune) {
        PrintTrait::print('Rune');
        self.id.print();
        self.statisticToString().print(); 
        self.typeToString().print();
        self.rank.print();
        self.printBonuses();
    }
    fn printBonuses(self: Rune) {
        if self.rank > 3 {
            self.rank4Bonus.print();
        }
        if self.rank > 7 {
            self.rank8Bonus.print();
        }
        if self.rank > 12 {
            self.rank12Bonus.print();
        }
        if self.rank > 16 {
            self.rank16Bonus.print();
        }
    }
    fn statisticToString(self: Rune)-> felt252 {
        let mut statisticStr: felt252 = '';
        match self.statistic {
            RuneStatistic::Health => statisticStr = 'health',
            RuneStatistic::Attack => statisticStr = 'attack',
            RuneStatistic::Defense => statisticStr = 'defense',
            RuneStatistic::Speed => statisticStr = 'speed',
        }
        return statisticStr;
    }
    fn typeToString(self: Rune)-> felt252 {
        let mut typeStr: felt252 = '';
        match self.runeType {
            RuneType::First => typeStr = 'First',
            RuneType::Second => typeStr = 'Second',
            RuneType::Third => typeStr = 'Third',
            RuneType::Fourth => typeStr = 'Fourth',
            RuneType::Fifth => typeStr = 'Fifth',
            RuneType::Sixth => typeStr = 'Sixth',
        }
        return typeStr;
    }
}