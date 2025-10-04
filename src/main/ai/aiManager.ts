import { ChatCompletionMessageParam } from 'openai/resources'
import { aiProvider } from '../../common/types/aiProvider.enum'
import { AiConfig, AlibabaConfig, DeepseekConfig, NewapiConfig, SiliconflowConfig, VolcengineConfig } from '../../common/types/userConfig.interface'
import OpenAI from 'openai'
import { ipcMain } from 'electron'

/**
 * AIManager – 统一 AI 服务调度器
 *
 * @description
 * 负责在运行时动态加载/卸载不同 AI 提供商（DeepSeek、BaiLian、Siliconflow、Volcengine、Newapi）。
 * 通过 IPC 暴露 `load-AIManager` / `unload-AIManager` 两条通道，供渲染进程按需激活或释放资源。
 * 内部维护一个 `AIAdapter` 实例，所有聊天请求最终转发给当前激活的提供商。
 *
 * @remarks
 * - 构造函数接收一个异步配置读取函数，确保在真正加载前拿到最新配置。
 * - `initialize()` 会清理同名 IPC 句柄，防止重复注册。
 * - 若配置中指定的提供商未被支持，将抛出错误。
 * - 卸载时会调用底层适配器的 `unload()` 方法，并清空引用。
 *
 * @example
 * ```ts
 * const ai = new AIManager(() => store.get('aiConfig'));
 * await ai.initialize();
 * const reply = await ai.chat([{ role: 'user', content: '你好' }]);
 * ```
 */
export class AIManager {
  private config!: AiConfig
  private getConfig: () => Promise<AiConfig>
  private activeProvider?: AIAdapter

  constructor(getConfig: () => Promise<AiConfig>) {
    this.getConfig = getConfig
  }
  async initialize(): Promise<void> {
    ipcMain.removeHandler('load-AIManager')
    ipcMain.removeHandler('unload-AIManager')

    ipcMain.handle('load-AIManager', () => {
      return this.load()
    })
    ipcMain.handle('unload-AIManager', () => {
      return this.unload()
    })
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
  private async load(): Promise<void> {
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
  private async unload(): Promise<void> {
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
    return completion.choices[0]?.message?.content ?? ''
  }
}
//#endregion
