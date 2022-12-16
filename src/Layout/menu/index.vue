<script lang="ts" setup>
import type { Component } from 'vue'
import { h } from 'vue'
import { NIcon } from 'naive-ui'
import { useRouter } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon
} from '@vicons/ionicons5'
import { filterRouter } from '@/utils'

const router = useRouter()
const routeData = router.getRoutes()
const menuRouteData = filterRouter(routeData)
function generatorMenu(data: Array<any>) {
  return data.map((item) => {
    const currentMenu: any = {
      // ...item,
      // ...item.meta,
      label: item.name,
      key: item.path
    }
    if (item?.meta?.icon)
      currentMenu.icon = item.meta.icon

    if (item.children && item.children.length)
      currentMenu.children = generatorMenu(item.children)
    return currentMenu
  })
}
const menuData: MenuOption[] = generatorMenu(menuRouteData)
console.log(menuData)

function handleUpdateValue(key: string) {
  router.push(key)
}
</script>

<template>
  <n-menu
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuData"
    key-field="key"
    label-field="label"
    children-field="children"
    @update:value="handleUpdateValue"
  />
</template>

<style lang="less" scoped>

</style>