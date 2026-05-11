import { useNavigate } from 'react-router'
import { testCatalogue } from '../../data/testCatalogue'
import { useSession } from '../../context/SessionContext'
import { Button } from '../../components/Button/Button'

export function TestSelectionScreen() {
  const navigate = useNavigate()
  const { dispatch } = useSession()

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
        Select a Test
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
              {test.name}
            </h3>
            <p style={{ color: '#aaa', margin: 0, lineHeight: 1.6 }}>{test.description}</p>
            <div>
              <Button variant="secondary" onClick={() => handleSelect(test.id)}>
                Configure
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
