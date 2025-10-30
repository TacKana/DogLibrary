<script setup lang="ts">
import { ElSwitch, ElIcon } from 'element-plus'
import { Sunset, MoonNight } from '@element-plus/icons-vue'
import { useDark } from '@vueuse/core'
import SvgIcon from './components/SvgIcon.vue'
import { onMounted, ref } from 'vue'
import FadeOutTransition from './components/FadeOutTransition.vue'
import appHeader from './components/appHeader.vue'

// 深色模式切换按钮
const colorMode = ref()
onMounted(async () => {
  colorMode.value = await window.darkMode.get()
  if (colorMode.value) {
    useDark()
  }
})

const colorModeToggle = async (): Promise<void> => {
  setTimeout(async () => {
    await window.darkMode.toggle()
    colorMode.value === true ? (colorMode.value = true) : (colorMode.value = false)
    useDark()
  }, 200)
}
</script>

<template>
  <div class="app">
    <appHeader></appHeader>
    <div class="body">
      <div class="sidebar">
        <div class="top">
          <el-switch v-model="colorMode" size="large" :active-action-icon="MoonNight" :inactive-action-icon="Sunset" @change="colorModeToggle" />
        </div>
        <ul>
          <li>
            <RouterLink active-class="active" to="/home">
              <div class="button">
                <el-icon size="24px">
                  <SvgIcon icon-class="icon-shouye" />
                </el-icon>
              </div>
            </RouterLink>
          </li>
          <li>
            <RouterLink active-class="active" to="/cache">
              <div class="button">
                <el-icon size="24px">
                  <SvgIcon icon-class="icon-gouwudai" />
                </el-icon>
              </div>
            </RouterLink>
          </li>
          <li>
            <RouterLink active-class="active" to="/settings">
              <div class="button">
                <el-icon size="24px">
                  <SvgIcon icon-class="icon-shezhi" />
                </el-icon>
              </div>
            </RouterLink>
          </li>
          <li>
            <RouterLink active-class="active" to="/about">
              <div class="button">
                <el-icon size="24px">
                  <SvgIcon icon-class="icon-wode" />
                </el-icon>
              </div>
            </RouterLink>
          </li>
        </ul>
      </div>
      <div class="routerView">
        <router-view v-slot="{ Component }">
          <FadeOutTransition>
            <keep-alive include="home">
              <component :is="Component" />
            </keep-alive>
          </FadeOutTransition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$bodyHeight: calc(100vh - 35px);
.app {
  background-color: var(--sidebar-bg-color);
  height: 100vh;
  .body {
    display: flex;
    // width: 100%;
    height: $bodyHeight;
    .sidebar {
      width: 75px;
      // height: 100vh;
      // background-color: var(--sidebar-bg-color);
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      ul {
        li {
          padding: 10px 0;
          .button {
            padding: 15px;
            display: flex;
            border-radius: 20px;
            // background-color: #000;
          }
          .active {
            .button {
              background-color: #e3f2fd;
              border: #61b0e8 dashed 1px;
            }
          }
        }
      }
    }
    .routerView {
      margin: 0px 10px 10px 0px;
      height: auto;
      overflow: auto;
      border-radius: 20px;
      width: 100%;
    }
  }
}
</style>
