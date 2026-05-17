import type { HeroPos, ActionId, CellType, Direction } from '../types/game'

// Maps any ActionId to a Direction for sprite selection
const ACTION_DIRECTION: Record<ActionId, Direction> = {
  up: 'up', down: 'down', left: 'left', right: 'right',
  swim: 'right', jump: 'up', dive: 'down', super_jump: 'up',
}

const KEY_COLOR: Partial<Record<CellType, string>> = {
  key_red: 'red',
  key_yellow: 'yellow',
}

const DOOR_COLOR: Partial<Record<CellType, string>> = {
  door_red: 'red',
  door_yellow: 'yellow',
}

export function executeStep(
  heroPos: HeroPos,
  actionId: ActionId,
  grid: CellType[][],
  collectedKeys: string[],
  surfaceRow?: number
): { heroPos: HeroPos; valid: boolean; collectedKey: string | null } {
  const { row, col } = heroPos

  let nextRow = row
  let nextCol = col
  switch (actionId) {
    case 'up':         nextRow = row - 1; break
    case 'down':       nextRow = row + 1; break
    case 'left':       nextCol = col - 1; break
    case 'right':      nextCol = col + 1; break
    case 'swim':{
      // Gravity: if above surface, fall back down while moving forward
      if (surfaceRow !== undefined && row < surfaceRow) {
        nextRow = row + 1
      }
      nextCol = col + 1
      break
    }
    case 'jump':       nextRow = row - 1; nextCol = col + 1; break
    case 'dive':       nextRow = row + 1; nextCol = col + 1; break
    case 'super_jump': nextRow = row - 2; nextCol = col + 1; break
  }

  if (
    nextRow < 0 || nextRow >= grid.length ||
    nextCol < 0 || nextCol >= grid[0].length
  ) {
    return { heroPos, valid: false, collectedKey: null }
  }

  const cell = grid[nextRow][nextCol]
  if (cell === 'wall' || cell === 'palm_tree') {
    return { heroPos, valid: false, collectedKey: null }
  }

  // Porte : bloquée si la clé correspondante n'a pas été ramassée
  const doorColor = DOOR_COLOR[cell]
  if (doorColor !== undefined && !collectedKeys.includes(doorColor)) {
    return { heroPos, valid: false, collectedKey: null }
  }

  // Clé : ramassée si on marche dessus et qu'on ne l'a pas encore
  const keyColor = KEY_COLOR[cell]
  const collectedKey = keyColor !== undefined && !collectedKeys.includes(keyColor) ? keyColor : null

  return {
    heroPos: { row: nextRow, col: nextCol, direction: ACTION_DIRECTION[actionId] },
    valid: true,
    collectedKey,
  }
}

export function isEndCell(row: number, col: number, grid: CellType[][]): boolean {
  return grid[row]?.[col] === 'end'
}
