import { contextBridge, ipcRenderer } from 'electron'
import { UserConfig } from '../common/types/userConfig.interface'

// 用户配置相关
const userConfig = {
  get: (): Promise<UserConfig> => ipcRenderer.invoke('get-userConfig'),
  set: (newUserConfig: Promise<Partial<UserConfig>>) =>
    ipcRenderer.invoke('set-userConfig', newUserConfig)
}

contextBridge.exposeInMainWorld('userConfig', userConfig)
