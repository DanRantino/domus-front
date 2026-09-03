import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import '#/i18n'
import { setupStore } from '#/app/store'
import { selectHousehold } from '#/features/create-household/slice/householdSessionSlice'

import { createHouseholdsWrapper } from '../test/renderWithHouseholds'
import { HouseholdSwitcher } from './HouseholdSwitcher'

const houses = [
  { id: 'h1', name: 'Casa Furst', role: 'admin' as const },
  { id: 'h2', name: 'Apê Centro', role: 'member' as const },
]

describe('HouseholdSwitcher', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('lists households and navigates after a selection', async () => {
    const user = userEvent.setup()
    const store = setupStore()
    store.dispatch(selectHousehold('h1'))
    const { wrapper } = createHouseholdsWrapper({ store })

    render(
      <HouseholdSwitcher households={houses} variant="header" onNavigate={() => undefined} />,
      { wrapper },
    )

    await user.click(screen.getByRole('button', { name: 'Suas casas' }))
    expect(screen.getByRole('menuitem', { name: 'Casa selecionada' })).toHaveTextContent(
      'Casa Furst',
    )
    await user.click(screen.getByRole('menuitem', { name: 'Apê Centro' }))
    expect(store.getState().householdSession.selectedId).toBe('h2')
  })

  it('falls back to the first household when none is selected', async () => {
    const user = userEvent.setup()
    const { wrapper } = createHouseholdsWrapper()
    render(<HouseholdSwitcher households={houses} variant="drawer" />, { wrapper })

    expect(screen.getByRole('button', { name: 'Suas casas' })).toHaveTextContent('Casa Furst')
    await user.click(screen.getByRole('button', { name: 'Suas casas' }))
    await user.keyboard('{Escape}')
  })
})
