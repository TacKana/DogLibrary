import { AnswersController } from '../controller/answers'
import { AIManager } from './ai/AI'
import { ConfigManager } from './config/config'
import { HttpManager } from './http/httpManager'
import { CacheManager } from './cache/cacheManager'
import { UpdaterManager } from './updater/updaterManager'

/**
 * 全局服务管理器，负责统一创建与初始化所有核心服务。
 *
 * @remarks
 * 依赖顺序：
 * 1. ConfigManager 率先初始化，为后续服务提供配置；
 * 2. HttpManager 依赖 ConfigManager 提供的网络配置；
 * 3. AIManager 依赖 ConfigManager 提供的 AI 配置。
 *
 * 调用 {@link init} 方法可完成全部服务的异步初始化。
 *
 * @public
 */
export class ServiceManager {
  private ConfigManager: ConfigManager
  private httpManager: HttpManager
  private aIManager: AIManager
  private AnswersController: AnswersController
  private cacheManager: CacheManager
  private updaterManager: UpdaterManager

  constructor() {
    this.ConfigManager = new ConfigManager()
    this.cacheManager = new CacheManager()
    this.aIManager = new AIManager(this.ConfigManager)
    this.AnswersController = new AnswersController(this.aIManager, this.cacheManager)
    this.httpManager = new HttpManager(this.ConfigManager, this.aIManager, this.AnswersController)
    this.updaterManager = new UpdaterManager()
  }
  async init(): Promise<void> {
    // 按依赖顺序初始化
    await this.ConfigManager.initialize()
    this.cacheManager.initialize()
    await this.httpManager.initialize()
    await this.aIManager.initialize()
    void this.AnswersController
    this.updaterManager.initialize()
  }
}
