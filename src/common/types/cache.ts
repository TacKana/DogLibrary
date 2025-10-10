import { cache } from '../../main/services/cache/schema/cache'

type CacheRow = typeof cache.$inferSelect
export interface CacheArray extends Array<CacheRow> {}
