import Database from 'better-sqlite3'
import { desc, eq } from 'drizzle-orm'
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { app, ipcMain } from 'electron'
import path from 'path'
import { cache } from './schema/cache'

export class CacheManager {
  private dbPath = path.join(app.getPath('userData'), 'answer.db')
  private db: BetterSQLite3Database
  private sqlite: Database.Database
  constructor() {
    this.sqlite = new Database(this.dbPath)
    this.db = drizzle(this.sqlite)
  }
  /**
   * 初始化缓存管理器
   * 创建缓存表（如果不存在），包含id、question、answer、type字段
   * 并在question字段上创建唯一索引
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
    ipcMain.handle('del-Cache', (_, id: number) => this.del(id))
    ipcMain.handle('query-Cache', (_, offset: number, limit: number) => this.paginationQuery(offset, limit))
  }
  /**
   * 将数据插入缓存表；若主键冲突则忽略。
   * @param data - 符合缓存表插入约束的数据对象
   */
  save(data: typeof cache.$inferInsert): void {
    this.db.insert(cache).values(data).onConflictDoNothing().execute()
  }
  /**
   * 根据问题文本查询缓存记录。
   *
   * @param question - 要查询的问题内容。
   * @returns 匹配到的第一条缓存记录；若不存在则返回 `undefined`。
   */
  query(question: typeof cache.$inferInsert.question): typeof cache.$inferSelect | undefined {
    const results = this.db.select().from(cache).where(eq(cache.question, question)).execute()
    return results[0]
  }
  private paginationQuery(offset: number = 0, limit: number = 10): (typeof cache.$inferSelect)[] {
    return this.db.select().from(cache).orderBy(desc(cache.id)).offset(offset).limit(limit).all()
  }

  private del(id: number): void {
    this.db.delete(cache).where(eq(cache.id, id)).execute()
  }
}
