import "./Register.css"
import { useState } from "react"
import { useSystemCalls } from "../../dojo/useSystemCalls";

const regex = /[^a-zA-Z0-9]/g;

export default function Register() {
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { createAccount } = useSystemCalls();

  function handleInputChange(event: any) {
    if(event.target.value.length > 27) return;
    setUsername(event.target.value.replace(regex, ''))
  }

  async function handleRegister(username: string) {
    setErrorMessage('');
    setIsRegistering(true);
    let res = await createAccount(username)
    if(res.success) {
      console.log("Account created successfully")
    } else {
      setErrorMessage(res.error)
    }
    setIsRegistering(false);
  }

  return(
    <div className="RegisterContainer">
      <div className="RegisterInputTitle">Username</div>
      <input className="RegisterInput" onChange={handleInputChange} value={username}/>
      {!isRegistering &&
        <div className="RegisterButton" onClick={() => handleRegister(username)}>Register</div>
      }
      {isRegistering &&
        <div className="RegisterButton">Registering ...</div>
      }
      {errorMessage &&
        <div className="ErrorMessage">{errorMessage}</div>
      }
    </div>
  )
}
