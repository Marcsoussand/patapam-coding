import type { Direction, HeroId } from '../types/game'
import mollassonFront from '../img/mollasson_front.png'
import mollassonBack  from '../img/mollasson_back.png'
import mollassonLeft  from '../img/mollasson_left.png'
import mollassonRight from '../img/mollasson_right.png'
import tartuffeFront from '../img/tartuffe_front.png'
import tartuffeBack  from '../img/tartuffe_back.png'
import tartuffeLeft  from '../img/tartuffe_left.png'
import tartuffeRight from '../img/tartuffe_right.png'
import dauphinouSwim from '../img/dauphinou_swim.png'
import dauphinouJump from '../img/dauphinou_jump.png'
import dauphinouDive from '../img/dauphinou_dive.png'

type SpriteMap = Record<Direction, string>

const HERO_SPRITES: Partial<Record<HeroId, SpriteMap>> & { _default: SpriteMap } = {
  _default: {
    up:    mollassonBack,
    down:  mollassonFront,
    left:  mollassonLeft,
    right: mollassonRight,
  },
  mollasson: {
    up:    mollassonBack,
    down:  mollassonFront,
    left:  mollassonLeft,
    right: mollassonRight,
  },
  tartuffe: {
    up:    tartuffeBack,
    down:  tartuffeFront,
    left:  tartuffeLeft,
    right: tartuffeRight,
  },
  dauphinou: {
    up:    dauphinouJump,   // jump sprite
    down:  dauphinouDive,   // dive sprite
    left:  dauphinouSwim,
    right: dauphinouSwim,   // swim sprite
  },
}

interface HeroProps {
  hero: HeroId
  direction: Direction
  isSuccess: boolean
  isFailure: boolean
}

export default function Hero({ hero, direction, isSuccess, isFailure }: HeroProps) {
  const className = [
    'hero-sprite',
    isSuccess ? 'hero-success' : '',
    isFailure ? 'hero-failure' : '',
  ].filter(Boolean).join(' ')

  const sprites = HERO_SPRITES[hero] ?? HERO_SPRITES._default
  return (
    <img
      src={sprites[direction]}
      alt={hero}
      className={className}
    />
  )
}
