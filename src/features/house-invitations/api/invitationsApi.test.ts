import { beforeEach, describe, expect, it } from 'vitest'

import { setupStore } from '#/app/store'
import { invitationsApi } from '#/features/house-invitations/api/invitationsApi'
import { stubDomusApi } from '#/test/domusApi'

describe('invitationsApi', () => {
  beforeEach(() => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
      invitations: [
        {
          id: 'inv-1',
          house_id: 'h1',
          email: 'guest@example.com',
          role: 'member',
          status: 'pending',
          expires_at: '2026-09-04T00:00:00Z',
          created_at: '2026-08-28T00:00:00Z',
          token: 'invite-token',
        },
      ],
    })
  })

  it('previews a pending invitation without exposing the email', async () => {
    const store = setupStore()
    const result = await store.dispatch(
      invitationsApi.endpoints.getInvitationPreview.initiate('invite-token'),
    )
    expect(result.data).toEqual({ house_name: 'Casa Furst' })
    expect(JSON.stringify(result.data)).not.toMatch(/guest@example.com/)
  })

  it('accepts a pending invitation', async () => {
    const store = setupStore()
    const result = await store.dispatch(
      invitationsApi.endpoints.acceptInvitation.initiate({ token: 'invite-token' }),
    )
    expect('data' in result && result.data).toEqual({
      house_id: 'h1',
      house_name: 'Casa Furst',
      role: 'member',
    })
  })
})
