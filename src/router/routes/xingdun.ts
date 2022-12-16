import type { RouteRecordRaw } from 'vue-router'
import {
  ShieldCheckmarkOutline as ShieldIcon
} from '@vicons/ionicons5'
import { renderIcon } from '@/utils/index'

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.isParent 排序越小越排前
 *
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/xingdun',
    name: '星盾',
    redirect: '/xingdun/test',
    component: () => import ('@/Layout/index.vue'),
    meta: {
      isParent: true,
      icon: renderIcon(ShieldIcon)
    },
    children: [{
      path: '/xingdun/test1',
      name: '星盾示例1',
      component: () => import ('@/views/xingdun/test1.vue')
    }, {
      path: '/xingdun/test2',
      name: '星盾示例2',
      meta: {},
      component: () => import ('@/views/xingdun/test2.vue')
    }]
  }
  // {
  //   path: '/page',
  //   name: `${routeName}_page`,
  //   meta: {
  //     name: '组件示例',
  //     icon: renderIcon(BasketballIcon)
  //   },
  //   component: () => import ('@/views/Home.vue')
  // }
]

export default routes