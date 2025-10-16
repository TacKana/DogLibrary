import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources'
import { aiProvider } from '../../../../common/types/aiProvider.enum'
import { SiliconflowConfig } from '../../../../common/types/config'
import { AIAdapter } from '../../../../common/types/AIAdapter'

export class Siliconflow implements AIAdapter {
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
