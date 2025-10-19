<script lang="ts" setup>
/**
 * @file aiModel.vue
 * @description
 * 本文件主要负责应用设置页面中 AI 模型相关配置的逻辑，包括：
 * - 定义了当前所选 AI API 提供商和其配置的响应式变量；
 * - 加载和初始化 AI 提供商与配置参数；
 * - 提供异步函数用于从主进程获取和保存 AI 配置信息；
 * - 支持 Element Plus 组件库进行界面组件化展示与交互。
 *
 * 主要功能说明：
 * 1. 通过 `loadAIconfig` 方法，在页面初始化时，异步加载本地存储的 AI 配置信息，填充界面参数及可选项；
 * 2. 通过 `saveAIconfig` 方法，将用户在页面上更改的 AI 参数配置持久化到本地配置文件，同时给予成功提示反馈。
 *
 * 相关类型与依赖：
 * - 引入了类型枚举 `aiProvider` 和接口 `AiProviderConfig`，限定和约束 AI 提供商及其配置数据结构；
 * - 使用 Element Plus UI 组件进行页面布局与交互。
 *
 * 使用场景：
 * - 主要用于“应用设置-模型配置”页面，为用户提供直观、便捷的 AI 提供商切换与参数配置功能。
 */

import { ElCard, ElRow, ElCol, ElSelect, ElOption, ElInput, ElSwitch, ElButton, ElMessage, ElText } from 'element-plus'
import { onMounted, ref, toRaw } from 'vue'
import { aiProvider } from '@common/types/aiProvider.enum'
import { AiProviderConfig } from '@common/types/config'
import FadeOutTransition from '@renderer/components/FadeOutTransition.vue'

// --- 主要变量 ---
// 当前所选的 AI API 提供商。
const apiProvider = ref<aiProvider>()
// 可选的 AI 提供商列表。
const aiOptionSelect = ref<{ value: string }[]>([])
// 各家 AI 提供商的参数配置对象。
const aiModelApiSetting = ref({} as AiProviderConfig)

/**
 * 加载 AI 配置的异步函数。
 * 此函数用于从获取并加载 AI 相关的配置信息，在页面初始化或设置变更时调用。
 *
 * @returns {Promise<void>} 无返回值，仅执行配置加载操作。
 */
async function loadconfig(): Promise<void> {
  // 通过ipc双向通信拿到配置
  const { aiConfig } = await window.Config.get()
  // 加载当前所选的 AI API 提供商
  apiProvider.value = aiConfig.apiProvider
  // 加载API提供商选项
  aiOptionSelect.value = Object.keys(aiConfig.aiProviderConfig).map((key) => ({ value: key }))
  // 加载各家api的配置选项
  aiModelApiSetting.value = aiConfig.aiProviderConfig
}
onMounted(() => {
  loadconfig()
}) // 等待组件组件挂载完成后执行加载配置

/**
 * 保存 AI 配置的异步函数。
 * 该方法将用户设置的 AI 配置进行保存，执行过程中不会阻塞主线程。
 * 通常用于应用设置页，确保 AI 参数持久化。
 */
async function saveAIconfig(): Promise<void> {
  const newConfig = {
    aiConfig: {
      apiProvider: apiProvider.value!,
      aiProviderConfig: { ...toRaw(aiModelApiSetting.value) },
    },
  }
  const res = await window.Config.set(newConfig)
  console.log(res)
  if (res === true) {
    ElMessage.success('保存成功')
  }
}
</script>
<template>
  <div class="aiModel">
    <div class="card">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>API提供商</span>
          </div>
        </template>
        <el-row :gutter="0">
          <el-col :span="20">
            <div>选择默认的AI提供商</div>
          </el-col>
          <el-col :span="4">
            <div>
              <el-select v-model="apiProvider" placeholder="Select">
                <el-option v-for="item in aiOptionSelect" :key="item.value" :value="item.value" :label="item.value" />
              </el-select>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="card">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>{{ apiProvider }}</span>
          </div>
        </template>
        <el-row :gutter="0">
          <!-- Deepseek官方的api设置 -->
          <FadeOutTransition>
            <div v-if="apiProvider === aiProvider.deepseek" class="body">
              <ul>
                <li><p>DeepSeek官方Api密钥</p></li>
                <li>
                  <el-input v-model="aiModelApiSetting[aiProvider.deepseek].apiKey" placeholder="请输入API密钥 (YOUR_API_KEY_HERE)" />
                </li>
                <li>
                  <a href="https://platform.deepseek.com/usage" target="_blank"
                    ><p><el-text type="primary">获取Api密钥</el-text></p></a
                  >
                </li>
                <li>
                  <div>
                    深度思考
                    <el-switch v-model="aiModelApiSetting[aiProvider.deepseek].isDeep" />
                  </div>
                </li>
                <li>
                  <div>
                    联网搜索
                    <el-switch v-model="aiModelApiSetting[aiProvider.deepseek].internetSearch" :disabled="true" />
                  </div>
                </li>
              </ul>
            </div>
            <!-- 阿里云百炼的api设置 -->
            <div v-else-if="apiProvider === aiProvider.alibaba" class="body">
              <ul>
                <li><p>阿里云百炼Api密钥</p></li>
                <li>
                  <el-input v-model="aiModelApiSetting[aiProvider.alibaba].apiKey" placeholder="请输入API密钥 (YOUR_API_KEY_HERE)" />
                </li>
                <li>
                  <a href="https://bailian.console.aliyun.com/#/home" target="_blank"
                    ><p><el-text type="primary">获取Api密钥</el-text></p></a
                  >
                </li>
                <li><p>阿里云百炼模型名称</p></li>
                <li>
                  <el-input v-model="aiModelApiSetting[aiProvider.alibaba].modelName" placeholder="请输入模型名称" />
                </li>
                <li>
                  <div>
                    联网搜索
                    <el-switch v-model="aiModelApiSetting[aiProvider.alibaba].internetSearch" :disabled="true" />
                  </div>
                </li>
              </ul>
            </div>
            <!--- 硅基流动的api设置 -->
            <div v-else-if="apiProvider === aiProvider.siliconflow" class="body">
              <ul>
                <li><p>硅基流动Api密钥</p></li>
                <li>
                  <el-input v-model="aiModelApiSetting[aiProvider.siliconflow].apiKey" placeholder="请输入API密钥 (YOUR_API_KEY_HERE)" />
                </li>
                <li>
                  <a href="https://cloud.siliconflow.cn/me/account/ak" target="_blank"
                    ><p><el-text type="primary">获取Api密钥</el-text></p></a
                  >
                </li>
                <li><p>硅基流动模型名称</p></li>
                <li>
                  <el-input v-model="aiModelApiSetting[aiProvider.siliconflow].modelName" placeholder="请输入模型名称" />
                </li>
                <li>
                  <div>
                    联网搜索
                    <el-switch v-model="aiModelApiSetting[aiProvider.siliconflow].internetSearch" :disabled="true" />
                  </div>
                </li>
              </ul>
            </div>
            <!-- 火山引擎的api设置 -->
            <div v-else-if="apiProvider === aiProvider.volcengine" class="body">
              <ul>
                <li><p>火山引擎的Api密钥</p></li>
                <li>
                  <el-input v-model="aiModelApiSetting[aiProvider.volcengine].apiKey" placeholder="请输入API密钥 (YOUR_API_KEY_HERE)" />
                </li>
                <li>
                  <a href="https://console.volcengine.com/ark" target="_blank"
                    ><p><el-text type="primary">获取Api密钥</el-text></p></a
                  >
                </li>
                <li><p>火山引擎的模型名称</p></li>
                <li>
                  <el-input v-model="aiModelApiSetting[aiProvider.volcengine].modelName" placeholder="请输入模型名称" />
                </li>
                <li>
                  <div>
                    联网搜索
                    <el-switch v-model="aiModelApiSetting[aiProvider.volcengine].internetSearch" :disabled="true" />
                  </div>
                </li>
              </ul>
            </div>
            <!--- NewApi的api设置 -->
            <div v-else-if="apiProvider === aiProvider.newapi" class="body">
              <ul>
                <li>
                  <p>NewApi接口地址</p>
                </li>
                <li>
                  <el-input v-model="aiModelApiSetting[aiProvider.newapi].baseUrl" placeholder="请输入NewApi的接口地址"></el-input>
                </li>
                <li>
                  <a href="https://docs.newapi.pro/api/openai-chat/" target="_blank"
                    ><p><el-text type="primary">获取NewApi地址</el-text></p></a
                  >
                </li>
                <li><p>NewApi的Api密钥</p></li>
                <li>
                  <el-input v-model="aiModelApiSetting[aiProvider.newapi].apiKey" placeholder="请输入API密钥 (YOUR_API_KEY_HERE)" />
                </li>
                <li>
                  <a href="https://docs.newapi.pro/guide/console/api-token/" target="_blank"
                    ><p><el-text type="primary">获取Api密钥</el-text></p></a
                  >
                </li>
                <li><p>NewApi的模型名称</p></li>
                <li>
                  <el-input v-model="aiModelApiSetting[aiProvider.newapi].modelName" placeholder="请输入模型名称" />
                </li>
                <li>
                  <div>
                    联网搜索
                    <el-switch v-model="aiModelApiSetting[aiProvider.newapi].internetSearch" :disabled="true" />
                  </div>
                </li>
              </ul>
            </div>
          </FadeOutTransition>
        </el-row>
        <template #footer><el-button type="primary" @click="saveAIconfig">保存配置</el-button></template>
      </el-card>
    </div>
  </div>
</template>
<style lang="scss" scoped>
// 整个AI模型设置页面的外层样式
.aiModel {
  padding: 15px;

  // 每个卡片之间的下间距
  .card {
    padding-bottom: 15px;

    // 卡片内容区
    .body {
      width: 100%;

      // 配置项列表
      ul {
        li {
          // 列表项间隔
          padding-bottom: 10px;
        }
      }
    }
  }
}
</style>
