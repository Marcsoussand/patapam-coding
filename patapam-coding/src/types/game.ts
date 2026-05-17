export type Direction = 'up' | 'down' | 'left' | 'right'
export type CellType = 'wall' | 'palm_tree' | 'path' | 'start' | 'end' | 'key_red' | 'key_yellow' | 'door_red' | 'door_yellow'
export type ActionId = Direction | 'swim' | 'jump' | 'dive' | 'super_jump'
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
  viewMode?: 'topdown' | 'sidescroll'       // default 'topdown'
  prefillSequence?: (ActionId | null)[]     // fixed-slot side-scroll levels
  surfaceRow?: number                       // gravity reference row for sidescroll
}

export interface GameState {
  currentLevelIndex: number
  sequence: ActionId[]
  heroPos: HeroPos
  status: GameStatus
  executionIndex: number
  failedStep: number
  collectedKeys: string[]  // e.g. ['red', 'yellow']
  displaySlots?: (ActionId | null)[]        // fixed slots for prefill side-scroll levels
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
  | { type: 'GO_TO_LEVEL'; index: number }
