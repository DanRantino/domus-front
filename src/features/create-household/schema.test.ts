import { describe, expect, it } from 'vitest'

import { HOUSEHOLD_NAME_MAX, createHouseholdSchema } from './schema'

describe('createHouseholdSchema', () => {
  it('accepts a trimmed name', () => {
    expect(createHouseholdSchema.parse({ name: '  Casa Furst  ' })).toEqual({
      name: 'Casa Furst',
    })
  })

  it('rejects an empty name', () => {
    const result = createHouseholdSchema.safeParse({ name: '   ' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('required')
    }
  })

  it('rejects a name that is too long', () => {
    const result = createHouseholdSchema.safeParse({ name: 'a'.repeat(HOUSEHOLD_NAME_MAX + 1) })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('tooLong')
    }
  })
})
