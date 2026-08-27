import type { HouseholdSessionState } from './types'

export const SESSION_STORAGE_KEY = 'domus.householdSession'

export function defaultHouseholdSession(): HouseholdSessionState {
  return {
    selectedId: null,
    skippedCreate: false,
  }
}

export function loadHouseholdSession(): HouseholdSessionState {
  const parsed = readJson(SESSION_STORAGE_KEY)
  if (!isHouseholdSession(parsed)) {
    return defaultHouseholdSession()
  }

  return parsed
}

export function saveHouseholdSession(session: HouseholdSessionState): void {
  writeJson(SESSION_STORAGE_KEY, session)
}

export function clearHouseholdPersistence(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // sessionStorage may be unavailable in some test or privacy contexts.
  }
}

function readJson(key: string): unknown {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) {
      return null
    }

    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore quota / access errors; the in-memory store still works.
  }
}

function isHouseholdSession(value: unknown): value is HouseholdSessionState {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>
  const selectedId = candidate.selectedId
  return (
    (selectedId === null || typeof selectedId === 'string') &&
    typeof candidate.skippedCreate === 'boolean'
  )
}
