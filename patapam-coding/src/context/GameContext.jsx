import { createContext, useContext, useReducer } from 'react'
import { TUTORIAL_LEVELS } from '../data/levels'
import { executeStep, isEndCell } from '../engine/gameEngine'

const GameContext = createContext(null)

function initState(levelIndex) {
  const level = TUTORIAL_LEVELS[levelIndex]
  return {
    currentLevelIndex: levelIndex,
    sequence: [],
    heroPos: { ...level.heroStart },
    status: 'idle',      // 'idle' | 'running' | 'success' | 'failure'
    executionIndex: 0,
    failedStep: -1,
  }
}

function reducer(state, action) {
  const level = TUTORIAL_LEVELS[state.currentLevelIndex]

  switch (action.type) {

    case 'ADD_ACTION': {
      if (state.sequence.length >= level.maxActions) return state
      const newSeq = [...state.sequence]
      if (action.index !== undefined) {
        newSeq.splice(action.index, 0, action.actionId)
      } else {
        newSeq.push(action.actionId)
      }
      return { ...state, sequence: newSeq }
    }

    case 'REMOVE_ACTION': {
      return {
        ...state,
        sequence: state.sequence.filter((_, i) => i !== action.index),
      }
    }

    case 'MOVE_ACTION': {
      const { fromIndex, toIndex } = action
      if (fromIndex === toIndex) return state
      const newSeq = [...state.sequence]
      const [moved] = newSeq.splice(fromIndex, 1)
      // Ajustement de l'index cible après suppression
      const adjustedTo = fromIndex < toIndex ? toIndex - 1 : toIndex
      newSeq.splice(adjustedTo, 0, moved)
      return { ...state, sequence: newSeq }
    }

    case 'RUN': {
      if (state.sequence.length === 0) return state
      return {
        ...state,
        status: 'running',
        executionIndex: 0,
        heroPos: { ...level.heroStart },
        failedStep: -1,
      }
    }

    case 'STEP': {
      const { executionIndex, sequence, heroPos } = state

      // Plus d'actions mais héros pas arrivé → échec
      if (executionIndex >= sequence.length) {
        return { ...state, status: 'failure' }
      }

      const actionId = sequence[executionIndex]
      const result = executeStep(heroPos, actionId, level.grid)

      if (!result.valid) {
        return { ...state, heroPos: result.heroPos, status: 'failure', failedStep: executionIndex }
      }

      const newPos = result.heroPos
      const nextIndex = executionIndex + 1

      if (isEndCell(newPos.row, newPos.col, level.grid)) {
        return { ...state, heroPos: newPos, executionIndex: nextIndex, status: 'success' }
      }

      if (nextIndex >= sequence.length) {
        return { ...state, heroPos: newPos, executionIndex: nextIndex, status: 'failure' }
      }

      return { ...state, heroPos: newPos, executionIndex: nextIndex, status: 'running' }
    }

    case 'CLEAR_SEQUENCE': {
      return { ...state, sequence: [] }
    }

    case 'RESET': {
      return {
        ...state,
        heroPos: { ...level.heroStart },
        status: 'idle',
        executionIndex: 0,
        failedStep: -1,
      }
    }

    case 'NEXT_LEVEL': {
      const nextIndex = state.currentLevelIndex + 1
      if (nextIndex >= TUTORIAL_LEVELS.length) return state
      return initState(nextIndex)
    }

    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, 0, initState)
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}
