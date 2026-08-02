import { z } from 'zod'

export const domusUserSchema = z.object({
  id: z.string().min(1),
  identity_id: z.string().min(1),
})

export type DomusUser = z.infer<typeof domusUserSchema>

export type MeResolution =
  | { status: 'api_unconfigured' }
  | { status: 'unauthenticated' }
  | { status: 'not_provisioned' }
  | { status: 'provisioned'; user: DomusUser }
  | { status: 'error'; message: string }
