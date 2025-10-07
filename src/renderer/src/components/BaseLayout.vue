<script lang="ts" setup>
import { ElRow, ElCol } from 'element-plus'
</script>
<template>
  <el-row :gutter="0">
    <el-col :xs="6" :sm="4" :md="4" :lg="3" :xl="2">
      <slot name="list"></slot>
    </el-col>
    <el-col :xs="18" :sm="20" :md="20" :lg="21" :xl="22">
      <slot name="body"></slot>
    </el-col>
  </el-row>
</template>
