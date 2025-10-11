<script setup lang="ts">
import { Delete, /* Download, Edit, FolderAdd, */ Refresh } from '@element-plus/icons-vue'
import { ElButton, ElInput, ElTable, ElTableColumn /* ElText */, ElPagination } from 'element-plus'
// import BaseLayout from '@renderer/components/BaseLayout.vue'

import { useWindowSize } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { CacheArray } from '@common/types/cache'
const { height } = useWindowSize()

const tableData = ref<CacheArray>([])
onMounted(() => {
  getCache()
})
async function getCache(): Promise<void> {
  tableData.value = await window.cacheManager.query(0, 100)
}
function del(id: number): void {
  console.log(id)

  window.cacheManager.del(id)
  getCache()
}
</script>

<template>
  <div class="topicCache">
    <!-- <BaseLayout> -->
    <!-- <template #list> -->
    <!-- <div class="list">
          <ul>
            <li v-for="item in 6" :key="item">
              <el-text class="mx-1" size="large">默认题库{{ item }}</el-text>
            </li>
          </ul>
        </div> -->
    <!-- </template> -->
    <!-- <template #body> -->
    <div class="table">
      <div class="operation">
        <div class="">
          <el-input style="width: 240px; padding-right: 5px" placeholder="输入题目关键词" />
          <el-button type="primary" plain>搜索</el-button>
        </div>
        <div class="button">
          <el-button type="danger" plain>清空</el-button>
          <!-- <el-button type="primary" :icon="Edit" circle plain /> -->
          <!-- <el-button type="primary" :icon="FolderAdd" circle plain /> -->
          <!-- <el-button type="primary" :icon="Download" circle plain /> -->
          <el-button type="primary" :icon="Refresh" circle plain @click="getCache" />
        </div>
      </div>
      <div class="body">
        <el-table :data="tableData" stripe style="width: 100%" table-layout="fixed" :max-height="height - 120">
          <el-table-column prop="question" label="问题" />
          <el-table-column prop="answer" label="答案" />
          <el-table-column prop="id" label="操作" width="180">
            <template #default="scope">
              <!-- <div>
                    {{ scope.$index }}
                  </div> -->
              <!-- <el-button type="primary" :icon="Edit" circle plain /> -->
              <el-button type="danger" :icon="Delete" circle plain @click="del(scope.row.id)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination :page-sizes="[100, 200, 300, 400]" layout="prev, pager, next,sizes" :total="1000" />

    <!-- </template> -->
    <!-- </BaseLayout> -->
  </div>
</template>

<style scoped lang="scss">
.topicCache {
  // padding: 15px;

  .list {
    display: flex;
    justify-content: center;
    background-color: var(--nav-list-bg-color);
    height: 100vh;

    ul {
      padding: 5px 0;
    }
  }

  .table {
    padding: 15px;

    .operation {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
