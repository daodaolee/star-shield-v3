<script lang="ts" setup>
import { h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import {
  CloseOutline as CloseIcon,
  ChevronForwardOutline as nextIcon,
  ChevronBackOutline as prevIcon
} from '@vicons/ionicons5'
import Draggable from 'vuedraggable'
import { storeToRefs } from 'pinia'
import { TABS_ROUTES } from '@/store/mutation-types'
import { storage } from '@/utils/storage'
import type { RouteItem } from '@/store/modules/tabbar'
import { useTabbarStore } from '@/store/modules/tabbar'
import { useVisitedRouteStore } from '@/store/modules/routes'

const visitedRouteStore = useVisitedRouteStore()
const {
  getVisitedRoutes,
  removeVisitedRoute,
  findLastRoutePath
} = storeToRefs(visitedRouteStore)

// 路由
const route = useRoute()
const router = useRouter()
const getSimpleRoute = (route: any): RouteItem => {
  const { fullPath, hash, meta, name, params, path, query } = route
  return { fullPath, hash, meta, name, params, path, query }
}
let cacheRoutes: RouteItem[] = []
const simpleRoute = getSimpleRoute(route)
try {
  const routeStr = storage.get(TABS_ROUTES) as string | null | undefined
  cacheRoutes = routeStr ? JSON.parse(routeStr) : [simpleRoute]
}
catch (error) {
  cacheRoutes = [simpleRoute]
}

// 新路由信息同步到 localStorage
const routes = router.getRoutes()
cacheRoutes.forEach((cacheRoute) => {
  const route = routes.find(route => route.path === cacheRoute.path)
  if (route) {
    cacheRoute.meta = route.meta || cacheRoute.meta
    cacheRoute.name = (route.name || cacheRoute.name) as string
  }
})

const tabbarStore = useTabbarStore()
tabbarStore.initTabs([])

const nameRef = ref(1)
const message = useMessage()
const panelsRef = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
function handleClose(name: number) {
  const { value: panels } = panelsRef
  if (panels.length === 1) {
    message.error('最后一个了')
    return
  }
  message.info(`关掉 ${name}`)
  const index = panels.findIndex(v => name === v)
  panels.splice(index, 1)
  if (nameRef.value === name)
    nameRef.value = panels[index]
}

const scrollable = ref(false)

const currentTab = ref(route.path)
watch(() => route.path, (newPath) => {
  currentTab.value = newPath || ''
})

function scrollPrev() {

}
function scrollNext() {

}
function goPage(element: any) {

}
</script>

<template>
  <div class="page-tabbar" flex z-5 py-1 px-1>
    <div min-w-full max-w-full flex>
      <div px-8 flex-1 overflow-hidden>
        <div
          class="page-tabbar-prev"
          w-8 h-8 flex justify-center items-center absolute left-0
          :class="{ 'page-tabbar-prev-hide': scrollable }"
          @click="scrollPrev"
        >
          <n-icon size="20" color="#515a6e" :component="prevIcon" cursor-pointer />
        </div>
        <div
          class="page-tabbar-next"
          w-8 h-8 flex justify-center items-center absolute right-0
          :class="{ 'page-tabbar-next-hide': scrollable }"
          @click="scrollNext"
        >
          <n-icon size="20" color="#515a6e" :component="nextIcon" cursor-pointer />
        </div>

        <div whitespace-nowrap class="page-tabbar-container">
          <Draggable :list="getVisitedRoutes" animation="300" item-key="path" class="flex">
            <template #item="{ element }">
              <n-button
                icon-placement="right"
                :type="currentTab === element.path ? 'primary' : 'default'"
                :render-icon="() => h(CloseIcon)"
                @click.stop="goPage(element)"
              >
                {{ element.name }}
              </n-button>
            </template>
          </Draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.n-tab-pane{
  padding:0
}
.n-tabs .n-tabs-nav-scroll-wrapper{
  overflow: inherit;
}
.page-tabbar-container{
  .page-tabbar-item{
    padding:0 14px;
    color: var(--n-text-color);
    background-color: var(--n-color);
    line-height: 34px;
  }
}
</style>