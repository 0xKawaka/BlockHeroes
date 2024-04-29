import { Account } from "starknet"
import "./AccountSelect.css"
import { useState, useEffect } from "react"
import Register from "./Register"
import Storage from '../../Cookies/storage'
import Burner from "../../Blockchain/Burner"
import { Getter } from "../../Blockchain/Getter"

type AccountSelectProps = {
  setAccountWallet: React.Dispatch<React.SetStateAction<Account | undefined>>
}

export default function AccountSelect({setAccountWallet}: AccountSelectProps) {
  const [showRegister, setShowRegister] = useState<boolean>(false);

  async function handleAccountWalletSelect(accountAdrs: string) {
    let acc = Burner.getAccountByAddress(accountAdrs)
    console.log(acc)
    if(acc){
      // let account = await Getter.getAccount(acc);
      setAccountWallet(acc);
    }
  }

  const accounts = Burner.getAllAccounts();

  const reactAccountList = accounts.map((account, i) => {
    return(
      <div className="AccountSelectAccountContainer" key={i} onClick={() => handleAccountWalletSelect(account.address)}>
        <div className="AccountSelectAccountUsername">{account.username}</div>
      </div>
    )
  })

  return(
  <div className="AccountSelectAndRegisterContainer">
    {!showRegister &&
      <div className="AccountSelectAndRegisterButtonContainer">
        <div className="AccountSelectTitle">Select Account</div>
        <div className="AccountSelectAccountList">
          {reactAccountList}
        </div>
        <div className="AccountSelectRegisterButton" onClick={() => setShowRegister(true)}>Create new account</div>
      </div>
    }
    {showRegister && <Register setAccountWallet={setAccountWallet} />}
  </div>
  )
}
