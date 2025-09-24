<script setup lang="ts">
import { ElRow, ElCol, ElSwitch } from 'element-plus'
import { Sunset, MoonNight } from '@element-plus/icons-vue'
import { useDark } from '@vueuse/core'

// 深色模式切换按钮
const colorMode = useDark()
</script>

<template>
  <div class="app">
    <el-row :gutter="0" class="elrow">
      <el-col :span="2">
        <div class="sidebar">
          <div class="top">
            <el-switch
              v-model="colorMode"
              size="large"
              :active-action-icon="MoonNight"
              :inactive-action-icon="Sunset"
            />
          </div>
          <ul>
            <li><RouterLink to="/">首页</RouterLink></li>
            <li><RouterLink to="/cache">题目缓存</RouterLink></li>
            <li><RouterLink to="/settings">设置</RouterLink></li>
          </ul>
        </div>
      </el-col>
      <el-col :span="22"
        ><div class="routerView"><RouterView /></div
      ></el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.app {
  // background-color: red;
  // position: relative;
  .sidebar {
    height: 100vh;
    background-color: var(--sidebar-bg-color);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
