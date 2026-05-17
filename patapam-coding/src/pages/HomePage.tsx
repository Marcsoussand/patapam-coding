import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import landingBg from '../img/landing_page.png'

interface HeroZone {
  key: string
  labelKey: string
  number?: number
  path: string
  pos: { top: number; left: number; width: number; height: number }
}

const HEROES: HeroZone[] = [
  { key: 'mollasson', labelKey: 'home.tutorial', path: '/play/mollasson',
    pos: { top: 10, left: 5,  width: 38, height: 42 } },
  { key: 'tartuffe',  labelKey: 'home.hero1', number: 1, path: '/play/tartuffe',
    pos: { top: 10, left: 57, width: 38, height: 42 } },
  { key: 'dauphinou', labelKey: 'home.hero3', number: 3, path: '/play/dauphinou',
    pos: { top: 55, left: 5,  width: 38, height: 42 } },
  { key: 'patapam',   labelKey: 'home.hero2', number: 2, path: '/play/patapam',
    pos: { top: 55, left: 57, width: 38, height: 42 } },
]

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <div className="home-bg-container">
        <img src={landingBg} alt="landing" className="home-bg-img" />

        {HEROES.map(hero => {
          return (
            <div
              key={hero.key}
              className="hero-hotspot hero-hotspot--unlocked"
              style={{
                top:    `${hero.pos.top}%`,
                left:   `${hero.pos.left}%`,
                width:  `${hero.pos.width}%`,
                height: `${hero.pos.height}%`,
              }}
              onClick={() => navigate(hero.path)}
              title={t(hero.labelKey)}
            >
              {hero.number && <span className="hotspot-number">{hero.number}</span>}
              <span className="hotspot-label">{t(hero.labelKey)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
