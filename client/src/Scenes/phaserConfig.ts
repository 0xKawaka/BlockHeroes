import Phaser from 'phaser'
import BattleScene from './BattleScene'
import UIScene from './UIScene'
import BattleLoader from './BattleLoader'
import FontLoader from './FontLoader'
import Entity from '../Classes/Entity/Entity'
import GameEventHandler from '../Blockchain/event/GameEventHandler'
import { Account } from 'starknet'
import Maps from '../GameDatas/maps'

function getPhaserConfig(eventHandler: GameEventHandler, account: Account, playTurn: any, parentContainer:string, map: Maps, battleId:number, selectedTeam: Entity[], enemiesTeam: Entity[]): Phaser.Types.Core.GameConfig{
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
        game.registry.merge({"eventHandler": eventHandler, "account": account, "playTurn": playTurn, "map": map, "battleId": battleId, "selectedTeam": selectedTeam, "enemiesTeam": enemiesTeam});
      }
    }
  }
  return Config

}

export {getPhaserConfig}