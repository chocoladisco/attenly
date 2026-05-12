import { Outlet } from 'react-router'
import { useTranslation } from 'react-i18next'

export function AppLayout() {
  const { i18n } = useTranslation()

  function toggleLanguage() {
    const next = i18n.language === 'en' ? 'de' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav
        style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid #333',
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>
          Attenly
        </span>
        <button
          onClick={toggleLanguage}
          style={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            background: 'none',
            border: '1px solid #444',
            color: '#aaa',
            padding: '0.25rem 0.6rem',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          {i18n.language === 'en' ? 'DE' : 'EN'}
        </button>
      </nav>
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  )
}
