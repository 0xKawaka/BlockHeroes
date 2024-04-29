import { currentChain, currentChainName } from "../../Blockchain/data/chain"
import "./NetworkError.css"

type NetworkErrorProps = {
  walletAdrs: string,
  networkId: string | undefined
}

export default function NetworkError({walletAdrs, networkId}: NetworkErrorProps) {
  if(walletAdrs === "") {
    return (
      <div className="NetworkErrorContainer">
        Connect your wallet
      </div>
    )
  }
  else {
    return(
      <div className="NetworkErrorContainer">
        Switch to {currentChainName} network
      </div>
    )
  }
}