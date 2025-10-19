import { CacheArray } from '@common/types/cache'
import { ElectronAPI } from '@electron-toolkit/preload'
import { Config } from 'src/common/types/config'

declare global {
  interface Window {
    electron: ElectronAPI
    Config: {
      get: () => Promise<Config>
      set: (newConfig: Partial<Config>) => Promise<boolean>
      reset: () => Promise<Config>
    }
    httpService: {
      start: () => Promise<void>
      stop: () => Promise<void>
      isRunning: () => Promise<boolean>
      getLocalIP: () => Promise<string>
    }
    cacheManager: {
      query: (offset: number, limit: number) => Promise<{ count: number; data: CacheArray }>
      del: (id: number) => Promise<boolean>
      search: (question: string) => Promise<CacheArray>
      clearAll: () => Promise<void>
    }
    darkMode: {
      toggle: () => Promise<boolean>
      get: () => Promise<boolean>
    }
    update: {
      check: () => Promise<void>
    }
  }
}
