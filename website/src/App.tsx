import './App.css'
import Home from './Pages/Home'
import { HashRouter as Router, Route, Link, Routes } from 'react-router-dom'
import GamePage from './Pages/GamePage'
// import { useState, useEffect } from 'react'
// import { connect, type StarknetWindowObject } from "get-starknet";
// import { Account } from "starknet";
// import Burner from './Blockchain/Burner'
// import Storage from './Cookies/storage'


function App() {
  // const [wallet, setWallet] = useState<StarknetWindowObject>();
  // const [hasDisconnected, setHasDisconnected] = useState<boolean>(false);

  // const [localWallet, setAccountWallet] = useState<Account>();
  // const [isDeploying, setIsDeploying] = useState(false);

  // useEffect(() => {
  //   Storage.clear();
  //   let firstActivBurner = Burner.getFirstActiveBurner();
  //   console.log('old localWallet : ', firstActivBurner);
  //   if(firstActivBurner){
  //     setAccountWallet(firstActivBurner);
  //   }
  //   else {
  //     setIsDeploying(true);
  //     Burner.createBurnerAccount().then((account) => {
  //       setAccountWallet(account);
  //       setIsDeploying(false);
  //       console.log('new localWallet : ', account);
  //     })
  //   }    
  // }, [])

  // useEffect(() => {
  //   (async () => {
  //     let res;
  //     if (!hasDisconnected){
  //       res = await connect({ modalMode: "neverAsk" })
  //     }
  //     if(res){
  //       setWallet(res)
  //     }
  //   })();
  // }, [wallet])

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
    </Router>
  )
}

export default App