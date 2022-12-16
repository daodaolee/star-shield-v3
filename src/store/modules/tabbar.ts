import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'

// 不展示在标签页的路由
const whiteList = ['Redirect', 'login']

export type RouteItem = Partial<RouteLocationNormalized> & {
  fullPath: string
  path: string
  name: string
  hash: string
  meta: object
  params: object
  query: object
}
export interface ITabbarState {
  tabList: RouteItem[]
}

export const useTabbarStore = defineStore({
  id: 'app-tabbar',
  state: (): ITabbarState => ({
    tabList: []
  }),
  getters: {

  },
  actions: {
    /**
     * 初始化tabs
     * @param routes
     */
    initTabs(routes: Array<RouteItem>) {
      this.tabList = routes
    },

    /**
     * 添加tabs
     */
    addTabs(route: RouteItem): boolean {
      if (whiteList.includes(route.name))
        return false
      const isExists = this.tabList.some(item => item.fullPath === route.fullPath)
      if (!isExists)
        this.tabList.push(route)
      return true
    },

    /**
     * 关闭左侧tab
     */
    closeLeftTabs(route: RouteItem): void {
      const index = this.tabList.findIndex(item => item.fullPath === route.fullPath)
      this.tabList = this.tabList.filter((item, i) => i >= index || (item?.meta.affix ?? false))
    },

    /**
     * 关闭右侧tab
     */
    closeRightTabs(route: RouteItem): void {
      const index = this.tabList.findIndex(item => item.fullPath === route.fullPath)
      this.tabList = this.tabList.filter((item, i) => i <= index || (item?.meta?.affix ?? false))
    },

    /**
     * 关闭其他tab
     */
    closeOtherTabs(route: RouteItem): void {
      this.tabList = this.tabList.filter(item => item.fullPath === route.fullPath || (item?.meta?.affix ?? false))
    },

    /**
     * 关闭当前tab
     */
    closeCurrentTabs(route: RouteItem): void {
      const index = this.tabList.findIndex(item => item.fullPath === route.fullPath)
      this.tabList.splice(index, 1)
    },

    /**
     * 关闭全部tab
     */
    closeAllTabs() {
      // 保留固定路由
      this.tabList = this.tabList.filter(item => item?.meta?.affix ?? false)
    }
  }
})