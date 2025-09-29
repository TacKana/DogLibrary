//  处理应用配置
import { app, ipcMain } from 'electron'
import path from 'path'
import { aiProvider } from '../../common/types/aiProvider.enum'
import fs from 'fs'
import { UserConfig } from '../../common/types/userConfig.interface'

//默认配置
const defaultUserConfig: UserConfig = {
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
        internetSearch: false
      },
      [aiProvider.alibaba]: {
        apiKey: '',
        internetSearch: false,
        // 模型名称
        modelName: ''
      },
      [aiProvider.siliconflow]: {
        apiKey: '',
        internetSearch: false,
        modelName: ''
      },
      [aiProvider.volcengine]: {
        apiKey: '',
        internetSearch: false,
        modelName: ''
      },
      [aiProvider.newapi]: {
        //api地址
        baseUrl: '',
        apiKey: '',
        internetSearch: false,
        modelName: ''
      }
    }
  },
  network: {
    // 服务端口
    port: 5233,
    // 是否允许局域网访问
    isLAN: false
  }
}

/**
 * 用户配置管理器，用于初始化、读取、保存和修改用户配置，并通过主进程与渲染进程进行IPC双向通信。
 *
 * @remarks
 * - 管理配置文件的读取与写入，路径基于用户数据目录。
 * - 提供初始化方法，支持读取现有配置或创建默认配置。
 * - 导出获取及修改配置的IPC处理函数，实现跨进程调用。
 */
export class UserConfigManager {
  private configPath: string
  private currentConfig: UserConfig

  constructor() {
    // 配置文件路径
    this.configPath = path.join(app.getPath('userData'), 'user-config.json')
    // 当前配置
    this.currentConfig = { ...defaultUserConfig }
  }

  /**
   * 初始化配置，读取现有配置或创建默认配置并启动主进程IPC双向通信
   */
  async initialize(): Promise<void> {
    console.log(this.configPath)

    if (fs.existsSync(this.configPath)) {
      this.currentConfig = await this.readConfigFile()
      console.info('配置读取成功')
    } else {
      await this.saveConfigFile(this.currentConfig)
      console.info('已初始化')
    }

    // 获取配置的ipc双向通信
    ipcMain.handle('get-userConfig', (): UserConfig => {
      return this.getConfig()
    })
    //修改配置的ipc双向通信
    ipcMain.handle('set-userConfig', (_, newConfig: Promise<Partial<UserConfig>>) => {
      return this.setConfig(newConfig)
    })
  }

  /**
   * 保存配置文件
   */
  private async saveConfigFile(config: UserConfig): Promise<void> {
    const dir = path.dirname(this.configPath)
    fs.mkdirSync(dir, { recursive: true })
    await fs.promises.writeFile(this.configPath, JSON.stringify(config, null, 2), 'utf-8')
  }

  /**
   * 加载配置文件
   */
  private async readConfigFile(): Promise<UserConfig> {
    const data = await fs.promises.readFile(this.configPath, 'utf-8')
    return JSON.parse(data)
  }

  // 公共方法供外部使用配置
  getConfig(): UserConfig {
    return { ...this.currentConfig }
  }

  async setConfig(newConfig: Promise<Partial<UserConfig>>): Promise<boolean> {
    try {
      this.currentConfig = { ...this.currentConfig, ...newConfig }
      await this.saveConfigFile(this.currentConfig)
      return true
    } catch (error) {
      console.error('更新配置失败:', error)
      return false
    }
  }
}
