import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      ElementPlus({
        // options
      })
    ]
  },
  preload: {
    plugins: [
      externalizeDepsPlugin(),
      ElementPlus({
        // options
      })
    ]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      ElementPlus({
        // options
      })
    ]
  }
})
