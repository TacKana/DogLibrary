import { ipcMain } from 'electron'
import express, { Express } from 'express'
import { Server } from 'http'
import { NetworkConfig } from '../../../common/types/userConfig.interface'
import { searchSchema } from './schema/search.schema'
import { UserConfigManager } from '../config/userConfig'
import { AIManager } from '../ai/aiManager'
import { AppController } from '../../app/appController'

/**
 * HTTP 服务管理器
 *
 * 负责管理 Express HTTP 服务器的生命周期，包括：
 * - 注册应用路由（支持 GET 和 POST 请求）
 * - 启动和停止 HTTP 服务器
 * - 通过 IPC 与主进程通信控制服务状态
 * - 集成 AI 管理器和应用控制器功能
 *
 * 该类通过 IPC 处理器暴露以下功能：
 * - 启动 HTTP 服务
 * - 停止 HTTP 服务
 * - 检查服务运行状态
 *
 * @remarks
 * 支持同时处理 GET 和 POST 请求的搜索接口，以兼容不同客户端需求。
 * 服务配置从用户配置管理器中获取网络设置。
 *
 * @throws 在启动或停止服务过程中出现错误时会抛出异常
 */
export class HttpManager {
  private app: Express
  private server: Server | null = null
  private config!: NetworkConfig

  constructor(
    private userConfigManager: UserConfigManager,
    private aIManager: AIManager,
    private appController: AppController,
  ) {
    this.app = express()
    this.app.use(express.json())
    this.registerRoutes()
  }

  /**
   * 注册应用的所有路由。
   *
   * @private
   */
  private registerRoutes(): void {
    this.app.get('/', (_, res) => {
      res.send('服务已启动')
    })

    // 本来仅使用post请求，但是OCS网课助手在post请求模式下body不知道为什么是undefined，所以只能新增get
    this.app.post('/search', async (req, res) => {
      try {
        const data = searchSchema.parse(req.body)
        const anwser = await this.appController.search(data)
        res.json({ success: true, data: anwser })
      } catch (error) {
        res.status(400).json({ success: false, data: { code: 0, anwser: error, msg: '请求错误' } })
      }
    })
    this.app.get('/search', async (req, res) => {
      try {
        const data = searchSchema.parse(req.query)
        const anwser = await this.appController.search(data)
        res.json({ success: true, data: anwser })
      } catch (error) {
        res.status(400).json({ success: false, data: { code: 0, anwser: error, msg: '请求错误' } })
      }
    })
  }

  /**
   * 启动 HTTP 服务
   *
   * @remarks
   * 该方法会：
   * 1. 获取网络配置信息
   * 2. 如果服务已运行，则直接返回
   * 3. 加载 AI 管理器
   * 4. 在指定端口启动 HTTP 服务器
   *
   * @returns 无返回值 Promise
   * @throws 如果启动过程中出现错误会抛出异常
   */
  private async start(): Promise<void> {
    this.config = (await this.userConfigManager.get()).network
    if (this.server) {
      console.log(`HTTP 服务已经在端口 ${this.config.port} 上运行`)
      return
    }
    await this.aIManager.load()
    this.server = this.app.listen(this.config.port, async () => {
      console.log(`HTTP 服务已在http://localhost:${this.config.port} 上启动`)
    })
  }

  /**
   * 停止HTTP服务器
   *
   * 如果服务器正在运行，则关闭服务器并卸载AI管理器。
   * 如果服务器未运行或已停止，则不执行任何操作。
   *
   * @throws 如果关闭服务器时发生错误
   */
  private async stop(): Promise<void> {
    if (this.server && this.isRunning()) {
      console.log(`HTTP 服务已在端口 ${this.config.port} 运行`)
      return
    }

    await new Promise<void>((resolve, reject) => {
      this.server!.close((err) => {
        if (err) return reject(err)
        this.aIManager.unload()
        this.server = null
        console.log('HTTP服务器已停止')
        resolve()
      })
    })
  }

  private isRunning(): boolean {
    return this.server !== null
  }

  /**
   * 初始化HTTP服务管理器
   *
   * 该方法会移除所有已存在的HTTP服务相关IPC处理器，并重新注册以下处理器：
   * - 'start-HttpService': 启动HTTP服务
   * - 'stop-HttpService': 停止HTTP服务
   * - 'isRunning': 检查HTTP服务运行状态
   *
   * @returns 无返回值Promise
   */
  async initialize(): Promise<void> {
    ipcMain.removeHandler('start-HttpService')
    ipcMain.removeHandler('stop-HttpService')
    ipcMain.removeHandler('isRunning')

    ipcMain.handle('start-HttpService', () => {
      return this.start()
    })
    ipcMain.handle('stop-HttpService', () => {
      return this.stop()
    })
    ipcMain.handle('isRunning', async (): Promise<boolean> => {
      return this.isRunning()
    })
  }
}
