// import { StarknetWindowObject } from "get-starknet"
import "./Register.css"
import { useState } from "react"
import { Account } from "starknet";
import { BurnerAccount } from "@dojoengine/create-burner"
import { useDojo } from "../../dojo/useDojo"

type RegisterProps = {
  account: BurnerAccount,
  setAccountSelected: React.Dispatch<React.SetStateAction<boolean>>
  setBlockchainAccount: React.Dispatch<React.SetStateAction<Account>>
} 
const regex = /[^a-zA-Z0-9]/g;
export default function Register({account, setAccountSelected,  setBlockchainAccount}: RegisterProps) {
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const {setup: {systemCalls: { createAccount }}} = useDojo();

  function handleInputChange(event: any) {
    if(event.target.value.length > 27) return;
    setUsername(event.target.value.replace(regex, ''))
  }

  async function handleRegister(username: string) {
    setIsRegistering(true);
    console.log("account :", account.account.address)
    account.create()
    console.log("account_aftercreate :", account.account.address)
    setBlockchainAccount(account.account)
    let res = await createAccount(account.account, username)
    if(res) {
      console.log("Account created successfully")
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccountSelected(true);
    }
    setIsRegistering(false);
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