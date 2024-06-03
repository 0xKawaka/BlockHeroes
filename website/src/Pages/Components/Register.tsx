import { StarknetWindowObject } from "get-starknet"
import "./Register.css"
import { GameAccount } from "../../Types/apiTypes"
import { Sender } from "../../Blockchain/Sender"
import { Getter } from "../../Blockchain/Getter"
import { useState } from "react"
import { Account } from "starknet";
import Burner from '../../Blockchain/Burner'
import Storage from '../../Cookies/storage'
import { RpcProvider } from "starknet";

type RegisterProps = {
  setAccountWallet: React.Dispatch<React.SetStateAction<Account | undefined>>,
} 
const regex = /[^a-zA-Z0-9]/g;
export default function Register({setAccountWallet}: RegisterProps) {
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  function handleInputChange(event: any) {
    setUsername(event.target.value.replace(regex, ''))
  }

  async function handleRegister(username: string) {
    setIsRegistering(true);
    if(process.env.REACT_APP_ENV == "DEV")
      Storage.clear();

    let accountInfos = await Burner.createBurnerAccount()
    console.log('new localWallet : ', accountInfos.account);

    // await Sender.createAccount(accountInfos.account, username);
    // Burner.saveAccount(accountInfos.account.address, accountInfos.privateKey, accountInfos.publicKey, accountInfos.deployTx, username);
    // setIsRegistering(false);
    // setAccountWallet(accountInfos.account);
  }

  return(
    <div className="RegisterContainer">
      <div className="RegisterInputTitle">Username</div>
      <input className="RegisterInput" onChange={handleInputChange} value={username}/>
      {!isRegistering &&
        <div className="RegisterButton" onClick={() => handleRegister(username)} >Register</div>
      }
      {isRegistering &&
        <div className="RegisterButton">Registering ...</div>
      }
    </div>
  )
}