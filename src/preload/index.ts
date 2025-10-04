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
}
const aiManager = {
  load: () => ipcRenderer.invoke('load-AIManager'),
  unload: () => ipcRenderer.invoke('unload-AIManager'),
}
contextBridge.exposeInMainWorld('userConfig', userConfig)
contextBridge.exposeInMainWorld('httpService', httpService)
contextBridge.exposeInMainWorld('aiManager', aiManager)
