const monstersNames = ["knight", "assassin", "priest", "hunter", "diana", "elric", "nereus", "rex", "celeste", "oakheart", "sylvara", "bane", "ember", "molten"]

const imagesByName: {[key: string]: string} = {}

monstersNames.forEach(monsterName => {
  imagesByName[monsterName] = new URL(`../../assets/monsters/${monsterName}.png`, import.meta.url).href
})

export default imagesByName