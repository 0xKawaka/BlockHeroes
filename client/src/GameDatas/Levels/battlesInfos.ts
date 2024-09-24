import { HeroesFactory } from "../../Classes/Heroes/HeroesFactory";

const battlesInfos = {
  0: [
    {
      background: 'battle1',
      names: [
        'nereus'
      ],
      levels: [
        1
      ],
      ranks: [
        1
      ],
      energyCost: 0
    },
    {
      background: 'battle1',
      names: [
        'wellan',
        'ember'
      ],
      levels: [
        1,
        1
      ],
      ranks: [
        1,
        1
      ],
      energyCost: 0
    },
    {
      background: 'battle1',
      names: [
        'wellan',
        'molten',
        'bane'
      ],
      levels: [
        2,
        1,
        2
      ],
      ranks: [
        1,
        1,
        1
      ],
      energyCost: 0
    },
    {
      background: 'battle1',
      names: [
        'rex'
      ],
      levels: [
        7
      ],
      ranks: [
        1
      ],
      energyCost: 0
    },
    {
      background: 'battle1',
      names: [
        'nereus',
        'marella',
        'celeste'
      ],
      levels: [
        3,
        3,
        3
      ],
      ranks: [
        1,
        1,
        1
      ],
      energyCost: 0
    },
    {
      background: 'battle1',
      names: [
        'wellan',
        'bane',
        'molten',
        'ember'
      ],
      levels: [
        3,
        3,
        3,
        3
      ],
      ranks: [
        1,
        1,
        1,
        1
      ],
      energyCost: 0
    },
    {
      background: 'battle1',
      names: [
        'nereus',
        'rex',
        'marella',
        'celeste'
      ],
      levels: [
        4,
        4,
        4,
        4
      ],
      ranks: [
        1,
        1,
        1,
        1
      ],
      energyCost: 0
    },
    {
      background: 'battle1',
      names: [
        'elric',
        'marella',
        'sirocco',
        'celeste'
      ],
      levels: [
        5,
        5,
        5,
        5
      ],
      ranks: [
        1,
        1,
        1,
        1
      ],
      energyCost: 0
    },
    {
      background: 'battle1',
      names: [
        'elric',
        'sirocco',
        'ember',
        'diana'
      ],
      levels: [
        7,
        7,
        7,
        7
      ],
      ranks: [
        1,
        1,
        1,
        1
      ],
      energyCost: 0
    },
    {
      background: 'battle1',
      names: [
        'janus'
      ],
      levels: [
        25
      ],
      ranks: [
        1
      ],
      energyCost: 0
    }
  ]
};

const worldsBattlesList = HeroesFactory.createEnemyHeroes(battlesInfos);
export {worldsBattlesList, battlesInfos};