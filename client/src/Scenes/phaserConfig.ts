import Phaser from 'phaser'
import BattleScene from './BattleScene'
import UIScene from './UIScene'
import BattleLoader from './BattleLoader'
import FontLoader from './FontLoader'
import Entity from '../Classes/Entity/Entity'
import GameEventHandler from '../Blockchain/event/GameEventHandler'
// import { Account } from 'starknet'
import { BurnerAccount } from '@dojoengine/create-burner'

function getPhaserConfig(eventHandler: GameEventHandler, account: BurnerAccount, walletAdrs:string, parentContainer:string, worldId:number, battleId:number, selectedTeam: Entity[], selectedHeroesIds:number[], enemiesTeam: Entity[]): Phaser.Types.Core.GameConfig{
  const Config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: parentContainer,
    backgroundColor: '#282c34',
    pixelArt: true,
    antialias: false,
    autoRound: true,
    roundPixels: true,
    width: window.innerWidth,
	  height: window.innerHeight,

    scale: {
      mode: Phaser.Scale.ScaleModes.NONE,
    },
    physics: {
      default: 'arcade',
    },
    scene: [FontLoader, BattleLoader, BattleScene, UIScene],
  
    callbacks: {
      preBoot: function (game) {
        game.registry.merge({"eventHandler": eventHandler, "account": account, "walletAdrs": walletAdrs, "worldId": worldId, "battleId": battleId, "selectedTeam": selectedTeam, "selectedHeroesIds": selectedHeroesIds, "enemiesTeam": enemiesTeam});
      }
    }
  }
  return Config

}

export {getPhaserConfig}