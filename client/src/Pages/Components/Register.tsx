// import { StarknetWindowObject } from "get-starknet"
import "./Register.css"
import { GameAccount } from "../../Types/apiTypes"
import { Sender } from "../../Blockchain/Sender"
import { Getter } from "../../Blockchain/Getter"
import { useState } from "react"
import { Account } from "starknet";
import Burner from '../../Blockchain/Burner'
import Storage from '../../Cookies/storage'
import { RpcProvider } from "starknet";
import { BurnerAccount } from "@dojoengine/create-burner"

type RegisterProps = {
  account: BurnerAccount,
  setAccountSelected: React.Dispatch<React.SetStateAction<boolean>>
  createAccount: (account: Account, username: string) => Promise<void>
} 
const regex = /[^a-zA-Z0-9]/g;
export default function Register({account, setAccountSelected, createAccount}: RegisterProps) {
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  function handleInputChange(event: any) {
    setUsername(event.target.value.replace(regex, ''))
  }

  async function handleRegister(username: string) {
    setIsRegistering(true);
    // account.list().map((acc) => {
    //   console.log(acc.address)
    // })
    account.create()
    createAccount(account.account, username)
    setIsRegistering(false);
    setAccountSelected(true);
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