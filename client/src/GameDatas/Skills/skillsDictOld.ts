import SkillsHandler from "../../Classes/IO/SkillsHandler";
import Skill from "../../Classes/Skill/Skill";
import { SkillsDictApi } from "../../Types/apiTypes";

const skillsDictWithoutImages: SkillsDictApi = {
  "Attack Marella": {
    imgName: "AttackMarella",
    name: "Attack Marella",
    description: "A basic attack.",
    cooldown: 0,
    damage: ["flat", 10, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Attack Elandor": {
    imgName: "AttackElandor",
    name: "Attack Elandor",
    description: "A basic attack.",
    cooldown: 0,
    damage: ["flat", 10, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Attack Wellan": {
    imgName: "AttackWellan",
    name: "Attack Wellan",
    description: "A basic attack.",
    cooldown: 0,
    damage: ["flat", 10, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Attack Sirocco": {
    imgName: "AttackSirocco",
    name: "Attack Sirocco",
    description: "A basic attack.",
    cooldown: 0,
    damage: ["flat", 10, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Fire Strike": {
    imgName: "FireStrike",
    name: "Fire Strike",
    description: "Fire Strike.",
    cooldown: 3,
    damage: ["flat", 20, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["Poison"], [0.1], [2], [1], [true], [false], [false], [], [], [], [], [], [], []]
  },
  "Fire Swing": {
    imgName: "FireSwing",
    name: "Fire Swing",
    description: "Fire Swing.",
    cooldown: 3,
    damage: ["flat", 20, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["Stun"], [0], [2], [1], [true], [false], [false], [], [], [], [], [], [], []]
  },
  "Sand Strike": {
    imgName: "SandStrike",
    name: "Sand Strike",
    description: "Sand Strike.",
    cooldown: 2,
    damage: ["flat", 20, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[], [], [], [], [], [], [], ["Attack"], [0.5], [2], [1], [false], [false], [true]],
  },
  "Sandstorm": {
    imgName: "Sandstorm",
    name: "Sandstorm",
    description: "Sandstorm Strikes.",
    cooldown: 4,
    damage: ["flat", 10, false, true, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["Slow"], [0.2], [2], [1], [false], [true], [false], [], [], [], [], [], [], []],
  },
  "Water Heal": {
    imgName: "WaterHeal",
    name: "Water Heal",
    description: "Water Heal.",
    cooldown: 3,
    damage: ["flat", 0, false, false, false],
    heal: ["percent", 0.1, false, true, false],
    targetType: "ally",
    accuracy: 1,
    aoe: true,
    buffsAndStatusArrays: [[], [], [], [], [], [], [], ["Regen"], [0.08], [2], [1], [false], [true], [false]],
  },
  "Water Shield": {
    imgName: "WaterShield",
    name: "Water Shield",
    description: "Water Shield.",
    cooldown: 4,
    damage: ["flat", 0, false, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "ally",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[], [], [], [], [], [], [], ["Defense"], [0.8], [3], [1], [true], [false], [true]],
  },
  "Arrows Rain": {
    imgName: "ArrowsRain",
    name: "Arrows Rain",
    description: "Arrows Rain.",
    cooldown: 3,
    damage: ["flat", 0, false, true, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["Poison"], [0.1], [2], [1], [false], [true], [false], [], [], [], [], [], [], []],
  },
  "Forest Senses": {
    imgName: "ForestSenses",
    name: "Forest Senses",
    description: "Forest Senses.",
    cooldown: 3,
    damage: ["flat", 0, false, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "ally",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[], [], [], [], [], [], [], ["Attack", "Speed"], [0.8, 0.8], [2, 2], [1, 1], [false, false], [false, false], [true, true]],
  },
  // 'Attack Diana', 'Nature Call', 'Wind Pierce'
  "Attack Diana": {
    imgName: "AttackDiana",
    name: "Attack Diana",
    description: "A basic attack.",
    cooldown: 0,
    damage: ["flat", 100, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Nature Call": {
    imgName: "NatureCall",
    name: "Nature Call",
    description: "Nature Call.",
    cooldown: 3,
    damage: ["flat", 0, false, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "ally",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["SpeedUp"], [0.4], [2], [1], [false], [true], [false], [], [], [], [], [], [], []],
  },
  "Wind Pierce": {
    imgName: "WindPierce",
    name: "Wind Pierce",
    description: "Wind Pierce.",
    cooldown: 3,
    damage: ["flat", 280, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Attack Elric": { 
    imgName: "AttackElric",
    name: "Attack Elric",
    description: "A basic attack.",
    cooldown: 0,
    damage: ["flat", 100, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Holy Bastion": {
    imgName: "HolyBastion",
    name: "Holy Bastion",
    description: "Holy Bastion.",
    cooldown: 4,
    damage: ["flat", 0, false, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "ally",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["DefenseUp"], [0.4], [3], [1], [false], [true], [false], [], [], [], [], [], [], []],
  },
  "Divine Hammer": {
    imgName: "DivineHammer",
    name: "Divine Hammer",
    description: "Divine Hammer.",
    cooldown: 3,
    damage: ["flat", 230, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["SpeedDown", "AttackDown"], [0.5, 0.5], [2, 2], [1, 1], [true, true], [false, false], [false, false], [], [], [], [], [], [], []],
  },
  "Attack Nereus": {
    imgName: "AttackNereus",
    name: "Attack Nereus",
    description: "A basic attack.",
    cooldown: 0,
    damage: ["flat", 100, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Tide Strike": {
    imgName: "TideStrike",
    name: "Tide Strike",
    description: "Tide Strike.",
    cooldown: 3,
    damage: ["flat", 200, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Wave Slash": {
    imgName: "WaveSlash",
    name: "Wave Slash",
    description: "Wave Slash.",
    cooldown: 3,
    damage: ["flat", 200, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Attack Rex": {
    imgName: "AttackRex",
    name: "Attack Rex",
    description: "A basic attack.",
    cooldown: 0,
    damage: ["flat", 100, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Chum Challenge": {
    imgName: "ChumChallenge",
    name: "Chum Challenge",
    description: "Chum Challenge.",
    cooldown: 3,
    damage: ["flat", 0, false, true, false],
    heal: ["percent", 0, false, false, false],
    targetType: "ally",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["DefenseUp"], [0.6], [2], [1], [false], [false], [true], [], [], [], [], [], [], []]
  },
  "Anchor Stomps": {
    imgName: "AnchorStomps",
    name: "Anchor Stomps",
    description: "Anchor Stomps.",
    cooldown: 3,
    damage: ["flat", 200, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Attack Celeste": {
    imgName: "AttackCeleste",
    name: "Attack Celeste",
    description: "A basic attack.",
    cooldown: 0,
    damage: ["flat", 100, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Ice Shatter": {
    imgName: "IceShatter",
    name: "Ice Shatter",
    description: "Ice Shatter.",
    cooldown: 3,
    damage: ["flat", 150, false, true, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Snow Storm": {
    imgName: "SnowStorm",
    name: "Snow Storm",
    description: "Snow Storm.",
    cooldown: 4,
    damage: ["flat", 100, false, true, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["SpeedDown"], [0.5], [2], [1], [false], [true], [false], [], [], [], [], [], [], []]
  },
  "Attack Oakheart": {
    imgName: "AttackOakheart",
    name: "Attack Oakheart",
    description: "A basic attack.",
    cooldown: 0,
    damage: ["flat", 100, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Lignum Hammer": {
    imgName: "LignumHammer",
    name: "Lignum Hammer",
    description: "Lignum Hammer.",
    cooldown: 3,
    damage: ["flat", 200, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["Stun"], [0], [1], [1], [true], [false], [false], [], [], [], [], [], [], []]
  },
  "Buloke Wall": {
    imgName: "BulokeWall",
    name: "Buloke Wall",
    description: "Buloke Wall.",
    cooldown: 4,
    damage: ["flat", 0, false, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "ally",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["DefenseUp"], [0.5], [2], [1], [false], [true], [false], [], [], [], [], [], [], []]
  },
  "Attack Sylvara": {
    imgName: "AttackSylvara",
    name: "Attack Sylvara",
    description: "A basic attack.",
    cooldown: 0,
    damage: ["flat", 100, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Silvan Chant": {
    imgName: "SilvanChant",
    name: "Silvan Chant",
    description: "Silvan Chant.",
    cooldown: 3,
    damage: ["flat", 0, false, false, false],
    heal: ["percent", 0.1, false, true, false],
    targetType: "ally",
    accuracy: 1,
    aoe: true,
    buffsAndStatusArrays: [["Regen"], [0.03], [2], [1], [false], [true], [false], [], [], [], [], [], [], []]
  },
  "Astral Beam": {
    imgName: "AstralBeam",
    name: "Astral Beam",
    description: "Astral Beam.",
    cooldown: 3,
    damage: ["flat", 200, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["AttackDown"], [0.5], [2], [1], [true], [false], [false], [], [], [], [], [], [], []]
  },
  "Attack Bane": {
    imgName: "AttackBane",
    name: "Attack Bane",
    description: "A powerful attack.",
    cooldown: 0,
    damage: ["flat", 100, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Raging Fire": {
    imgName: "RagingFire",
    name: "Raging Fire",
    description: "Unleash raging flames.",
    cooldown: 3,
    damage: ["flat", 200, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["SpeedDown"], [0.5], [2], [1], [true], [false], [false], [], [], [], [], [], [], []]
  },
  "Meteor Strike": {
    imgName: "MeteorStrike",
    name: "Meteor Strike",
    description: "Call down a meteor.",
    cooldown: 3,
    damage: ["flat", 160, false, true, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Attack Ember": {
    imgName: "AttackEmber",
    name: "Attack Ember",
    description: "A basic attack with healing properties.",
    cooldown: 0,
    damage: ["flat", 0, false, false, false],
    heal: ["percent", 0.05, true, false, false],
    targetType: "ally",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Ember Infusion": {
    imgName: "EmberInfusion",
    name: "Ember Infusion",
    description: "Infuse with ember power.",
    cooldown: 3,
    damage: ["flat", 0, false, false, false],
    heal: ["percent", 0.05, true, false, false],
    targetType: "ally",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["SpeedUp", "AttackUp"], [0.2, 0.2], [2, 2], [1, 1], [false, false], [true, true], [false, false], [], [], [], [], [], [], []]
  },
  "Fiery Shower": {
    imgName: "FieryShower",
    name: "Fiery Shower",
    description: "A shower of flames.",
    cooldown: 3,
    damage: ["flat", 200, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Attack Molten": {
    imgName: "AttackMolten",
    name: "Attack Molten",
    description: "A molten attack.",
    cooldown: 0,
    damage: ["flat", 100, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  "Blazing Rage": {
    imgName: "BlazingRage",
    name: "Blazing Rage",
    description: "Blaze with rage.",
    cooldown: 3,
    damage: ["flat", 0, false, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "ally",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [["DefenseUp", "AttackUp"], [0.6, 0.6], [2, 2], [1, 1], [true, true], [false, false], [false, false], [], [], [], [], [], [], []]
  },
  "Volcano Flurry": {
    imgName: "VolcanoFlurry",
    name: "Volcano Flurry",
    description: "A flurry of volcanic attacks.",
    cooldown: 3,
    damage: ["flat", 200, true, false, false],
    heal: ["percent", 0, false, false, false],
    targetType: "enemy",
    accuracy: 1,
    aoe: false,
    buffsAndStatusArrays: [[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  

    // self.skills.write('Attack Elric', SkillWithoutBuffs::new('Attack Elric', 0, Damage::new(100, true, false, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Enemy, 1));
    // self.skills.write('Holy Bastion', SkillWithoutBuffs::new('Holy Bastion', 4, Damage::new(0, false, false, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Ally, 1));
    // self.skills.write('Divine Hammer', SkillWithoutBuffs::new('Divine Hammer', 3, Damage::new(230, true, false, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Enemy, 1));
    // self.skills.write('Attack Nereus', SkillWithoutBuffs::new('Attack Nereus', 0, Damage::new(100, true, false, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Enemy, 1));
    // self.skills.write('Tide Strike', SkillWithoutBuffs::new('Trident Strike', 3, Damage::new(200, true, false, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Enemy, 1));
    // self.skills.write('Wave Slash', SkillWithoutBuffs::new('Wave Slash', 3, Damage::new(200, true, false, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Enemy, 1));
    // self.skills.write('Attack Rex', SkillWithoutBuffs::new('Attack Rex', 0, Damage::new(100, true, false, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Enemy, 1));
    // self.skills.write('Chum Challenge', SkillWithoutBuffs::new('Chum Challenge', 3, Damage::new(0, false, true, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Ally, 1));
    // self.skills.write('Anchor Stomps', SkillWithoutBuffs::new('Anchor Stomps', 3, Damage::new(200, true, false, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Enemy, 1));
    // self.skills.write('Attack Celeste', SkillWithoutBuffs::new('Attack Celeste', 0, Damage::new(100, true, false, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Enemy, 1));
    // self.skills.write('Ice Shatter', SkillWithoutBuffs::new('Ice Shatter', 3, Damage::new(150, false, true, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Enemy, 1));
    // self.skills.write('Snow Storm', SkillWithoutBuffs::new('Snow Storm', 4, Damage::new(100, false, true, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Enemy, 1));
    // self.skills.write('Attack Oakheart', SkillWithoutBuffs::new('Attack Oakheart', 0, Damage::new(100, true, false, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Enemy, 1));
    // self.skills.write('Lignum Hammer', SkillWithoutBuffs::new('Lignum Hammer', 3, Damage::new(200, true, false, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Enemy, 1));
    // self.skills.write('Buloke Wall', SkillWithoutBuffs::new('Buloke Wall', 4, Damage::new(0, false, false, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Ally, 1));
    // self.skills.write('Attack Sylvara', SkillWithoutBuffs::new('Attack Sylvara', 0, Damage::new(100, true, false, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Enemy, 1));
    // self.skills.write('Silvan Chant', SkillWithoutBuffs::new('Silvan Chant', 3, Damage::new(0, false, false, false, Damage::DamageType::Flat), Skill::Heal::new(10, false, true, false, Heal::HealType::Percent), TargetType::Ally, 1));
    // self.skills.write('Astral Beam', SkillWithoutBuffs::new('Astral Beam', 3, Damage::new(200, true, false, false, Damage::DamageType::Flat), Skill::Heal::new(0, false, false, false, Heal::HealType::Percent), TargetType::Enemy, 1));


    // let mut HolyBastionBuffs = self.skillsBuffs.read('Holy Bastion');
    // HolyBastionBuffs.append(Buff::new(BuffType::DefenseUp, 50, 3, false, true, false));
    // let mut DivineHammerBuffs = self.skillsBuffs.read('Divine Hammer');
    // DivineHammerBuffs.append(Buff::new(BuffType::SpeedDown, 50, 2, true, false, false));
    // DivineHammerBuffs.append(Buff::new(BuffType::AttackDown, 50, 2, true, false, false));
    // let mut NatureCallBuffs = self.skillsBuffs.read('Nature Call');
    // NatureCallBuffs.append(Buff::new(BuffType::SpeedUp, 40, 2, false, true, false));
    // let mut HolyBastionBuffs = self.skillsBuffs.read('Holy Bastion');
    // HolyBastionBuffs.append(Buff::new(BuffType::DefenseUp, 50, 3, false, true, false));
    // let mut DivineHammerBuffs = self.skillsBuffs.read('Divine Hammer');
    // DivineHammerBuffs.append(Buff::new(BuffType::SpeedDown, 50, 2, true, false, false));
    // DivineHammerBuffs.append(Buff::new(BuffType::AttackDown, 50, 2, true, false, false));
    // let mut TideStrikeBuffs = self.skillsBuffs.read('Tide Strike');
    // TideStrikeBuffs.append(Buff::new(BuffType::AttackUp, 50, 2, false, true, false));
    // let mut ChumChallengeBuffs = self.skillsBuffs.read('Chum Challenge');
    // ChumChallengeBuffs.append(Buff::new(BuffType::DefenseUp, 60, 2, false, false, true));
    // let mut SnowStormBuffs = self.skillsBuffs.read('Snow Storm');
    // SnowStormBuffs.append(Buff::new(BuffType::SpeedDown, 50, 2, false, true, false));
    // let mut LigumHammerBuffs = self.skillsBuffs.read('Lignum Hammer');
    // LigumHammerBuffs.append(Buff::new(BuffType::Stun, 0, 1, true, false, false));
    // let mut BulokeWallBuffs = self.skillsBuffs.read('Buloke Wall');
    // BulokeWallBuffs.append(Buff::new(BuffType::DefenseUp, 50, 2, false, true, false));
    // let mut SilvanChantBuffs = self.skillsBuffs.read('Silvan Chant');
    // SilvanChantBuffs.append(Buff::new(BuffType::Regen, 3, 2, false, true, false));
    // let mut AstralBeamBuffs = self.skillsBuffs.read('Astral Beam');
    // AstralBeamBuffs.append(Buff::new(BuffType::AttackDown, 50, 2, true, false, false));
}

const skillsDict = SkillsHandler.formatSkills(skillsDictWithoutImages);

export default skillsDict;