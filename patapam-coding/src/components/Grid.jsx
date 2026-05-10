import { useGame } from '../context/GameContext'
import { TUTORIAL_LEVELS } from '../data/levels'
import Hero from './Hero'
import branche from '../img/branche.png'

const CELL_SIZE = 80

export default function Grid() {
  const { state } = useGame()
  const { heroPos, currentLevelIndex, status, failedStep, executionIndex } = state
  const level = TUTORIAL_LEVELS[currentLevelIndex]
  const { grid } = level

  const isShaking = status === 'failure'

  return (
    <div className="grid-wrapper">
      <div
        className={`grid-container ${isShaking ? 'grid-shake' : ''}`}
        style={{ backgroundImage: `url(${branche})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="grid-row">
            {row.map((cell, colIdx) => {
              const isHero = heroPos.row === rowIdx && heroPos.col === colIdx
              const isEnd  = cell === 'end'
              return (
                <div
                  key={colIdx}
                  className={`grid-cell cell-${cell}`}
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                >
                  {isEnd && !isHero && <span className="end-flag">🏁</span>}
                  {isHero && (
                    <Hero
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
    </div>
  )
}
