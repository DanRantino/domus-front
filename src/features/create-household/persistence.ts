import type { Household, HouseholdRole, HouseholdSessionState } from './types'
import { householdRoles } from './types'

export const HOUSEHOLDS_STORAGE_KEY = 'domus.households'
export const SESSION_STORAGE_KEY = 'domus.householdSession'

export function defaultHouseholdSession(): HouseholdSessionState {
  return {
    selectedId: null,
    skippedCreate: false,
  }
}

export function loadHouseholds(): Household[] {
  const parsed = readJson(HOUSEHOLDS_STORAGE_KEY)
  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed.filter(isHousehold)
}

export function saveHouseholds(households: Household[]): void {
  writeJson(HOUSEHOLDS_STORAGE_KEY, households)
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
    sessionStorage.removeItem(HOUSEHOLDS_STORAGE_KEY)
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
    // Ignore quota / access errors; the in-memory RTK cache still works.
  }
}

function isHousehold(value: unknown): value is Household {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    isHouseholdRole(candidate.role)
  )
}

function isHouseholdRole(value: unknown): value is HouseholdRole {
  return typeof value === 'string' && householdRoles.includes(value as HouseholdRole)
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
