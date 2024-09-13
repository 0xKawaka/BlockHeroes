import './GamePage.css'
import { useState, useEffect, useMemo } from 'react'
// import {RunesList, BattlesInfosDict, HeroInfos, GameAccount, SkillsDict, SkillSets, BaseStatsDict, RuneInfos} from '../Types/apiTypes'
import WorldSelect from './Components/WorldSelect'
import title from '../assets/misc/BlockHeroes_Title.png'
import collectionIcon from '../assets/icons/Menu_CollectionIcon.png'
import battleIcon from '../assets/icons/Menu_BattleIcon.png'
import summonIcon from '../assets/icons/Menu_SummonIcon.png'
import mapIcon from '../assets/icons/Menu_MapIcon.png'
import Summons from './Components/Summons'
import { BaseHeroInfos, HeroesFactory } from '../Classes/Heroes/HeroesFactory'
import { HeroBlockchain } from '../Types/blockchainTypes'
import MyHeroes from './Components/MyHeroes'
import RuneFactory from '../Classes/Runes/RuneFactory'
import runeStats from '../GameDatas/Statistics/runeStats'
import StateChangesHandler from './State/StateChangesHandler'
import AccountOverview from './Components/AccountOverview'
import EnergyHandler from './Classes/EnergyHandler'
import AccountSelect from './Components/AccountSelect'
import { worldsBattlesList } from '../GameDatas/Levels/battlesInfos'
import Pvp from './Components/Pvp'
import { useDojo } from "../dojo/useDojo";
import { useComponentValue, useQuerySync } from "@dojoengine/react";
import { getComponentValue, Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import ToriiGetter from '../dojo/ToriiGetter'
import { GameAccount } from '../Types/toriiTypes'
import { HeroInfos, RuneInfos } from '../Types/apiTypes'
import { Account } from 'starknet'
import { set } from 'mobx'

function getGamePageContainerStyle(isBattleRunning: boolean){
  if (isBattleRunning){
    return {
      paddingTop: "0px",
    }
  }
  else {
    return {
      paddingTop: "1rem",
    }
  }
}

type GamePageProps = {
}  

function GamePage({} : GamePageProps) {
  const {setup: {clientComponents: {Account, ArenaAccount, Runes, Heroes, ArenaTeam}, toriiClient, contractComponents}, account} = useDojo();

  const [accountSelected, setAccountSelected] = useState<boolean>(false)
  const [blockchainAccount, setBlockchainAccount] = useState<Account>(account.account)
  const [gameAccount, setGameAccount] = useState<GameAccount>({ username: "", crystals: 0, gems: 0, energy: 0, pvpEnergy: 0, lastEnergyUpdateTimestamp: 0, lastPvpEnergyUpdateTimestamp: 0, heroesCount: 0, owner: BigInt(0), runesCount: 0 });  
  const [arenaAccount, setArenaAccount] = useState<{rank: number, lastClaimedRewards: number}>({rank: 0, lastClaimedRewards: 0})
  const [defenseArenaHeroesIds, setDefenseArenaHeroesIds] = useState<number[]>([])
  const [baseHeroes, setBaseHeroes] = useState<Array<BaseHeroInfos>>([])
  const [heroes, setHeroes] = useState<Array<HeroInfos>>([])
  const [runes, setRunes] = useState<Array<RuneInfos>>([])
  const [allAccountsDict, setAllAccountsDict] = useState<{[key: string]: GameAccount}>({})
  const [showMyHeroes, setShowMyHeroes] = useState<boolean>(false)
  const [showWorldSelect, setShowWorldSelect] = useState<boolean>(false)
  const [showPvp, setShowPvp] = useState<boolean>(false)
  const [showSummons, setShowSummons] = useState<boolean>(false)
  const [isBattleRunning, setIsBattleRunning] = useState<boolean>(false)
  const [stateChangesHandler, setStateChangesHandler] = useState<StateChangesHandler>(new StateChangesHandler(setHeroes, setRunes, setGameAccount, setShowMyHeroes, setShowWorldSelect, setIsBattleRunning))


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


  function loadPvpInfos() {
    const accountEntityId = getEntityIdFromKeys([
      BigInt(blockchainAccount.address)
    ]) as Entity;
    const arenaAccount = getComponentValue(ArenaAccount, accountEntityId);
    console.log("arenaAccount", arenaAccount);
    if(arenaAccount){
      setArenaAccount(arenaAccount);
      let arenaDefenseHeroes = ToriiGetter.getArenaDefenseHeroesIndexes(account.account.address, arenaAccount.teamSize, ArenaTeam);
      setDefenseArenaHeroesIds(arenaDefenseHeroes);
      console.log("arenaDefenseHeroes", arenaDefenseHeroes);
    }

    // let pvpRankPromise = Getter.getPvpRank(localWallet!);
    // let pvpDefenseTeamPromise = Getter.getTeam(localWallet!);
    // let [pvpRank, pvpDefenseTeam] = await Promise.all([pvpRankPromise, pvpDefenseTeamPromise]);
    // setPvpRank(pvpRank);
    // setDefenseArenaHeroesIds(pvpDefenseTeam);
  }
  
  useEffect(() => {
    if(!accountSelected) {
      let allAccountsDict = ToriiGetter.getAllAccounts(account.list().map((account) => account.address), Account);
      setAllAccountsDict(allAccountsDict);
    }
    else {
      let gameAccount: GameAccount;
      if(allAccountsDict[account.account.address]){
        gameAccount = allAccountsDict[account.account.address];
      } else {
        gameAccount = ToriiGetter.getGameAccount(account.account.address, Account);
      }
      setGameAccount(gameAccount);
      let runes: RuneInfos[] = [];
      let heroes: HeroInfos[] = [];
      if(gameAccount !== undefined){
        let toriiRunes = ToriiGetter.getAllRunes(account.account.address, gameAccount.runesCount, Runes);
        let toriiHeroes = ToriiGetter.getAllHeroes(account.account.address, gameAccount.heroesCount, Heroes);
        runes = RuneFactory.createRunes(toriiRunes, runeStats);
        setBaseHeroes(HeroesFactory.createBaseHeroes());
        heroes = HeroesFactory.createHeroes(toriiHeroes, runes);
        setHeroes(heroes);
        setRunes(runes);
        loadPvpInfos();
        // let energyHandler = new EnergyHandler(setEnergy);
        // energyHandler.initEnergy(gameAccount.energy, gameAccount.lastEnergyUpdateTimestamp);
        // stateChangesHandler.setEnergyHandler(energyHandler);
      }
    }
  }, [accountSelected]);




  // let runes;
  // if(toriiRunes !== undefined){
  //   runes = RuneFactory.createRunes(toriiRunes, runeStats);
  // }
  // console.log("runes: ", runes);

  // useEffect(() => {
  //   (async () => {
  //     console.log('useEffect GamePage')
      // if(localWallet === undefined){
      //   console.log('localWallet undefined')
      //   return;
      // }
      // let accountPromise = await Getter.getAccount(localWallet);
      // console.log(accountPromise)


      // let heroesPromise = Getter.getAllHeroes(localWallet);
      // let runesPromise = Getter.getAllRunes(localWallet);
      // let pvpRankPromise = Getter.getPvpRank(localWallet);
      // let pvpDefenseTeamPromise = Getter.getTeam(localWallet);
      // let skillsDictPromise = ApiHandler.getSkillsDict();
      // let skillSetsPromise = ApiHandler.getSkillSets();
      // let baseStatsDictPromise = ApiHandler.getBaseStats();
      // let runeStatsDictPromise = ApiHandler.getRuneStats();
      // let [account, heroes, blockchainRunes, pvpRank, pvpDefenseTeam, skillsDictApi, skillSets, baseStatsDict, runeStatsDict] = await Promise.all([accountPromise, heroesPromise, runesPromise, pvpRankPromise, pvpDefenseTeamPromise, skillsDictPromise, skillSetsPromise, baseStatsDictPromise, runeStatsDictPromise]);
      // stateChangesHandler.setRuneStatsDict(runeStatsDict)
      // stateChangesHandler.setBaseStatsDict(baseStatsDict)
      // if(account){
      //   let energyHandler = new EnergyHandler(setEnergy)
      //   energyHandler.initEnergy(account.energyInfos.energy, account.energyInfos.lastEnergyUpdateTimestamp)
      //   stateChangesHandler.setEnergyHandler(energyHandler)
      //   let pvpEnergyHandler = new EnergyHandler(setPvpEnergy)
      //   pvpEnergyHandler.initEnergy(account.energyInfos.pvpEnergy, account.energyInfos.lastPvpEnergyUpdateTimestamp)
      //   stateChangesHandler.setPvpEnergyHandler(pvpEnergyHandler)
      //   setGameAccount(account);
      //   setPvpRank(pvpRank);
      //   setDefenseArenaHeroesIds(pvpDefenseTeam);
      //   setHasAccount(true);
      // }
      // setStateChangesHandler(stateChangesHandler)
      // const skillsDict = SkillsHandler.formatSkills(skillsDictApi);
      // let runes = RuneFactory.createRunes(blockchainRunes, runeStatsDict);
      // let heroesWithSkillsAndStats = HeroesFactory.createHeroes(heroes, runes, skillsDict, skillSets, baseStatsDict);
      // setHeroesList(heroesWithSkillsAndStats);
      // setRunesList(runes);
      // setSkillsDict(skillsDict);
      // setSkillSets(skillSets);
      // setBaseStatsDict(baseStatsDict);
      // let battlesInfos = await ApiHandler.getBattlesInfos();
      // const battlesWithEnemyStatsAndSkills = HeroesFactory.createEnemyHeroes(battlesInfos, skillsDict, skillSets, baseStatsDict);
      // // console.log(battlesWithEnemyStatsAndSkills);
      // setWorldsBattlesList(battlesWithEnemyStatsAndSkills);
  //   })();
  // }, [accountSelected]);

  return (
    <div className='GamePhaserContainer' id='GamePhaserContainer'>
      <div className='GamePageContainer' style={getGamePageContainerStyle(isBattleRunning)}>
        {accountSelected && !isBattleRunning && gameAccount && <AccountOverview gameAccount={gameAccount} maxEnergy={5} maxPvpEnergy={5} />}
        {accountSelected && !showMyHeroes && !showWorldSelect && !showSummons && !showPvp &&
        <div className='GamePageTitleAndMenu'>
          <img className='GamePageTitle' src={title} />
          <div className='GamePageMenu'>
            <div className='GamePageMenuButton' onClick={() => setShowSummons(true)}>
              <img className='GamePageMenuButtonIcon' src={summonIcon} />
              <div className="GamePageMenuButtonText">
                Summon Heroes
              </div>
            </div>
            <div className='GamePageMenuButton' onClick={() => setShowMyHeroes(true)}>
              <img className='GamePageMenuButtonIcon' src={collectionIcon} />
              <div className="GamePageMenuButtonText">
                My Collection
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
        {showMyHeroes &&
          <MyHeroes account={blockchainAccount} heroesList={heroes} runesList={runes} baseHeroes={baseHeroes} stateChangesHandler={stateChangesHandler}/>
        }
        {showWorldSelect &&
          <WorldSelect account={blockchainAccount} gameAccount={gameAccount} worldsBattlesList={worldsBattlesList} heroesList={heroes} runesList={runes} stateChangesHandler={stateChangesHandler} />
        }
        {showSummons &&
          <Summons account={blockchainAccount} setShowSummons={setShowSummons} handleNewHeroEvent={handleNewHeroEvent} />
        }
        {showPvp &&
          <Pvp account={blockchainAccount} rank={arenaAccount.rank} heroesList={heroes} defenseArenaHeroesIds={defenseArenaHeroesIds} setDefenseArenaHeroesIds={setDefenseArenaHeroesIds} setShowPvp={setShowPvp} loadPvpInfos={loadPvpInfos}/>
        }
      </div>
    </div>
  )
}

export default GamePage