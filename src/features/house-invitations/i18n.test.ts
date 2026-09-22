import { describe, expect, it } from 'vitest'

import en from '#/i18n/locales/en.json'
import ptBR from '#/i18n/locales/pt-BR.json'

describe('invitation i18n catalogs', () => {
  it('includes invite and accept copy in pt-BR and en', () => {
    expect(ptBR.start.invite.description).toMatch(/e-mail/)
    expect(ptBR.start.invite.emailMismatch).toMatch(/e-mail/)
    expect(ptBR.invites.title).toBeTruthy()
    expect(ptBR.start.ready.title).toBe('Sua Domus está pronta.')
    expect(en.start.invite.description).toMatch(/email/i)
    expect(en.start.invite.emailMismatch).toMatch(/email/i)
    expect(en.invites.title).toBeTruthy()
    expect(en.start.ready.send).toMatch(/invitation/i)
  })
})
