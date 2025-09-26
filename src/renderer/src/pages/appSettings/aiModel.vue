<script lang="ts" setup>
import { ElCard, ElRow, ElCol, ElSelect, ElOption, ElInput, ElSwitch } from 'element-plus'
import { reactive, ref } from 'vue'

enum aiConfig {
  deepseek = 'DeepSeek官方',
  alibaba = '阿里云百炼',
  siliconflow = '硅基流动',
  volcengine = '火山引擎',
  newapi = 'NewApi'
}

const value = ref(aiConfig.deepseek)
// aiOptionSelect 是一个包含可选AI模型选项的数组，用于应用设置页面的下拉选择。
// 数组中的每个元素代表一个可选的AI模型配置。
const aiOptionSelect = [
  {
    value: aiConfig.deepseek
  },
  {
    value: aiConfig.alibaba
  },
  {
    value: aiConfig.siliconflow
  },
  {
    value: aiConfig.volcengine
  },
  {
    value: aiConfig.newapi
  }
]

/**
 * AI模型API设置的响应式状态对象。
 * 用于存储与AI模型集成相关的配置选项和参数。
 * 在组件内动态管理和更新API设置时使用此对象。
 */
const aiModelApiSetting = reactive({
  [aiConfig.deepseek]: {
    apiKey: '',
    isDeep: false,
    internetSearch: false
  },
  [aiConfig.alibaba]: {
    apiKey: '',
    internetSearch: false,
    modelName: ''
  },
  [aiConfig.siliconflow]: {
    apiKey: '',
    internetSearch: false,
    modelName: ''
  },
  [aiConfig.volcengine]: {
    apiKey: '',
    internetSearch: false,
    modelName: ''
  },
  [aiConfig.newapi]: {
    baseUrl: '',
    apiKey: '',
    internetSearch: false,
    modelName: ''
  }
})
</script>
<template>
  <div class="aiModel">
    <div class="card">
      <el-card>
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
              <el-select v-model="value" placeholder="Select">
                <el-option v-for="item in aiOptionSelect" :key="item.value" :value="item.value" />
              </el-select>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="card">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>{{ value }}</span>
          </div>
        </template>
        <el-row :gutter="0">
          <!-- Deepseek官方的api设置 -->
          <div v-if="value === aiConfig.deepseek" class="body">
            <ul>
              <li><p>DeepSeek官方Api密钥</p></li>
              <li>
                <el-input
                  v-model="aiModelApiSetting[aiConfig.deepseek].apiKey"
                  placeholder="请输入API密钥 (YOUR_API_KEY_HERE)"
                />
              </li>
              <li>
                <a href="https://platform.deepseek.com/usage" target="_blank"><p>获取Api密钥</p></a>
              </li>
              <li>
                <div>
                  深度思考
                  <el-switch v-model="aiModelApiSetting[aiConfig.deepseek].isDeep" />
                </div>
              </li>
              <li>
                <div>
                  联网搜索
                  <el-switch v-model="aiModelApiSetting[aiConfig.deepseek].internetSearch" />
                </div>
              </li>
            </ul>
          </div>
          <!-- 阿里云百炼的api设置 -->
          <div v-else-if="value === aiConfig.alibaba" class="body">
            <ul>
              <li><p>阿里云百炼Api密钥</p></li>
              <li>
                <el-input
                  v-model="aiModelApiSetting[aiConfig.alibaba].apiKey"
                  placeholder="请输入API密钥 (YOUR_API_KEY_HERE)"
                />
              </li>
              <li>
                <a href="https://bailian.console.aliyun.com/#/home" target="_blank"
                  ><p>获取Api密钥</p></a
                >
              </li>
              <li><p>阿里云百炼模型名称</p></li>
              <li>
                <el-input
                  v-model="aiModelApiSetting[aiConfig.alibaba].modelName"
                  placeholder="请输入模型名称"
                />
              </li>
              <li>
                <div>
                  联网搜索
                  <el-switch v-model="aiModelApiSetting[aiConfig.alibaba].internetSearch" />
                </div>
              </li>
            </ul>
          </div>
          <!-- 硅基流动的api设置 -->
          <div v-else-if="value === aiConfig.siliconflow" class="body">
            <ul>
              <li><p>硅基流动Api密钥</p></li>
              <li>
                <el-input
                  v-model="aiModelApiSetting[aiConfig.siliconflow].apiKey"
                  placeholder="请输入API密钥 (YOUR_API_KEY_HERE)"
                />
              </li>
              <li>
                <a href="https://cloud.siliconflow.cn/me/account/ak" target="_blank"
                  ><p>获取Api密钥</p></a
                >
              </li>
              <li><p>硅基流动模型名称</p></li>
              <li>
                <el-input
                  v-model="aiModelApiSetting[aiConfig.siliconflow].modelName"
                  placeholder="请输入模型名称"
                />
              </li>
              <li>
                <div>
                  联网搜索
                  <el-switch v-model="aiModelApiSetting[aiConfig.alibaba].internetSearch" />
                </div>
              </li>
            </ul>
          </div>
          <!-- 火山引擎的api设置 -->
          <div v-else-if="value === aiConfig.volcengine" class="body">
            <ul>
              <li><p>火山引擎的Api密钥</p></li>
              <li>
                <el-input
                  v-model="aiModelApiSetting[aiConfig.volcengine].apiKey"
                  placeholder="请输入API密钥 (YOUR_API_KEY_HERE)"
                />
              </li>
              <li>
                <a href="https://console.volcengine.com/ark" target="_blank"><p>获取Api密钥</p></a>
              </li>
              <li><p>火山引擎的模型名称</p></li>
              <li>
                <el-input
                  v-model="aiModelApiSetting[aiConfig.volcengine].modelName"
                  placeholder="请输入模型名称"
                />
              </li>
              <li>
                <div>
                  联网搜索
                  <el-switch v-model="aiModelApiSetting[aiConfig.volcengine].internetSearch" />
                </div>
              </li>
            </ul>
          </div>
          <!-- NewApi的api设置 -->
          <div v-else-if="value === aiConfig.newapi" class="body">
            <ul>
              <li>
                <p>NewApi接口地址</p>
              </li>
              <li>
                <el-input
                  v-model="aiModelApiSetting[aiConfig.newapi].baseUrl"
                  placeholder="请输入NewApi的接口地址"
                ></el-input>
              </li>
              <li>
                <a href="https://docs.newapi.pro/api/openai-chat/" target="_blank"
                  ><p>获取NewApi地址</p></a
                >
              </li>
              <li><p>NewApi的Api密钥</p></li>
              <li>
                <el-input
                  v-model="aiModelApiSetting[aiConfig.newapi].apiKey"
                  placeholder="请输入API密钥 (YOUR_API_KEY_HERE)"
                />
              </li>
              <li>
                <a href="https://docs.newapi.pro/guide/console/api-token/" target="_blank"
                  ><p>获取Api密钥</p></a
                >
              </li>
              <li><p>NewApi的模型名称</p></li>
              <li>
                <el-input
                  v-model="aiModelApiSetting[aiConfig.newapi].modelName"
                  placeholder="请输入模型名称"
                />
              </li>
              <li>
                <div>
                  联网搜索
                  <el-switch v-model="aiModelApiSetting[aiConfig.newapi].internetSearch" />
                </div>
              </li>
            </ul>
          </div>
        </el-row>
      </el-card>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.aiModel {
  padding: 15px;
  .card {
    padding-bottom: 15px;

    .body {
      width: 100%;
      ul {
        li {
          padding-bottom: 10px;
        }
      }
    }
  }
}
</style>
