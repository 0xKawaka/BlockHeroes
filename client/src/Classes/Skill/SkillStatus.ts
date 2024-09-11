import ISkillStatus from "./ISkillStatus";

export default class SkillStatus implements ISkillStatus {
  name: string;
  value: number;
  duration: number;
  target: boolean;
  aoe: boolean;
  self: boolean;
  accuracy: number;

  constructor(name: string, value: number, duration: number, target: boolean, aoe: boolean, self: boolean, accuracy: number) {
    this.name = name;
    // assert(value >= 0 && value <= 1)
    this.value = value;
    this.duration = duration;
    this.target = target;
    this.aoe = aoe;
    this.self = self;
    // assert(accuracy >= 0 && accuracy <= 1)
    this.accuracy = accuracy;
  }
}