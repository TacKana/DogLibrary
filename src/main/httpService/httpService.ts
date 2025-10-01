import express, { Express } from 'express'
import http, { Server } from 'http'
import { NetworkConfig } from '../../common/types/userConfig.interface'
import { ipcMain } from 'electron'

export class HttpService {
  private app: Express
  private server: Server | null = null
  private networkConfig: NetworkConfig

  constructor(networkConfig: NetworkConfig) {
    this.app = express()
    this.server = null
    this.registerRoutes()
    this.networkConfig = networkConfig
  }

  private registerRoutes(): void {
    this.app.post('/query', (req, res) => {
      res.json(req.body)
    })
    this.app.get('/', (_, res) => {
      res.send('已经启动http')
    })
  }

  private start() {
    if (this.server) {
      console.log(`服务器已在端口 ${this.networkConfig.port} 上运行`)
      return
    }

    this.server = this.app.listen(this.networkConfig.port, () => {
      console.log(`HTTP 服务器已在http://localhost:${this.networkConfig.port} 上启动`)
    })
  }

  private stop() {
    if (!this.server) {
      console.log('HTTP服务器当前未运行');
      return
    }
    this.server.close(() => {
      console.log('HTTP服务器已停止')
      this.server = null
    })
  }
  private isRunning(): boolean {
    return this.server !== null
  }

  async initialize() {
    ipcMain.handle('start-HttpService', () => {
      return this.start()
    })
    ipcMain.handle('stop-HttpService', () => {
      return this.stop()
    })
    ipcMain.handle('isRunning', (): boolean => {
      return this.isRunning()
    })

  }
}
