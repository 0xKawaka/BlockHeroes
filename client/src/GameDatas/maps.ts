enum Maps {
  Campaign= 0,
  Arena= 1,
}

function mapFromString(map: string): Maps {
  switch(map) {
    case "Campaign": return Maps.Campaign;
    case "Arena": return Maps.Arena;
    default: return Maps.Campaign;
  }
}

export {Maps, mapFromString};