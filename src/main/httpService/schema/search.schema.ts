import z from 'zod'

export const searchSchema = z.object({
  title: z.string(),
  type: z.enum(['single', 'multiple', 'judgement', 'completion']),
  options: z.string(),
})
