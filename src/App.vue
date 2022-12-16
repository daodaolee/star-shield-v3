<script setup lang="ts">
</script>

<template>
  <n-dialog-provider>
    <n-notification-provider>
      <n-message-provider>
        <router-view />
      </n-message-provider>
    </n-notification-provider>
  </n-dialog-provider>
</template>

<style scoped lang="less">
</style>