<script setup lang="ts">
import BaseLayout from '@renderer/components/BaseLayout.vue'
import FadeOutTransition from '@renderer/components/FadeOutTransition.vue'
</script>

<template>
  <div class="appSettings">
    <BaseLayout>
      <template #list>
        <div class="list">
          <ul>
            <li>
              <RouterLink to="/settings/aimodel" active-class="active"><div class="button">AI模型</div></RouterLink>
            </li>
            <li>
              <RouterLink to="/settings/network" active-class="active"><div class="button">网络</div></RouterLink>
            </li>
            <li>
              <RouterLink to="/settings/other" active-class="active"><div class="button">其他</div></RouterLink>
            </li>
          </ul>
        </div>
      </template>
      <template #body>
        <div class="body">
          <div class="routerView">
            <router-view v-slot="{ Component }">
              <FadeOutTransition>
                <component :is="Component" />
              </FadeOutTransition>
            </router-view>
          </div>
        </div>
      </template>
    </BaseLayout>
  </div>
</template>

<style scoped lang="scss">
.appSettings {
  .list {
    background-color: var(--nav-list-bg-color);
    height: $windowHeight;
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
      background-color: #787878;
      border: #61b0e8 solid 1px;
      color: #ffffff;
    }
  }
  .body {
    .routerView {
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
