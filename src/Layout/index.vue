<script lang="ts" setup>
import type { GlobalTheme } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { useDark } from '@vueuse/core'
import { PageMenu } from './menu'
import { PageHeader } from './header'
import { PageTabbar } from './tabbar'
import { PageMain } from './main'
import { lighten } from '@/utils'
import { appTheme } from '@/constant'

const getThemeOverrides = computed(() => {
  const lightenStr = lighten(appTheme, 6)
  return {
    common: {
      primaryColor: appTheme,
      primaryColorHover: lightenStr,
      primaryColorPressed: lightenStr,
      primaryColorSuppl: appTheme
    },
    LoadingBar: {
      colorLoading: appTheme
    }
  }
})

const isDark = useDark()
const theme = ref<GlobalTheme | null>(isDark.value ? darkTheme : null)

const collapsed = ref(false)

/**
 * 设置新主题
 * @param newTheme 新主题是否是暗色
 */
function changeTheme(isDarkTheme: boolean) {
  theme.value = isDarkTheme ? darkTheme : null
}
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="getThemeOverrides">
    <n-global-style />
    <n-message-provider>
      <n-layout has-sider>
        <n-layout-sider
          h-100vh
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :collapsed="collapsed"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
        >
          <div flex justify-center>
            <div class="logo" :class="{ part: collapsed }" />
          </div>
          <PageMenu />
        </n-layout-sider>
        <n-layout>
          <n-layout-header fixed top-0 z-99 :style="{ width: `calc(100% - ${!collapsed ? '240px' : '64px'}` }">
            <PageHeader transition- @changeTheme="changeTheme" />
          </n-layout-header>
          <n-layout-content pt-15 h-full :style="{ backgroundColor: theme ? '#101014' : '#f0f2f5' }">
            <PageTabbar />
            <PageMain px-5 py-5 w-full h-full />
          </n-layout-content>
        </n-layout>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="less" scoped>
.logo{
  width: 128px;
  height: 45px;
  margin: 10px 0;
  background-image: url('../assets/img/logo.png');
  background-position: -20px -25px;
  background-repeat: no-repeat;
  background-size: 170px 90px;
  transition: all .3s var(--n-bezier);
  &.part{
    scale: 0.8;
  }
}
.n-layout-header{
  transition: all 0.3s var(--n-bezier);
}
</style>