import { useAccount } from '@starknet-react/core'
import './GamePage.css'
import { useState, useEffect, useMemo } from 'react'
import { useDojoSDK, useEntityId, useEntityQuery, useEventQuery, useModel, useModels } from '@dojoengine/sdk/react'
import { WalletAccount } from '../dojo/wallet-account'
import { Account, ModelsMapping, Runes } from '../dojo/generated/models.gen'
import { getAccountFixedLenQuery, getAccountQuery, getAccountQuestsQuery, getAccountVariableLenQuery, getConfigQuery, getEventsFromTxHashQuery, getEventsQuery, getHeroesQuery, getMapProgressQuery, getRunesQuery, getUndefinedKeysQuery } from '../dojo/toriiQueries'
import { maxPvpEnergy, maxEnergy } from '../GameDatas/constants'
import AccountOverview from './Components/AccountOverview'
import { extractValues, parseAccount, parseArenaAccountsByOwner, parseArenaTeamsByOwner, parseConfig, parseHeroes, parseHeroesByOwner, parseMapProgress, parseNewBattle, parseRunes } from '../dojo/parseTorii'
import Register from './Components/Register'

// import WorldSelect from './Components/WorldSelect'
import title from '../assets/misc/BlockHeroes_Title.png'
import collectionIcon from '../assets/icons/Menu_CollectionIcon.png'
import battleIcon from '../assets/icons/Menu_BattleIcon.png'
import summonIcon from '../assets/icons/Menu_SummonIcon.png'
import mapIcon from '../assets/icons/Menu_MapIcon2.png'
import questsIcon from '../assets/icons/Menu_QuestsIcon.png'
import MyHeroes from './Components/MyHeroes'
import RuneFactory from '../Classes/Runes/RuneFactory'
import { HeroesFactory } from '../Classes/Heroes/HeroesFactory'
import StateChangesHandler from './State/StateChangesHandler'
import EnergyHandler from './Classes/EnergyHandler'
import Quests from './Components/Quests'
import Summons from './Components/Summons'
import WorldSelect from './Components/WorldSelect'
import { worldsBattlesList } from '../GameDatas/Levels/battlesInfos'
import { useSystemCalls } from '../dojo/useSystemCalls'
import { addAddressPadding } from 'starknet'
import { NewBattleEvent } from '../Types/eventTypes'

function GamePage() {
  const [showMyHeroes, setShowMyHeroes] = useState<boolean>(false);
  const [showWorldSelect, setShowWorldSelect] = useState<boolean>(false);
  const [showSummons, setShowSummons] = useState<boolean>(false);
  const [showPvp, setShowPvp] = useState<boolean>(false);
  const [showQuests, setShowQuests] = useState<boolean>(false);
  const [isBattleRunning, setIsBattleRunning] = useState<boolean>(false);
  const [energy, setEnergy] = useState<number>(0);
  const [pvpEnergy, setPvpEnergy] = useState<number>(0);
  const [stateChangesHandler, setStateChangesHandler] = useState<StateChangesHandler>(new StateChangesHandler(setShowMyHeroes, setShowWorldSelect, setIsBattleRunning))

  const { account } = useAccount();
	// const { client, useDojoStore } = useDojoSDK();
	// const entities = useDojoStore((state) => state.entities);

  const playerEntityId = useEntityId(account?.address ?? "0");

  useEntityQuery(getAccountFixedLenQuery(account?.address ?? "0"));
  useEntityQuery(getAccountVariableLenQuery(account?.address ?? "0"));  
  useEntityQuery(getUndefinedKeysQuery());
  // useEventQuery(getEventsQuery(account?.address ?? "0"));

  const configRaw = useModels("game-Config");
  const config = useMemo(() => parseConfig(configRaw), [configRaw]);

  const globalQuestsRaw = useModels("game-GlobalQuests");
  const globalQuests = useMemo(() => {
    const quests = extractValues(globalQuestsRaw);
    return quests.sort((a, b) => a.mapProgressRequired - b.mapProgressRequired);
  }, [globalQuestsRaw]);
  const accountQuestsRaw = useModels("game-AccountQuests");
  const accountQuests = useMemo(() => extractValues(accountQuestsRaw), [accountQuestsRaw]);
  const mapProgressRaw = useModels("game-MapProgress");
  const mapProgress = useMemo(() => parseMapProgress(mapProgressRaw), [mapProgressRaw]);

  const gameAccountRaw = useModel(playerEntityId, ModelsMapping.Account);
  // console.log("gameAccountRaw", gameAccountRaw)
  const gameAccount = useMemo(() => parseAccount(gameAccountRaw as Account), [gameAccountRaw]);
  const runesRaw = useModels("game-Runes");
  const parsedRunes = useMemo(() => parseRunes(runesRaw), [runesRaw]);
  const runes = RuneFactory.createRunes(parsedRunes);

  const heroesRaw = useModels("game-Heroes");
  const heroesByOwner = useMemo(() => parseHeroesByOwner(heroesRaw), [heroesRaw]);
  const heroes = HeroesFactory.createHeroes(heroesByOwner[addAddressPadding(account?.address ?? "0")], runes);
  const baseHeroes = HeroesFactory.createBaseHeroes();

  // const arenaAccountsRaw = useModels("game-ArenaAccount");
  // const arenaAccountsByOwner = useMemo(() => parseArenaAccountsByOwner(arenaAccountsRaw), [arenaAccountsRaw]);
  // const arenaTeamsRaw = useModels("game-ArenaTeam");
  // const arenaTeamsByOwner = useMemo(() => parseArenaTeamsByOwner(arenaTeamsRaw), [arenaTeamsRaw]);

  // let txHashId = useEntityId(txHash);

  // const newBattleRaw = useModel(playerEntityId, ModelsMapping.NewBattle);
  // const newBattle = useMemo(() => parseNewBattle(newBattleRaw), [newBattleRaw]);

  // const { initPvp } = useSystemCalls();

  useEffect(() => {
    if(gameAccount){
      let energyHandler = new EnergyHandler(setEnergy, maxEnergy, config.timeTickEnergy);
      energyHandler.initEnergy(gameAccount.energy, gameAccount.lastEnergyUpdateTimestamp);
      stateChangesHandler.setEnergyHandler(energyHandler);
      let pvpEnergyHandler = new EnergyHandler(setPvpEnergy, maxPvpEnergy, config.timeTickPvpEnergy);
      pvpEnergyHandler.initEnergy(gameAccount.pvpEnergy, gameAccount.lastPvpEnergyUpdateTimestamp);
      stateChangesHandler.setPvpEnergyHandler(pvpEnergyHandler);
      // initPvp([1, 2,3, 4]);
    }
  }, [gameAccount]);

  // console.log("config", config)
  // console.log("gameAccount", gameAccount)

  // const {setup: {clientComponents: {Account, ArenaAccount, Runes, Heroes, ArenaTeam, MapProgress, GlobalQuests, AccountQuests}}} = useDojo();

  // const [accountSelected, setAccountSelected] = useState<boolean>(false)
  // const [blockchainAccount, setBlockchainAccount] = useState<Account>(account.account)
  // const [gameAccount, setGameAccount] = useState<GameAccount>({ username: "", crystals: 0, gems: 0, energy: 0, pvpEnergy: 0, lastEnergyUpdateTimestamp: 0, lastPvpEnergyUpdateTimestamp: 0, heroesCount: 0, owner: BigInt(0), runesCount: 0, summonChests: 0 });  
  // const [arenaAccount, setArenaAccount] = useState<ArenaAccount>({rank: 0, lastClaimedRewards: 0})
  // const [defenseArenaHeroesIds, setDefenseArenaHeroesIds] = useState<number[]>([])
  // const [arenaFullAccounts, setArenaFullAccounts] = useState<ArenaFullAccount[]>([])
  // const [baseHeroes, setBaseHeroes] = useState<Array<BaseHeroInfos>>([])
  // const [heroes, setHeroes] = useState<Array<HeroInfos>>([])
  // const [runes, setRunes] = useState<Array<RuneInfos>>([])
  // const [allAccountsDict, setAllAccountsDict] = useState<{[key: string]: GameAccount}>({})
  // const [showQuests, setShowQuests] = useState<boolean>(false)
  // const [showMyHeroes, setShowMyHeroes] = useState<boolean>(false)
  // const [showWorldSelect, setShowWorldSelect] = useState<boolean>(false)
  // const [showPvp, setShowPvp] = useState<boolean>(false)
  // const [showSummons, setShowSummons] = useState<boolean>(false)
  // const [isBattleRunning, setIsBattleRunning] = useState<boolean>(false)
  // const [mapProgress, setMapProgress] = useState<{[key: number]: number}>({})
  // const [globalQuests, setGlobalQuests] = useState<Array<GlobalQuest>>([])
  // const [stateChangesHandler, setStateChangesHandler] = useState<StateChangesHandler>(new StateChangesHandler(setHeroes, setRunes, setGameAccount, setShowMyHeroes, setShowWorldSelect, setIsBattleRunning, setMapProgress, setArenaAccount, setArenaFullAccounts, setGlobalQuests))


  // function loadPvpInfos(address: string) {
  //   const accountEntityId = getEntityIdFromKeys([BigInt(address)]) as Entity;
  //   const arenaAccount = getComponentValue(ArenaAccount, accountEntityId);
  //   // console.log("arenaAccount", arenaAccount);
  //   if(arenaAccount){
  //     setArenaAccount(arenaAccount);
  //     let arenaDefenseHeroes = ToriiGetter.getArenaDefenseHeroesIndexes(address, arenaAccount.teamSize, ArenaTeam);
  //     setDefenseArenaHeroesIds(arenaDefenseHeroes);
  //     // console.log("arenaDefenseHeroes", arenaDefenseHeroes);
  //   }
  // }

  // function updateGlobalPvpInfos() {
  //   // console.log("updateGlobalPvpInfos");
  //   let arenaFullAccounts = ToriiGetter.loadGlobalPvpInfos(ArenaAccount, Heroes, ArenaTeam, Account, Runes);
  //   setArenaFullAccounts(arenaFullAccounts);
  // }

  // useEffect(() => {
  //   updateGlobalPvpInfos();
  // }, []);
  
  // useEffect(() => {
  //   if(!accountSelected) {
  //     let allAccountsDict = ToriiGetter.getAllAccounts(account.list().map((account) => account.address), Account);
  //     setAllAccountsDict(allAccountsDict);
  //   }
  //   else {
  //     let gameAccount: GameAccount;
  //     if(allAccountsDict[blockchainAccount.address]){
  //       gameAccount = allAccountsDict[blockchainAccount.address];
  //     } else {
  //       gameAccount = ToriiGetter.getGameAccount(blockchainAccount.address, Account);
  //     }
  //     setGameAccount(gameAccount);
  //     let runes: RuneInfos[] = [];
  //     let heroes: HeroInfos[] = [];
  //     if(gameAccount !== undefined){
  //       if(gameAccount.heroesCount < 2){
  //         setShowSummons(true);
  //       }
  //       let globalQuests = ToriiGetter.getGlobalQuests(blockchainAccount.address, GlobalQuests, AccountQuests)
  //       setGlobalQuests(globalQuests);
  //       let toriiRunes = ToriiGetter.getAllRunes(blockchainAccount.address, gameAccount.runesCount, Runes);
  //       let toriiHeroes = ToriiGetter.getAllHeroes(blockchainAccount.address, gameAccount.heroesCount, Heroes);
  //       runes = RuneFactory.createRunes(toriiRunes);
  //       setBaseHeroes(HeroesFactory.createBaseHeroes());
  //       heroes = HeroesFactory.createHeroes(toriiHeroes, runes);
  //       setHeroes(heroes);
  //       setRunes(runes);
  //       loadPvpInfos(blockchainAccount.address);
  //       let energyHandler = new EnergyHandler(setEnergy, maxEnergy, timeTickEnergy);
  //       energyHandler.initEnergy(gameAccount.energy, gameAccount.lastEnergyUpdateTimestamp);
  //       stateChangesHandler.setEnergyHandler(energyHandler);
  //       let pvpEnergyHandler = new EnergyHandler(setPvpEnergy, maxPvpEnergy, timeTickPvpEnergy);
  //       pvpEnergyHandler.initEnergy(gameAccount.pvpEnergy, gameAccount.lastPvpEnergyUpdateTimestamp);
  //       stateChangesHandler.setPvpEnergyHandler(pvpEnergyHandler);
  //       const campaignProgressEntity = getEntityIdFromKeys([BigInt(blockchainAccount.address), BigInt(Maps.Campaign)]) as Entity;
  //       const campaignProgress = getComponentValue(MapProgress, campaignProgressEntity);
  //       mapProgress[Maps.Campaign] = campaignProgress ? campaignProgress.level : 0;
  //       setMapProgress(mapProgress);
  //     }
  //   }
  // }, [accountSelected]);

  return (
    <div className='GamePhaserContainer' id='GamePhaserContainer'>
      <WalletAccount />
      <div className='GamePageContainer' style={isBattleRunning ? {paddingTop: "0px"} : {paddingTop: "1vh"}}>
        {gameAccount && !isBattleRunning && <AccountOverview gameAccount={gameAccount} maxEnergy={maxEnergy} maxPvpEnergy={maxPvpEnergy} stateChangesHandler={stateChangesHandler}  />}
        {account && !(gameAccount?.username) &&
          <Register />
        }
        {!account &&
          <div className="flex justify-center items-center w-full h-full">
            <div className="text-center mx-auto" style={{ fontSize: '3rem' }}>
              Select a wallet to continue
            </div>
          </div>
        }
        {account && gameAccount?.username && !showMyHeroes && !showWorldSelect && !showSummons && !showPvp && !showQuests &&
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
        {showQuests &&
          <Quests gameAccount={gameAccount!} globalQuests={globalQuests} mapProgress={mapProgress} setShowQuests={setShowQuests} />
        }
        {showMyHeroes &&
          <MyHeroes gameAccount={gameAccount!} heroesList={heroes} runesList={runes} baseHeroes={baseHeroes} stateChangesHandler={stateChangesHandler}/>
        }
        {showWorldSelect &&
          <WorldSelect gameAccount={gameAccount!} worldsBattlesList={worldsBattlesList} heroesList={heroes} runesList={runes} mapProgress={mapProgress} stateChangesHandler={stateChangesHandler} />
        }
        {showSummons &&
          <Summons gameAccount={gameAccount!} setShowSummons={setShowSummons} />
        }
        {/* {showPvp &&
          <Pvp account={blockchainAccount} gameAccount={gameAccount} arenaAccount={arenaAccount} heroesList={heroes} defenseArenaHeroesIds={defenseArenaHeroesIds} arenaFullAccounts={arenaFullAccounts} stateChangesHandler={stateChangesHandler} setDefenseArenaHeroesIds={setDefenseArenaHeroesIds} setArenaAccount={setArenaAccount} setShowPvp={setShowPvp} loadPvpInfos={loadPvpInfos} updateGlobalPvpInfos={updateGlobalPvpInfos}/>
        } */}
      </div>
    </div>
  )
}

export default GamePage;