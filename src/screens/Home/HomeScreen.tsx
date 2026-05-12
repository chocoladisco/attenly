import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '../../components/Button/Button'

export function HomeScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '4rem' }}>
      <h1
        style={{
          fontFamily: 'monospace',
          fontSize: '3rem',
          fontWeight: 'bold',
          letterSpacing: '0.05em',
          marginBottom: '1rem',
        }}
      >
        Attenly
      </h1>
      <p style={{ color: '#aaa', marginBottom: '2.5rem', lineHeight: 1.6 }}>
        {t('home.tagline')}
      </p>
      <Button onClick={() => navigate('/tests')}>{t('home.selectTest')}</Button>
    </div>
  )
}
