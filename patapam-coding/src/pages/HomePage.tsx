import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import landingBg from '../img/landing_page.png'

interface HeroZone {
  key: string
  labelKey: string
  number?: number
  locked: boolean
  path: string
  // Position en % sur l'image : top, left, width, height
  pos: { top: number; left: number; width: number; height: number }
}

// ⬇️ Ajuste ces valeurs en % pour coller aux héros sur l'image
const HEROES: HeroZone[] = [
  { key: 'mollasson', labelKey: 'home.tutorial', locked: false, path: '/play',
    pos: { top: 10, left: 5,  width: 38, height: 42 } },
  { key: 'tartuffe',  labelKey: 'home.hero1', number: 1, locked: true, path: '/hero/tartuffe',
    pos: { top: 10, left: 57, width: 38, height: 42 } },
  { key: 'dauphinou', labelKey: 'home.hero3', number: 3, locked: true, path: '/hero/dauphinou',
    pos: { top: 55, left: 5,  width: 38, height: 42 } },
  { key: 'patapam',   labelKey: 'home.hero2', number: 2, locked: true, path: '/hero/patapam',
    pos: { top: 55, left: 57, width: 38, height: 42 } },
]

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <div className="home-bg-container">
        <img src={landingBg} alt="landing" className="home-bg-img" />

        {HEROES.map(hero => (
          <div
            key={hero.key}
            className={`hero-hotspot ${hero.locked ? 'hero-hotspot--locked' : 'hero-hotspot--unlocked'}`}
            style={{
              top:    `${hero.pos.top}%`,
              left:   `${hero.pos.left}%`,
              width:  `${hero.pos.width}%`,
              height: `${hero.pos.height}%`,
            }}
            onClick={() => !hero.locked && navigate(hero.path)}
            title={hero.locked ? t('home.complete_previous') : t(hero.labelKey)}
          >
            {hero.number && <span className="hotspot-number">{hero.number}</span>}
            <span className="hotspot-label">{t(hero.labelKey)}</span>
            {hero.locked && <span className="hotspot-lock">🔒</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
