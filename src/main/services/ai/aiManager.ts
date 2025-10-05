import { ChatCompletionMessageParam } from 'openai/resources'
import { aiProvider } from '../../../common/types/aiProvider.enum'
import { AiConfig, AlibabaConfig, DeepseekConfig, NewapiConfig, SiliconflowConfig, VolcengineConfig } from '../../../common/types/userConfig.interface'
import OpenAI from 'openai'

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
  private getConfig: () => Promise<AiConfig>
  private activeProvider?: AIAdapter

  constructor(getConfig: () => Promise<AiConfig>) {
    this.getConfig = getConfig
  }
  /**
   * 异步加载并初始化 AI 服务提供器。
   *
   * @remarks
   * 根据当前配置中的 `apiProvider` 字段，从 `aiProviderConfig` 中取出对应配置，
   * 实例化相应的提供器（DeepSeek、BaiLian、Siliconflow、Volcengine、Newapi），
   * 并将其赋值给 `activeProvider`。
   *
   * 若配置中指定的提供器不受支持，则抛出错误。
   *
   * @throws {Error} 当 `apiProvider` 为未知值时抛出“不支持的提供商”错误。
   *
   * @returns {Promise<void>} 完成加载后返回的 Promise，无额外值。
   */
  async load(): Promise<void> {
    this.config = await this.getConfig()
    const cfg = this.config.aiProviderConfig
    switch (this.config.apiProvider) {
      case aiProvider.deepseek:
        this.activeProvider = new DeepSeek(cfg[aiProvider.deepseek])
        break
      case aiProvider.alibaba:
        this.activeProvider = new BaiLian(cfg[aiProvider.alibaba])
        break
      case aiProvider.siliconflow:
        this.activeProvider = new Siliconflow(cfg[aiProvider.siliconflow])
        break
      case aiProvider.volcengine:
        this.activeProvider = new Volcengine(cfg[aiProvider.volcengine])
        break
      case aiProvider.newapi:
        this.activeProvider = new Newapi(cfg[aiProvider.newapi])
        break
      default:
        throw new Error(`不支持的提供商: ${this.config.apiProvider}`)
    }
    console.log(`当前已经加载`)
    console.log(this.activeProvider)
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
      console.log(`当前已经卸载${this.activeProvider}`)
    }
  }
}
//各家api的适配器
//#region
/**
 * 统一封装各类 AI 服务（Deepseek、Alibaba、Siliconflow、Volcengine、Newapi）的适配器接口。
 * 实现该接口的类负责：
 * 1. 按自身需求初始化 SDK 与配置；
 * 2. 提供 chat 方法完成多轮对话并返回纯文本结果；
 * 3. 在生命周期结束时通过 unload 释放资源。
 */
interface AIAdapter {
  name: aiProvider
  sdk?: unknown
  config?: DeepseekConfig | AlibabaConfig | SiliconflowConfig | VolcengineConfig | NewapiConfig

  chat(messages: ChatCompletionMessageParam[]): Promise<string>
  unload(): void
}

class DeepSeek implements AIAdapter {
  name = aiProvider.deepseek
  sdk: OpenAI | null = null
  config: DeepseekConfig
  constructor(config: DeepseekConfig) {
    this.config = config
    this.sdk = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: this.config.apiKey,
    })
  }
  unload(): void {
    this.sdk = null
  }
  async chat(messages: ChatCompletionMessageParam[]): Promise<string> {
    const completion = await this.sdk!.chat.completions.create({
      messages: messages, // ← 数组原样传递
      model: this.config.isDeep ? 'deepseek-reasoner' : 'deepseek-chat',
    })
    return completion.choices[0]?.message?.content ?? ''
  }
}
class BaiLian implements AIAdapter {
  name = aiProvider.alibaba
  sdk: OpenAI | null = null
  config: AlibabaConfig
  constructor(config: AlibabaConfig) {
    this.config = config
    this.sdk = new OpenAI({
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      apiKey: this.config.apiKey,
    })
  }
  unload(): void {
    this.sdk = null
  }
  async chat(messages: ChatCompletionMessageParam[]): Promise<string> {
    const completion = await this.sdk!.chat.completions.create({
      messages: messages, // ← 数组原样传递
      model: this.config.modelName,
    })
    return completion.choices[0]?.message?.content ?? ''
  }
}
class Siliconflow implements AIAdapter {
  name = aiProvider.siliconflow
  sdk: OpenAI | null = null
  config: SiliconflowConfig
  constructor(config: SiliconflowConfig) {
    this.config = config
    this.sdk = new OpenAI({
      baseURL: 'https://api.siliconflow.cn/v1',
      apiKey: this.config.apiKey,
    })
  }
  unload(): void {
    this.sdk = null
  }
  async chat(messages: ChatCompletionMessageParam[]): Promise<string> {
    const completion = await this.sdk!.chat.completions.create({
      messages: messages, // ← 数组原样传递
      model: this.config.modelName,
    })
    return completion.choices[0]?.message?.content ?? ''
  }
}
class Volcengine implements AIAdapter {
  name = aiProvider.volcengine
  sdk: OpenAI | null = null
  config: VolcengineConfig
  constructor(config: VolcengineConfig) {
    this.config = config
    this.sdk = new OpenAI({
      baseURL: 'https://ark.cn-beijing.volces.com/api/v3/',
      apiKey: this.config.apiKey,
    })
  }
  unload(): void {
    this.sdk = null
  }
  async chat(messages: ChatCompletionMessageParam[]): Promise<string> {
    const completion = await this.sdk!.chat.completions.create({
      messages: messages, // ← 数组原样传递
      model: this.config.modelName,
    })
    return completion.choices[0]?.message?.content ?? ''
  }
}
class Newapi implements AIAdapter {
  name = aiProvider.newapi
  sdk: OpenAI | null = null
  config: NewapiConfig
  constructor(config: NewapiConfig) {
    this.config = config
    this.sdk = new OpenAI({
      baseURL: this.config.baseUrl,
      apiKey: this.config.apiKey,
    })
  }
  unload(): void {
    this.sdk = null
  }
  async chat(messages: ChatCompletionMessageParam[]): Promise<string> {
    const completion = await this.sdk!.chat.completions.create({
      messages: messages, // ← 数组原样传递
      model: this.config.modelName,
    })
    console.log(completion)

    return completion.choices[0].message.content!
  }
}
//#endregion
