import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { testCatalogue } from '../../data/testCatalogue'
import { useSession } from '../../context/SessionContext'
import { Button } from '../../components/Button/Button'

export function TestSelectionScreen() {
  const navigate = useNavigate()
  const { dispatch } = useSession()
  const { t } = useTranslation()

  function handleSelect(testId: string) {
    dispatch({ type: 'SELECT_TEST', testId })
    navigate(`/tests/${testId}/configure`)
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2
        style={{
          fontFamily: 'monospace',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          letterSpacing: '0.05em',
        }}
      >
        {t('testSelection.heading')}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {testCatalogue.map((test) => (
          <div
            key={test.id}
            style={{
              border: '1px solid #444',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <h3
              style={{
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                margin: 0,
              }}
            >
              {t(`tests.${test.id}.name`)}
            </h3>
            <p style={{ color: '#aaa', margin: 0, lineHeight: 1.6 }}>
              {t(`tests.${test.id}.description`)}
            </p>
            <div>
              <Button variant="secondary" onClick={() => handleSelect(test.id)}>
                {t('testSelection.configure')}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
