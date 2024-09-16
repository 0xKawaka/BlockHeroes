import { Link } from "react-router-dom";
import './Home.css'

type HomeProps = {
}


function Home({}: HomeProps) {
  return (
    <div className="HomeContainerAndNavbar">
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



