import SkillStatus from "./SkillStatus";
import SkillBuff from "./SkillBuff";
import IHealOrDamage from "./IHealOrDamage";


export default interface ISkill {
  name: string,
  description: string,
  cooldown: number,
  damage: IHealOrDamage,
  heal: IHealOrDamage,
  accuracy: number,
  aoe: boolean,
  image: any
  skillStatusArray: Array<SkillStatus>,
  skillBuffArray: Array<SkillBuff>,
}