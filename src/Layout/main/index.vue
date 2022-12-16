<script lang="ts" setup>

</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="opacity-transform" mode="out-in" appear>
      <keep-alive>
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<style lang="less" scoped>

</style>