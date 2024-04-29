import './GamePage.css'
import ApiHandler from '../Classes/IO/ApiHandler'
import MyHeroes from './Components/MyHeroes'
import { useState, useEffect } from 'react'
import {RunesList, BattlesInfosDict, HeroInfos, GameAccount, SkillsDict, SkillSets, BaseStatsDict, RuneInfos} from '../Types/apiTypes'
import WorldSelect from './Components/WorldSelect'
import title from '../assets/misc/BlockHeroes_Title.png'
import collectionIcon from '../assets/icons/Menu_CollectionIcon.png'
import battleIcon from '../assets/icons/Menu_BattleIcon.png'
import summonIcon from '../assets/icons/Menu_SummonIcon.png'
import mapIcon from '../assets/icons/Menu_MapIcon.png'
import SkillsHandler from '../Classes/IO/SkillsHandler'
import { computeBonusStats } from './utils/statisticsCompute'
import Summons from './Components/Summons'
import { StarknetWindowObject } from 'get-starknet'
import { Getter } from '../Blockchain/Getter'
import { HeroesFactory } from '../Classes/Heroes/HeroesFactory'
import Register from './Components/Register'
import { Account } from "starknet";
import { HeroBlockchain } from '../Types/blockchainTypes'
import RuneFactory from '../Classes/Runes/RuneFactory'
import StateChangesHandler from './State/StateChangesHandler'
import AccountOverview from './Components/AccountOverview'
import EnergyHandler from './Classes/EnergyHandler'
import AccountSelect from './Components/AccountSelect'
import Pvp from './Components/Pvp'

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
  const [localWallet, setAccountWallet] = useState<Account>();
  const [gameAccount, setGameAccount] = useState<GameAccount>({ username: "", crystals: 0, gems: 0})
  const [energy, setEnergy] = useState<number>(0)
  const [pvpEnergy, setPvpEnergy] = useState<number>(0)
  const [pvpRank, setPvpRank] = useState<number>(0)
  const [defensePvpHeroesIds, setDefensePvpHeroesIds] = useState<number[]>([])
  const [hasAccount, setHasAccount] = useState<boolean>(false)
  const [heroesList, setHeroesList] = useState<Array<HeroInfos>>([])
  const [runesList, setRunesList] = useState<Array<RuneInfos>>([])
  const [skillsDict, setSkillsDict] = useState<SkillsDict>({})
  const [skillSets, setSkillSets] = useState<SkillSets>({})
  const [baseStatsDict, setBaseStatsDict] = useState<BaseStatsDict>({})
  const [worldsBattlesList, setWorldsBattlesList] = useState<BattlesInfosDict>({})
  const [showMyHeroes, setShowMyHeroes] = useState<boolean>(false)
  const [showWorldSelect, setShowWorldSelect] = useState<boolean>(false)
  const [showPvp, setShowPvp] = useState<boolean>(false)
  const [showSummons, setShowSummons] = useState<boolean>(false)
  const [isBattleRunning, setIsBattleRunning] = useState<boolean>(false)
  const [stateChangesHandler, setStateChangesHandler] = useState<StateChangesHandler>(new StateChangesHandler(setHeroesList, setRunesList, setGameAccount, setShowMyHeroes, setShowWorldSelect, setIsBattleRunning))

  // function handleNewAccount(){
  //   setRefreshUseEffect(refreshUseEffect + 1)
  // }

  async function handleNewHeroEvent(hero: HeroBlockchain) {
    let heroInfos = HeroesFactory.createHero(hero!, [], skillsDict, skillSets, baseStatsDict)
    let newHeroesList = [...heroesList]
    newHeroesList.push(heroInfos)
    setHeroesList(newHeroesList)
  }

  async function reloadPvpInfos() {
    let pvpRankPromise = Getter.getPvpRank(localWallet!);
    let pvpDefenseTeamPromise = Getter.getTeam(localWallet!);
    let [pvpRank, pvpDefenseTeam] = await Promise.all([pvpRankPromise, pvpDefenseTeamPromise]);
    setPvpRank(pvpRank);
    setDefensePvpHeroesIds(pvpDefenseTeam);
  }

  useEffect(() => {
    (async () => {
      console.log('useEffect GamePage')
      if(localWallet === undefined){
        console.log('localWallet undefined')
        return;
      }
      let accountPromise = await Getter.getAccount(localWallet);
      let heroesPromise = Getter.getAllHeroes(localWallet);
      let runesPromise = Getter.getAllRunes(localWallet);
      let pvpRankPromise = Getter.getPvpRank(localWallet);
      let pvpDefenseTeamPromise = Getter.getTeam(localWallet);
      let skillsDictPromise = ApiHandler.getSkillsDict();
      let skillSetsPromise = ApiHandler.getSkillSets();
      let baseStatsDictPromise = ApiHandler.getBaseStats();
      let runeStatsDictPromise = ApiHandler.getRuneStats();
      let [account, heroes, blockchainRunes, pvpRank, pvpDefenseTeam, skillsDictApi, skillSets, baseStatsDict, runeStatsDict] = await Promise.all([accountPromise, heroesPromise, runesPromise, pvpRankPromise, pvpDefenseTeamPromise, skillsDictPromise, skillSetsPromise, baseStatsDictPromise, runeStatsDictPromise]);
      stateChangesHandler.setRuneStatsDict(runeStatsDict)
      stateChangesHandler.setBaseStatsDict(baseStatsDict)
      if(account){
        let energyHandler = new EnergyHandler(setEnergy)
        energyHandler.initEnergy(account.energyInfos.energy, account.energyInfos.lastEnergyUpdateTimestamp)
        stateChangesHandler.setEnergyHandler(energyHandler)
        let pvpEnergyHandler = new EnergyHandler(setPvpEnergy)
        pvpEnergyHandler.initEnergy(account.energyInfos.pvpEnergy, account.energyInfos.lastPvpEnergyUpdateTimestamp)
        stateChangesHandler.setPvpEnergyHandler(pvpEnergyHandler)
        setGameAccount(account);
        setPvpRank(pvpRank);
        setDefensePvpHeroesIds(pvpDefenseTeam);
        setHasAccount(true);
      }
      setStateChangesHandler(stateChangesHandler)
      const skillsDict = SkillsHandler.formatSkills(skillsDictApi);
      let runes = RuneFactory.createRunes(blockchainRunes, runeStatsDict);
      let heroesWithSkillsAndStats = HeroesFactory.createHeroes(heroes, runes, skillsDict, skillSets, baseStatsDict);
      setHeroesList(heroesWithSkillsAndStats);
      setRunesList(runes);
      setSkillsDict(skillsDict);
      setSkillSets(skillSets);
      setBaseStatsDict(baseStatsDict);
      let battlesInfos = await ApiHandler.getBattlesInfos();
      const battlesWithEnemyStatsAndSkills = HeroesFactory.createEnemyHeroes(battlesInfos, skillsDict, skillSets, baseStatsDict);
      // console.log(battlesWithEnemyStatsAndSkills);
      setWorldsBattlesList(battlesWithEnemyStatsAndSkills);
    })();
  }, [localWallet]);

  return (
    <div className='GamePhaserContainer' id='GamePhaserContainer'>
      <div className='GamePageContainer' style={getGamePageContainerStyle(isBattleRunning)}>
        {hasAccount && !isBattleRunning && <AccountOverview gameAccount={gameAccount} energy={energy} maxEnergy={5} pvpEnergy={pvpEnergy} maxPvpEnergy={5} stateChangesHandler={stateChangesHandler} />}
        {hasAccount && !showMyHeroes && !showWorldSelect && !showSummons && !showPvp &&
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
        {localWallet === undefined &&
          <AccountSelect setAccountWallet={setAccountWallet} />
        }
        {showMyHeroes &&
          <MyHeroes heroesList={heroesList} runesList={runesList} localWallet={localWallet!} stateChangesHandler={stateChangesHandler}/>
        }
        {showWorldSelect &&
          <WorldSelect energy={energy} worldsBattlesList={worldsBattlesList} heroesList={heroesList} runesList={runesList} localWallet={localWallet!} stateChangesHandler={stateChangesHandler} />
        }
        {showSummons &&
          <Summons localWallet={localWallet!} setShowSummons={setShowSummons} handleNewHeroEvent={handleNewHeroEvent} />
        }
        {showPvp &&
          <Pvp localWallet={localWallet!} rank={pvpRank} heroesList={heroesList} defensePvpHeroesIds={defensePvpHeroesIds} setShowPvp={setShowPvp} reloadPvpInfos={reloadPvpInfos} />
        }
      </div>
    </div>
  )
}

export default GamePage