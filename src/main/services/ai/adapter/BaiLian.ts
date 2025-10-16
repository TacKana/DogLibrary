import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources'
import { aiProvider } from '../../../../common/types/aiProvider.enum'
import { AlibabaConfig } from '../../../../common/types/Config.interface'
import { AIAdapter } from '../../../../common/types/AIAdapter'

export class BaiLian implements AIAdapter {
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
