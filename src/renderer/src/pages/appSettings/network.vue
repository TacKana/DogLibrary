<script lang="ts" setup>
/**
 * @description 网络设置页面
 *
 * 该文件负责网络参数的加载与保存逻辑，并结合 Element Plus 提供的 UI 组件完成交互。
 *
 * 主要功能包括：
 * - 导入网络配置类型及所需 UI 组件。
 * - 使用 Vue 组合式 API 管理配置信息的状态与生命周期。
 * - 提供 `loadNetworkConfig` 方法异步加载网络配置，在页面挂载时自动调用更新视图。
 * - 提供 `saveNetworkConfig` 方法用于持久化变更后的网络配置，保存成功后给出界面提示。
 *
 * 适用场景：
 * 用户通过界面修改网络相关设置，并可一键保存当前配置。
 */
import { NetworkConfig } from '@common/types/userConfig.interface'
import { ElCard, ElRow, ElCol, ElSwitch, ElText, ElInput, ElAlert, ElButton, ElMessage } from 'element-plus'
import { ref, toRaw } from 'vue'
import { onMounted } from 'vue'

const networkOption = ref<NetworkConfig>({} as NetworkConfig)

/**
 * 加载网络配置的异步函数。
 * 用于从相关数据源获取并更新当前网络配置信息。
 *
 * @returns {Promise<void>} 无返回值，异步执行网络配置加载操作。
 */
async function loadNetworkConfig(): Promise<void> {
  const { network } = await window.userConfig.get()
  networkOption.value = network
  console.log(networkOption.value)
}
onMounted(() => {
  loadNetworkConfig()
})

/**
 * 保存网络配置的异步函数。
 *
 * 此函数负责将当前的网络设置持久化到配置中，通常用于用户修改后点击保存按钮时触发。
 * 执行完成后，网络配置将被应用或更新到系统中。
 *
 * @returns {Promise<void>} 返回一个 Promise，在保存完成后 resolve，不包含返回值。
 */
async function saveNetworkConfig(): Promise<void> {
  const newConfig = { network: { ...toRaw(networkOption.value) } }
  console.log(newConfig)
  const res = await window.userConfig.set(newConfig)
  console.log(res)
  if (res === true) {
    ElMessage.success('保存成功')
  }
}
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
            <el-alert title="端口范围：1024~65535，且只能为正整数" type="warning" :closable="false" show-icon />
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
        <template #footer><el-button type="primary" @click="saveNetworkConfig">保存配置</el-button></template>
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
