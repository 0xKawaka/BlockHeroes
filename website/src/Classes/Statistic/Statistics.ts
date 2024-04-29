import IStatistic from "../../Interfaces/IStatistics";

export default class Statistics implements IStatistic {
  level: number;
  health: number;
  // attack: number;
  // defense: number;
  speed: number;
  // critical: number;
  // criticalDamage: number;
  // evasion: number;
  // accuracy: number;

  constructor(level: number, health: number, speed: number) {
    this.level = level;
    this.health = health;
    // this.attack = attack;
    // this.defense = defense;
    this.speed = speed;
    // this.critical = critical;
    // this.criticalDamage = criticalDamage;
    // this.evasion = evasion;
    // this.accuracy = accuracy;
  }

  // setHealth(health: number) {
  //   this.health = health;
  // }
}