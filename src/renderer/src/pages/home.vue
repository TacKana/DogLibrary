<script setup lang="ts">
import autosize from 'autosize'
import { onMounted, useTemplateRef } from 'vue'
import { ElButton } from 'element-plus'

const textarea = useTemplateRef('textarea')
onMounted(() => {
  autosize(textarea.value!)
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
      <div class="right"><el-button type="success" plain>启动服务</el-button></div>
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
}] </textarea
        >
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
