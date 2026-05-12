import type { HeroPos, ActionId, CellType, Direction } from '../types/game'

const DIRECTION_ORDER: Direction[] = ['up', 'right', 'down', 'left']

function turnRight(direction: Direction): Direction {
  const idx = DIRECTION_ORDER.indexOf(direction)
  return DIRECTION_ORDER[(idx + 1) % 4]
}

function turnLeft(direction: Direction): Direction {
  const idx = DIRECTION_ORDER.indexOf(direction)
  return DIRECTION_ORDER[(idx + 3) % 4]
}

function getNextPos(row: number, col: number, direction: Direction): { row: number; col: number } {
  switch (direction) {
    case 'up':    return { row: row - 1, col }
    case 'down':  return { row: row + 1, col }
    case 'left':  return { row, col: col - 1 }
    case 'right': return { row, col: col + 1 }
  }
}

export function executeStep(
  heroPos: HeroPos,
  actionId: ActionId,
  grid: CellType[][]
): { heroPos: HeroPos; valid: boolean } {
  const { row, col, direction } = heroPos

  if (actionId === 'turn_left') {
    return { heroPos: { row, col, direction: turnLeft(direction) }, valid: true }
  }
  if (actionId === 'turn_right') {
    return { heroPos: { row, col, direction: turnRight(direction) }, valid: true }
  }
  if (actionId === 'move_forward') {
    const next = getNextPos(row, col, direction)
    if (
      next.row < 0 || next.row >= grid.length ||
      next.col < 0 || next.col >= grid[0].length
    ) {
      return { heroPos, valid: false }
    }
    const cell = grid[next.row][next.col]
    if (cell === 'wall') {
      return { heroPos, valid: false }
    }
    return { heroPos: { row: next.row, col: next.col, direction }, valid: true }
  }
  return { heroPos, valid: false }
}

export function isEndCell(row: number, col: number, grid: CellType[][]): boolean {
  return grid[row]?.[col] === 'end'
}
