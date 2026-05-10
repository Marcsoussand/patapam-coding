import { useGame } from '../context/GameContext'
import { TUTORIAL_LEVELS, ACTIONS } from '../data/levels'

export default function ActionPanel() {
  const { state, dispatch } = useGame()
  const level = TUTORIAL_LEVELS[state.currentLevelIndex]
  const isRunning = state.status === 'running'

  function handleDragStart(e, actionId) {
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'panel', actionId }))
  }

  function handleClick(actionId) {
    if (isRunning) return
    dispatch({ type: 'ADD_ACTION', actionId })
  }

  return (
    <div className="action-panel">
      <h3>Actions disponibles</h3>
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
              title="Clic pour ajouter · Glisser pour placer"
            >
              <span className={`action-icon${action.iconBg ? ' action-icon--blue' : ''}`}>{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
