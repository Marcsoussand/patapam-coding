// Moteur de jeu : logique pure d'exécution des actions, sans React

const DIRECTION_ORDER = ['up', 'right', 'down', 'left'] // sens horaire

function turnRight(direction) {
  const idx = DIRECTION_ORDER.indexOf(direction)
  return DIRECTION_ORDER[(idx + 1) % 4]
}

function turnLeft(direction) {
  const idx = DIRECTION_ORDER.indexOf(direction)
  return DIRECTION_ORDER[(idx + 3) % 4]
}

function getNextPos(row, col, direction) {
  switch (direction) {
    case 'up':    return { row: row - 1, col }
    case 'down':  return { row: row + 1, col }
    case 'left':  return { row, col: col - 1 }
    case 'right': return { row, col: col + 1 }
    default:      return { row, col }
  }
}

/**
 * Exécute une action sur la position actuelle du héros.
 * Retourne { heroPos, valid } — valid=false si le mouvement est bloqué.
 */
export function executeStep(heroPos, actionId, grid) {
  const { row, col, direction } = heroPos

  if (actionId === 'turn_left') {
    return { heroPos: { row, col, direction: turnLeft(direction) }, valid: true }
  }

  if (actionId === 'turn_right') {
    return { heroPos: { row, col, direction: turnRight(direction) }, valid: true }
  }

  if (actionId === 'move_forward') {
    const next = getNextPos(row, col, direction)
    // Vérif hors limites
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

export function isEndCell(row, col, grid) {
  return grid[row]?.[col] === 'end'
}
