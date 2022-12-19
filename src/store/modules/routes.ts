import { defineStore } from 'pinia'
import type { StateTree, StoreDefinition } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { findCachedRoutes } from '../help'
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
    /**
     * 初始化缓存路由
     */
    initCachedRoute(routes: string[]) {
      this.cachedRoutes = routes.map(item => toHump(item as string))
    },
    /**
     * 设置缓存路由
     */
    setCachedRoute(cachedRoutes: string[] = []) {
      this.cachedRoutes = cachedRoutes
    },
    /**
     * 重置缓存路由
     */
    resetCachedRoutes() {
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
    /**
     * 添加可见路由
     */
    addVisitedRoute(route: RouteRecordRaw) {
      return new Promise((resolve) => {
        if (!this.visitedRoutes.find(item => item.path === route.path)) {
          this.visitedRoutes.push(route)
          if (route.name) {
            if (!this.cachedRoutes.includes(route.name as string))
              this.cachedRoutes.push(route.name as string)
          }
          this.persistentVisitedRoute()
        }
        resolve(route)
      })
    },
    /**
     * 移除可见路由
     */
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
    /**
     * 找到最后一个路由路径
     */
    findLastRoutePath() {
      return this.visitedRoutes?.length
        ? this.visitedRoutes[this.visitedRoutes.length - 1].path
        : '/'
    },
    /**
     * 关闭左侧可见路由
     */
    closeLeftVisitedRoute(selectRoute: RouteRecordRaw) {
      return new Promise((resolve) => {
        const selecIndex = this.visitedRoutes.indexOf(selectRoute)
        if (selecIndex !== -1) {
          this.visitedRoutes = this.visitedRoutes.filter((item, index) => {
            return (item.meta && item.meta.affix) || index >= selecIndex
          })
          this.setCachedRoute(findCachedRoutes(this.visitedRoutes))
          this.persistentVisitedRoute()
        }
        resolve(selectRoute)
      })
    },
    /**
     * 关闭右侧可见路由
     */
    closeRightVisitedRoute(selectRoute: RouteRecordRaw) {
      return new Promise((resolve) => {
        const selecIndex = this.visitedRoutes.indexOf(selectRoute)
        if (selecIndex !== -1) {
          this.visitedRoutes = this.visitedRoutes.filter((item, index) => {
            return (item.meta && item.meta.affix) || index <= selecIndex
          })
          this.setCachedRoute(findCachedRoutes(this.visitedRoutes))
          this.persistentVisitedRoute()
        }
        resolve(selectRoute)
      })
    },
    /**
     * 关闭其他所有路由
     */
    closeOtherVisitedRoute(selectRoute: RouteRecordRaw) {
      return new Promise((resolve) => {
        const selectIndex = this.visitedRoutes.indexOf(selectRoute)
        if (selectIndex !== -1) {
          this.visitedRoutes = this.visitedRoutes.filter((item, index) => {
            return (item.meta && item.meta.affix) || index === selectIndex
          })
          this.setCachedRoute(findCachedRoutes(this.visitedRoutes))
          this.persistentVisitedRoute()
        }
        resolve(selectRoute)
      })
    },
    /**
     * 关闭所有可见路由
     */
    closeAllVisitedRoute() {
      return new Promise<void>((resolve) => {
        this.visitedRoutes = this.visitedRoutes.filter((item) => {
          return item.meta && item.meta.affix
        })
        this.setCachedRoute(findCachedRoutes(this.visitedRoutes))
        this.persistentVisitedRoute()
        resolve()
      })
    },
    /**
     * 存入缓存，持久化
     */
    persistentVisitedRoute() {
      const tempPersistendRoutes = this.visitedRoutes.map((item) => {
        return {
          fullPath: item.path,
          meta: item.meta,
          name: item.name,
          path: item.path
        }
      })
      localStorage.setItem(this.$id, JSON.stringify(tempPersistendRoutes))
    },
    /**
     * 清空可见路由
     */
    restoreVisitedRoute() {
      this.visitedRoutes.length = 0
    }
  }
})