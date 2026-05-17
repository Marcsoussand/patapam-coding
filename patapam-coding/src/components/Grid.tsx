import { useGame } from '../context/GameContext'
import Hero from './Hero'
import branche        from '../img/branche.png'
import tartuffeNeige  from '../img/tartuffe_neige.png'
import dauphinouMer   from '../img/dauphinou_mer.png'
import redFlower      from '../img/obstacles/mollasson/red_flower.png'
import orangeFlower   from '../img/obstacles/mollasson/orange_flower.png'
import woodenKnot     from '../img/obstacles/mollasson/wooden_knot.png'
import fir            from '../img/obstacles/tartuffe/fir.png'
import rock           from '../img/obstacles/tartuffe/rock.png'
import rockSurface    from '../img/obstacles/dauphinou/rock_surface.png'
import palmTree      from '../img/obstacles/dauphinou/palm_tree.png'
import { executeStep } from '../engine/gameEngine'
import type { ActionId, CellType, HeroId, HeroPos } from '../types/game'

const HERO_BG: Partial<Record<HeroId, string>> = {
  mollasson: branche,
  tartuffe:  tartuffeNeige,
  dauphinou: dauphinouMer,
}

const HERO_OBSTACLES: Partial<Record<HeroId, (string | null)[]>> = {
  mollasson: [redFlower, orangeFlower, woodenKnot, null, null],
  tartuffe:  [fir, rock, null, null, null],
}

function wallObstacle(row: number, col: number, hero: HeroId): string | null {
  const pool = HERO_OBSTACLES[hero] ?? HERO_OBSTACLES.mollasson!
  return pool[(row * 3 + col * 7) % pool.length]
}

function simulateGhost(
  sequence: ActionId[],
  heroStart: HeroPos,
  grid: CellType[][],
  surfaceRow?: number,
): HeroPos {
  let pos = { ...heroStart }
  let collectedKeys: string[] = []
  for (const actionId of sequence) {
    const result = executeStep(pos, actionId, grid, collectedKeys, surfaceRow)
    if (!result.valid) break
    if (result.collectedKey) collectedKeys = [...collectedKeys, result.collectedKey]
    pos = result.heroPos
    if (grid[pos.row]?.[pos.col] === 'end') break
  }
  return pos
}

const CELL_SIZE = 80

export default function Grid() {
  const { state, currentLevel } = useGame()
  const { heroPos, status, collectedKeys, sequence } = state
  const { grid, hero } = currentLevel
  const isShaking = status === 'failure'

  const ghostPos = status === 'idle' && sequence.length > 0
    ? simulateGhost(sequence, currentLevel.heroStart, grid, currentLevel.surfaceRow)
    : null
  const showGhost = ghostPos !== null && (
    ghostPos.row !== currentLevel.heroStart.row || ghostPos.col !== currentLevel.heroStart.col
  )

  const bgImage = HERO_BG[hero] ?? branche

  // ── Side-scroll view (Dauphinou) ────────────────────────────────────
  if (currentLevel.viewMode === 'sidescroll') {
    const SIDE_W = 64
    const SIDE_H = 64
    const cols = grid[0]?.length ?? 10
    const rows = grid.length
    return (
      <div
        className={`grid-container grid-container--side ${isShaking ? 'grid-shake' : ''}`}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${SIDE_W}px)`,
          gridTemplateRows: `repeat(${rows}, ${SIDE_H}px)`,
        }}
      >
        {grid.flatMap((row, rowIdx) =>
          row.map((cell, colIdx) => {
            // Palm tree: anchor = top-left cell of the 2×2 block
            const isPalmAnchor = cell === 'palm_tree'
              && grid[rowIdx - 1]?.[colIdx] !== 'palm_tree'
              && grid[rowIdx][colIdx - 1] !== 'palm_tree'
            // The other 3 cells of the 2×2 are covered by the anchor's span → skip
            if (cell === 'palm_tree' && !isPalmAnchor) return null

            const isHero  = heroPos.row === rowIdx && heroPos.col === colIdx
            const isEnd   = cell === 'end'
            const isGhost = showGhost && ghostPos!.row === rowIdx && ghostPos!.col === colIdx && !isHero
            const obstacleImg = cell === 'wall' && rowIdx < rows - 1 ? rockSurface : null
            const rowClass = rowIdx <= 1 ? 'cell-side-sky'
              : rowIdx === rows - 1 ? 'cell-side-floor'
              : rowIdx === 2 ? 'cell-side-surface'
              : 'cell-side-water'
            const isWall = (cell === 'wall' && !!obstacleImg) || isPalmAnchor
            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`grid-cell ${rowClass} ${isWall ? 'cell-side-wall' : ''}`}
                style={{
                  gridColumn: isPalmAnchor ? `${colIdx + 1} / span 2` : colIdx + 1,
                  gridRow: isPalmAnchor ? `${rowIdx + 1} / span 2` : rowIdx + 1,
                  width: isPalmAnchor ? SIDE_W * 2 : SIDE_W,
                  height: isPalmAnchor ? SIDE_H * 2 : SIDE_H,
                }}
              >
                {isPalmAnchor && (
                  <img src={palmTree} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                )}
                {obstacleImg && (
                  <img src={obstacleImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                )}
                {isEnd && !isHero && <span className="end-flag">🏆</span>}
                {isGhost && (
                  <div className="hero-ghost">
                    <Hero hero={hero} direction={ghostPos!.direction} isSuccess={false} isFailure={false} />
                  </div>
                )}
                {isHero && (
                  <Hero hero={hero} direction={heroPos.direction} isSuccess={status === 'success'} isFailure={status === 'failure'} />
                )}
              </div>
            )
          })
        )}
      </div>
    )
  }

  // ── Top-down view (Mollasson / Tartuffe) ────────────────────────────
  return (
    <div
      className={`grid-container ${isShaking ? 'grid-shake' : ''}`}
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="grid-row">
          {row.map((cell, colIdx) => {
            const isHero  = heroPos.row === rowIdx && heroPos.col === colIdx
            const isEnd   = cell === 'end'
            const isGhost = showGhost && ghostPos!.row === rowIdx && ghostPos!.col === colIdx && !isHero
            const obstacleImg = cell === 'wall' ? wallObstacle(rowIdx, colIdx, hero) : null
            return (
              <div
                key={colIdx}
                className={`grid-cell cell-${cell}`}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
              >
                {obstacleImg && (
                  <img
                    src={obstacleImg}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
                  />
                )}
                {cell === 'key_red'     && !collectedKeys.includes('red')    && <span className="cell-icon cell-icon--red-key">🗝️</span>}
                {cell === 'key_yellow'  && !collectedKeys.includes('yellow') && <span className="cell-icon">🗝️</span>}
                {cell === 'door_red'    && <span className="cell-icon cell-icon--red-key">{collectedKeys.includes('red') ? '🔓' : '🔒'}</span>}
                {cell === 'door_yellow' && <span className="cell-icon">{collectedKeys.includes('yellow') ? '\uD83D\uDD13' : '\uD83D\uDD10'}</span>}
                {isEnd && !isHero && <span className="end-flag">&#127937;</span>}
                {isGhost && (
                  <div className="hero-ghost">
                    <Hero hero={hero} direction={ghostPos!.direction} isSuccess={false} isFailure={false} />
                  </div>
                )}
                {isHero && (
                  <Hero
                    hero={hero}
                    direction={heroPos.direction}
                    isSuccess={status === 'success'}
                    isFailure={status === 'failure'}
                  />
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
