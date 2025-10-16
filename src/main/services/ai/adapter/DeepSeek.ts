import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources'
import { aiProvider } from '../../../../common/types/aiProvider.enum'
import { DeepseekConfig } from '../../../../common/types/config'
import { AIAdapter } from '../../../../common/types/AIAdapter'

export class DeepSeek implements AIAdapter {
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
