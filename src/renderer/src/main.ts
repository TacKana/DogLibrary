import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.scss'
import 'element-plus/theme-chalk/dark/css-vars.css' // 暗黑模式样式
import './assets/iconfont/iconfont.js' //自定义图标
import router from './router'
import Clarity from '@microsoft/clarity'

const app = createApp(App)
app.use(router)
app.mount('#app')

const projectId = 'tpstapzh7x'
Clarity.init(projectId)
