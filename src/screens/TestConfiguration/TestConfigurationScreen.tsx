import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getTestById } from '../../data/testCatalogue'
import { buildDefaultConfig } from '../Test/TestEngine'
import { useSession } from '../../context/SessionContext'
import { Button } from '../../components/Button/Button'
import type { TestConfig } from '../../types/session'

export function TestConfigurationScreen() {
  const { testId } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const { dispatch } = useSession()

  const test = getTestById(testId ?? '')
  const [config, setConfig] = useState<TestConfig>(() =>
    test ? buildDefaultConfig(test) : {},
  )

  if (!test) {
    return <p>Test not found.</p>
  }

  function handleChange(key: string, value: string) {
    setConfig((prev) => ({ ...prev, [key]: Number(value) }))
  }

  function handleToggle(key: string, checked: boolean) {
    setConfig((prev) => ({ ...prev, [key]: checked }))
  }

  function handleStart() {
    dispatch({ type: 'SET_CONFIG', config })
    navigate(`/tests/${testId}/run`)
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2
        style={{
          fontFamily: 'monospace',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          letterSpacing: '0.05em',
        }}
      >
        {test.name}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        {test.configSchema.map((field) => {
          if (field.dependsOn && !config[field.dependsOn]) return null

          if (field.type === 'toggle') {
            const checked = Boolean(config[field.key] ?? field.defaultValue)
            return (
              <label
                key={field.key}
                htmlFor={field.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: '#aaa',
                  cursor: 'pointer',
                }}
              >
                <input
                  id={field.key}
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => handleToggle(field.key, e.target.checked)}
                  style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                />
                {field.label}
              </label>
            )
          }

          return (
            <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label
                htmlFor={field.key}
                style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#aaa' }}
              >
                {field.label}
                {field.unit ? ` (${field.unit})` : ''}
              </label>
              <input
                id={field.key}
                type="number"
                value={String(config[field.key] ?? field.defaultValue)}
                min={field.min}
                max={field.max}
                step={field.step}
                onChange={(e) => handleChange(field.key, e.target.value)}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  background: '#111',
                  color: '#fff',
                  border: '1px solid #444',
                  padding: '0.5rem 0.75rem',
                  width: '100%',
                }}
              />
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={handleStart}>Start Test</Button>
        <Button variant="secondary" onClick={() => navigate('/tests')}>
          Back
        </Button>
      </div>
    </div>
  )
}
