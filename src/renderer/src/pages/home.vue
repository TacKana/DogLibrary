<script setup lang="ts">
import autosize from 'autosize'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { UserConfig } from '@common/types/userConfig.interface'
// --- 多行文本框高度自适应 ---
//#region
const textarea = useTemplateRef('textarea')
onMounted(() => {
  autosize(textarea.value!)
})
//#endregion
// --- 多行文本框高度自适应 END ---

// --- 控制HTTP服务和大模型API服务 ---
//#region
const isRunning = ref({
  running: true,
  text: '启动服务',
})
async function switchServer(): Promise<void> {
  if (await window.httpService.isRunning()) {
    await window.httpService.stop()
    ElMessage.success('已停止服务')
    isRunning.value.running = true
    isRunning.value.text = '启动服务'
    return
  }
  await window.httpService.start()
  ElMessage.success('已开启HTTP服务')
  isRunning.value.running = false
  isRunning.value.text = '停止服务'
}
//#endregion
// --- 控制HTTP服务 END ---

// --- 获取配置 ---
/**
 * 加载网络配置的异步函数。
 * 用于从相关数据源获取并更新当前网络配置信息。
 *
 * @returns {Promise<void>} 无返回值，异步执行网络配置加载操作。
 */
const config = ref<UserConfig>()
const ocsConfig = computed(() => [
  {
    name: '狗库',
    homepage: 'http://dogku.xuxo.top',
    url: `http://localhost:${config.value?.network.port}/search`,
    method: 'post',
    type: 'GM_xmlhttpRequest',
    contentType: 'json',
    data: {
      title: '${title}',
      options: '${options}',
      type: '${type}',
    },
    handler: 'return (res)=>res.code === 0 ? [res.data.msg, undefined] : [res.data.msg,res.data.anwser]',
  },
])
async function loadNetworkConfig(): Promise<void> {
  config.value = await window.userConfig.get()
}
onMounted(() => {
  loadNetworkConfig()
})
// --- 获取配置 END ---
</script>

<template>
  <div class="home">
    <h1>首页</h1>
    <div class="serviceStatus">
      <div class="left">
        <p>服务状态</p>
        <p v-show="!isRunning.running" style="color: green">已启动</p>
        <p v-show="isRunning.running">未启动</p>
      </div>
      <div class="right">
        <el-button type="success" :plain="isRunning.running" @click="switchServer">{{ isRunning.text }}</el-button>
      </div>
    </div>
    <div class="allocation">
      <div class="title">
        <p>题库配置（可导入OCS）</p>
        <el-button type="primary" plain>复制配置</el-button>
      </div>

      <div class="textarea">
        <textarea ref="textarea" :value="JSON.stringify(ocsConfig, null, 2)" readonly></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  padding: 15px;
  // height: 100%;
  display: flex;
  flex-direction: column;

  @mixin serviceStatus {
    padding: 15px;
    border: 1px solid #dadada;
    border-radius: 18px;
    margin-top: 20px;

    p:first-child {
      font-weight: bold;
    }
  }

  .serviceStatus {
    @include serviceStatus;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p:last-child {
      color: #c00;
    }
  }

  .allocation {
    @include serviceStatus;

    .title {
      display: flex;
      justify-content: space-between;
    }

    .textarea {
      height: auto;
      // width: 100%;
      margin: 15px 15px 0px 0;

      textarea {
        resize: none;
        padding: 5px;
        width: 100%;
        overflow: hidden;
        /* 隐藏滚动条 */
      }
    }
  }
}
</style>
