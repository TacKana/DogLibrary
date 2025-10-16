<script lang="ts" setup>
import { ElButton, ElText, ElCard, ElRow, ElCol, ElAlert, ElMessageBox, ElMessage } from 'element-plus'

function reset() {
  ElMessageBox.confirm('你即将还原所有设置，是否继续？', '警告', {
    confirmButtonText: '清空',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    window.Config.reset()
    ElMessage({
      type: 'success',
      message: '还原成功',
    })
  })
}
</script>
<template>
  <div class="other">
    <div class="card">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>其他设置</span>
          </div>
        </template>
        <div class="elrow">
          <el-row :gutter="0">
            <el-col :span="20">
              <div>重置所有配置</div>
            </el-col>
            <el-col :span="4">
              <div></div>
            </el-col>
            <el-text type="info">还原所有配置为初始值</el-text>
            <el-alert title="当你点击重置按钮的时候，所有设置都会被还原，请谨慎重置" type="warning" :closable="false" show-icon />
          </el-row>
        </div>
        <template #footer><el-button type="warning" @click="reset">重置所有配置</el-button></template>
      </el-card>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.other {
  padding: 15px;

  .card {
    padding-bottom: 15px;

    .elrow {
      padding-bottom: 15px;
    }
  }
}
</style>
