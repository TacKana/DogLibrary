import { ChatCompletionMessageParam } from 'openai/resources'
import { aiProvider } from '../../../common/types/aiProvider.enum'
import { AiConfig } from '../../../common/types/config'
import { BaiLian } from './adapter/BaiLian'
import { DeepSeek } from './adapter/DeepSeek'
import { Siliconflow } from './adapter/Siliconflow'
import { Volcengine } from './adapter/Volcengine'
import { AIAdapter } from '../../../common/types/AIAdapter'
import { Newapi } from './adapter/Newapi'
import { ConfigManager } from '../config/config'

/**
 * AIManager 负责按需异步加载并管理 AI 服务提供器。
 *
 * @remarks
 * 1. 构造函数接收一个返回 `AiConfig` 的异步函数，用于运行时获取最新配置。
 * 2. 调用 `load()` 后，根据 `config.apiProvider` 字段实例化对应的 AI 适配器（DeepSeek、BaiLian、Siliconflow、Volcengine、Newapi），
 *    并将其缓存到 `activeProvider`。
 * 3. 通过 `chat(messages)` 方法，将符合 OpenAI 格式的对话消息转发给当前激活的提供器，并返回完整回复。
 * 4. 调用 `unload()` 可释放当前提供器资源，并将 `activeProvider` 置空。
 *
 * @example
 * ```ts
 * const getCfg = async () => (await readConfig()).ai;
 * const mgr = new AIManager(getCfg);
 * await mgr.load();
 * const reply = await mgr.chat([{ role: 'user', content: '你好' }]);
 * await mgr.unload();
 * ```
 *
 * @public
 */

export class AIManager {
  private config!: AiConfig
  private getConfig!: () => Promise<AiConfig>
  private activeProvider?: AIAdapter
  providerMap: Record<string, (cfg) => AIAdapter>

  constructor(private ConfigManager: ConfigManager) {
    this.providerMap = {
      [aiProvider.deepseek]: (cfg) => new DeepSeek(cfg),
      [aiProvider.alibaba]: (cfg) => new BaiLian(cfg),
      [aiProvider.siliconflow]: (cfg) => new Siliconflow(cfg),
      [aiProvider.volcengine]: (cfg) => new Volcengine(cfg),
      [aiProvider.newapi]: (cfg) => new Newapi(cfg),
    }
  }

  async initialize(): Promise<void> {
    this.getConfig = async () => (await this.ConfigManager.get()).aiConfig
  }

  /**
   * 加载AI服务提供商
   *
   * 从配置中获取AI提供商设置，初始化对应的提供商实例。
   * 如果配置的提供商不被支持，将抛出错误。
   * 成功加载后会打印日志信息。
   *
   * @throws {Error} 当配置的AI提供商不被支持时抛出错误
   * @returns {Promise<void>} 异步操作完成后的Promise
   */
  async load(): Promise<void> {
    this.config = await this.getConfig()
    const cfg = this.config.aiProviderConfig
    const provider = this.providerMap[this.config.apiProvider]
    if (!provider) {
      throw new Error(`不支持的提供商: ${this.config.apiProvider}`)
    }
    this.activeProvider = provider(cfg[this.config.apiProvider])
    console.log(`当前已经加载`)
  }

  /**
   * 向当前激活的 AI 服务提供者发送对话请求。
   *
   * @param messages - 符合 OpenAI 格式的对话消息数组。
   * @returns 提供者返回的完整回复文本。
   * @throws {Error} 若 `AIManager` 尚未初始化或无可用的服务提供者。
   */
  async chat(messages: ChatCompletionMessageParam[]): Promise<string> {
    if (!this.activeProvider) throw new Error(`AIManager未初始化或不支持的服务提供者`)
    return this.activeProvider.chat(messages)
  }
  async unload(): Promise<void> {
    if (this.activeProvider) {
      this.activeProvider.unload()
      this.activeProvider = undefined
    }
  }
}
