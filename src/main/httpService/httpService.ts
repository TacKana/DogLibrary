import { ipcMain } from 'electron'
import express, { Express } from 'express'
import { Server } from 'http'
import { NetworkConfig } from '../../common/types/userConfig.interface'
import { searchSchema } from './schema/search.schema'

/**
 * 负责管理 Express HTTP 服务器的生命周期与 IPC 通信。
 *
 * @remarks
 * - 通过 `getNetworkConfig` 异步获取端口等网络配置。
 * - 提供 `start()`、`stop()`、`isRunning()` 方法，并通过 IPC 通道暴露给主进程。
 * - 内部已注册 `/search` POST 路由，仅回显请求体。
 *
 * @example
 * ```ts
 * const http = new HttpService(async () => ({ port: 3000 }));
 * await http.initialize(); // 注册 IPC 通道
 * // 渲染进程可调用：
 * // ipcRenderer.invoke('start-HttpService');
 * ```
 */
export class HttpService {
  private app: Express
  private server: Server | null = null
  private config!: NetworkConfig
  private getNetworkConfig: () => Promise<NetworkConfig>

  constructor(getNetworkConfig: () => Promise<NetworkConfig>) {
    this.app = express()
    this.server = null
    this.app.use(express.json())
    this.registerRoutes()
    this.getNetworkConfig = getNetworkConfig
  }

  /**
   * 注册应用的所有路由。
   *
   * @private
   */
  private registerRoutes(): void {
    this.app.post('/search', (req, res) => {
      try {
        const data = searchSchema.parse(req.body)
        console.log(data)
        res.json({ code: 1, data })
      } catch (error) {
        // console.log(error)
        res.status(400).json({ code: 0, msg: error })
      }
    })
  }

  /**
   * 初始化并启动 HTTP 服务器。
   *
   * @remarks
   * 1. 调用 {@link getNetworkConfig} 获取网络配置（含监听端口）。
   * 2. 若服务器实例已存在，则直接打印提示并返回，避免重复启动。
   * 3. 否则创建新的监听实例，并在启动成功后打印访问地址。
   *
   * @returns 当服务器成功进入监听状态后解析的 `Promise<void>`。
   *
   * @throws 若端口被占用或网络配置获取失败，会抛出异常并由调用方处理。
   *
   * @example
   * ```ts
   * await httpService.start(); // 控制台输出：HTTP 服务器已在 http://localhost:3000 上启动
   * ```
   */
  private async start(): Promise<void> {
    this.config = await this.getNetworkConfig()
    if (this.server) {
      console.log(`服务器已在端口 ${this.config.port} 上运行`)
      return
    }

    this.server = this.app.listen(this.config.port, async () => {
      console.log(`HTTP 服务器已在http://localhost:${this.config.port} 上启动`)
    })
  }

  /**
   * 安全关闭 HTTP 服务器。
   * 若服务器未运行，直接返回并记录提示；
   * 否则等待服务器关闭完成后释放资源。
   *
   * @returns {Promise<void>} 服务器关闭完成的 Promise。
   */
  private async stop(): Promise<void> {
    if (!this.server) {
      console.log('HTTP服务器当前未运行')
      return
    }

    await new Promise<void>((resolve) => {
      this.server!.close(() => {
        console.log('HTTP服务器已停止')
        this.server = null
        resolve()
      })
    })
  }

  private isRunning(): boolean {
    return this.server !== null
  }

  /**
   * 初始化 HTTP 服务的 IPC 通道处理程序。
   *
   * 调用此方法会依次执行以下操作：
   * 1. 移除已存在的 'start-HttpService'、'stop-HttpService' 和 'isRunning' 处理程序，避免重复注册。
   * 2. 为 'start-HttpService' 通道注册处理程序，调用并返回 this.start() 方法的结果。
   * 3. 为 'stop-HttpService' 通道注册处理程序，调用并返回 this.stop() 方法的结果。
   * 4. 为 'isRunning' 通道注册处理程序，调用并返回 Promise<boolean>，用于查询服务是否正在运行。
   *
   * @returns Promise<void> 一个表示所有通道处理程序已初始化完成的 Promise。
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
