import { ChatCompletionMessageParam } from 'openai/resources'
import { aiProvider } from './aiProvider.enum'
import { DeepseekConfig, AlibabaConfig, SiliconflowConfig, VolcengineConfig, NewapiConfig } from './Config.interface'

/**
 * 统一封装各类 AI 服务（Deepseek、Alibaba、Siliconflow、Volcengine、Newapi）的适配器接口。
 * 实现该接口的类负责：
 * 1. 按自身需求初始化 SDK 与配置；
 * 2. 提供 chat 方法完成多轮对话并返回纯文本结果；
 * 3. 在生命周期结束时通过 unload 释放资源。
 */
export interface AIAdapter {
  name: aiProvider
  sdk?: unknown
  config?: DeepseekConfig | AlibabaConfig | SiliconflowConfig | VolcengineConfig | NewapiConfig

  chat(messages: ChatCompletionMessageParam[]): Promise<string>
  unload(): void
}
