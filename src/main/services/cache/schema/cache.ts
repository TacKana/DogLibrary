import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export enum questionType {
  single = 'single',
  multiple = 'multiple',
  judgement = 'judgement',
  completion = 'completion',
}

/**
 * 缓存表结构定义
 *
 * 用于存储问答数据的SQLite缓存表，包含以下字段：
 * - id: 自增主键，唯一标识每条缓存记录
 * - question: 问题文本，非空且唯一，作为查询键
 * - answer: 答案文本，非空
 * - type: 问题类型，非空，用于分类管理
 *
 * 该表主要用于提高问答系统的响应速度，避免重复计算相同问题
 */
export const cache = sqliteTable('cache', {
  id: integer().primaryKey({ autoIncrement: true }),
  question: text().notNull().unique(),
  answer: text().notNull(),
  type: text().$type<questionType>().notNull(),
})
