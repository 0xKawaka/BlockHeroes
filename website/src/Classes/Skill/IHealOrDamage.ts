export default interface IHealOrDamage {
  value: number
  target: boolean
  aoe: boolean
  self: boolean

  getStringifiedValue(): string
}