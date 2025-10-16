import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources'
import { aiProvider } from '../../../../common/types/aiProvider.enum'
import { VolcengineConfig } from '../../../../common/types/Config.interface'
import { AIAdapter } from '../../../../common/types/AIAdapter'

export class Volcengine implements AIAdapter {
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
