<script setup lang="ts">
import { Delete, Download, Edit, FolderAdd, Refresh } from '@element-plus/icons-vue'
import { ElButton, ElInput, ElTable, ElTableColumn, ElText } from 'element-plus'
import BaseLayout from '@renderer/components/BaseLayout.vue'

import { useWindowSize } from '@vueuse/core'
const { height } = useWindowSize()

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]
</script>

<template>
  <div class="topicCache">
    <BaseLayout>
      <template #list>
        <div class="list">
          <ul>
            <li v-for="item in 6" :key="item">
              <el-text class="mx-1" size="large">默认题库{{ item }}</el-text>
            </li>
          </ul>
        </div>
      </template>
      <template #body>
        <div class="table">
          <div class="operation">
            <el-input style="width: 240px" placeholder="输入题目关键词" />
            <div class="button">
              <el-button type="danger" plain>清空</el-button>
              <el-button type="primary" :icon="Edit" circle plain />
              <el-button type="primary" :icon="FolderAdd" circle plain />
              <el-button type="primary" :icon="Download" circle plain />
              <el-button type="primary" :icon="Refresh" circle plain />
            </div>
          </div>
          <div class="body">
            <el-table
              :data="tableData"
              stripe
              style="width: 100%"
              table-layout="fixed"
              :max-height="height - 100"
            >
              <el-table-column prop="date" label="问题" />
              <el-table-column prop="name" label="答案" />
              <el-table-column prop="address" label="操作" width="180">
                <template #default="">
                  <!-- <div>
                    {{ scope.$index }}
                  </div> -->
                  <el-button type="primary" :icon="Edit" circle plain />
                  <el-button type="danger" :icon="Delete" circle plain />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </BaseLayout>
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
