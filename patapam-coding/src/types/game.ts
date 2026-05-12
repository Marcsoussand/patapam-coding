export type Direction = 'up' | 'down' | 'left' | 'right'
export type CellType = 'wall' | 'path' | 'start' | 'end'
export type ActionId = 'move_forward' | 'turn_left' | 'turn_right'
export type GameStatus = 'idle' | 'running' | 'success' | 'failure'
export type HeroId = 'mollasson' | 'tartuffe' | 'patapam' | 'dauphinou'

export interface HeroPos {
  row: number
  col: number
  direction: Direction
}

export interface ActionDef {
  id: ActionId
  label: string
  icon: string
  iconBg: boolean
}

export interface Level {
  id: string
  title: string
  description: string
  hero: HeroId
  grid: CellType[][]
  heroStart: HeroPos
  availableActions: ActionId[]
  maxActions: number
}

export interface GameState {
  currentLevelIndex: number
  sequence: ActionId[]
  heroPos: HeroPos
  status: GameStatus
  executionIndex: number
  failedStep: number
}

export type GameAction =
  | { type: 'ADD_ACTION'; actionId: ActionId; index?: number }
  | { type: 'REMOVE_ACTION'; index: number }
  | { type: 'MOVE_ACTION'; fromIndex: number; toIndex: number }
  | { type: 'CLEAR_SEQUENCE' }
  | { type: 'RUN' }
  | { type: 'STEP' }
  | { type: 'RESET' }
  | { type: 'NEXT_LEVEL' }
