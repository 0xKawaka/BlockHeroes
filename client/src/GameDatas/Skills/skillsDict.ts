import SkillsHandler from "../../Classes/IO/SkillsHandler";
import Skill from "../../Classes/Skill/Skill";
import { SkillsDictApi } from "../../Types/apiTypes";

const skillsDictWithoutImages: SkillsDictApi = {
  "Attack Wellan": {
    "imgName": "AttackWellan",
    "name": "Attack Wellan",
    "description": "Attack Wellan.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Fire Swing": {
    "imgName": "FireSwing",
    "name": "Fire Swing",
    "description": "Fire Swing.",
    "cooldown": 3,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "Stun"
      ],
      [
        0
      ],
      [
        2
      ],
      [
        1
      ],
      [
        true
      ],
      [
        false
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Fire Strike": {
    "imgName": "FireStrike",
    "name": "Fire Strike",
    "description": "Fire Strike.",
    "cooldown": 3,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "Poison"
      ],
      [
        0.1
      ],
      [
        2
      ],
      [
        1
      ],
      [
        true
      ],
      [
        false
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Marella": {
    "imgName": "AttackMarella",
    "name": "Attack Marella",
    "description": "Attack Marella.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Water Heal": {
    "imgName": "WaterHeal",
    "name": "Water Heal",
    "description": "Water Heal.",
    "cooldown": 3,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0.1,
      false,
      true,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "Regen"
      ],
      [
        0.08
      ],
      [
        2
      ],
      [
        1
      ],
      [
        false
      ],
      [
        true
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Water Shield": {
    "imgName": "WaterShield",
    "name": "Water Shield",
    "description": "Water Shield.",
    "cooldown": 4,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "DefenseUp"
      ],
      [
        0.7
      ],
      [
        3
      ],
      [
        1
      ],
      [
        true
      ],
      [
        false
      ],
      [
        true
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Elandor": {
    "imgName": "AttackElandor",
    "name": "Attack Elandor",
    "description": "Attack Elandor.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Arrows Rain": {
    "imgName": "ArrowsRain",
    "name": "Arrows Rain",
    "description": "Arrows Rain.",
    "cooldown": 3,
    "damage": [
      "flat",
      0,
      false,
      true,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "Poison"
      ],
      [
        0.1
      ],
      [
        2
      ],
      [
        1
      ],
      [
        false
      ],
      [
        true
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Forest Senses": {
    "imgName": "ForestSenses",
    "name": "Forest Senses",
    "description": "Forest Senses.",
    "cooldown": 3,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "AttackUp",
        "SpeedUp"
      ],
      [
        0.8,
        0.8
      ],
      [
        2,
        2
      ],
      [
        1,
        1
      ],
      [
        false,
        false
      ],
      [
        false,
        false
      ],
      [
        true,
        true
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Sirocco": {
    "imgName": "AttackSirocco",
    "name": "Attack Sirocco",
    "description": "Attack Sirocco.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Sand Strike": {
    "imgName": "SandStrike",
    "name": "Sand Strike",
    "description": "Sand Strike.",
    "cooldown": 2,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "AttackUp"
      ],
      [
        0.5
      ],
      [
        2
      ],
      [
        1
      ],
      [
        false
      ],
      [
        false
      ],
      [
        true
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Sandstorm": {
    "imgName": "Sandstorm",
    "name": "Sandstorm",
    "description": "Sandstorm.",
    "cooldown": 4,
    "damage": [
      "flat",
      100,
      false,
      true,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "SpeedDown"
      ],
      [
        0.2
      ],
      [
        2
      ],
      [
        1
      ],
      [
        false
      ],
      [
        true
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Diana": {
    "imgName": "AttackDiana",
    "name": "Attack Diana",
    "description": "Attack Diana.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Nature Call": {
    "imgName": "NatureCall",
    "name": "Nature Call",
    "description": "Nature Call.",
    "cooldown": 3,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "SpeedUp"
      ],
      [
        0.4
      ],
      [
        2
      ],
      [
        1
      ],
      [
        false
      ],
      [
        true
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Wind Pierce": {
    "imgName": "WindPierce",
    "name": "Wind Pierce",
    "description": "Wind Pierce.",
    "cooldown": 3,
    "damage": [
      "flat",
      280,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Elric": {
    "imgName": "AttackElric",
    "name": "Attack Elric",
    "description": "Attack Elric.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Holy Bastion": {
    "imgName": "HolyBastion",
    "name": "Holy Bastion",
    "description": "Holy Bastion.",
    "cooldown": 4,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "DefenseUp"
      ],
      [
        0.5
      ],
      [
        3
      ],
      [
        1
      ],
      [
        false
      ],
      [
        true
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Divine Hammer": {
    "imgName": "DivineHammer",
    "name": "Divine Hammer",
    "description": "Divine Hammer.",
    "cooldown": 3,
    "damage": [
      "flat",
      230,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "SpeedDown",
        "AttackDown"
      ],
      [
        0.5,
        0.5
      ],
      [
        2,
        2
      ],
      [
        1,
        1
      ],
      [
        true,
        true
      ],
      [
        false,
        false
      ],
      [
        false,
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Nereus": {
    "imgName": "AttackNereus",
    "name": "Attack Nereus",
    "description": "Attack Nereus.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Tide Strike": {
    "imgName": "TideStrike",
    "name": "Tide Strike",
    "description": "Tide Strike.",
    "cooldown": 3,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "AttackUp"
      ],
      [
        0.5
      ],
      [
        2
      ],
      [
        1
      ],
      [
        false
      ],
      [
        true
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Wave Slash": {
    "imgName": "WaveSlash",
    "name": "Wave Slash",
    "description": "Wave Slash.",
    "cooldown": 3,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Rex": {
    "imgName": "AttackRex",
    "name": "Attack Rex",
    "description": "Attack Rex.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Chum Challenge": {
    "imgName": "ChumChallenge",
    "name": "Chum Challenge",
    "description": "Chum Challenge.",
    "cooldown": 3,
    "damage": [
      "flat",
      0,
      false,
      true,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "DefenseUp"
      ],
      [
        0.6
      ],
      [
        2
      ],
      [
        1
      ],
      [
        false
      ],
      [
        false
      ],
      [
        true
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Anchor Stomps": {
    "imgName": "AnchorStomps",
    "name": "Anchor Stomps",
    "description": "Anchor Stomps.",
    "cooldown": 3,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Celeste": {
    "imgName": "AttackCeleste",
    "name": "Attack Celeste",
    "description": "Attack Celeste.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Ice Shatter": {
    "imgName": "IceShatter",
    "name": "Ice Shatter",
    "description": "Ice Shatter.",
    "cooldown": 3,
    "damage": [
      "flat",
      150,
      false,
      true,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Snow Storm": {
    "imgName": "SnowStorm",
    "name": "Snow Storm",
    "description": "Snow Storm.",
    "cooldown": 4,
    "damage": [
      "flat",
      100,
      false,
      true,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "SpeedDown"
      ],
      [
        0.5
      ],
      [
        2
      ],
      [
        1
      ],
      [
        false
      ],
      [
        true
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Oakheart": {
    "imgName": "AttackOakheart",
    "name": "Attack Oakheart",
    "description": "Attack Oakheart.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Lignum Hammer": {
    "imgName": "LignumHammer",
    "name": "Lignum Hammer",
    "description": "Lignum Hammer.",
    "cooldown": 3,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "Stun"
      ],
      [
        0
      ],
      [
        1
      ],
      [
        1
      ],
      [
        true
      ],
      [
        false
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Buloke Wall": {
    "imgName": "BulokeWall",
    "name": "Buloke Wall",
    "description": "Buloke Wall.",
    "cooldown": 4,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "DefenseUp"
      ],
      [
        0.5
      ],
      [
        2
      ],
      [
        1
      ],
      [
        false
      ],
      [
        true
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Sylvara": {
    "imgName": "AttackSylvara",
    "name": "Attack Sylvara",
    "description": "Attack Sylvara.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Silvan Chant": {
    "imgName": "SilvanChant",
    "name": "Silvan Chant",
    "description": "Silvan Chant.",
    "cooldown": 3,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0.1,
      false,
      true,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "Regen"
      ],
      [
        0.03
      ],
      [
        2
      ],
      [
        1
      ],
      [
        false
      ],
      [
        true
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Astral Beam": {
    "imgName": "AstralBeam",
    "name": "Astral Beam",
    "description": "Astral Beam.",
    "cooldown": 3,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "AttackDown"
      ],
      [
        0.5
      ],
      [
        2
      ],
      [
        1
      ],
      [
        true
      ],
      [
        false
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Bane": {
    "imgName": "AttackBane",
    "name": "Attack Bane",
    "description": "Attack Bane.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Raging Fire": {
    "imgName": "RagingFire",
    "name": "Raging Fire",
    "description": "Raging Fire.",
    "cooldown": 3,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "SpeedDown"
      ],
      [
        0.5
      ],
      [
        2
      ],
      [
        1
      ],
      [
        true
      ],
      [
        false
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Meteor Strike": {
    "imgName": "MeteorStrike",
    "name": "Meteor Strike",
    "description": "Meteor Strike.",
    "cooldown": 3,
    "damage": [
      "flat",
      160,
      false,
      true,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Ember": {
    "imgName": "AttackEmber",
    "name": "Attack Ember",
    "description": "Attack Ember.",
    "cooldown": 0,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0.05,
      true,
      false,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Ember Infusion": {
    "imgName": "EmberInfusion",
    "name": "Ember Infusion",
    "description": "Ember Infusion.",
    "cooldown": 3,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0.05,
      true,
      false,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "SpeedUp",
        "AttackUp"
      ],
      [
        0.2,
        0.2
      ],
      [
        2,
        2
      ],
      [
        1,
        1
      ],
      [
        false,
        false
      ],
      [
        true,
        true
      ],
      [
        false,
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Fiery Shower": {
    "imgName": "FieryShower",
    "name": "Fiery Shower",
    "description": "Fiery Shower.",
    "cooldown": 3,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Molten": {
    "imgName": "AttackMolten",
    "name": "Attack Molten",
    "description": "Attack Molten.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Blazing Rage": {
    "imgName": "BlazingRage",
    "name": "Blazing Rage",
    "description": "Blazing Rage.",
    "cooldown": 3,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "DefenseUp",
        "AttackUp"
      ],
      [
        0.6,
        0.6
      ],
      [
        2,
        2
      ],
      [
        1,
        1
      ],
      [
        true,
        true
      ],
      [
        false,
        false
      ],
      [
        false,
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Volcano Flurry": {
    "imgName": "VolcanoFlurry",
    "name": "Volcano Flurry",
    "description": "Volcano Flurry.",
    "cooldown": 3,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Solas": {
    "imgName": "AttackSolas",
    "name": "Attack Solas",
    "description": "Attack Solas.",
    "cooldown": 0,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0.05,
      true,
      false,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Wisp Infusion": {
    "imgName": "WispInfusion",
    "name": "Wisp Infusion",
    "description": "Wisp Infusion.",
    "cooldown": 3,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      true,
      false,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "SpeedUp"
      ],
      [
        0.3
      ],
      [
        2
      ],
      [
        1
      ],
      [
        false
      ],
      [
        true
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Divine Storm": {
    "imgName": "DivineStorm",
    "name": "Divine Storm",
    "description": "Divine Storm.",
    "cooldown": 3,
    "damage": [
      "flat",
      280,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      true,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Solveig": {
    "imgName": "AttackSolveig",
    "name": "Attack Solveig",
    "description": "Attack Solveig.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Swords Dance": {
    "imgName": "SwordsDance",
    "name": "Swords Dance",
    "description": "Swords Dance.",
    "cooldown": 3,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "AttackUp"
      ],
      [
        0.3
      ],
      [
        2
      ],
      [
        1
      ],
      [
        false
      ],
      [
        true
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Celestial Judgement": {
    "imgName": "CelestialJudgement",
    "name": "Celestial Judgement",
    "description": "Celestial Judgement.",
    "cooldown": 3,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "DefenseDown"
      ],
      [
        0.5
      ],
      [
        2
      ],
      [
        1
      ],
      [
        true
      ],
      [
        false
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Janus": {
    "imgName": "AttackJanus",
    "name": "Attack Janus",
    "description": "Attack Janus.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Eclipse Burst": {
    "imgName": "EclipseBurst",
    "name": "Eclipse Burst",
    "description": "Eclipse Burst.",
    "cooldown": 3,
    "damage": [
      "flat",
      280,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Void Singularity": {
    "imgName": "VoidSingularity",
    "name": "Void Singularity",
    "description": "Void Singularity.",
    "cooldown": 4,
    "damage": [
      "flat",
      200,
      false,
      true,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Horus": {
    "imgName": "AttackHorus",
    "name": "Attack Horus",
    "description": "Attack Horus.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Ankh Blessing": {
    "imgName": "AnkhBlessing",
    "name": "Ankh Blessing",
    "description": "Ankh Blessing.",
    "cooldown": 3,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "DefenseUp"
      ],
      [
        0.5
      ],
      [
        2
      ],
      [
        1
      ],
      [
        false
      ],
      [
        true
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Khonsu Blessing": {
    "imgName": "KhonsuBlessing",
    "name": "Khonsu Blessing",
    "description": "Khonsu Blessing.",
    "cooldown": 3,
    "damage": [
      "flat",
      0,
      false,
      false,
      false
    ],
    "heal": [
      "percent",
      0.1,
      false,
      true,
      false
    ],
    "targetType": "ally",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "AttackUp"
      ],
      [
        0.3
      ],
      [
        2
      ],
      [
        1
      ],
      [
        false
      ],
      [
        true
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Jabari": {
    "imgName": "AttackJabari",
    "name": "Attack Jabari",
    "description": "Attack Jabari.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Scorpion Surge": {
    "imgName": "ScorpionSurge",
    "name": "Scorpion Surge",
    "description": "Scorpion Surge.",
    "cooldown": 3,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "Stun"
      ],
      [
        0
      ],
      [
        2
      ],
      [
        1
      ],
      [
        true
      ],
      [
        false
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Venom Slash": {
    "imgName": "VenomSlash",
    "name": "Venom Slash",
    "description": "Venom Slash.",
    "cooldown": 3,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "Poison"
      ],
      [
        0.12
      ],
      [
        2
      ],
      [
        1
      ],
      [
        true
      ],
      [
        false
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Attack Khamsin": {
    "imgName": "AttackKhamsin",
    "name": "Attack Khamsin",
    "description": "Attack Khamsin.",
    "cooldown": 0,
    "damage": [
      "flat",
      100,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Sand Flurry": {
    "imgName": "SandFlurry",
    "name": "Sand Flurry",
    "description": "Sand Flurry.",
    "cooldown": 3,
    "damage": [
      "flat",
      200,
      true,
      false,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "DefenseDown"
      ],
      [
        0.5
      ],
      [
        2
      ],
      [
        1
      ],
      [
        true
      ],
      [
        false
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  },
  "Quicksand Ambush": {
    "imgName": "QuicksandAmbush",
    "name": "Quicksand Ambush",
    "description": "Quicksand Ambush.",
    "cooldown": 4,
    "damage": [
      "flat",
      100,
      false,
      true,
      false
    ],
    "heal": [
      "percent",
      0,
      false,
      false,
      false
    ],
    "targetType": "enemy",
    "accuracy": 1,
    "aoe": false,
    "buffsAndStatusArrays": [
      [
        "SpeedDown"
      ],
      [
        0.2
      ],
      [
        2
      ],
      [
        1
      ],
      [
        true
      ],
      [
        false
      ],
      [
        false
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  }
};
const skillsDict = SkillsHandler.formatSkills(skillsDictWithoutImages);

export default skillsDict;
