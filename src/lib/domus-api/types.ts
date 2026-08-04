import { z } from 'zod'

export const themeSchema = z.enum(['light', 'dark', 'system'])
export type ThemePreference = z.infer<typeof themeSchema>

export const notificationSettingsSchema = z.object({
  daily_tasks: z.boolean(),
  expenses: z.boolean(),
  family_chat: z.boolean(),
})
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>

export const userSettingsSchema = z.object({
  theme: themeSchema,
  notifications: notificationSettingsSchema,
})
export type UserSettings = z.infer<typeof userSettingsSchema>

export const houseMembershipSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.enum(['admin', 'member', 'guest']),
})
export type HouseMembership = z.infer<typeof houseMembershipSchema>

export const domusUserSchema = z.object({
  id: z.string().min(1),
  identity_id: z.string().min(1),
  full_name: z.string().nullable(),
  settings: userSettingsSchema,
  houses: z.array(houseMembershipSchema),
})

export type DomusUser = z.infer<typeof domusUserSchema>

export type MeResolution =
  | { status: 'api_unconfigured' }
  | { status: 'unauthenticated' }
  | { status: 'not_provisioned' }
  | { status: 'provisioned'; user: DomusUser }
  | { status: 'error'; message: string }

export type PatchMeBody = {
  full_name?: string | null
}

export type PatchMeSettingsBody = {
  theme?: ThemePreference
  notifications?: Partial<NotificationSettings>
}
