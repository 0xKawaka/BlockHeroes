const monstersNames = [
  "wellan",
  "sirocco",
  "marella",
  "elandor",
  "diana",
  "elric",
  "nereus",
  "rex",
  "celeste",
  "oakheart",
  "sylvara",
  "bane",
  "ember",
  "molten",
  "solas",
  "solveig",
  "janus",
  "horus",
  "jabari",
  "khamsin",
 ]

const imagesByName: {[key: string]: string} = {}

monstersNames.forEach(monsterName => {
  imagesByName[monsterName] = new URL(`../../assets/monsters/${monsterName}.png`, import.meta.url).href
})

export default imagesByName