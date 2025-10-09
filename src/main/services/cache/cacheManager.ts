import Database from 'better-sqlite3'
import { eq } from 'drizzle-orm'
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { app } from 'electron'
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
    	type text NOT NULL
)`,
      )
      .run()
    this.sqlite.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS cache_question_unique ON cache (question)`).run()
  }
  save(data: typeof cache.$inferInsert): void {
    this.db.insert(cache).values(data).onConflictDoNothing().execute()
  }
  async query(question: typeof cache.$inferInsert.question): Promise<typeof cache.$inferInsert> {
    const results = await this.db.select().from(cache).where(eq(cache.question, question)).execute()
    return results[0]
  }
}
