<script setup lang="ts">
import { ElImage, ElRow, ElCol, ElText, ElCard, ElIcon, ElMessage } from 'element-plus'
import SvgIcon from '@renderer/components/SvgIcon.vue'
import icon from '../assets/icon.png'
import { onMounted, ref } from 'vue'

// --- 版本号 ---
const versions = ref()
onMounted(() => (versions.value = window.electron.process.env.npm_package_version!))
// --- 版本号 END ---

function updates(): void {
  ElMessage.success('当前已是最新版本')
}
</script>

<template>
  <div class="about">
    <el-row>
      <el-col :span="4"> </el-col>
      <el-col :span="18">
        <div class="body">
          <div class="info">
            <el-image :src="icon" style="width: 100px; height: 100px" fit="cover" />
            <p>狗库AI题库Windows</p>
            <el-text type="info">Version{{ versions }}</el-text>
          </div>
          <div class="card">
            <el-card shadow="hover">
              <ul>
                <li>
                  <a href="https://dog.xuxo.top" target="_blank">
                    <el-text size="large">访问狗库官网</el-text>
                    <el-icon size="20px">
                      <SvgIcon icon-class="icon-right" />
                    </el-icon>
                  </a>
                </li>
                <li>
                  <a href="https://element-plus.org" target="_blank">
                    <el-text size="large">交流群</el-text>
                    <el-icon size="20px">
                      <SvgIcon icon-class="icon-right" />
                    </el-icon>
                  </a>
                </li>
                <li>
                  <a href="https://element-plus.org" target="_blank">
                    <el-text size="large">反馈问题</el-text>
                    <el-icon size="20px">
                      <SvgIcon icon-class="icon-right" />
                    </el-icon>
                  </a>
                </li>
              </ul>
            </el-card>
          </div>
          <div class="card">
            <el-card shadow="hover" style="cursor: pointer" @click="updates">
              <ul>
                <li>
                  <a>
                    <el-text size="large">检查更新</el-text>
                    <el-icon size="20px">
                      <SvgIcon icon-class="icon-right" />
                    </el-icon>
                  </a>
                </li>
              </ul>
            </el-card>
          </div>
        </div>
      </el-col>
      <el-col :span="1"> </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.about {
  .body {
    display: flex;
    justify-content: center;
    padding-top: 100px;
    flex-direction: column;

    .info {
      display: flex;
      flex-direction: column;
      align-items: center;

      p {
        padding-top: 15px;
      }
    }

    .card {
      padding-top: 40px;

      :deep(.el-card) {
        border-radius: 24px;
        // border: 0;

        ul {
          li {
            padding: 10px 0;

            a {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
}
</style>
