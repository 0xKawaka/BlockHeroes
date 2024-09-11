import "./Navbar.css"
import { connect, disconnect, type ConnectOptions, type DisconnectOptions, type StarknetWindowObject } from "get-starknet"
import { truncateAddress } from "../utils/addressHandler"

type NavBarProps = {
  wallet: StarknetWindowObject | undefined
  setWallet: React.Dispatch<React.SetStateAction<StarknetWindowObject | undefined>>
  setHasDisconnected: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NavBar({wallet, setWallet, setHasDisconnected}: NavBarProps) {

  function handleConnect(options?: ConnectOptions) {
    return async () => {
      const res = await connect(options)
      if(res){
        setWallet(res)
      }
    }
  }
  
  function handleDisconnect(options?: DisconnectOptions) {
    return async () => {
      setHasDisconnected(true)
      await disconnect(options)
      setWallet(undefined)
    }
  }


  return(
  <div className="navBarContainer">
    {(wallet === undefined || wallet.selectedAddress === undefined || wallet.selectedAddress === "") &&
      <div className="walletContainer">
        <div className="connectButton" onClick={handleConnect({ modalMode: "alwaysAsk" })}>
          Connect
        </div>
      </div>
    }
    {wallet !== undefined && wallet.selectedAddress !== undefined && wallet.selectedAddress != "" &&
      <div className="walletContainer">
        <div className="navbarWalletAdrs">
          {truncateAddress(wallet.selectedAddress)}
        </div>
        <div className="disconnectButton" onClick={handleDisconnect()}>
          Disconnect
        </div>
      </div>
    }
  </div>
  )
}