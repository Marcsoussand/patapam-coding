import { useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../context/GameContext'
import { ACTIONS } from '../data/levels'
import ActionIcon from './ActionIcon'
import type { ActionId } from '../types/game'

interface DragData {
  source: 'panel' | 'sequencer'
  actionId?: ActionId
  index?: number
}

export default function Sequencer() {
  const { state, dispatch, currentLevel } = useGame()
  const { t } = useTranslation()
  const { sequence, status, executionIndex, failedStep } = state
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

  const isLastLevel = false // handled in GamePage success modal

  // ── Mode slots fixes (Dauphinou side-scroll) ──────────────────────
  const isPrefill = !!currentLevel.prefillSequence && !!state.displaySlots
  if (isPrefill) {
    const displaySlots = state.displaySlots!
    const prefillSeq   = currentLevel.prefillSequence!
    // Map executionIndex (counts non-null slots executed) to a slot index
    const activeSlotIdx = status === 'running'
      ? (() => { let c = 0; for (let i = 0; i < displaySlots.length; i++) { if (displaySlots[i] !== null) { if (c === executionIndex) return i; c++ } } return -1 })()
      : -1

    return (
      <div className="sequencer">
        <div className="seq-header">
          <span className="seq-title">{t('game.your_sequence')}</span>
          <span className="seq-count">{sequence.length} / {currentLevel.maxActions}</span>
          {!isRunning && displaySlots.some((s, i) => s !== null && prefillSeq[i] === null) && (
            <button
              className="clear-btn"
              onClick={() => dispatch({ type: 'CLEAR_SEQUENCE' })}
              title={t('game.clear_sequence')}
            >🗑</button>
          )}
        </div>
        <div className="sequence-strip sequence-strip--fixed">
          {displaySlots.map((slotAction, idx) => {
            const isLocked  = prefillSeq[idx] !== null
            const isEmpty   = slotAction === null
            const isActive  = idx === activeSlotIdx
            const isDone    = isActive ? false : (() => { let c = 0; for (let i = 0; i < idx; i++) { if (displaySlots[i] !== null) c++ } return c < executionIndex && ['running','success','failure'].includes(status) })()
            const isFailed  = status === 'failure' && idx === activeSlotIdx

            if (isEmpty) {
              return (
                <div
                  key={idx}
                  className={`seq-slot seq-slot--empty ${dropOverIdx === idx ? 'seq-slot--dragover' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDropOverIdx(idx) }}
                  onDragLeave={() => setDropOverIdx(null)}
                  onDrop={e => {
                    e.preventDefault(); setDropOverIdx(null)
                    const data: DragData = JSON.parse(e.dataTransfer.getData('text/plain'))
                    if (data.source === 'panel' && data.actionId) {
                      dispatch({ type: 'ADD_ACTION', actionId: data.actionId, index: idx })
                    } else if (data.source === 'sequencer' && data.index !== undefined) {
                      // Move from a user slot to this empty slot
                      const fromIdx = data.index
                      if (fromIdx !== idx) {
                        const moved = displaySlots[fromIdx]
                        if (moved !== null && prefillSeq[fromIdx] === null) {
                          dispatch({ type: 'REMOVE_ACTION', index: fromIdx })
                          dispatch({ type: 'ADD_ACTION', actionId: moved, index: idx })
                        }
                      }
                    }
                  }}
                >
                  <span className="seq-slot-placeholder">?</span>
                </div>
              )
            }

            const action = ACTIONS[slotAction!]
            return (
              <div
                key={idx}
                className={[
                  'seq-slot',
                  isLocked  ? 'seq-slot--locked' : 'seq-slot--user',
                  isActive  ? 'seq-active' : '',
                  isDone    ? 'seq-done' : '',
                  isFailed  ? 'seq-failed' : '',
                ].filter(Boolean).join(' ')}
                title={t('actions.' + slotAction)}
                draggable={!isLocked && !isRunning}
                onDragStart={e => {
                  if (isLocked) return
                  e.dataTransfer.effectAllowed = 'move'
                  e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'sequencer', index: idx }))
                }}
              >
                <span className="seq-item-icon"><ActionIcon actionId={slotAction!} /></span>
                {!isLocked && !isRunning && (
                  <button
                    className="remove-btn-slot"
                    onClick={e => { e.stopPropagation(); dispatch({ type: 'REMOVE_ACTION', index: idx }) }}
                    title="Enlever"
                  >✕</button>
                )}
              </div>
            )
          })}
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
          {(status === 'success' || status === 'failure') && (
            <button className="btn-reset" onClick={() => dispatch({ type: 'RESET' })}>{t('game.replay')}</button>
          )}
        </div>
      </div>
    )
  }

  // ── Mode libre (Mollasson / Tartuffe) ─────────────────────────────
  return (
    <div className="sequencer">
      <div className="seq-header">
        <span className="seq-title">{t('game.your_sequence')}</span>
        <span className="seq-count">{sequence.length} / {currentLevel.maxActions}</span>
        {sequence.length > 0 && !isRunning && (
          <button
            className="clear-btn"
            onClick={() => dispatch({ type: 'CLEAR_SEQUENCE' })}
            title={t('game.clear_sequence')}
          >
            🗑
          </button>
        )}
      </div>

      <div
        className="sequence-strip"
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
            <Fragment key={idx}>
              <div
                className={`drop-zone-h ${dropOverIdx === idx ? 'drop-zone-h--active' : ''}`}
                onDragOver={e => handleDropZoneDragOver(e, idx)}
                onDragLeave={handleDropZoneDragLeave}
                onDrop={e => handleDropZoneDrop(e, idx)}
              />
              <div
                className={['seq-item', isActive ? 'seq-active' : '', isDone ? 'seq-done' : '', isFailed ? 'seq-failed' : ''].filter(Boolean).join(' ')}
                draggable={!isRunning}
                onDragStart={e => handleItemDragStart(e, idx)}
                title={t('actions.' + actionId)}
              >
                <span className="seq-item-icon">{action.icon}</span>
                {!isRunning && (
                  <button className="remove-btn-sm" onClick={() => dispatch({ type: 'REMOVE_ACTION', index: idx })}>×</button>
                )}
              </div>
            </Fragment>
          )
        })}

        <div
          className={`drop-zone-h ${dropOverIdx === sequence.length ? 'drop-zone-h--active' : ''}`}
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
          <button className="btn-reset" onClick={() => dispatch({ type: 'RESET' })}>{t('game.replay')}</button>
        )}
        {status === 'failure' && (
          <>
            <div className="status-msg status-failure">{t('game.failure')}</div>
            <button className="btn-reset" onClick={() => dispatch({ type: 'RESET' })}>↺ {t('game.retry')}</button>
          </>
        )}
      </div>
    </div>
  )
}
