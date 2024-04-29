mod equippedRunes;
mod rune;

use rune::{Rune, RuneImpl};
use equippedRunes::{EquippedRunes, EquippedRunesImpl};
use game::utils::list::List;
// use game::Contracts::EventEmitter::{IEventEmitterDispatcher, IEventEmitterDispatcherTrait};
use starknet::ContractAddress;
use debug::PrintTrait;

const levelZeroExperienceNeeded: u32 = 100;
const bonusExperiencePercentRequirePerLevel: u32 = 10;

#[derive(starknet::Store, Introspect, Copy, Drop, Serde)]
struct Hero {
    id: u32,
    name: felt252,
    level: u16,
    rank: u16,
    experience: u32,
    runes: EquippedRunes,
}

fn new(id: u32, name: felt252, level: u16, rank: u16) -> Hero {
    Hero { id:id, name: name, level: level, rank: rank, experience: 0, runes: equippedRunes::new() }
}

trait HeroTrait {
    fn gainExperience(ref self: Hero, experience: u32, owner: ContractAddress);
    fn equipRune(ref self: Hero, ref rune: Rune, ref runesList: List<Rune>);
    fn unequipRune(ref self: Hero, ref rune: Rune);
    fn getRunes(self: Hero) -> EquippedRunes;
    fn getRunesIndexArray(self: Hero) -> Array<u32>;
    fn getLevel(self: Hero) -> u16;
    fn getExperience(self: Hero) -> u32;
    fn getName(self: Hero) -> felt252;
    fn setName(ref self: Hero, name: felt252);
    fn print(self: @Hero);
}

impl HeroImpl of HeroTrait {
    fn gainExperience(ref self: Hero, experience: u32, owner: ContractAddress) {
        self.experience += experience;
        let mut requiredExperience = 0;
        // let previousLevel = self.level;
        loop {
            requiredExperience = levelZeroExperienceNeeded + (((self.level.into() - 1) * levelZeroExperienceNeeded * bonusExperiencePercentRequirePerLevel) / 100);
            if(self.experience < requiredExperience) {
                break;
            }
            self.level += 1;
            self.experience -= requiredExperience;
        };
        // IEventEmitterDispatch.experienceGain(owner, self.id, experience, self.level, self.experience);
    }
    fn equipRune(ref self: Hero, ref rune: Rune, ref runesList: List<Rune>) {
        self.runes.equipRune(ref rune, self.id, ref runesList);
    }
    fn unequipRune(ref self: Hero, ref rune: Rune) {
        self.runes.unequipRune(ref rune, self.id);
    }
    fn getRunes(self: Hero) -> EquippedRunes {
        self.runes
    }
    fn getRunesIndexArray(self: Hero) -> Array<u32> {
        self.runes.getRunesIndexArray()
    }
    fn getLevel(self: Hero) -> u16 {
        self.level
    }
    fn getExperience(self: Hero) -> u32 {
        self.experience
    }
    fn getName(self: Hero) -> felt252 {
        self.name
    }
    fn setName(ref self: Hero, name: felt252) {
        self.name = name;
    }

    fn print(self: @Hero) {
        (*self.name).print();
    }
}
