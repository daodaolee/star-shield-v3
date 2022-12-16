import type { RouteRecordRaw } from 'vue-router'

export function findAffixedRoutes(routes: Array<RouteRecordRaw>) {
  const temp = [] as Array<RouteRecordRaw>
  routes.forEach((item) => {
    if (item.meta?.affix)
      temp.push(item)
  })
  return temp
}