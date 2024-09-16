// function getEventKey(name: string): string {
//   const h = BigInt(hash.getSelectorFromName(name));
//   return `0x${h.toString(16).padStart(64, "0")}`;
// }

// const eventHashes: {[key: string]: string} = {};

export const eventHashes: {[key: string]: string} = {
  "0x2c65067edfe78635f180e23020c2e9db4e335d95eb040aab4c0e7dee5b58dca": "NewBattle",
  "0x364c483b42fbda718cda2ea8558455b23dd2c48caea2656f8304c96a49466b9": "StartTurn",
  "0x2964a4a6f3e638677f017a8ff74dab5ed76a8a6dfbcfe80c69e4dfdb8d9da22": "Skill",
  "0x10dfc37ad65804aa830bec1dc0284b3410a8366355b641b41ccb6063b41acc5": "EndTurn",
  "0x169143d013e7076216610ff35d9f8aaed3705a203efcaad1474f9a854f900bd": "EndBattle",
  "0xe652e0407ea68d77a436a2e8d511b75b7885524d7a62e8c28312b419dcde4c": "ExperienceGain",
  "0x1aa4251c55065346137f3c4c733fd2305e0640fbe22c9143a8c9cfe59e1bc54": "Loot",
  "0x12072cf4cf73034a0d2054394ece7cb1dc5df49068f7705f0f1356920890f6c": "RuneMinted",
}

export default eventHashes;


