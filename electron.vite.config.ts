import { resolve } from 'path'
import { bytecodePlugin, defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()],
    build: {
      rollupOptions: {
        external: ['better-sqlite3'],
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@common': resolve(__dirname, 'src/common'),
      },
    },
    plugins: [
      vue(),
      ElementPlus({
        // options
      }),
    ],
  },
})
