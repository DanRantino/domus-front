export type InvitationRole = 'admin' | 'member'

export type HouseInvitation = {
  id: string
  house_id: string
  email: string
  role: InvitationRole
  status: string
  expires_at: string
  created_at: string
  token?: string | null
  email_sent?: boolean | null
}

export type InvitationPreview = {
  house_name: string
}

export type AcceptInvitationResult = {
  house_id: string
  house_name: string
  role: InvitationRole
}
