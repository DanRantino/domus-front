import { z } from 'zod'

export const inviteCodeSchema = z.object({
  token: z.string().trim().min(1, 'required'),
})

export type InviteCodeValues = z.infer<typeof inviteCodeSchema>

export const createInvitationSchema = z.object({
  email: z.string().trim().email('invalid'),
  role: z.enum(['member', 'admin']),
})

export type CreateInvitationValues = z.infer<typeof createInvitationSchema>

export const inviteEmailSchema = z.object({
  email: z.string().trim().email('invalid'),
})

export type InviteEmailValues = z.infer<typeof inviteEmailSchema>
