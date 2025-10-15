import { AppController } from './appController'
import { AIManager } from '../services/ai/aiManager'
import { UserConfigManager } from '../services/config/userConfig'
import { HttpManager } from '../services/http/httpManager'
import { CacheManager } from '../services/cache/cacheManager'
import { UpdaterManager } from '../services/updater/updaterManager'

/**
 * 全局服务管理器，负责统一创建与初始化所有核心服务。
 *
 * @remarks
 * 依赖顺序：
 * 1. UserConfigManager 率先初始化，为后续服务提供配置；
 * 2. HttpManager 依赖 UserConfigManager 提供的网络配置；
 * 3. AIManager 依赖 UserConfigManager 提供的 AI 配置。
 *
 * 调用 {@link init} 方法可完成全部服务的异步初始化。
 *
 * @public
 */
export class ServiceManager {
  private userConfigManager: UserConfigManager
  private httpManager: HttpManager
  private aIManager: AIManager
  private appController: AppController
  private cacheManager: CacheManager
  private updaterManager: UpdaterManager

  constructor() {
    this.userConfigManager = new UserConfigManager()
    this.cacheManager = new CacheManager()
    this.aIManager = new AIManager(async () => (await this.userConfigManager.get()).aiConfig)
    this.appController = new AppController(this.aIManager, this.cacheManager)
    this.httpManager = new HttpManager(this.userConfigManager, this.aIManager, this.appController)
    this.updaterManager = new UpdaterManager()
  }
  async init(): Promise<void> {
    // 按依赖顺序初始化
    await this.userConfigManager.initialize()
    this.cacheManager.initialize()
    await this.httpManager.initialize()
    void this.aIManager
    void this.appController
    this.updaterManager.initialize()
  }
}
