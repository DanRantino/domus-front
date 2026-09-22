import { describe, expect, it } from 'vitest'

import { findSelectedHousehold } from './selectHousehold'

const houses = [
  { id: 'h1', name: 'Casa Furst' },
  { id: 'h2', name: 'Apê Centro' },
]

describe('findSelectedHousehold', () => {
  it('returns the household that matches the selected id', () => {
    expect(findSelectedHousehold(houses, 'h2')).toEqual(houses[1])
  })

  it('falls back to the first household when none is selected', () => {
    expect(findSelectedHousehold(houses, null)).toEqual(houses[0])
  })

  it('returns undefined when there are no households', () => {
    expect(findSelectedHousehold([], 'h1')).toBeUndefined()
  })
})
