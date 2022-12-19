<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useVisitedRouteStore } from '@/store/modules/routes'
// tabbar 有关路由信息
const visitedRouteStore = useVisitedRouteStore()
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="opacity-transform" mode="out-in" appear>
      <keep-alive :include="visitedRouteStore.getCachedRouteName">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<style lang="less" scoped>

</style>