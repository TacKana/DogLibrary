<template>
  <svg :class="classList" aria-hidden="true" :style="{ width: size, height: size }">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  className: {
    type: String,
    default: '',
  },
  // 图标名称，对应 Iconfont 项目中的符号名
  iconClass: {
    type: String,
    required: true,
  },
  // 图标颜色
  color: {
    type: String,
    default: 'inherit',
  },
  // 图标尺寸，可以传入如 '20px' 或 '1em'
  size: {
    type: String,
    default: '1em',
  },
})

const classList = computed(() => ['svg-icon', props.className])
const iconName = computed(() => `#${props.iconClass}`)
</script>

<style scoped>
.svg-icon {
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
