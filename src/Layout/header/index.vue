<script lang="ts" setup>
import { NIcon } from 'naive-ui'
import { useDark, useToggle } from '@vueuse/core'
import type { RouteRecordNormalized } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import {
  MoonOutline as MoonIcon,
  SunnyOutline as SunIcon
} from '@vicons/ionicons5'
import { isExternal } from '@/utils'

interface DropItem {
  label: string
  key: string
  children?: DropItem[]
}

const emit = defineEmits<{
  (e: 'changeTheme', state: boolean): void
}>()

const isDark = useDark()
const toggleDark = useToggle(isDark)
function changeTheme() {
  toggleDark()
  emit('changeTheme', isDark.value)
}

const route = useRoute()
const router = useRouter()

function handlePath(path: string) {
  return path.split('/').reduce((pre: string[], cur: string) => {
    if (cur) {
      const lastItem = pre[pre.length - 1]
      if (lastItem)
        pre.push(`${lastItem}/${cur}`)
      else
        pre.push(`/${cur}`)
    }
    return pre
  }, [])
}
function findRoute(paths: string[]) {
  const selectRoutes: Array<RouteRecordNormalized> = []
  let tempOrigin = router.getRoutes()
  paths.forEach((it) => {
    const selectRoute = tempOrigin.find(pIt => pIt.path === it)
    if (selectRoute) {
      tempOrigin = selectRoute.children as RouteRecordNormalized[]
      selectRoutes.push(selectRoute)
    }
  })
  return selectRoutes
}

function generatorDropdown(
  routes: Array<RouteRecordNormalized> | undefined,
  parentPath = '/'
) {
  if (!routes)
    return
  const tempArray: DropItem[] = []
  routes.forEach((item) => {
    const tempItem: DropItem = {
      label: item.name as string,
      key: isExternal(item.path)
        ? item.path
        : item.path.startsWith('/')
          ? item.path
          : `${parentPath}/${item.path}`,
      children: []
    }
    if (item.children && item.children.length > 0) {
      tempItem.children = generatorDropdown(
        item.children as RouteRecordNormalized[],
        tempItem.key
      )
    }
    else {
      delete tempItem.children
    }
    tempArray.push(tempItem)
  })
  return tempArray
}

const breadcrumbList = ref<Array<DropItem>>([])

function generatorBreadcrumb() {
  breadcrumbList.value.length = 0
  const findedRoutes = findRoute(handlePath(route.path))
  const target = generatorDropdown(findedRoutes)
  if (target)
    breadcrumbList.value.push(...target)
}

function handleSelect(key: string) {
  router.push(key)
}

onMounted(() => {
  generatorBreadcrumb()
})

watch(() => route.path, () => {
  const returnExp = route.path.startsWith('/redirect') || ['/404'].includes(route.path)
  if (returnExp)
    return
  generatorBreadcrumb()
})
</script>

<template>
  <header px-6 py-4 flex justify-between>
    <div>
      <n-breadcrumb>
        <n-breadcrumb-item
          v-for="item in breadcrumbList"
          :key="item.key"
        >
          <n-dropdown
            v-if="item.children?.length"
            :options="item.children"
            @select="handleSelect"
          >
            <div class="trigger">
              {{ item.label }}
            </div>
          </n-dropdown>
          <div v-else>
            {{ item.label }}
          </div>
        </n-breadcrumb-item>
      </n-breadcrumb>
    </div>
    <div>
      <n-icon size="20" :component="isDark ? SunIcon : MoonIcon" cursor-pointer @click="changeTheme" />
    </div>
  </header>
</template>

<style lang="less" scoped>
header{
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  transition: all .2s ease-in-out;
}
</style>