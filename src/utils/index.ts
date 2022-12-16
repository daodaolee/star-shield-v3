import { h } from 'vue'
import { NIcon } from 'naive-ui'

/**
 * 是否外部链接
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * render 图标
 */
export function renderIcon(icon: ReturnType<typeof defineComponent>) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

/**
 * 过滤Router
 * */
export function filterRouter(routerMap: Array<any>) {
  return routerMap.filter((item) => {
    return item.meta.isParent && item.children.length
  })
}

/**
 * 判断根路由 Router
 * */
export function isRootRouter(item: any) {
  return (
    item.meta?.alwaysShow !== true
    && item?.children?.filter((item: any) => !item?.meta?.hidden)?.length === 1
  )
}

/**
 * 中划线字符驼峰
 * @param {*} str 要转换的字符串
 * @returns 返回值
 */
export function toHump(str: string): string {
  if (!str)
    return str
  return str
    .replace(/\-(\w)/g, (all, letter) => {
      return letter.toUpperCase()
    })
    .replace(/(\s|^)[a-z]/g, (char) => {
      return char.toUpperCase()
    })
}

/**
 * Sums the passed percentage to the R, G or B of a HEX color
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function addLight(color: string, amount: number) {
  const cc = parseInt(color, 16) + amount
  const c = cc > 255 ? 255 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
 * Lightens a 6 char HEX color according to the passed percentage
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed color represented as HEX
 */
export function lighten(color: string, amount: number) {
  color = color.includes('#') ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`
}