import { UserConfig } from 'src/common/types/userConfig.interface'

declare global {
  interface Window {
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
  }
}
