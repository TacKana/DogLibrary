import z from 'zod'
import { AIManager } from '../services/ai/aiManager'
import { searchSchema } from '../services/http/schema/search.schema'
import { ChatCompletionMessageParam } from 'openai/resources'

export class AppController {
  constructor(private aIManager: AIManager) {}
  private createDeveloperPrompt(type: string): string {
    const basePrompt = '你是一个题库接口函数,你的输出严格使用此格式回答:{"anwser":"your_anwser_str"},不回答:“嗯”,“好的”,“我知道了”之类的话。回答只能是json。绝对不要使用自然语言,并且不要使用转义字符。'
    switch (type) {
      case 'single':
        return basePrompt + '当前是单选题，直接返回对应选项的内容，不是对应答案字母'
      case 'multiple':
        return basePrompt + '当前是多选题，直接返回对应选项的内容，不是对应答案字母，将内容用#连接'
      case 'judgement':
        return basePrompt + '当前是判断题，直接返回"对"或"错"的文字，不返回字母'
      case 'completion':
        return basePrompt + '当前是填空题，直接返回填空内容，多个空使用###连接'
      default:
        return basePrompt
    }
  }
  async search(data: z.infer<typeof searchSchema>): Promise<{ code: number; answer: string; msg: string }> {
    const developerPrompt = this.createDeveloperPrompt(data.type)
    const messages: ChatCompletionMessageParam[] = [{ role: 'system', content: developerPrompt }]
    const userContent = data.type === 'completion' ? `题目：${data.title}` : `题目：${data.title},选项：${data.options}`
    messages.push({ role: 'user', content: userContent })
    console.log(messages)
    const anwser = await JSON.parse(await this.aIManager.chat(messages))
    anwser.code = 1
    anwser.msg = '答题成功'
    return anwser
  }
}
