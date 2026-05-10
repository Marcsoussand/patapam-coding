import mollassonFront from '../img/mollasson_front.png'
import mollassonBack  from '../img/mollasson_back.png'
import mollassonLeft  from '../img/mollasson_left.png'
import mollassonRight from '../img/mollasson_right.png'

const SPRITES = {
  up:    mollassonBack,
  down:  mollassonFront,
  left:  mollassonLeft,
  right: mollassonRight,
}

export default function Hero({ direction, isSuccess, isFailure }) {
  const className = [
    'hero-sprite',
    isSuccess ? 'hero-success' : '',
    isFailure ? 'hero-failure' : '',
  ].filter(Boolean).join(' ')

  return (
    <img
      src={SPRITES[direction] ?? mollassonFront}
      alt="Mollasson"
      className={className}
    />
  )
}
