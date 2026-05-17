import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { GameProvider, useGame } from '../context/GameContext'
import { HERO_LEVELS } from '../data/levels'
import type { HeroId, CellType } from '../types/game'
import Grid from '../components/Grid'
import ActionPanel from '../components/ActionPanel'
import Sequencer from '../components/Sequencer'

const KEY_CELL_COLOR: Partial<Record<CellType, string>> = {
  key_red: 'red',
  key_yellow: 'yellow',
}

const KEY_ICONS: Record<string, string> = { red: '🔑', yellow: '🗝️' }

function GameScreen() {
  const { state, dispatch, currentLevel, isLastLevel } = useGame()
  const { status, executionIndex, currentLevelIndex, collectedKeys } = state
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { grid, hero } = currentLevel

  const levels = HERO_LEVELS[hero]

  // Resolve i18n key safely — return null if the key is missing/untranslated
  function resolveKey(key: string): string | null {
    const result = i18n.exists(key) ? t(key) : null
    return result === key ? null : result
  }

  const levelTitle = resolveKey(currentLevel.title)
  const levelDesc  = resolveKey(currentLevel.description)

  const keyTypes = [...new Set(
    grid.flat()
      .map(cell => KEY_CELL_COLOR[cell])
      .filter((c): c is string => c !== undefined)
  )]
  const hasKeyLevel = keyTypes.length > 0

  // (unlock progressif supprimé — tous les héros sont accessibles dès le départ)

  useEffect(() => {
    if (status !== 'running') return
    const timer = setTimeout(() => dispatch({ type: 'STEP' }), 600)
    return () => clearTimeout(timer)
  }, [status, executionIndex, dispatch])

  useEffect(() => {
    const ARROW_MAP: Record<string, string> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (status === 'idle' && state.sequence.length > 0) {
          e.preventDefault()
          dispatch({ type: 'RUN' })
        }
        return
      }
      const actionId = ARROW_MAP[e.key]
      if (!actionId) return
      if (!currentLevel.availableActions.includes(actionId as never)) return
      if (status === 'running') return
      e.preventDefault()
      dispatch({ type: 'ADD_ACTION', actionId: actionId as never })
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [status, state.sequence, currentLevel.availableActions, dispatch])

  return (
    <div className="app">
      <main className="game-layout">
        <div className="game-header">
          {/* ── Barre de progression des niveaux ── */}
          <div className="level-progress-bar">
            {levels.map((_, idx) => {
              const isActive  = idx === currentLevelIndex
              const isPast    = idx < currentLevelIndex
              const isLocked  = idx > currentLevelIndex
              return (
                <div key={idx} className="level-progress-item">
                  <button
                    className={`level-bubble ${isActive ? 'level-bubble--active' : ''} ${isPast ? 'level-bubble--past' : ''} ${isLocked ? 'level-bubble--locked' : ''}`}
                    onClick={() => { if (!isLocked) dispatch({ type: 'GO_TO_LEVEL', index: idx }) }}
                    disabled={isLocked}
                    aria-label={`${t('game.level')} ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                  {idx < levels.length - 1 && (
                    <span className={`level-arrow ${isPast ? 'level-arrow--past' : ''}`}>›</span>
                  )}
                </div>
              )
            })}
          </div>
          {/* ── Titre + description ── */}
          <h2>
            {t('game.level')} {currentLevelIndex + 1}
            {levelTitle && <> : {levelTitle}</>}
          </h2>
          {levelDesc && <p className="level-desc">{levelDesc}</p>}
        </div>
        <div className="game-body">
          <div className="game-center">
            <Grid />
          </div>
          <aside className="side-panel">
            <ActionPanel />
            {hasKeyLevel && (
              <div className="inventory">
                <span className="inventory-label">🎒</span>
                {keyTypes.map(color => (
                  <span
                    key={color}
                    className={`inventory-key ${collectedKeys.includes(color) ? 'inventory-key--collected' : 'inventory-key--missing'}`}
                    title={color}
                  >
                    {KEY_ICONS[color] ?? '🗝️'}
                  </span>
                ))}
              </div>
            )}
          </aside>
        </div>
        <div className="sequencer-row">
          <Sequencer />
        </div>
      </main>

      {status === 'success' && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-emoji">🎉</div>
            <div className="success-title">{t('game.success', { heroName: hero.charAt(0).toUpperCase() + hero.slice(1) })}</div>
            {!isLastLevel ? (
              <>
                <button className="btn-next btn-next--big" onClick={() => dispatch({ type: 'NEXT_LEVEL' })}>
                  {t('game.next_level')}
                </button>
                <button className="btn-reset btn-reset--sm" onClick={() => dispatch({ type: 'RESET' })}>
                  {t('game.replay')}
                </button>
              </>
            ) : (
              <>
                <div className="success-complete">{t('game.tutorial_complete')}</div>
                {hero === 'mollasson' && (
                  <>
                    <p className="success-unlock-msg">{t('game.mollasson_done')}</p>
                    <button className="btn-next btn-next--big" onClick={() => navigate('/play/tartuffe')}>
                      {t('game.play_tartuffe')}
                    </button>
                  </>
                )}
                <button className="btn-reset btn-reset--sm" onClick={() => dispatch({ type: 'RESET' })}>
                  {t('game.replay')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function GamePage() {
  const { hero = 'mollasson' } = useParams<{ hero?: string }>()
  return (
    <GameProvider hero={hero as HeroId}>
      <GameScreen />
    </GameProvider>
  )
}

