import { createRouter, createWebHistory } from 'vue-router'

import AppSettings from '@renderer/pages/appSettings.vue'
import AiModel from '@renderer/pages/appSettings/aiModel.vue'
import Network from '@renderer/pages/appSettings/network.vue'
// import Other from '@renderer/pages/appSettings/other.vue'

import Home from '@renderer/pages/home.vue'
import TopicCache from '@renderer/pages/topicCache.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      component: Home,
      name: 'Home',
      meta: { keepAlive: true }, // 控制是否缓存
    },
    {
      path: '/cache',
      component: TopicCache,
    },
    {
      path: '/settings',
      component: AppSettings,
      children: [
        { path: '', redirect: '/settings/aimodel' },
        {
          path: 'aimodel',
          component: AiModel,
        },
        {
          path: 'network',
          component: Network,
        },
        // {
        //   path: 'other',
        //   component: Other
        // }
      ],
    },
  ],
})

export default router
