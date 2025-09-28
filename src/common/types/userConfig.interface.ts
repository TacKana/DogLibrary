import { aiProvider } from './aiProvider.enum'

export interface DeepseekConfig {
  apiKey: string
  isDeep: boolean
  internetSearch: boolean
}

export interface AlibabaConfig {
  apiKey: string
  internetSearch: boolean
  modelName: string
}

export interface SiliconflowConfig {
  apiKey: string
  internetSearch: boolean
  modelName: string
}

export interface VolcengineConfig {
  apiKey: string
  internetSearch: boolean
  modelName: string
}

export interface NewapiConfig {
  baseUrl: string
  apiKey: string
  internetSearch: boolean
  modelName: string
}

export interface AiProviderConfig {
  [aiProvider.deepseek]: DeepseekConfig
  [aiProvider.alibaba]: AlibabaConfig
  [aiProvider.siliconflow]: SiliconflowConfig
  [aiProvider.volcengine]: VolcengineConfig
  [aiProvider.newapi]: NewapiConfig
}

export interface AiConfig {
  apiProvider: aiProvider
  aiProviderConfig: AiProviderConfig
}

export interface NetworkConfig {
  port: number
  isLAN: boolean
}

export interface UserConfig {
  aiConfig: AiConfig
  network: NetworkConfig
}
