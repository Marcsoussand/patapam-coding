import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/"     element={<HomePage />} />
        <Route path="/play" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  )
}
