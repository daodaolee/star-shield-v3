import { defineStore } from 'pinia'
import type { StateTree, StoreDefinition } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { storage } from '@/utils/storage'
import { toHump } from '@/utils'

const visitedRoutes = storage.get('app-routes') || []

export const useVisitedRouteStore: StoreDefinition = defineStore('app-routes', {
  state: () => ({
    visitedRoutes: visitedRoutes as RouteRecordRaw[],
    cachedRoutes: [] as string[],
    isLoadAffix: false
  }),
  getters: {
    getCachedRouteName: (state: StateTree) => state.cachedRoutes,
    getVisitedRoutes: (state: StateTree) => state.visitedRoutes
  },
  actions: {
    initCachedRoute(routes: string[]) {
      this.cachedRoutes = routes.map(item => toHump(item as string))
    },
    setCachedRoute(cachedRoutes: string[] = []) {
      this.cachedRoutes = cachedRoutes
    },
    resetCachedRoutes() {
      // this.$reset()
      this.cachedRoutes.length = 0
    },
    /**
     * 初始化固定路由
     */
    initAffixRoutes(affixRoutes: RouteRecordRaw[]) {
      affixRoutes.reverse().forEach((affixRoute) => {
        if (!this.visitedRoutes.find(item => item.path === affixRoute.path))
          this.visitedRoutes.unshift(affixRoute)
      })
      this.isLoadAffix = true
    },
    addVisitedRoute(route: RouteRecordRaw) {
      return new Promise((resolve) => {
        if (!this.visitedRoutes.find(item => item.path === route.path)) {
          this.visitedRoutes.push(route)
          if (route.name) {
            if (!this.cachedRoutes.includes(route.name as string))
              this.cachedRoutes.push(route.name as string)
          }
          // this.persistentVisitedView()
        }
        resolve(route)
      })
    },
    removeVisitedRoute(route: RouteRecordRaw) {
      return new Promise((resolve) => {
        this.visitedRoutes.splice(this.visitedRoutes.indexOf(route), 1)
        if (route.name) {
          if (this.cachedRoutes.includes(route.name as string))
            this.cachedRoutes.splice(this.cachedRoutes.indexOf(route.name as string), 1)
        }
        resolve(this.findLastRoutePath())
      })
    },
    findLastRoutePath() {
      return this.visitedRoutes?.length
        ? this.visitedRoutes[this.visitedRoutes.length - 1].path
        : '/'
    },
    restoreVisitedView() {
      this.visitedRoutes.length = 0
    }
  }
})