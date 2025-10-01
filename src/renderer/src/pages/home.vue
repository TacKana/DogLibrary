<script setup lang="ts">
import autosize from 'autosize'
import { onMounted, ref, useTemplateRef } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { tr } from 'element-plus/es/locales.mjs'
// --- 多行文本框高度自适应 ---
const textarea = useTemplateRef('textarea')
onMounted(() => {
  autosize(textarea.value!)
})
// --- 多行文本框高度自适应 END ---

async function switchHttp() {
  if (await window.httpService.isRunning()) {
    window.httpService.stop()
    ElMessage.success('已停止HTTP服务')
    isRunning.value.boolean =true
    isRunning.value.text="启动服务"
    return
  }
  window.httpService.start()
  ElMessage.success('已开启HTTP服务')
  isRunning.value.boolean =false
  isRunning.value.text="停止服务"
}
const isRunning=ref({
  boolean:true,
  text:"启动服务"
})
</script>

<template>
  <div class="home">
    <h1>首页</h1>
    <div class="serviceStatus">
      <div class="left">
        <p>服务状态</p>
        <p>未启动</p>
      </div>
      <div class="right"><el-button type="success" :plain="isRunning.boolean" @click="switchHttp">{{isRunning.text}}</el-button></div>
    </div>
    <div class="allocation">
      <div class="title">
        <p>题库配置（可导入OCS）</p>
        <el-button type="primary" plain>复制配置</el-button>
      </div>

      <div class="textarea">
        <textarea ref="textarea" readonly>
[{
    "name": "ZE题库(自建版)",
    "homepage": "http://zerror.neoregion.cn",
    "url": "http://localhost:5233/query",
    "method": "get",
    "type": "GM_xmlhttpRequest",
    "contentType": "json",
    "data": {
        "title": "${title}",
        "options": "${options}",
        "type": "${type}"
    },
    "handler": "return (res)=>res.code === 0 ? [res.data.msg, undefined] : [res.data.msg,res.data.data]"
}] </textarea>
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
