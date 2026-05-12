import type { Direction } from '../types/game'
import mollassonFront from '../img/mollasson_front.png'
import mollassonBack  from '../img/mollasson_back.png'
import mollassonLeft  from '../img/mollasson_left.png'
import mollassonRight from '../img/mollasson_right.png'

const SPRITES: Record<Direction, string> = {
  up:    mollassonBack,
  down:  mollassonFront,
  left:  mollassonLeft,
  right: mollassonRight,
}

interface HeroProps {
  direction: Direction
  isSuccess: boolean
  isFailure: boolean
}

export default function Hero({ direction, isSuccess, isFailure }: HeroProps) {
  const className = [
    'hero-sprite',
    isSuccess ? 'hero-success' : '',
    isFailure ? 'hero-failure' : '',
  ].filter(Boolean).join(' ')

  return (
    <img
      src={SPRITES[direction]}
      alt="Mollasson"
      className={className}
    />
  )
}
