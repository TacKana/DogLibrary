import z from 'zod'

export const searchSchema = z.object({
  title: z.string(), // 题目
  type: z.enum(['single', 'multiple', 'judgement', 'completion', 'line', 'fill', 'reader']), // 题目类型
  // 题目选项
  options: z.string(),
})
