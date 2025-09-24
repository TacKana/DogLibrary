<script lang="ts" setup>
import { ElRow, ElCol } from 'element-plus'
</script>
<template>
  <el-row :gutter="0">
    <el-col :xs="4" :sm="4" :md="4" :lg="2" :xl="1">
      <slot name="list"></slot>
    </el-col>
    <el-col :xs="20" :sm="20" :md="20" :lg="22" :xl="23">
      <slot name="body"></slot>
    </el-col>
  </el-row>
</template>
