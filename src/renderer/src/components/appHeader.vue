<script lang="ts" setup>
import { ElText, ElAvatar, ElButton, ElIcon } from 'element-plus'
import { Minus, Close, FullScreen } from '@element-plus/icons-vue'
import logo from '../assets/icon.png'

function windowMin(): void {
  window.windowControl.mix()
}
function windowMax(): void {
  window.windowControl.max()
}
function windowClose(): void {
  window.windowControl.close()
}
</script>
<template>
  <header>
    <div class="content">
      <el-avatar size="small" :src="logo" />
      <el-text size="default" tag="b">狗库</el-text>
    </div>
    <div class="button">
      <el-button size="small" text @click="windowMin">
        <el-icon><Minus /></el-icon>
      </el-button>
      <el-button size="small" text @click="windowMax">
        <el-icon><FullScreen /></el-icon>
      </el-button>
      <el-button size="small" text @click="windowClose">
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
  </header>
</template>
<style lang="scss" scoped>
// var(--el-text-color-regular)
header {
  -webkit-app-region: drag;
  display: flex;
  justify-content: space-between;

  // height: 36px;
  background-color: var(--sidebar-bg-color);

  .content {
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding: 5px 10px 5px;
  }
  .button {
    // padding-right: 10px;
    -webkit-app-region: no-drag;

    :deep(.el-button) {
      height: 100%;
      width: 60px;
      // color: var(--nav-text-color);

      &:hover {
        background-color: var(--el-color-info-light-5);
      }
      &:last-child:hover {
        background-color: #e74c3c;
      }
    }
  }
}
</style>
