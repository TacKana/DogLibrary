import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/global.scss'
import 'element-plus/theme-chalk/dark/css-vars.css' // 暗黑模式样式
import './assets/iconfont/iconfont.js' //自定义图标
import router from './router'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const index = createApp(App)
index.use(router)
index.use(ElementPlus, {
  locale: zhCn,
})
index.mount('#app')
