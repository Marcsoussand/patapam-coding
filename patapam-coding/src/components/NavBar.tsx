import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'

const LANGUAGES = [
  { code: 'fr', flag: '/src/img/flags/fr.png', label: 'Français' },
  { code: 'en', flag: '/src/img/flags/eng.png', label: 'English'  },
  { code: 'he', flag: '/src/img/flags/he.png', label: 'עברית'    },
]

export default function NavBar() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {!isHome && (
          <button className="nav-home-btn" onClick={() => navigate('/')}>
            ← {t('nav.home')}
          </button>
        )}
        <span className="navbar-title">Patapam Coding</span>
      </div>

      <div className="navbar-flags">
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            className={`flag-btn ${i18n.language === lang.code ? 'flag-btn--active' : ''}`}
            onClick={() => i18n.changeLanguage(lang.code)}
            title={lang.label}
          >
            <img src={lang.flag} alt={lang.label} className="flag-img" />
          </button>
        ))}
      </div>
    </nav>
  )
}
