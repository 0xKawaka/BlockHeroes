import { HeroesFactory } from "../../Classes/Heroes/HeroesFactory";

const battlesInfos = {
  0: 
  [
    {
      background: "battle1",
      names: ["sirocco"],
      levels: [1],
      ranks: [1],
      energyCost: 1,
    },
    {
      background: "battle1",
      names: ["wellan", "wellan", "marella", "sirocco"],
      levels: [1, 1, 1, 1],
      ranks: [1, 1, 1, 1],
      energyCost: 1,
    },
    {
      background: "battle1",
      names: ["wellan", "wellan", "elandor", "sirocco"],
      levels: [5, 5, 5, 5],
      ranks: [1, 1, 1, 1],
      energyCost: 1,
    },

    {
      background: "battle1",
      names: ["marella", "marella", "elandor", "sirocco"],
      levels: [10, 10, 10, 10],
      ranks: [1, 1, 1, 1],
      energyCost: 1,
    },
    {
      background: "battle1",
      names: ["marella", "elandor", "sirocco", "sirocco"],
      levels: [20, 20, 20, 20],
      ranks: [1, 1, 1, 1],
      energyCost: 1,
    },
  ],
};

const worldsBattlesList = HeroesFactory.createEnemyHeroes(battlesInfos);



export {worldsBattlesList, battlesInfos};