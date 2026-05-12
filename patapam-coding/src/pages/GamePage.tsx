import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { GameProvider, useGame } from '../context/GameContext'
import { TUTORIAL_LEVELS } from '../data/levels'
import Grid from '../components/Grid'
import ActionPanel from '../components/ActionPanel'
import Sequencer from '../components/Sequencer'

function GameScreen() {
  const { state, dispatch } = useGame()
  const { status, executionIndex, currentLevelIndex } = state
  const { t } = useTranslation()
  const level = TUTORIAL_LEVELS[currentLevelIndex]

  useEffect(() => {
    if (status !== 'running') return
    const timer = setTimeout(() => dispatch({ type: 'STEP' }), 600)
    return () => clearTimeout(timer)
  }, [status, executionIndex, dispatch])

  return (
    <div className="app">
      <main className="game-layout">
        <div className="game-header">
          <h2>{t('game.tutorial_label')} — {t('game.level')} {currentLevelIndex + 1} : {level.title}</h2>
          <p className="level-desc">{level.description}</p>
        </div>
        <Grid />
        <aside className="side-panel">
          <ActionPanel />
          <Sequencer />
        </aside>
      </main>
    </div>
  )
}

export default function GamePage() {
  return (
    <GameProvider>
      <GameScreen />
    </GameProvider>
  )
}
