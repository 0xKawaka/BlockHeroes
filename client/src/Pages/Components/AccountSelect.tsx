import { Account } from "starknet"
import "./AccountSelect.css"
import { useState, useEffect } from "react"
import Register from "./Register"
import Storage from '../../Cookies/storage'
import Burner from "../../Blockchain/Burner"
import { Getter } from "../../Blockchain/Getter"
import { BurnerAccount } from "@dojoengine/create-burner"
import { set } from "mobx"
import { GameAccount } from "../../Types/toriiTypes"

type AccountSelectProps = {
  account: BurnerAccount,
  setAccountSelected: React.Dispatch<React.SetStateAction<boolean>>
  setBlockchainAccount: React.Dispatch<React.SetStateAction<Account>>
  allAccountsDict: {[key: string]: GameAccount}
}

export default function AccountSelect({account, allAccountsDict, setAccountSelected, setBlockchainAccount}: AccountSelectProps) {
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [removePopup, setRemovePopup] = useState<boolean>(false);
  const [adrsToRemove, setAdrsToRemove] = useState<string>("");
  const [showClipboardMsg, setShowClipboardMsg] = useState<boolean>(false);

  // async function handleAccountWalletSelect(accountAdrs: string) {
  //   let acc = Burner.getAccountByAddress(accountAdrs)
  //   console.log(acc)
  //   if(acc){
  //     // let account = await Getter.getAccount(acc);
  //     setAccountWallet(acc);
  //   }
  // }

  // const accounts = Burner.getAllAccounts();


  const showRemovePopup = (address: string) => {
    setRemovePopup(true);
    setAdrsToRemove(address);
  }

  const handleClearBurner = (address: string) => {
    account.remove(address)
    setRemovePopup(false);
  }

  const showAndHideClipboardMsg = () => {
    setShowClipboardMsg(true);
    setTimeout(() => {
      setShowClipboardMsg(false);
    }, 2000);
  }
  
  const handleExportAccounts = (account: BurnerAccount) => {
    account.copyToClipboard();
    setClipboardStatus({
      message: "Accounts exported successfully!",
      isError: false,
    });
    showAndHideClipboardMsg();
  }

  const handleAccountSelected = (accountAdrs: string) => {
    account.select(accountAdrs);
    console.log("selected account adrs: ", accountAdrs)
    console.log("selected account: ", account.account.address)
    setBlockchainAccount(account.account);
    setAccountSelected(true);
  }
  
  const reactAccountList = account?.list().map((account, index) => {
    if(allAccountsDict[account.address]){  
      return(
        <div className="AccountSelectAccountContainer" key={index}>
          <div className="AccountSelectAccountUsername" onClick={() => handleAccountSelected(account.address)}>{allAccountsDict[account.address].username}</div>
          <div className="AccountSelectClearButton" onClick={() => showRemovePopup(account.address)}>X</div>
        </div>
      )
    }
  })

  const [clipboardStatus, setClipboardStatus] = useState({
    message: "",
    isError: false,
  });

  const handleRestoreBurners = async () => {
    try {
        await account?.applyFromClipboard();
        setClipboardStatus({
            message: "Burners restored successfully!",
            isError: false,
        });
    } catch (error) {
        setClipboardStatus({
            message: `Failed to restore burners from clipboard`,
            isError: true,
        });
    }
    showAndHideClipboardMsg();
};

useEffect(() => {
    if (clipboardStatus.message) {
        const timer = setTimeout(() => {
            setClipboardStatus({ message: "", isError: false });
        }, 3000);

        return () => clearTimeout(timer);
    }
}, [clipboardStatus.message]);

  return(
  <div className="AccountSelectAndRegisterContainer">
          {/* <button onClick={() => account?.create()}>
          {account?.isDeploying ? "deploying burner" : "create burner"}
      </button>
      {account && account?.list().length > 0 && (
          <button onClick={async () => await account?.copyToClipboard()}>
              Save Burners to Clipboard
          </button>
      )}
      <button onClick={handleRestoreBurners}>
          Restore Burners from Clipboard
      </button>
      {clipboardStatus.message && (
          <div className={clipboardStatus.isError ? "error" : "success"}>
              {clipboardStatus.message}
          </div>
      )}

      <div className="card">
        <div>{`burners deployed: ${account.count}`}</div>
        <div>
            select signer:{" "}
            <select
                value={account ? account.account.address : ""}
                onChange={(e) => account.select(e.target.value)}
            >
                {account?.list().map((account, index) => {
                    return (
                        <option value={account.address} key={index}>
                            {account.address}
                        </option>
                    );
                })}
            </select>
        </div>
        <div>
            <button onClick={() => account.clear()}>
                Clear burners
            </button>
            <p>
                You will need to Authorise the contracts before you can
                use a burner. See readme.
            </p>
        </div>
      </div> */}
      
    {!showRegister &&
      <div className="AccountSelectAndRegisterButtonContainer">
        <div className="AccountSelectTitle">Select Account</div>
        <div className="AccountSelectAccountList">
          {reactAccountList}
        </div>
        
        <div className="ClipboardButtonsContainer">
          <div className="AccountSelectRegisterButton" onClick={() => setShowRegister(true)}>Create new account</div>
          <div className="ClipboardExportButton" onClick={() => handleExportAccounts(account)}>Export Accounts to Clipboard</div>
          <div className="ClipboardExportButton" onClick={() => handleRestoreBurners()}>Import Accounts from Clipboard</div>
        </div>
        {showClipboardMsg &&
          <div className={clipboardStatus.isError ? "clipboardMsgError" : "clipboardMsgSuccess"}>
            {clipboardStatus.message}
          </div>
        }
      </div>
    }
    {removePopup &&
      <div className="AccountSelectRemovePopup">
        <div className="AccountSelectRemovePopupTitle">Are you sure you want to remove this account?</div>
        <div className="AccountSelectRemovePopupAddress">{adrsToRemove}</div>
        <div className="AccountSelectRemovePopupButtons">
          <div className="AccountSelectRemovePopupButton" onClick={() => handleClearBurner(adrsToRemove)}>Yes</div>
          <div className="AccountSelectRemovePopupButton" onClick={() => setRemovePopup(false)}>No</div>
        </div>
      </div>
    }
    {showRegister && !removePopup && <Register account={account} setAccountSelected={setAccountSelected} setBlockchainAccount={setBlockchainAccount} />}
  </div>
  )
}
