import { z } from 'zod'

export const HOUSEHOLD_NAME_MAX = 80

export const createHouseholdSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'required')
    .max(HOUSEHOLD_NAME_MAX, 'tooLong'),
})

export type CreateHouseholdValues = z.infer<typeof createHouseholdSchema>
