import type { App } from 'vue'
import { createPinia } from 'pinia'
const store = createPinia()

export default function useAppStore(app: App<Element>) {
  app.use(store)
}

// export {
//   store
// }