const monstersNames = ["knight", "assassin", "priest", "hunter"]

let imagesByName: {[key: string]: {[key: string]: {[key: string]: any}} } = {}

for (let monsterName of monstersNames) {
  imagesByName[monsterName] = {}
  let img = require('../../assets/monsters/' + monsterName + '/' + 'spritesheet.png')
  imagesByName[monsterName] = img
}


export default imagesByName