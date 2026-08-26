import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

import { setAccessTokenGetter } from '#/api/accessToken'
import { stubDomusApi } from '#/test/domusApi'

beforeEach(() => {
  setAccessTokenGetter(async () => 'test-token')
  stubDomusApi()
})

afterEach(() => {
  cleanup()
  sessionStorage.clear()
  setAccessTokenGetter(undefined)
  vi.unstubAllGlobals()
})
