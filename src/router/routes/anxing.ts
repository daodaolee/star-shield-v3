import type { RouteRecordRaw } from 'vue-router'
import {
  ShieldCheckmarkOutline as ShieldIcon
} from '@vicons/ionicons5'
import { renderIcon } from '@/utils/index'

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.affix 是否永久固定 tabbar
 * @param meta.hidden 是否隐藏
 * @param meta.icon 图标
 * @param meta.noShowTabbar 不展示到 tabbar
 * @param meta.isParent 是不是父级路由
 *
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/anxing',
    name: '安行',
    component: () => import ('@/Layout/index.vue'),
    meta: {
      isParent: true,
      icon: renderIcon(ShieldIcon)
    },
    children: [{
      path: '/anxing/test1',
      name: '安行示例1',
      meta: {},
      component: () => import ('@/views/anxing/test1.vue')
    }, {
      path: '/anxing/test2',
      name: '安行示例2',
      meta: {},
      component: () => import ('@/views/anxing/test2.vue')
    }]
  }
]

export default routes