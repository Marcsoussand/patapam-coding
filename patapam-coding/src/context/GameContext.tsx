import { createContext, useContext, useReducer, useRef, useMemo, type ReactNode } from 'react'
import { HERO_LEVELS } from '../data/levels'
import { executeStep, isEndCell } from '../engine/gameEngine'
import type { GameState, GameAction, Level, HeroId } from '../types/game'

interface GameContextValue {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  currentLevel: Level
  isLastLevel: boolean
}

const GameContext = createContext<GameContextValue | null>(null)

function initState(levelIndex: number, levels: Level[]): GameState {
  const level = levels[levelIndex]
  const displaySlots = level.prefillSequence ? [...level.prefillSequence] : undefined
  const sequence = displaySlots
    ? displaySlots.filter((a): a is import('../types/game').ActionId => a !== null)
    : []
  return {
    currentLevelIndex: levelIndex,
    sequence,
    heroPos: { ...level.heroStart },
    status: 'idle',
    executionIndex: 0,
    failedStep: -1,
    collectedKeys: [],
    displaySlots,
  }
}

function reducer(state: GameState, action: GameAction, levels: Level[]): GameState {
  const level = levels[state.currentLevelIndex]

  switch (action.type) {

    case 'ADD_ACTION': {
      if (state.displaySlots && level.prefillSequence) {
        // Fixed-slot mode: place at provided index or first empty editable slot
        const targetIdx = action.index !== undefined
          ? action.index
          : state.displaySlots.findIndex((slot, i) => slot === null && level.prefillSequence![i] === null)
        if (targetIdx < 0 || targetIdx >= state.displaySlots.length) return state
        if (state.displaySlots[targetIdx] !== null) return state  // already filled
        if (level.prefillSequence[targetIdx] !== null) return state  // locked
        const newSlots = [...state.displaySlots]
        newSlots[targetIdx] = action.actionId
        return {
          ...state,
          displaySlots: newSlots,
          sequence: newSlots.filter((a): a is GameState['sequence'][0] => a !== null),
        }
      }
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
      if (state.displaySlots && level.prefillSequence) {
        const idx = action.index
        if (idx < 0 || idx >= state.displaySlots.length) return state
        if (level.prefillSequence[idx] !== null) return state  // locked slot
        const newSlots = [...state.displaySlots]
        newSlots[idx] = null
        return {
          ...state,
          displaySlots: newSlots,
          sequence: newSlots.filter((a): a is GameState['sequence'][0] => a !== null),
        }
      }
      return { ...state, sequence: state.sequence.filter((_, i) => i !== action.index) }
    }

    case 'MOVE_ACTION': {
      if (state.displaySlots) return state  // no reordering in fixed-slot mode
      const { fromIndex, toIndex } = action
      if (fromIndex === toIndex) return state
      const newSeq = [...state.sequence]
      const [moved] = newSeq.splice(fromIndex, 1)
      const adjustedTo = fromIndex < toIndex ? toIndex - 1 : toIndex
      newSeq.splice(adjustedTo, 0, moved)
      return { ...state, sequence: newSeq }
    }

    case 'CLEAR_SEQUENCE': {
      if (state.displaySlots && level.prefillSequence) {
        // Reset only the editable (non-locked) slots
        const newSlots = state.displaySlots.map((slot, i) =>
          level.prefillSequence![i] !== null ? slot : null
        )
        return {
          ...state,
          displaySlots: newSlots,
          sequence: newSlots.filter((a): a is GameState['sequence'][0] => a !== null),
        }
      }
      return { ...state, sequence: [] }
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
      if (executionIndex >= sequence.length) return { ...state, status: 'failure' }

      const actionId = sequence[executionIndex]
      const result = executeStep(heroPos, actionId, level.grid, state.collectedKeys, level.surfaceRow)

      if (!result.valid) {
        return { ...state, status: 'failure', failedStep: executionIndex }
      }

      const newPos = result.heroPos
      const newCollectedKeys = result.collectedKey
        ? [...state.collectedKeys, result.collectedKey]
        : state.collectedKeys
      const nextIndex = executionIndex + 1

      if (isEndCell(newPos.row, newPos.col, level.grid)) {
        return { ...state, heroPos: newPos, collectedKeys: newCollectedKeys, executionIndex: nextIndex, status: 'success' }
      }
      if (nextIndex >= sequence.length) {
        return { ...state, heroPos: newPos, collectedKeys: newCollectedKeys, executionIndex: nextIndex, status: 'failure' }
      }
      return { ...state, heroPos: newPos, collectedKeys: newCollectedKeys, executionIndex: nextIndex, status: 'running' }
    }

    case 'RESET': {
      const displaySlots = level.prefillSequence ? [...level.prefillSequence] : undefined
      const sequence = displaySlots
        ? displaySlots.filter((a): a is import('../types/game').ActionId => a !== null)
        : state.sequence.length > 0 ? [] : state.sequence
      return {
        ...state,
        heroPos: { ...level.heroStart },
        status: 'idle',
        executionIndex: 0,
        failedStep: -1,
        collectedKeys: [],
        sequence,
        displaySlots,
      }
    }

    case 'NEXT_LEVEL': {
      const nextIndex = state.currentLevelIndex + 1
      if (nextIndex >= levels.length) return state
      return initState(nextIndex, levels)
    }

    case 'GO_TO_LEVEL': {
      const { index } = action
      if (index < 0 || index >= levels.length) return state
      return initState(index, levels)
    }

    default:
      return state
  }
}

export function GameProvider({ hero, children }: { hero: HeroId; children: ReactNode }) {
  const levels = useMemo(() => HERO_LEVELS[hero] ?? [], [hero])
  const levelsRef = useRef(levels)
  levelsRef.current = levels

  const [state, dispatch] = useReducer(
    (s: GameState, a: GameAction) => reducer(s, a, levelsRef.current),
    0,
    (i: number) => initState(i, levels)
  )

  const currentLevel = levels[state.currentLevelIndex]
  const isLastLevel = state.currentLevelIndex === levels.length - 1

  return (
    <GameContext.Provider value={{ state, dispatch, currentLevel, isLastLevel }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
