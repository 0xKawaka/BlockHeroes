import IHealOrDamage from "./IHealOrDamage";

export default class PercentHeal implements IHealOrDamage {
  value: number
  target: boolean
  aoe: boolean
  self: boolean
  
  constructor(value: number, target: boolean, aoe: boolean, self: boolean) {
    this.value = value
    this.target = target
    this.aoe = aoe
    this.self = self
  }

  getStringifiedValue(): string {
    return this.value * 100 + "%"
  }
}