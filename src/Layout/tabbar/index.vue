<script lang="ts" setup>
import { h } from 'vue'
import { type RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import {
  CloseOutline as closeIcon,
  ArrowBackOutline as leftIcon,
  ChevronForwardOutline as nextIcon,
  ChevronBackOutline as prevIcon,
  RefreshSharp as refreshIcon,
  ArrowForwardOutline as rightIcon
} from '@vicons/ionicons5'
import Draggable from 'vuedraggable'
import { storeToRefs } from 'pinia'
import { useVisitedRouteStore } from '@/store/modules/routes'

// tabbar 有关路由信息
const visitedRouteStore = useVisitedRouteStore()
const {
  getVisitedRoutes,
  removeVisitedRoute,
  closeLeftVisitedRoute,
  closeRightVisitedRoute,
  closeOtherVisitedRoute,
  findLastRoutePath
} = storeToRefs(visitedRouteStore)

// 路由
const route = useRoute()
const router = useRouter()

const scrollable = ref(false)

const currentTab = ref(route.path)
const scrollTab = ref(null) as unknown as HTMLElement
watch(() => route.path, (newPath) => {
  currentTab.value = newPath || ''
  setTimeout(() => {
    const el = document.querySelector(`[data="${currentTab}"]`) as HTMLElement
    el && scrollTab.scrollTo({
      left: el.offsetLeft,
      behavior: 'smooth'
    })
  }, 0)
})

function scrollPrev() {
  const el = document.querySelector(`[data="${currentTab}"]`) as HTMLElement
  const scrollX = document.querySelector('.page-tabbar-container')?.scrollLeft || 0
  el && scrollTab.scrollTo({
    left: Math.max(0, scrollX - 200),
    behavior: 'smooth'
  })
  isDisabledArrow()
}
function scrollNext() {
  const el = document.querySelector(`[data="${currentTab}"]`) as HTMLElement
  const scrollX = document.querySelector('.page-tabbar-container')?.scrollLeft || 0
  el && scrollTab.scrollTo({
    left: scrollX + 200,
    behavior: 'smooth'
  })
  isDisabledArrow()
}
function isDisabledArrow() {
  setTimeout(() => {
    const { scrollLeft, scrollWidth, clientWidth } = document.querySelector('.page-tabbar-container') as HTMLElement
    scrollable.value = Boolean(scrollLeft === scrollWidth - clientWidth)
  }, 100)
}
function goPage(item: RouteRecordRaw) {
  router.push(item.path || '/')
}

const showLeftMenu = ref(true)
const showRightMenu = ref(true)
const contextMenuStyle = ref({ left: '0', top: '0' })
const showContextMenu = ref(false)
const selectRoute = ref({})
function isLeftLast(tempRoute: string) {
  return getVisitedRoutes.value.findIndex((item: RouteRecordRaw) =>
    item.path === tempRoute) === 0
}
function isRightLast(tempRoute: string) {
  return getVisitedRoutes.value.findIndex((item: RouteRecordRaw) =>
    item.path === tempRoute) === getVisitedRoutes.value.length - 1
}
function onContextMenu(item: RouteRecordRaw, e: MouseEvent) {
  const { clientX } = e
  const { x } = document.querySelector('.page-tabbar')!.getBoundingClientRect()
  e.preventDefault()
  selectRoute.value = item
  if (selectRoute.value) {
    showLeftMenu.value = isLeftLast(item.path || '/')
    showRightMenu.value = isRightLast(item.path || '/')
    const screenWidth = document.body.clientWidth
    contextMenuStyle.value.left
            = `${clientX + 130 > screenWidth ? clientX - 130 - x - 15 : clientX - x + 15}px`
    contextMenuStyle.value.top = '25px'
    showContextMenu.value = true
  }
}
function refreshRoute() {
  router.replace({ path: route.path, replace: true })
}
async function closeLeft() {
  if (!selectRoute.value)
    return
  await visitedRouteStore.closeLeftVisitedRoute(selectRoute.value)
  if (route.path !== (selectRoute.value as RouteRecordRaw).path)
    router.push(visitedRouteStore.findLastRoutePath())
}
async function closeRight() {
  if (!selectRoute.value)
    return
  await visitedRouteStore.closeRightVisitedRoute(selectRoute.value)
  if (route.path !== (selectRoute.value as RouteRecordRaw).path)
    router.push(visitedRouteStore.findLastRoutePath())
}
async function closeOther() {
  if (!selectRoute.value)
    return
  await visitedRouteStore.closeOtherVisitedRoute(selectRoute.value)
}
function closeMenu() {
  showContextMenu.value = false
}
function handleClose() {

}
watch(showContextMenu, (val) => {
  if (val)
    document.body.addEventListener('click', closeMenu)
  else
    document.body.removeEventListener('click', closeMenu)
})
</script>

<template>
  <div class="page-tabbar" flex z-5 py-1 px-1 relative>
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
          <Draggable ref="scrollTab" :list="getVisitedRoutes" animation="300" item-key="path" class="flex">
            <template #item="{ element }">
              <n-tag
                mr-2
                closable
                cursor-pointer
                :type="currentTab === element.path ? 'info' : 'default'"
                @click.stop="goPage(element)"
                @contextmenu="onContextMenu(element, $event)"
                @close="handleClose"
              >
                {{ element.name }}
              </n-tag>
            </template>
          </Draggable>
        </div>
      </div>
    </div>
    <ul v-show="showContextMenu" :style="contextMenuStyle" class="page-context-menu">
      <li>
        <n-button
          text
          size="tiny"
          :render-icon="() => h(refreshIcon)"
          icon-placement="right"
          @click="refreshRoute"
        >
          刷新页面
        </n-button>
      </li>
      <li :disabled="showLeftMenu">
        <n-button
          :disabled="showLeftMenu"
          text
          size="tiny"
          :render-icon="() => h(leftIcon)"
          icon-placement="right"
          @click="closeLeft"
        >
          关闭左侧
        </n-button>
      </li>
      <li :disabled="showRightMenu">
        <n-button
          :disabled="showRightMenu"
          text
          size="tiny"
          :render-icon="() => h(rightIcon)"
          icon-placement="right"
          @click="closeRight"
        >
          关闭右侧
        </n-button>
      </li>
      <li :disabled="showRightMenu">
        <n-button
          :disabled="showRightMenu"
          text
          size="tiny"
          :render-icon="() => h(closeIcon)"
          icon-placement="right"
          @click="closeOther"
        >
          关闭其他
        </n-button>
      </li>
    </ul>
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
.page-context-menu{
  position: absolute;
  width: 100px;
  z-index: 999;
  list-style: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: var(--tabbar-contextmenu-bg);
  padding-left:0;
  border-radius: 3px;
  & > li {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 0;
    &:hover{
      color: var(--primary-color);
    }
  }
}
</style>