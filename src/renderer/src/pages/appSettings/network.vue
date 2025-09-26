<script lang="ts" setup>
import { ElCard, ElRow, ElCol, ElSwitch, ElText, ElInput, ElAlert } from 'element-plus'
import { reactive } from 'vue'

const networkOption = reactive({
  port: 5233,
  isLAN: false
})
</script>
<template>
  <div class="network">
    <div class="card">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>网络设置</span>
          </div>
        </template>
        <div class="elrow">
          <el-row :gutter="0">
            <el-col :span="20">
              <div>服务端口</div>
              <el-text type="info">设置服务运行在那个端口上（需要重启服务生效）</el-text>
            </el-col>
            <el-col :span="4">
              <div>
                <el-input v-model="networkOption.port" type="number" />
              </div>
            </el-col>
            <el-alert
              title="端口范围：1024~65535，且只能为正整数"
              type="warning"
              :closable="false"
              show-icon
            />
          </el-row>
        </div>

        <div class="elrow">
          <el-row :gutter="0">
            <el-col :span="20">
              <div>允许局域网访问</div>
              <el-text type="info">开启后局域网的其他设备可以访问此服务（重启生效）</el-text>
            </el-col>
            <el-col :span="4">
              <div>
                <el-switch v-model="networkOption.isLAN" size="large"></el-switch>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.network {
  padding: 15px;

  .card {
    padding-bottom: 15px;

    .elrow {
      padding-bottom: 15px;
    }
  }
}
</style>
