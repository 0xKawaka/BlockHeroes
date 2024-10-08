import './GamePage.css'
import { useState, useEffect, useMemo } from 'react'
// import {RunesList, BattlesInfosDict, HeroInfos, GameAccount, SkillsDict, SkillSets, BaseStatsDict, RuneInfos} from '../Types/apiTypes'
import WorldSelect from './Components/WorldSelect'
import title from '../assets/misc/BlockHeroes_Title.png'
import collectionIcon from '../assets/icons/Menu_CollectionIcon.png'
import battleIcon from '../assets/icons/Menu_BattleIcon.png'
import summonIcon from '../assets/icons/Menu_SummonIcon.png'
import mapIcon from '../assets/icons/Menu_MapIcon2.png'
import questsIcon from '../assets/icons/Menu_QuestsIcon.png'
import Summons from './Components/Summons'
import { HeroesFactory } from '../Classes/Heroes/HeroesFactory'
import { HeroBlockchain } from '../Types/blockchainTypes'
import MyHeroes from './Components/MyHeroes'
import RuneFactory from '../Classes/Runes/RuneFactory'
import StateChangesHandler from './State/StateChangesHandler'
import AccountOverview from './Components/AccountOverview'
import EnergyHandler from './Classes/EnergyHandler'
import AccountSelect from './Components/AccountSelect'
import { worldsBattlesList } from '../GameDatas/Levels/battlesInfos'
import Pvp from './Components/Pvp'
import { useDojo } from "../dojo/useDojo";
import { useComponentValue, useQuerySync } from "@dojoengine/react";
import { getComponentValue, Entity, runQuery, Has } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import ToriiGetter from '../dojo/ToriiGetter'
import { GameAccount, Hero } from '../Types/toriiTypes'
import { HeroInfos, RuneInfos } from '../Types/apiTypes'
import { Account } from 'starknet'
import { ArenaAccount, ArenaFullAccount, BaseHeroInfos, GlobalQuest } from '../Types/customTypes'
import { BurnerAccount } from '@dojoengine/create-burner'
import { ToriiClient } from '@dojoengine/torii-client'
import { AllyOrEnemy } from '../dojo/typescript/models.gen';
import { ClientComponents } from '../dojo/createClientComponents';
import {Maps} from '../GameDatas/maps'
import Quests from './Components/Quests'
import { maxEnergy, maxPvpEnergy, timeTickEnergy, timeTickPvpEnergy } from '../GameDatas/constants'


function getGamePageContainerStyle(isBattleRunning: boolean){
  if (isBattleRunning){
    return {
      paddingTop: "0px",
    }
  }
  else {
    return {
      paddingTop: "1vh",
    }
  }
}

type GamePageProps = {
  toriiClient: ToriiClient
  account: BurnerAccount
}

function GamePage({toriiClient, account} : GamePageProps) {
  const {setup: {clientComponents: {Account, ArenaAccount, Runes, Heroes, ArenaTeam, MapProgress, GlobalQuests, AccountQuests}}} = useDojo();
  // useQuerySync(toriiClient, contractComponents as any, []);

  const [accountSelected, setAccountSelected] = useState<boolean>(false)
  const [blockchainAccount, setBlockchainAccount] = useState<Account>(account.account)
  const [gameAccount, setGameAccount] = useState<GameAccount>({ username: "", crystals: 0, gems: 0, energy: 0, pvpEnergy: 0, lastEnergyUpdateTimestamp: 0, lastPvpEnergyUpdateTimestamp: 0, heroesCount: 0, owner: BigInt(0), runesCount: 0, summonChests: 0 });  
  const [arenaAccount, setArenaAccount] = useState<ArenaAccount>({rank: 0, lastClaimedRewards: 0})
  const [defenseArenaHeroesIds, setDefenseArenaHeroesIds] = useState<number[]>([])
  const [arenaFullAccounts, setArenaFullAccounts] = useState<ArenaFullAccount[]>([])
  const [baseHeroes, setBaseHeroes] = useState<Array<BaseHeroInfos>>([])
  const [heroes, setHeroes] = useState<Array<HeroInfos>>([])
  const [runes, setRunes] = useState<Array<RuneInfos>>([])
  const [allAccountsDict, setAllAccountsDict] = useState<{[key: string]: GameAccount}>({})
  const [showQuests, setShowQuests] = useState<boolean>(false)
  const [showMyHeroes, setShowMyHeroes] = useState<boolean>(false)
  const [showWorldSelect, setShowWorldSelect] = useState<boolean>(false)
  const [showPvp, setShowPvp] = useState<boolean>(false)
  const [showSummons, setShowSummons] = useState<boolean>(false)
  const [isBattleRunning, setIsBattleRunning] = useState<boolean>(false)
  const [mapProgress, setMapProgress] = useState<{[key: number]: number}>({})
  const [globalQuests, setGlobalQuests] = useState<Array<GlobalQuest>>([])
  const [stateChangesHandler, setStateChangesHandler] = useState<StateChangesHandler>(new StateChangesHandler(setHeroes, setRunes, setGameAccount, setShowMyHeroes, setShowWorldSelect, setIsBattleRunning, setMapProgress, setArenaAccount, setArenaFullAccounts, setGlobalQuests))

  async function handleNewHeroEvent(hero: HeroInfos) {
    let newHeroes = [...heroes]
    newHeroes.push(hero)
    setHeroes(newHeroes)
  }

  const setEnergy = (energy: number) => {
    setGameAccount((prevState: GameAccount) => {
      return {...prevState, energy: energy}
    })
  }

  const setPvpEnergy = (pvpEnergy: number) => {
    setGameAccount((prevState: GameAccount) => {
      return {...prevState, pvpEnergy: pvpEnergy}
    })
  }


  function loadPvpInfos(address: string) {
    const accountEntityId = getEntityIdFromKeys([BigInt(address)]) as Entity;
    const arenaAccount = getComponentValue(ArenaAccount, accountEntityId);
    // console.log("arenaAccount", arenaAccount);
    if(arenaAccount){
      setArenaAccount(arenaAccount);
      let arenaDefenseHeroes = ToriiGetter.getArenaDefenseHeroesIndexes(address, arenaAccount.teamSize, ArenaTeam);
      setDefenseArenaHeroesIds(arenaDefenseHeroes);
      // console.log("arenaDefenseHeroes", arenaDefenseHeroes);
    }
  }

  function updateGlobalPvpInfos() {
    // console.log("updateGlobalPvpInfos");
    let arenaFullAccounts = ToriiGetter.loadGlobalPvpInfos(ArenaAccount, Heroes, ArenaTeam, Account, Runes);
    setArenaFullAccounts(arenaFullAccounts);
  }

  useEffect(() => {
    updateGlobalPvpInfos();
  }, []);
  
  useEffect(() => {
    if(!accountSelected) {
      let allAccountsDict = ToriiGetter.getAllAccounts(account.list().map((account) => account.address), Account);
      setAllAccountsDict(allAccountsDict);
    }
    else {
      let gameAccount: GameAccount;
      if(allAccountsDict[blockchainAccount.address]){
        gameAccount = allAccountsDict[blockchainAccount.address];
      } else {
        gameAccount = ToriiGetter.getGameAccount(blockchainAccount.address, Account);
      }
      setGameAccount(gameAccount);
      let runes: RuneInfos[] = [];
      let heroes: HeroInfos[] = [];
      if(gameAccount !== undefined){
        if(gameAccount.heroesCount < 2){
          setShowSummons(true);
        }
        let globalQuests = ToriiGetter.getGlobalQuests(blockchainAccount.address, GlobalQuests, AccountQuests)
        setGlobalQuests(globalQuests);
        let toriiRunes = ToriiGetter.getAllRunes(blockchainAccount.address, gameAccount.runesCount, Runes);
        let toriiHeroes = ToriiGetter.getAllHeroes(blockchainAccount.address, gameAccount.heroesCount, Heroes);
        console.log("toriiHeroes", toriiHeroes);
        runes = RuneFactory.createRunes(toriiRunes);
        setBaseHeroes(HeroesFactory.createBaseHeroes());
        heroes = HeroesFactory.createHeroes(toriiHeroes, runes);
        setHeroes(heroes);
        setRunes(runes);
        loadPvpInfos(blockchainAccount.address);
        let energyHandler = new EnergyHandler(setEnergy, maxEnergy, timeTickEnergy);
        energyHandler.initEnergy(gameAccount.energy, gameAccount.lastEnergyUpdateTimestamp);
        stateChangesHandler.setEnergyHandler(energyHandler);
        let pvpEnergyHandler = new EnergyHandler(setPvpEnergy, maxPvpEnergy, timeTickPvpEnergy);
        pvpEnergyHandler.initEnergy(gameAccount.pvpEnergy, gameAccount.lastPvpEnergyUpdateTimestamp);
        stateChangesHandler.setPvpEnergyHandler(pvpEnergyHandler);
        const campaignProgressEntity = getEntityIdFromKeys([BigInt(blockchainAccount.address), BigInt(Maps.Campaign)]) as Entity;
        const campaignProgress = getComponentValue(MapProgress, campaignProgressEntity);
        mapProgress[Maps.Campaign] = campaignProgress ? campaignProgress.level : 0;
        setMapProgress(mapProgress);
      }
    }
  }, [accountSelected]);

  return (
    <div className='GamePhaserContainer' id='GamePhaserContainer'>
      <div className='GamePageContainer' style={getGamePageContainerStyle(isBattleRunning)}>
        {accountSelected && !isBattleRunning && gameAccount && <AccountOverview gameAccount={gameAccount} maxEnergy={maxEnergy} maxPvpEnergy={maxPvpEnergy} stateChangesHandler={stateChangesHandler} />}
        {accountSelected && !showMyHeroes && !showWorldSelect && !showSummons && !showPvp && !showQuests &&
        <div className='GamePageTitleAndMenu'>
          <img className='GamePageTitle' src={title} />
          <div className='GamePageMenu'>
            <div className='GamePageMenuButton' onClick={() => setShowQuests(true)}>
              <img className='GamePageMenuButtonIcon' src={questsIcon} />
              <div className="GamePageMenuButtonText">
                Quests
              </div>
            </div>
            <div className='GamePageMenuButton' onClick={() => setShowSummons(true)}>
              <img className='GamePageMenuButtonIcon' src={summonIcon} />
              <div className="GamePageMenuButtonText">
                Summon
              </div>
            </div>
            <div className='GamePageMenuButton' onClick={() => setShowMyHeroes(true)}>
              <img className='GamePageMenuButtonIcon' src={collectionIcon} />
              <div className="GamePageMenuButtonText">
                Heroes
              </div>
            </div>
            <div className='GamePageMenuButton' onClick={() => setShowWorldSelect(true)}>
              <img className='GamePageMenuButtonIcon' src={mapIcon} />
              <div className="GamePageMenuButtonText">
                World
              </div>
            </div>
            <div className='GamePageMenuButton' onClick={() => setShowPvp(true)}>
              <img className='GamePageMenuButtonIcon' src={battleIcon} />
              <div className="GamePageMenuButtonText">
                Arena
              </div>
            </div>
          </div>
        </div>
        }
        {!accountSelected &&
          <AccountSelect account={account} allAccountsDict={allAccountsDict} setAccountSelected={setAccountSelected} setBlockchainAccount={setBlockchainAccount} />
        }
        {showQuests &&
          <Quests account={blockchainAccount} gameAccount={gameAccount} stateChangesHandler={stateChangesHandler} globalQuests={globalQuests} mapProgress={mapProgress} setShowQuests={setShowQuests} />
        }
        {showMyHeroes &&
          <MyHeroes account={blockchainAccount} gameAccount={gameAccount} heroesList={heroes} runesList={runes} baseHeroes={baseHeroes} stateChangesHandler={stateChangesHandler}/>
        }
        {showWorldSelect &&
          <WorldSelect account={blockchainAccount} gameAccount={gameAccount} worldsBattlesList={worldsBattlesList} heroesList={heroes} runesList={runes} mapProgress={mapProgress} stateChangesHandler={stateChangesHandler} />
        }
        {showSummons &&
          <Summons account={blockchainAccount} gameAccount={gameAccount} setGameAccount={setGameAccount} setShowSummons={setShowSummons} handleNewHeroEvent={handleNewHeroEvent} />
        }
        {showPvp &&
          <Pvp account={blockchainAccount} gameAccount={gameAccount} arenaAccount={arenaAccount} heroesList={heroes} defenseArenaHeroesIds={defenseArenaHeroesIds} arenaFullAccounts={arenaFullAccounts} stateChangesHandler={stateChangesHandler} setDefenseArenaHeroesIds={setDefenseArenaHeroesIds} setArenaAccount={setArenaAccount} setShowPvp={setShowPvp} loadPvpInfos={loadPvpInfos} updateGlobalPvpInfos={updateGlobalPvpInfos}/>
        }
      </div>
    </div>
  )
}

export default GamePage;