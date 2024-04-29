export default interface ISkillBuff {
  name: string,
  value: number,
  duration: number,
  target: boolean,
  aoe: boolean,
  self: boolean,
  accuracy: number,
}
