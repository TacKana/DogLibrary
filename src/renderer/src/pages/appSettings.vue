<script setup lang="ts">
import BaseLayout from '@renderer/components/BaseLayout.vue'
</script>

<template>
  <div class="appSettings">
    <BaseLayout>
      <template #list>
        <div class="list">
          <ul>
            <li>
              <RouterLink to="/settings/aimodel" active-class="active"
                ><div class="button">AI模型</div></RouterLink
              >
            </li>
            <li>
              <RouterLink to="/settings/network" active-class="active"
                ><div class="button">网络</div></RouterLink
              >
            </li>
            <!-- <li><RouterLink to="/settings/other">其他</RouterLink></li> -->
          </ul>
        </div>
      </template>
      <template #body>
        <div class="body">
          <div class="routerView"><RouterView /></div>
        </div>
      </template>
    </BaseLayout>
  </div>
</template>

<style scoped lang="scss">
.appSettings {
  .list {
    background-color: var(--nav-list-bg-color);
    height: 100vh;
    display: flex;
    justify-content: center;
    ul {
      li {
        .button {
          margin: 8px 0;
          padding: 10px 30px;
          border: 1px solid var(--el-border-color);
          border-radius: 4px;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
  .active {
    .button {
      background-color: #e3f2fd;
      border: #61b0e8 dashed 1px;
    }
  }
}
</style>
