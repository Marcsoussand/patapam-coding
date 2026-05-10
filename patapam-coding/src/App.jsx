import { useEffect } from 'react'
import { GameProvider, useGame } from './context/GameContext'
import { TUTORIAL_LEVELS } from './data/levels'
import Grid from './components/Grid'
import ActionPanel from './components/ActionPanel'
import Sequencer from './components/Sequencer'
import './App.css'

function GameScreen() {
  const { state, dispatch } = useGame()
  const { status, executionIndex, currentLevelIndex } = state
  const level = TUTORIAL_LEVELS[currentLevelIndex]

  // Boucle d'animation : déclenche un STEP toutes les 600 ms quand le jeu tourne
  useEffect(() => {
    if (status !== 'running') return
    const timer = setTimeout(() => {
      dispatch({ type: 'STEP' })
    }, 600)
    return () => clearTimeout(timer)
  }, [status, executionIndex, dispatch])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌿 Mollasson apprend à coder</h1>
        <div className="level-info">Tutoriel — Niveau {currentLevelIndex + 1} : {level.title}</div>
        <p className="level-desc">{level.description}</p>
      </header>

      <main className="game-layout">
        <Grid />
        <aside className="side-panel">
          <ActionPanel />
          <Sequencer />
        </aside>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <GameScreen />
    </GameProvider>
  )
}
