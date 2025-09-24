<script setup lang="ts">
import BaseLayout from '@renderer/components/BaseLayout.vue'
</script>

<template>
  <div class="appSettings">
    <BaseLayout>
      <template #list>
        <div class="list">
          <ul>
            <li><RouterLink to="/settings">AI模型</RouterLink></li>
            <li><RouterLink to="/settings/network">网络</RouterLink></li>
            <li><RouterLink to="/settings/other">其他</RouterLink></li>
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
        margin: 8px 0;
        padding: 5px 30px;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
      }
    }
  }
}
</style>
