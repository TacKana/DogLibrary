import { contextBridge, ipcRenderer } from 'electron'
import { UserConfig } from '../common/types/userConfig.interface'
import { start } from 'repl'

// 用户配置相关
const userConfig = {
  get: (): Promise<UserConfig> => ipcRenderer.invoke('get-userConfig'),
  set: (newUserConfig: Promise<Partial<UserConfig>>) =>
    ipcRenderer.invoke('set-userConfig', newUserConfig)
}
const httpService = {
  start: () => ipcRenderer.invoke('start-HttpService'),
  stop: () => ipcRenderer.invoke('stop-HttpService'),
  isRunning: (): Promise<boolean> => ipcRenderer.invoke('isRunning')
}
contextBridge.exposeInMainWorld('userConfig', userConfig)
contextBridge.exposeInMainWorld('httpService', httpService)
