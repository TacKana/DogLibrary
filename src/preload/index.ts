import { contextBridge, ipcRenderer } from 'electron'
import { Config } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const config = {
  get: () => ipcRenderer.invoke('get-Config'),
  set: (newConfig: Partial<Config>) => ipcRenderer.invoke('set-Config', newConfig),
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
  search: (question: string) => ipcRenderer.invoke('search-Cache', question),
  clearAll: () => ipcRenderer.invoke('clearAll-Cache'),
}
const darkMode = {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
}
contextBridge.exposeInMainWorld('Config', config)
contextBridge.exposeInMainWorld('httpService', httpService)
contextBridge.exposeInMainWorld('cacheManager', cacheManager)
contextBridge.exposeInMainWorld('darkMode', darkMode)
contextBridge.exposeInMainWorld('electron', electronAPI)
