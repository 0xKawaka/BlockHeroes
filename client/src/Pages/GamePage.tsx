import './GamePage.css'
// import ApiHandler from '../Classes/IO/ApiHandler'
import { useState, useEffect, useMemo } from 'react'
// import {RunesList, BattlesInfosDict, HeroInfos, GameAccount, SkillsDict, SkillSets, BaseStatsDict, RuneInfos} from '../Types/apiTypes'
// import WorldSelect from './Components/WorldSelect'
import title from '../assets/misc/BlockHeroes_Title.png'
import collectionIcon from '../assets/icons/Menu_CollectionIcon.png'
import battleIcon from '../assets/icons/Menu_BattleIcon.png'
import summonIcon from '../assets/icons/Menu_SummonIcon.png'
import mapIcon from '../assets/icons/Menu_MapIcon.png'
// import { computeBonusStats } from './utils/statisticsCompute'
// import Summons from './Components/Summons'
// import { Getter } from '../Blockchain/Getter'
import { BaseHeroInfos, HeroesFactory } from '../Classes/Heroes/HeroesFactory'
// import Register from './Components/Register'
// import { HeroBlockchain } from '../Types/blockchainTypes'
import MyHeroes from './Components/MyHeroes'
import RuneFactory from '../Classes/Runes/RuneFactory'
import runeStats from '../GameDatas/Statistics/runeStats'
import skillsDict from '../GameDatas/Skills/skillsDict'
import skillSets from '../GameDatas/Skills/skillSets'
import baseStats from '../GameDatas/Statistics/baseStats'
import StateChangesHandler from './State/StateChangesHandler'
import AccountOverview from './Components/AccountOverview'
// import EnergyHandler from './Classes/EnergyHandler'
import AccountSelect from './Components/AccountSelect'
// import Pvp from './Components/Pvp'
// import { GameDojo } from '../Blockchain/Dojo/game'

import { useDojo } from "../dojo/useDojo";
import { useComponentValue, useQuerySync } from "@dojoengine/react";
import { getComponentValue, Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import hexToString from './utils/hexToString';
import ToriiGetter from '../dojo/ToriiGetter'
import { GameAccount } from '../Types/toriiTypes'
import { HeroInfos, RuneInfos } from '../Types/apiTypes'
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
  // ToriiGetter.getUsernamesByAccount();
  const [accountSelected, setAccountSelected] = useState<boolean>(false)
  // const [localWallet, setAccountWallet] = useState<Account>();
  // const [energy, setEnergy] = useState<number>(0)
  // const [pvpEnergy, setPvpEnergy] = useState<number>(0)
  // const [pvpRank, setPvpRank] = useState<number>(0)
  // const [defensePvpHeroesIds, setDefensePvpHeroesIds] = useState<number[]>([])
  // const [hasAccount, setHasAccount] = useState<boolean>(false)
  const [gameAccount, setGameAccount] = useState<GameAccount>({ username: "", crystals: 0, gems: 0, energy: 0, pvpEnergy: 0, lastEnergyUpdateTimestamp: 0, lastPvpEnergyUpdateTimestamp: 0, heroesCount: 0, owner: BigInt(0), runesCount: 0 });  
  const [baseHeroes, setBaseHeroes] = useState<Array<BaseHeroInfos>>([])
  const [heroes, setHeroes] = useState<Array<HeroInfos>>([])
  const [runes, setRunes] = useState<Array<RuneInfos>>([])
  const [allAccountsDict, setAllAccountsDict] = useState<{[key: string]: GameAccount}>({})

  // const [skillsDict, setSkillsDict] = useState<SkillsDict>({})
  // const [skillSets, setSkillSets] = useState<SkillSets>({})
  // const [baseStatsDict, setBaseStatsDict] = useState<BaseStatsDict>({})
  // const [worldsBattlesList, setWorldsBattlesList] = useState<BattlesInfosDict>({})
  const [showMyHeroes, setShowMyHeroes] = useState<boolean>(false)
  const [showWorldSelect, setShowWorldSelect] = useState<boolean>(false)
  const [showPvp, setShowPvp] = useState<boolean>(false)
  const [showSummons, setShowSummons] = useState<boolean>(false)
  const [isBattleRunning, setIsBattleRunning] = useState<boolean>(false)
  const [stateChangesHandler, setStateChangesHandler] = useState<StateChangesHandler>(new StateChangesHandler(setHeroes, setRunes, setGameAccount, setShowMyHeroes, setShowWorldSelect, setIsBattleRunning))


  // const params = {
  //   rpcUrl: "http://0.0.0.0:5050",
  //   toriiUrl: "http://0.0.0.0:8080",
  //   relayUrl: "",
  //   account: undefined,
  //   worldAddress: "0x43f5a4477cb4fd56a23cf3ccf5172c95bd90caf1ed0813d4989f5e7449d102f",
  //   gameAddress: "0x349651054fdd167d9cac22e2dc68f527c1eddcd7823ec779f3ae662eada3dc9",
  //   settingsAddress: "0x1fbf77ab7d4a5ad70e732231d18d4bbaade6f280cc7d37bfc9116b2f29f0bec",
  // };


  // async function handleNewHeroEvent(hero: HeroBlockchain) {
  //   let heroInfos = HeroesFactory.createHero(hero!, [], skillsDict, skillSets, baseStatsDict)
  //   let newHeroesList = [...heroesList]
  //   newHeroesList.push(heroInfos)
  //   setHeroesList(newHeroesList)
  // }

  // async function reloadPvpInfos() {
  //   let pvpRankPromise = Getter.getPvpRank(localWallet!);
  //   let pvpDefenseTeamPromise = Getter.getTeam(localWallet!);
  //   let [pvpRank, pvpDefenseTeam] = await Promise.all([pvpRankPromise, pvpDefenseTeamPromise]);
  //   setPvpRank(pvpRank);
  //   setDefensePvpHeroesIds(pvpDefenseTeam);
  // }

  const {setup: {systemCalls: { createAccount }, clientComponents: {Account, Runes, Heroes}, toriiClient, contractComponents}, account} = useDojo();

  useEffect(() => {
    if(!accountSelected) {
      let allAccountsDict = ToriiGetter.getAllAccounts(account.list().map((account) => account.address), Account);
      setAllAccountsDict(allAccountsDict);
    }
    else {
      let gameAccount = ToriiGetter.getGameAccount(account.account.address, Account);
      setGameAccount(gameAccount);
      let runes: RuneInfos[] = [];
      let heroes: HeroInfos[] = [];
      if(gameAccount !== undefined){
        let toriiRunes = ToriiGetter.getAllRunes(account.account.address, gameAccount.runesCount, Runes);
        let toriiHeroes = ToriiGetter.getAllHeroes(account.account.address, gameAccount.heroesCount, Heroes);
        // console.log("toriiRunes:", toriiRunes)
        runes = RuneFactory.createRunes(toriiRunes, runeStats);
        setBaseHeroes(HeroesFactory.createBaseHeroes(skillsDict, skillSets, baseStats));
        heroes = HeroesFactory.createHeroes(toriiHeroes, runes, skillsDict, skillSets, baseStats);
        setHeroes(heroes);
        setRunes(runes);
        // console.log(heroes);
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
      //   setDefensePvpHeroesIds(pvpDefenseTeam);
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
        {/* {localWallet === undefined && */}
        {!accountSelected &&
          <AccountSelect account={account} createAccount={createAccount} allAccountsDict={allAccountsDict} setAccountSelected={setAccountSelected} />
        }
        
        {showMyHeroes &&
          // <MyHeroes heroesList={heroesList} runesList={runesList} account={account} stateChangesHandler={stateChangesHandler}/>
          <MyHeroes account={account} heroesList={heroes} runesList={runes} baseHeroes={baseHeroes} stateChangesHandler={stateChangesHandler}/>
        }
        {/* {showWorldSelect &&
          <WorldSelect energy={energy} worldsBattlesList={worldsBattlesList} heroesList={heroesList} runesList={runesList} localWallet={localWallet!} stateChangesHandler={stateChangesHandler} />
        }
        {showSummons &&
          <Summons localWallet={localWallet!} setShowSummons={setShowSummons} handleNewHeroEvent={handleNewHeroEvent} />
        }
        {showPvp &&
          <Pvp localWallet={localWallet!} rank={pvpRank} heroesList={heroesList} defensePvpHeroesIds={defensePvpHeroesIds} setShowPvp={setShowPvp} reloadPvpInfos={reloadPvpInfos} />
        } */}
      </div>
    </div>
  )
}

export default GamePage