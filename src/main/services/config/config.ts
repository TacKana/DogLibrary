//  处理应用配置
import { app, ipcMain } from 'electron'
import path from 'path'
import { aiProvider } from '../../../common/types/aiProvider.enum'
import fs from 'fs'
import { Config } from '../../../common/types/config'

/**
 * 配置管理器
 *
 * @remarks
 * 负责 Electron 应用的用户配置文件全生命周期管理：
 * - 在 `userData` 目录下维护 `config.json`
 * - 提供默认配置模板，支持 AI 服务商（deepseek、alibaba、siliconflow、volcengine、newapi）与网络端口设置
 * - 通过 `ipcMain.handle` 暴露 `get-Config` / `set-Config` 双向通信通道
 * - 所有读写均做深拷贝，避免外部引用污染
 * - 文件异常时自动回退至默认配置并重写文件
 *
 * @example
 * ```ts
 * const manager = new ConfigManager();
 * const config  = await manager.get();      // 读取当前配置
 * await manager.set({ network: { port: 8080 } }); // 局部更新
 * ```
 *
 * @public
 */
export class ConfigManager {
  private readonly configPath: string
  private readonly defaultConfig: Config

  constructor() {
    // 配置文件路径
    this.configPath = path.join(app.getPath('userData'), 'config.json')
    this.defaultConfig = {
      //ai配置
      aiConfig: {
        //使用哪家api提供商
        apiProvider: aiProvider.deepseek,
        //各家api专属设置
        aiProviderConfig: {
          // deepseek专属设置
          [aiProvider.deepseek]: {
            //api密钥
            apiKey: '',
            // 是否开启深度思考
            isDeep: false,
            // 是否联网搜索
            internetSearch: false,
          },
          [aiProvider.alibaba]: {
            apiKey: '',
            internetSearch: false,
            // 模型名称
            modelName: '',
          },
          [aiProvider.siliconflow]: {
            apiKey: '',
            internetSearch: false,
            modelName: '',
          },
          [aiProvider.volcengine]: {
            apiKey: '',
            internetSearch: false,
            modelName: '',
          },
          [aiProvider.newapi]: {
            //api地址
            baseUrl: '',
            apiKey: '',
            internetSearch: false,
            modelName: '',
          },
        },
      },
      network: {
        // 服务端口
        port: 5233,
        // 是否允许局域网访问
        isLAN: false,
      },
    }
  }
  async initialize(): Promise<void> {
    ipcMain.removeHandler('get-Config')
    ipcMain.removeHandler('set-Config')

    // 获取配置的ipc双向通信
    ipcMain.handle('get-Config', () => {
      return this.get()
    })
    //修改配置的ipc双向通信
    ipcMain.handle('set-Config', (_, newConfig: Partial<Config>) => {
      return this.set(newConfig)
    })
    console.log('已创建配置IPC双向通信')
    if (fs.existsSync(this.configPath)) {
      console.log('配置存在，跳过初始化')
      return
    } else {
      console.log('配置不存在，创建默认配置')
      this.saveConfigFile(this.defaultConfig)
    }
  }
  /**
   * 将用户配置对象持久化到配置文件。
   *
   * @param config - 待保存的完整用户配置对象。
   * @returns 无返回值的 Promise，当写入完成或失败时决议。
   * @throws 当文件写入过程中发生错误时，Promise 会被拒绝并携带相应异常。
   *
   * @example
   * ```ts
   * await saveConfigFile({ theme: 'dark', lang: 'zh-CN' });
   * ```
   */
  private async saveConfigFile(config: Config): Promise<void> {
    fs.promises.writeFile(this.configPath, JSON.stringify(config, null, 2), 'utf8')
  }
  private async readConfigFile(): Promise<Config> {
    try {
      const config = JSON.parse(await fs.promises.readFile(this.configPath, 'utf8'))
      return config
    } catch (error) {
      console.error('读取配置文件失败，回退到默认配置', error)
      await this.saveConfigFile(this.defaultConfig)
      return this.defaultConfig
    }
  }
  async get(): Promise<Config> {
    const config = await this.readConfigFile()
    return structuredClone(config) // 深拷贝，避免引用问题
  }

  async set(newConfig: Partial<Config>): Promise<boolean> {
    try {
      const oldConfig = await this.get()
      const config = structuredClone({ ...oldConfig, ...newConfig }) // 深拷贝，避免引用问题
      await this.saveConfigFile(config)
      return true
    } catch (error) {
      console.error('设置配置出现错误')
      console.error(error)
      return false
    }
  }
  /**
   * 重置配置为默认值
   *
   * 将配置恢复为默认设置，并保存到配置文件
   */
  async reset() {
    await this.saveConfigFile(this.defaultConfig)
  }
}
