import { ipcMain } from 'electron'
import express, { Express } from 'express'
import { Server } from 'http'
import { NetworkConfig } from '../../../common/types/config'
import { searchSchema } from './schema/search.schema'
import { ConfigManager } from '../config/config'
import { AIManager } from '../ai/AI'
import { AnswersController } from '../../controller/answers'
import os from 'os'
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
    private ConfigManager: ConfigManager,
    private aIManager: AIManager,
    private AnswersController: AnswersController,
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
        const answer = await this.AnswersController.search(data)
        res.json({ success: true, data: answer })
      } catch (error) {
        res.status(400).json({ success: false, data: { code: 0, answer: error, msg: '请求错误' } })
      }
    })
    this.app.get('/search', async (req, res) => {
      try {
        const data = searchSchema.parse(req.query)
        const answer = await this.AnswersController.search(data)
        res.json({ success: true, data: answer })
      } catch (error) {
        res.status(400).json({ success: false, data: { code: 0, answer: error, msg: '请求错误' } })
      }
    })
  }

  /**
   * 启动 HTTP 服务
   *
   * @description
   * 初始化并启动 HTTP 服务器。首先检查配置并确保 AI 管理器已加载，
   * 如果服务已在运行则跳过启动过程。
   *
   * @returns {Promise<void>} 异步操作，无返回值
   *
   * @throws {Error} 当服务器启动失败时抛出错误
   */
  private async start(): Promise<void> {
    this.config = (await this.ConfigManager.get()).network
    if (this.server && this.isRunning()) {
      console.log(`HTTP 服务已在端口 ${this.config.port} 运行`)
      return
    }
    await this.aIManager.load()
    const host = this.config.isLAN ? this.getLocalIP() : 'localhost'
    this.server = this.app.listen(this.config.port, host, () => {
      console.log(`HTTP 服务已在http://${host}:${this.config.port} 上启动`)
    })
  }

  /**
   * 停止HTTP服务器
   *
   * 如果服务器当前未运行，将输出提示信息并直接返回。
   * 如果服务器正在运行，将执行以下操作：
   * 1. 卸载AI管理器
   * 2. 关闭服务器并输出停止信息
   * 3. 关闭所有连接
   * 4. 将服务器实例置为null
   */
  private stop(): void {
    if (!this.server) {
      console.log('HTTP服务器当前未运行')
      return
    }
    this.aIManager.unload()
    this.server!.close(() => {
      console.log('HTTP服务器已停止')
    })
    this.server.closeAllConnections()
    this.server = null
  }

  private isRunning(): boolean {
    return this.server !== null
  }

  /**
   * 初始化HTTP服务管理器
   *
   * 此方法会清理并重新注册所有与HTTP服务相关的IPC处理器：
   * - 启动HTTP服务 (start-HttpService)
   * - 停止HTTP服务 (stop-HttpService)
   * - 检查服务运行状态 (isRunning)
   * - 获取本地IP地址 (getLocalIP)
   *
   * 确保IPC通信通道在服务启动前处于干净状态，避免重复注册处理器
   */
  async initialize(): Promise<void> {
    ipcMain.removeHandler('start-HttpService')
    ipcMain.removeHandler('stop-HttpService')
    ipcMain.removeHandler('isRunning')
    ipcMain.removeHandler('getLocalIP')

    ipcMain.handle('start-HttpService', () => {
      return this.start()
    })
    ipcMain.handle('stop-HttpService', () => {
      return this.stop()
    })
    ipcMain.handle('isRunning', async (): Promise<boolean> => {
      return this.isRunning()
    })
    ipcMain.handle('getLocalIP', () => this.getLocalIP())
  }
  /**
   * 获取本机的IPv4地址
   *
   * 该方法会遍历所有网络接口，返回第一个非内部IPv4地址
   * 主要用于获取本机在网络中的实际IP地址
   *
   * @returns 返回找到的IPv4地址字符串，如果未找到则返回127.0.0.1
   */
  private getLocalIP(): string {
    for (const [key, value] of Object.entries(os.networkInterfaces())) {
      if (key.includes('docker')) {
        continue
      }
      if (key.includes('vmnet')) {
        continue
      }
      if (key.includes('virtual')) {
        continue
      }
      if (key.includes('VMware')) {
        continue
      }
      if (key.includes('veth')) {
        continue
      }
      if (key.includes('br-')) {
        continue
      }
      if (key.includes('virbr')) {
        continue
      }
      for (const net of value || []) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address
        }
      }
    }
    return '127.0.0.1'
  }
}
