import Database from 'better-sqlite3'
import { desc, eq, like } from 'drizzle-orm'
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { app, ipcMain } from 'electron'
import path from 'path'
import { cache } from './schema/cache'
import { CacheArray, CacheRow } from '../../../common/types/cache'

/**
 * 缓存管理器类，负责管理应用程序的缓存数据
 *
 * 该类提供了缓存数据的存储、查询、删除等功能，使用SQLite数据库作为存储后端。
 * 支持精确搜索、模糊搜索、分页查询等操作，并通过IPC与渲染进程进行通信。
 *
 * @example
 * ```typescript
 * const cacheManager = new CacheManager()
 * cacheManager.initialize()
 * await cacheManager.save({ question: '问题', answer: '答案', type: '类型' })
 * ```
 */
export class CacheManager {
  private dbPath = path.join(app.getPath('userData'), 'answer.db')
  private db: BetterSQLite3Database
  private sqlite: Database.Database
  constructor() {
    this.sqlite = new Database(this.dbPath)
    this.db = drizzle(this.sqlite)
  }

  /**
   * 初始化缓存管理器。
   * 创建缓存表（如果不存在），并为其创建一个唯一索引。
   * 移除并重新注册 `del-Cache` 和 `query-Cache` 的 IPC 处理程序。
   * `del-Cache` 处理程序用于删除指定 ID 的缓存项。
   * `query-Cache` 处理程序用于查询缓存项，返回指定范围内的结果。
   */
  initialize(): void {
    this.sqlite
      .prepare(
        `CREATE TABLE IF NOT EXISTS cache (
    	    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        	question text NOT NULL,
        	answer text NOT NULL,
        	type text NOT NULL)`,
      )
      .run()
    this.sqlite.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS cache_question_unique ON cache (question)`).run()

    ipcMain.removeHandler('del-Cache')
    ipcMain.removeHandler('query-Cache')
    ipcMain.removeHandler('search-Cache')
    ipcMain.removeHandler('clearAll-Cache')
    ipcMain.handle('del-Cache', (_, id: number) => this.del(id))
    ipcMain.handle('query-Cache', (_, offset: number, limit: number) => this.query(offset, limit))
    ipcMain.handle('search-Cache', (_, question: string) => this.fuzzySearch(question))
    ipcMain.handle('clearAll-Cache', () => this.clearAll())
  }

  /**
   * 将数据保存到缓存中。
   * @param data - 要保存的缓存行数据。
   * @returns 如果保存成功则返回 `true`，否则返回 `false`。
   */
  async save(data: Omit<CacheRow, 'id'>): Promise<boolean> {
    const newData = await this.db.insert(cache).values(data).onConflictDoNothing().returning().execute()
    if (!newData) {
      return false
    }
    return true
  }

  /**
   * 根据ID删除缓存数据
   * @param id - 要删除的缓存数据的ID
   * @returns 返回一个Promise，解析为布尔值表示是否删除成功
   */
  async del(id: number): Promise<boolean> {
    const delData = await this.db.delete(cache).where(eq(cache.id, id)).returning().execute()
    return Boolean(delData)
  }

  /**
   * 清除缓存中的所有数据
   * @returns {Promise<boolean>} 返回一个Promise，解析为布尔值表示是否成功清除所有缓存数据
   */
  async clearAll(): Promise<boolean> {
    const delData = await this.db.delete(cache).returning().execute()
    return Boolean(delData)
  }

  /**
   * 使用指定问题进行精确搜索缓存行。
   * @param question - 要搜索的问题。
   * @returns 匹配的缓存行，如果未找到则为 undefined。
   */
  async exactSearch(question: string): Promise<CacheRow | undefined> {
    const results = await this.db.select().from(cache).where(eq(cache.question, question)).execute()
    return results[0]
  }

  /**
   * 模糊搜索缓存中包含指定问题的条目。
   * @param question - 要搜索的问题
   * @returns 包含指定问题的缓存数组，如果未找到则为 undefined
   */
  async fuzzySearch(question: string): Promise<CacheArray | undefined> {
    const results = await this.db
      .select()
      .from(cache)
      .where(like(cache.question, `%${question}%`))

      .execute()
    return results
  }
  /**
   * 从缓存中查询数据。
   * @param offset - 查询结果的偏移量。
   * @param limit - 查询结果的限制数量。
   * @returns 返回一个包含缓存数据的Promise。
   */
  async query(offset: number = 0, limit: number = 10): Promise<{ count: number; data: CacheArray }> {
    const data = await this.db.select().from(cache).orderBy(desc(cache.id)).offset(offset).limit(limit).execute()
    const count = await this.db.$count(cache)
    return { count, data }
  }
}
