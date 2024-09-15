import ISkillAnimation from "../../Classes/Skill/Animations/ISkillAnimation"

export default class SkillAnimationWrapper {
  animType: string;
  animPlayer: ISkillAnimation;
  xOffsetPercent: number; // Make xDestinationOffset optional

  constructor(animType: string, animPlayer: ISkillAnimation, xOffsetPercent: number = 0) {
    this.animType = animType;
    this.animPlayer = animPlayer;
    this.xOffsetPercent = xOffsetPercent;
  }
}
