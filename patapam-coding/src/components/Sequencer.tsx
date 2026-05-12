import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../context/GameContext'
import { TUTORIAL_LEVELS, ACTIONS } from '../data/levels'
import type { ActionId } from '../types/game'

interface DragData {
  source: 'panel' | 'sequencer'
  actionId?: ActionId
  index?: number
}

export default function Sequencer() {
  const { state, dispatch } = useGame()
  const { t } = useTranslation()
  const { sequence, status, executionIndex, failedStep, currentLevelIndex } = state
  const level = TUTORIAL_LEVELS[currentLevelIndex]
  const isRunning = status === 'running'
  const [dropOverIdx, setDropOverIdx] = useState<number | null>(null)

  function handleItemDragStart(e: React.DragEvent, index: number) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'sequencer', index }))
  }

  function handleDropZoneDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    e.stopPropagation()
    setDropOverIdx(idx)
  }

  function handleDropZoneDragLeave() {
    setDropOverIdx(null)
  }

  function handleDropZoneDrop(e: React.DragEvent, insertAt: number) {
    e.preventDefault()
    e.stopPropagation()
    setDropOverIdx(null)
    const data: DragData = JSON.parse(e.dataTransfer.getData('text/plain'))
    if (data.source === 'panel' && data.actionId) {
      dispatch({ type: 'ADD_ACTION', actionId: data.actionId, index: insertAt })
    } else if (data.source === 'sequencer' && data.index !== undefined) {
      dispatch({ type: 'MOVE_ACTION', fromIndex: data.index, toIndex: insertAt })
    }
  }

  function handleContainerDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDropOverIdx(sequence.length)
  }

  function handleContainerDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropOverIdx(null)
    }
  }

  function handleContainerDrop(e: React.DragEvent) {
    e.preventDefault()
    setDropOverIdx(null)
    const data: DragData = JSON.parse(e.dataTransfer.getData('text/plain'))
    if (data.source === 'panel' && data.actionId) {
      dispatch({ type: 'ADD_ACTION', actionId: data.actionId })
    } else if (data.source === 'sequencer' && data.index !== undefined) {
      dispatch({ type: 'MOVE_ACTION', fromIndex: data.index, toIndex: sequence.length })
    }
  }

  const isLastLevel = currentLevelIndex >= TUTORIAL_LEVELS.length - 1

  return (
    <div className="sequencer">
      <h3>
        {t('game.your_sequence')}
        <span className="seq-count">{sequence.length} / {level.maxActions}</span>
        {sequence.length > 0 && !isRunning && (
          <button
            className="clear-btn"
            onClick={() => dispatch({ type: 'CLEAR_SEQUENCE' })}
            title={t('game.clear_sequence')}
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
          <div className="sequence-empty">{t('game.drop_here')}</div>
        )}

        {sequence.map((actionId, idx) => {
          const action   = ACTIONS[actionId]
          const isActive = status === 'running' && idx === executionIndex
          const isDone   = idx < executionIndex && ['running', 'success', 'failure'].includes(status)
          const isFailed = status === 'failure' && idx === failedStep

          return (
            <div key={idx}>
              <div
                className={`drop-zone ${dropOverIdx === idx ? 'drop-zone--active' : ''}`}
                onDragOver={e => handleDropZoneDragOver(e, idx)}
                onDragLeave={handleDropZoneDragLeave}
                onDrop={e => handleDropZoneDrop(e, idx)}
              />
              <div
                className={['sequence-item', isActive ? 'seq-active' : '', isDone ? 'seq-done' : '', isFailed ? 'seq-failed' : ''].filter(Boolean).join(' ')}
                draggable={!isRunning}
                onDragStart={e => handleItemDragStart(e, idx)}
              >
                <span className={`action-icon${action.iconBg ? ' action-icon--blue' : ''}`}>{action.icon}</span>
                <span className="action-label">{t('actions.' + actionId)}</span>
                {!isRunning && (
                  <button className="remove-btn" onClick={() => dispatch({ type: 'REMOVE_ACTION', index: idx })}>×</button>
                )}
              </div>
            </div>
          )
        })}

        <div
          className={`drop-zone ${dropOverIdx === sequence.length ? 'drop-zone--active' : ''}`}
          onDragOver={e => handleDropZoneDragOver(e, sequence.length)}
          onDragLeave={handleDropZoneDragLeave}
          onDrop={e => handleDropZoneDrop(e, sequence.length)}
        />
      </div>

      <div className="sequencer-controls">
        {status === 'idle' && (
          <button className="btn-run" onClick={() => dispatch({ type: 'RUN' })} disabled={sequence.length === 0}>
            {t('game.run')}
          </button>
        )}
        {status === 'running' && (
          <button className="btn-reset" onClick={() => dispatch({ type: 'RESET' })}>{t('game.stop')}</button>
        )}
        {status === 'success' && (
          <>
            <div className="status-msg status-success">{t('game.success')}</div>
            {!isLastLevel
              ? <button className="btn-next" onClick={() => dispatch({ type: 'NEXT_LEVEL' })}>{t('game.next_level')}</button>
              : <div className="status-msg" style={{ color: '#ffd700' }}>{t('game.tutorial_complete')}</div>
            }
            <button className="btn-reset" onClick={() => dispatch({ type: 'RESET' })}>{t('game.replay')}</button>
          </>
        )}
        {status === 'failure' && (
          <>
            <div className="status-msg status-failure">{t('game.failure')}</div>
            <button className="btn-reset" onClick={() => dispatch({ type: 'RESET' })}>{t('game.retry')}</button>
          </>
        )}
      </div>
    </div>
  )
}
