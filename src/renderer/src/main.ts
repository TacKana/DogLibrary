import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.scss'
import 'element-plus/theme-chalk/dark/css-vars.css' // 暗黑模式样式
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
