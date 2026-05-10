import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { TUTORIAL_LEVELS, ACTIONS } from '../data/levels'

export default function Sequencer() {
  const { state, dispatch } = useGame()
  const { sequence, status, executionIndex, failedStep, currentLevelIndex } = state
  const level = TUTORIAL_LEVELS[currentLevelIndex]
  const isRunning = status === 'running'

  // Index de la drop-zone active (pour le surlignage)
  const [dropOverIdx, setDropOverIdx] = useState(null)

  // ── Drag depuis la séquence (réorganisation) ──────────────────────────────
  function handleItemDragStart(e, index) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'sequencer', index }))
  }

  // ── Drop zone entre les items (insertion à position précise) ──────────────
  function handleDropZoneDragOver(e, idx) {
    e.preventDefault()
    e.stopPropagation()
    setDropOverIdx(idx)
  }

  function handleDropZoneDragLeave() {
    setDropOverIdx(null)
  }

  function handleDropZoneDrop(e, insertAt) {
    e.preventDefault()
    e.stopPropagation()
    setDropOverIdx(null)
    const data = JSON.parse(e.dataTransfer.getData('text/plain'))
    if (data.source === 'panel') {
      dispatch({ type: 'ADD_ACTION', actionId: data.actionId, index: insertAt })
    } else if (data.source === 'sequencer') {
      dispatch({ type: 'MOVE_ACTION', fromIndex: data.index, toIndex: insertAt })
    }
  }

  // ── Drop sur le conteneur (ajout en fin de liste) ─────────────────────────
  function handleContainerDragOver(e) {
    e.preventDefault()
    setDropOverIdx(sequence.length)
  }

  function handleContainerDragLeave(e) {
    // Ne reset que si on quitte vraiment le conteneur
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropOverIdx(null)
    }
  }

  function handleContainerDrop(e) {
    e.preventDefault()
    setDropOverIdx(null)
    const data = JSON.parse(e.dataTransfer.getData('text/plain'))
    if (data.source === 'panel') {
      dispatch({ type: 'ADD_ACTION', actionId: data.actionId })
    } else if (data.source === 'sequencer') {
      dispatch({ type: 'MOVE_ACTION', fromIndex: data.index, toIndex: sequence.length })
    }
  }

  // ── Contrôles ─────────────────────────────────────────────────────────────
  function handleRun()       { dispatch({ type: 'RUN' }) }
  function handleReset()     { dispatch({ type: 'RESET' }) }
  function handleNextLevel() { dispatch({ type: 'NEXT_LEVEL' }) }
  function handleRemove(i)   { dispatch({ type: 'REMOVE_ACTION', index: i }) }

  const isLastLevel = currentLevelIndex >= TUTORIAL_LEVELS.length - 1

  return (
    <div className="sequencer">
      <h3>
        Ta séquence
        <span className="seq-count">{sequence.length} / {level.maxActions}</span>
        {sequence.length > 0 && !isRunning && (
          <button
            className="clear-btn"
            onClick={() => dispatch({ type: 'CLEAR_SEQUENCE' })}
            title="Tout effacer"
          >
            🗑
          </button>
        )}
      </h3>

      <div
        className="sequence-zone"
        onDragOver={handleContainerDragOver}
        onDragLeave={handleContainerDragLeave}
        onDrop={handleContainerDrop}
      >
        {sequence.length === 0 && (
          <div className="sequence-empty">Glisse tes actions ici !</div>
        )}

        {sequence.map((actionId, idx) => {
          const action    = ACTIONS[actionId]
          const isActive  = status === 'running' && idx === executionIndex
          const isDone    = idx < executionIndex && (status === 'running' || status === 'success' || status === 'failure')
          const isFailed  = status === 'failure' && idx === failedStep

          return (
            <div key={idx}>
              {/* Drop zone AVANT chaque item */}
              <div
                className={`drop-zone ${dropOverIdx === idx ? 'drop-zone--active' : ''}`}
                onDragOver={e => handleDropZoneDragOver(e, idx)}
                onDragLeave={handleDropZoneDragLeave}
                onDrop={e => handleDropZoneDrop(e, idx)}
              />

              <div
                className={[
                  'sequence-item',
                  isActive ? 'seq-active'  : '',
                  isDone  ? 'seq-done'    : '',
                  isFailed? 'seq-failed'  : '',
                ].filter(Boolean).join(' ')}
                draggable={!isRunning}
                onDragStart={e => handleItemDragStart(e, idx)}
              >
                <span className={`action-icon${action.iconBg ? ' action-icon--blue' : ''}`}>{action.icon}</span>
                <span className="action-label">{action.label}</span>
                {!isRunning && (
                  <button className="remove-btn" onClick={() => handleRemove(idx)}>×</button>
                )}
              </div>
            </div>
          )
        })}

        {/* Drop zone finale (après le dernier item) */}
        <div
          className={`drop-zone ${dropOverIdx === sequence.length ? 'drop-zone--active' : ''}`}
          onDragOver={e => handleDropZoneDragOver(e, sequence.length)}
          onDragLeave={handleDropZoneDragLeave}
          onDrop={e => handleDropZoneDrop(e, sequence.length)}
        />
      </div>

      {/* Boutons de contrôle */}
      <div className="sequencer-controls">
        {status === 'idle' && (
          <button className="btn-run" onClick={handleRun} disabled={sequence.length === 0}>
            ▶ Lancer !
          </button>
        )}

        {status === 'running' && (
          <button className="btn-reset" onClick={handleReset}>⏹ Arrêter</button>
        )}

        {status === 'success' && (
          <>
            <div className="status-msg status-success">🎉 Bravo Mollasson !</div>
            {!isLastLevel && (
              <button className="btn-next" onClick={handleNextLevel}>Niveau suivant →</button>
            )}
            {isLastLevel && (
              <div className="status-msg" style={{ color: '#ffd700' }}>🏆 Tutoriel terminé !</div>
            )}
            <button className="btn-reset" onClick={handleReset}>Rejouer</button>
          </>
        )}

        {status === 'failure' && (
          <>
            <div className="status-msg status-failure">💥 Raté ! Réessaie !</div>
            <button className="btn-reset" onClick={handleReset}>Réessayer</button>
          </>
        )}
      </div>
    </div>
  )
}
