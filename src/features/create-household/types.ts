export const householdRoles = ['admin', 'member', 'guest'] as const

export type HouseholdRole = (typeof householdRoles)[number]

export type Household = {
  id: string
  name: string
  role: HouseholdRole
}

export type HouseholdSessionState = {
  selectedId: string | null
  skippedCreate: boolean
}
