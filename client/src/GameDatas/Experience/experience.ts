const levelZeroExperienceNeeded = 100;
const bonusExperiencePercentRequirePerLevel = 0.5;

function computeExperienceNeeded(level: number): number {
  if (level === 0) {
    return levelZeroExperienceNeeded;
  }
  return levelZeroExperienceNeeded + (level - 1) * levelZeroExperienceNeeded * bonusExperiencePercentRequirePerLevel;
}
export {computeExperienceNeeded};

