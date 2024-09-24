import { Link } from "react-router-dom";
import './Home.css'
import discord from '../assets/icons/discord.png'
import x from '../assets/icons/x.png'

type HomeProps = {
}


function Home({}: HomeProps) {
  return (
    <div className="HomeContainerAndNavbar">
      <div className="HomeNavbar">
        <div className="HomeNavbarOutline">
          <a className='HomeNavbarLink' target="_blank" rel="noopener noreferrer" href='https://discord.com/invite/awySSQYJdB'>
            <img className="HomeNavbarLinkImage" src={discord} alt="discord" />
          </a>
          <a className='HomeNavbarLink' target="_blank" rel="noopener noreferrer" href='https://x.com/Block__Heroes'>
            <img className="HomeNavbarLinkImage" src={x} alt="x" />
          </a>
        </div>
      </div>
      <div className="HomeContainer">
        <div className="disclaimerAndPlayContainer">
          {/* <div className="disclaimerHome">
            We're working on an update. Stay tuned !
          </div> */}

          <Link className="GameButton" to={{pathname: '/game'}}>
            Start Playing
          </Link>
          </div>
        </div>
    </div>
  )
}

export default Home



