import { api } from '#/api/api'

import type {
  AcceptInvitationResult,
  HouseInvitation,
  InvitationPreview,
  InvitationRole,
} from '../types'

export const invitationsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getInvitationPreview: build.query<InvitationPreview, string>({
      query: (token) => `/invitations/preview?token=${encodeURIComponent(token)}`,
    }),
    acceptInvitation: build.mutation<AcceptInvitationResult, { token: string }>({
      query: (body) => ({
        url: '/invitations/accept',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Houses', 'Me', 'Invitations'],
    }),
    getHouseInvitations: build.query<HouseInvitation[], string>({
      query: (houseId) => `/houses/${houseId}/invitations`,
      providesTags: (_result, _error, houseId) => [{ type: 'Invitations', id: houseId }],
    }),
    createHouseInvitation: build.mutation<
      HouseInvitation,
      { houseId: string; email: string; role?: InvitationRole }
    >({
      query: ({ houseId, email, role }) => ({
        url: `/houses/${houseId}/invitations`,
        method: 'POST',
        body: { email, role },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Invitations', id: arg.houseId }],
    }),
    revokeHouseInvitation: build.mutation<
      HouseInvitation,
      { houseId: string; invitationId: string }
    >({
      query: ({ houseId, invitationId }) => ({
        url: `/houses/${houseId}/invitations/${invitationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Invitations', id: arg.houseId }],
    }),
    resendHouseInvitation: build.mutation<
      HouseInvitation,
      { houseId: string; invitationId: string }
    >({
      query: ({ houseId, invitationId }) => ({
        url: `/houses/${houseId}/invitations/${invitationId}/resend`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Invitations', id: arg.houseId }],
    }),
  }),
})

export const {
  useGetInvitationPreviewQuery,
  useAcceptInvitationMutation,
  useGetHouseInvitationsQuery,
  useCreateHouseInvitationMutation,
  useRevokeHouseInvitationMutation,
  useResendHouseInvitationMutation,
} = invitationsApi
