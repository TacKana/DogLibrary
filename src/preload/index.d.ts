import { CacheArray } from '@common/types/cache'
import { ElectronAPI } from '@electron-toolkit/preload'
import { UserConfig } from 'src/common/types/userConfig.interface'

declare global {
  interface Window {
    electron: ElectronAPI
    userConfig: {
      get: () => Promise<UserConfig>
      set: (newUserConfig: Partial<UserConfig>) => Promise<boolean>
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
    }
  }
}
