import { describe, it, expect } from 'vitest'
import { testCatalogue, getTestById } from './testCatalogue'

describe('testCatalogue', () => {
  it('contains at least one test definition', () => {
    expect(testCatalogue.length).toBeGreaterThan(0)
  })

  it('includes the visual 1-back test (vlta)', () => {
    const vlta = testCatalogue.find((t) => t.id === 'vlta')
    expect(vlta).toBeDefined()
    expect(vlta?.name).toBe('Visual 1-Back')
  })

  describe('vlta config schema', () => {
    const vlta = () => testCatalogue.find((t) => t.id === 'vlta')!

    it('has a maxDurationMin field of type number', () => {
      const field = vlta().configSchema.find((f) => f.key === 'maxDurationMin')
      expect(field).toBeDefined()
      expect(field?.type).toBe('number')
    })

    it('has a shapeIntervalSec field of type number', () => {
      const field = vlta().configSchema.find((f) => f.key === 'shapeIntervalSec')
      expect(field).toBeDefined()
      expect(field?.type).toBe('number')
    })

    it('has a shapeDurationMs field of type number', () => {
      const field = vlta().configSchema.find((f) => f.key === 'shapeDurationMs')
      expect(field).toBeDefined()
      expect(field?.type).toBe('number')
    })

    it('has a maxFailureCount field of type number', () => {
      const field = vlta().configSchema.find((f) => f.key === 'maxFailureCount')
      expect(field).toBeDefined()
      expect(field?.type).toBe('number')
    })

    it('all fields have sensible default values', () => {
      for (const field of vlta().configSchema) {
        expect(field.defaultValue).toBeDefined()
      }
    })

    it('number fields have min and max bounds', () => {
      const numberFields = vlta().configSchema.filter((f) => f.type === 'number')
      for (const field of numberFields) {
        expect(field.min).toBeDefined()
        expect(field.max).toBeDefined()
        expect((field.min as number) < (field.max as number)).toBe(true)
      }
    })
  })

  describe('getTestById', () => {
    it('returns the correct test for a valid id', () => {
      const result = getTestById('vlta')
      expect(result).toBeDefined()
      expect(result?.id).toBe('vlta')
    })

    it('returns undefined for an unknown id', () => {
      expect(getTestById('does-not-exist')).toBeUndefined()
    })
  })
})
