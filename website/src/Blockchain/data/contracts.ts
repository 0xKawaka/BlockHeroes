let AccountsAdrs = "";
let EventEmitterAdrs = "";
let GameAdrs = "";
let PvpAdrs = "";
let ETHAdrs = "";

if(process.env.REACT_APP_ENV == "DEV") {
  AccountsAdrs = "0x032fc741c29dd4d4a3183fcd9aa5e39dc97868c54edda39e624e95fe41d2a1d7";
  EventEmitterAdrs = "0x0624f7080c190670161bb6e2159638bf09450cd38d96914560202111db8ad970";
  GameAdrs = "0x349651054fdd167d9cac22e2dc68f527c1eddcd7823ec779f3ae662eada3dc9";
  PvpAdrs = "0x00524dcd7345544db90388b18889e527f020923b025dd8617c17f97c7136fce8";
  ETHAdrs = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
}
else if(process.env.REACT_APP_ENV == "TEST") {
  AccountsAdrs = "0x030a345c7e6db591c91604bcae4033c2543dce3aa51fb4fe295c012da4effc8a";
  GameAdrs = "0xa4117f22405c058510b817d4ff5a66cda3b63d379880d29ab377637bcd6581";
  ETHAdrs = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
}
else if(process.env.REACT_APP_ENV == "PROD") {
  // AccountsAdrs = "0x07f8b470057f47f3c2c4f60db801f4df4a23d4b6969b200876685607e50f6a53";
  AccountsAdrs = "0x07ba68bc3505dc7db6555e5bcce98cf408fc9afe75f47007effd9bc7b8e557e4";
  // GameAdrs = "0x02e798fa9fb684fe729823fa68e594d6885a159ac4261a09f761bc0ff96ed43d";
  GameAdrs = "0x05a38de2da899a95770939d4ffb3fd4223b55b4d02765c3575438a826f6a78fd";
  ETHAdrs = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
}


// export { AccountsAdrs, EventEmitterAdrs, GameAdrs, PvpAdrs, ETHAdrs }
export { AccountsAdrs, EventEmitterAdrs, GameAdrs, PvpAdrs, ETHAdrs }