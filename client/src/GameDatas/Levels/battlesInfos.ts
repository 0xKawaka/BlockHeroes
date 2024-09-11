import { HeroesFactory } from "../../Classes/Heroes/HeroesFactory";
import skillSets from "../Skills/skillSets";
import skillsDict from "../Skills/skillsDict";
import baseStats from "../Statistics/baseStats";

const battlesInfos = {
  0: 
  [
    {
      background: "battle1",
      names: ["knight", "hunter", "priest", "assassin"],
      levels: [1, 1, 1, 1],
      ranks: [1, 1, 1, 1],
      energyCost: 1,
    },
    {
      background: "battle1",
      names: ["knight", "knight", "hunter", "assassin"],
      levels: [5, 5, 5, 5],
      ranks: [1, 1, 1, 1],
      energyCost: 1,
    },
    {
      background: "battle1",
      names: ["assassin"],
      levels: [1],
      ranks: [1],
      energyCost: 0,
    },
    {
      background: "battle1",
      names: ["priest", "priest", "hunter", "assassin"],
      levels: [10, 10, 10, 10],
      ranks: [1, 1, 1, 1],
      energyCost: 1,
    },
    {
      background: "battle1",
      names: ["priest", "hunter", "assassin", "assassin"],
      levels: [20, 20, 20, 20],
      ranks: [1, 1, 1, 1],
      energyCost: 1,
    },
  ],
};

const worldsBattlesList = HeroesFactory.createEnemyHeroes(battlesInfos, skillsDict, skillSets, baseStats);



export {worldsBattlesList, battlesInfos};