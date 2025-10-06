<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElMessage, ElInput, MessageHandler } from 'element-plus'
import { UserConfig } from '@common/types/userConfig.interface'

// --- 控制服务 ---
//#region
const ip = ref('')
const isRunning = ref({
  running: false,
  text: '启动服务',
})
/**
 * 控制服务开关
 *
 * 异步函数，用于控制服务开关
 *
 * @returns {Promise<void>} 返回一个 Promise 对象，在服务器切换完成后解析
 */
async function switchServer(): Promise<void> {
  await loadNetworkConfig()
  ip.value = await window.httpService.getLocalIP()
  if (await window.httpService.isRunning()) {
    await window.httpService.stop()
    ElMessage.success('已停止服务')
    isRunning.value.running = false
    isRunning.value.text = '启动服务'
    ocsConfig.value = ''
    return
  }
  await window.httpService.start()
  ElMessage.success('已开启HTTP服务')
  isRunning.value.running = true
  isRunning.value.text = '停止服务'
  ocsConfig.value = JSON.stringify(
    [
      {
        name: '狗库',
        homepage: 'http://dogku.xuxo.top',
        url: `http://${config.value?.network?.isLAN ? ip.value : 'localhost'}:${config.value?.network?.port}/search`,
        method: 'get',
        type: 'GM_xmlhttpRequest',
        contentType: 'json',
        data: {
          //这里是模板占位
          title: '${title}',
          options: '${options}',
          type: '${type}',
        },
        // ocs网课助手模板脚本
        handler: 'return (res)=>res.code === 0 ? [res.data.msg, undefined] : [res.data.msg,res.data.anwser]',
      },
    ],
    null,
    2,
  )
}
//#endregion
// --- 控制服务 END ---

// --- 获取配置 ---
const config = ref<UserConfig>()
const ocsConfig = ref('')

async function loadNetworkConfig(): Promise<void> {
  config.value = await window.userConfig.get()
}

// --- 获取配置 END ---

// --- 复制配置 ---
async function copyConfig(): Promise<MessageHandler> {
  if (ocsConfig.value === '') return ElMessage.warning('未启动服务，无法复制配置')
  await navigator.clipboard.writeText(ocsConfig.value)
  return ElMessage.success('已复制到剪贴板')
}
// --- 复制配置 END ---
</script>

<template>
  <div class="home">
    <h1>首页</h1>
    <div class="serviceStatus">
      <div class="left">
        <p>服务状态</p>
        <p v-show="isRunning.running" style="color: green">已启动</p>
        <p v-show="!isRunning.running">未启动</p>
      </div>
      <div class="right">
        <el-button type="success" :plain="!isRunning.running" @click="switchServer">{{ isRunning.text }}</el-button>
      </div>
    </div>
    <div class="allocation">
      <div class="title">
        <p>题库配置（可导入OCS）</p>
        <el-button type="primary" plain @click="copyConfig">复制配置</el-button>
      </div>

      <div class="textarea">
        <el-input v-model="ocsConfig" style="width: 100%" autosize type="textarea" readonly placeholder="启动后获取配置" />
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
