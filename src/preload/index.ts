import { contextBridge, ipcRenderer } from 'electron'
import { UserConfig } from '../common/types/userConfig.interface'

// 用户配置相关
const userConfig = {
  get: () => ipcRenderer.invoke('get-userConfig'),
  set: (newUserConfig: Partial<UserConfig>) => ipcRenderer.invoke('set-userConfig', newUserConfig),
}
const httpService = {
  start: () => ipcRenderer.invoke('start-HttpService'),
  stop: () => ipcRenderer.invoke('stop-HttpService'),
  isRunning: (): Promise<boolean> => ipcRenderer.invoke('isRunning'),
  getLocalIP: (): Promise<string> => ipcRenderer.invoke('getLocalIP'),
}
const cacheManager = {
  query: (offset: number, limit: number) => ipcRenderer.invoke('query-Cache', offset, limit),
  del: (id: number) => ipcRenderer.invoke('del-Cache', id),
}
contextBridge.exposeInMainWorld('userConfig', userConfig)
contextBridge.exposeInMainWorld('httpService', httpService)
contextBridge.exposeInMainWorld('cacheManager', cacheManager)
