import { useNavigate } from 'react-router'
import { Button } from '../../components/Button/Button'

export function HomeScreen() {
  const navigate = useNavigate()

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
        Measure and train your visual sustained attention with scientifically structured tests.
      </p>
      <Button onClick={() => navigate('/tests')}>Select a Test</Button>
    </div>
  )
}
