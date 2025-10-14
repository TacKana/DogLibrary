import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.scss'
import 'element-plus/theme-chalk/dark/css-vars.css' // 暗黑模式样式
import './assets/iconfont/iconfont.js' //自定义图标
import router from './router'
import Clarity from '@microsoft/clarity'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})
app.mount('#app')

// 配置微软clarity统计
const projectId = 'tpstapzh7x'
Clarity.init(projectId)
