import z from 'zod'
import { AIManager } from '../services/ai/aiManager'
import { searchSchema } from '../services/http/schema/search.schema'
import { ChatCompletionMessageParam } from 'openai/resources'
import { CacheManager } from '../services/cache/cacheManager'
import { questionType } from '../services/cache/schema/cache'

export class AppController {
  constructor(
    private aiManager: AIManager,
    private cacheManager: CacheManager,
  ) {}

  /**
   * 根据题目类型生成开发者提示词。
   * 返回的字符串严格限定为纯 JSON 格式：{"answer":"your_answer_str"}，不含任何 Markdown 代码块或转义字符。
   * @param type - 题目类型，取自 searchSchema['type'] 的联合类型
   * @returns 对应题型的完整提示语，包含基础格式要求与题型特定规则
   */
  private createDeveloperPrompt(type: z.infer<typeof searchSchema>['type']): string {
    const basePrompt = '你的输出严格使用此格式回答:{"answer":"your_answer_str"},只能输出纯 JSON（不要包含 markdown 代码块或转义字符）'
    switch (type) {
      case 'single':
        return basePrompt + '当前是单选题，直接返回对应选项的内容，不是对应答案字母'
      case 'multiple':
        return basePrompt + '当前是多选题，直接返回对应选项的内容，不是对应答案字母，将内容用#连接'
      case 'judgement':
        return basePrompt + '当前是判断题，直接返回"对"或"错"文字，如果为英语对错题，直接返回"True"或"False",其他情况返回"√"和"×",不返回字母'
      case 'completion':
        return basePrompt + '当前是填空题，直接返回内容，多个空使用###连接'
      case 'line':
        return basePrompt + '当前是连线题，直接返回内容，多个空使用###连接'
      case 'fill':
        return basePrompt + '当前是完形填空题，直接返回内容，多个空使用###连接'
      case 'reader':
        return basePrompt + '当前是阅读理解题，直接返回内容，多个空使用###连接'
      default:
        return basePrompt
    }
  }

  /**
   * 根据题目类型与内容搜索答案。
   * 优先从缓存中读取；若无缓存，则调用 AI 生成答案并缓存结果。
   *
   * @param data - 经过 searchSchema 校验的题目数据
   * @returns 包含 code、answer、msg 的响应对象
   * @throws 无显式抛出，但 AI 解析失败时会返回默认错误信息
   */
  async search(data: z.infer<typeof searchSchema>): Promise<{ code: number; answer: string; msg: string }> {
    const cache = await this.cacheManager.query(data.title)
    if (data.title === cache?.question) {
      // 调用ai之前先查询数据库中是否有缓存，有则直接返回跳过ai生成
      return {
        code: 1,
        msg: '答题成功',
        answer: cache.answer,
      }
    }
    //没有则请求ai

    // 生成动态系统提示词
    const developerPrompt = this.createDeveloperPrompt(data.type)
    const messages: ChatCompletionMessageParam[] = [{ role: 'system', content: developerPrompt }]
    // 生成用户问题提示词
    const userContent = data.type === 'completion' ? `题目：${data.title}` : `题目：${data.title},选项：${data.options}`
    // 组合提示词
    messages.push({ role: 'user', content: userContent })
    // 创建响应答案对象
    let answer: { answer: string; code: number; msg: string } = { answer: '', code: 0, msg: 'AI解析失败' }
    try {
      // 调用ai对话生成答案，并将答案转换为对象
      answer = JSON.parse(await this.aiManager.chat(messages))
      answer.code = 1
      answer.msg = '答题成功'
    } catch (e) {
      //如果失败就报错
      console.error('AI解析JSON失败', e)
    }
    // 答题成功后缓存答案
    this.cacheManager.save({ type: questionType[data.type], question: data.title, answer: answer.answer })
    return answer
  }
}
