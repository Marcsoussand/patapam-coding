import { useTranslation } from 'react-i18next'
import { useGame } from '../context/GameContext'
import { TUTORIAL_LEVELS, ACTIONS } from '../data/levels'

export default function ActionPanel() {
  const { state, dispatch } = useGame()
  const { t } = useTranslation()
  const level = TUTORIAL_LEVELS[state.currentLevelIndex]
  const isRunning = state.status === 'running'

  function handleDragStart(e: React.DragEvent, actionId: string) {
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'panel', actionId }))
  }

  function handleClick(actionId: string) {
    if (isRunning) return
    dispatch({ type: 'ADD_ACTION', actionId: actionId as never })
  }

  return (
    <div className="action-panel">
      <h3>{t('game.available_actions')}</h3>
      <div className="action-list">
        {level.availableActions.map(actionId => {
          const action = ACTIONS[actionId]
          return (
            <div
              key={actionId}
              className={`action-card ${isRunning ? 'action-card--disabled' : ''}`}
              draggable={!isRunning}
              onDragStart={e => handleDragStart(e, actionId)}
              onClick={() => handleClick(actionId)}
              title={`${t('actions.' + actionId)} — clic ou glisser`}
            >
              <span className={`action-icon${action.iconBg ? ' action-icon--blue' : ''}`}>
                {action.icon}
              </span>
              <span className="action-label">{t('actions.' + actionId)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
