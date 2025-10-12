<script setup lang="ts">
import { Delete, /* Download, Edit, FolderAdd, */ Refresh } from '@element-plus/icons-vue'
import { ElButton, ElInput, ElPagination, ElTable, ElTableColumn /* ElText */ } from 'element-plus'
// import BaseLayout from '@renderer/components/BaseLayout.vue'
import { CacheArray } from '@common/types/cache'
import { useWindowSize } from '@vueuse/core'
import { onMounted, ref } from 'vue'

//表格动态高度
const { height } = useWindowSize()

//表格数据
const tableData = ref<{ count: number; data: CacheArray }>({ count: 0, data: [] })

// 分页控制
const currentPage = ref(1)
const pageSize = ref(50)

onMounted(() => {
  getCache(0, 100)
})

async function getCache(page = currentPage.value, limit = pageSize.value): Promise<void> {
  const offset = (page - 1) * limit
  tableData.value = await window.cacheManager.query(offset, limit)
}
function del(id: number): void {
  console.log(id)
  window.cacheManager.del(id)
  getCache(0, 100)
}

function clearAll(): void {
  window.cacheManager.clearAll()
  getCache(0, 100)
}
const question = ref('')
async function search(): Promise<void> {
  console.log(question.value)

  const results = await window.cacheManager.search(question.value)
  tableData.value.data = results
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
          <el-input v-model="question" style="width: 240px; padding-right: 5px" placeholder="输入题目关键词" />
          <el-button type="primary" plain @click="search">搜索</el-button>
        </div>
        <div class="button">
          <el-button type="danger" plain @click="clearAll">清空</el-button>
          <!-- <el-button type="primary" :icon="Edit" circle plain /> -->
          <!-- <el-button type="primary" :icon="FolderAdd" circle plain /> -->
          <!-- <el-button type="primary" :icon="Download" circle plain /> -->
          <el-button type="primary" :icon="Refresh" circle plain @click="getCache(0, 100)" />
        </div>
      </div>
      <div class="body">
        <el-table :data="tableData.data" stripe style="width: 100%" table-layout="fixed" :max-height="height - 120">
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
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :hide-on-single-page="tableData.count < 50"
        :page-sizes="[50, 100, 200, 300, 400]"
        background
        layout="prev, pager, next,sizes"
        :total="tableData.count"
        style="padding-top: 20px"
        @current-change="getCache"
        @size-change="getCache(1, pageSize)"
      />
    </div>

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
