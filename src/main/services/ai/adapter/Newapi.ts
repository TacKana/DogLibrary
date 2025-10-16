import { ChatCompletionMessageParam } from 'openai/resources'
import { aiProvider } from '../../../../common/types/aiProvider.enum'
import { NewapiConfig } from '../../../../common/types/Config.interface'
import OpenAI from 'openai'
import { AIAdapter } from '../../../../common/types/AIAdapter'

export class Newapi implements AIAdapter {
  name = aiProvider.newapi
  sdk: OpenAI | null = null
  config: NewapiConfig
  constructor(config: NewapiConfig) {
    this.config = config
    this.sdk = new OpenAI({
      baseURL: this.config.baseUrl + '/v1',
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
