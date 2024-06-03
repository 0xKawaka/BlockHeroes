import './App.css'
import Home from './Pages/Home'
import { HashRouter as Router, Route, Link, Routes } from 'react-router-dom'
import GamePage from './Pages/GamePage'

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
    </Router>
  )
}

export default App