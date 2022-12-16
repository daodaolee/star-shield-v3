import { createApp } from 'vue'

import App from './App.vue'
import { useAppRouter } from './router'
import useAppStore from './store'
import useRouterGuard from './router/guard'

import './style/common.less'
import '@unocss/reset/tailwind.css'
import 'uno.css'

const app = createApp(App)

useAppStore(app)

useAppRouter(app)

useRouterGuard()

app.mount('#app')