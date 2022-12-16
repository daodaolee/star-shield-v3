import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const modules = import.meta.glob('./routes/**/*.ts', { eager: true, import: 'default' })
const routeModuleList: RouteRecordRaw[] = []
Object.keys(modules).forEach((key) => {
  const mod = modules[key] || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{

    path: '/',
    redirect: '/anxing',
    children: routeModuleList

  }]
})

export function useAppRouter(app: App) {
  app.use(router)
}
export default router