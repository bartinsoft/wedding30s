import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { routes } from './router'
import i18n from './i18n'
import './assets/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

import { useAuth } from './composables/useAuth'

router.beforeEach(async (to, _from, next) => {
  if (to.meta.requiresAuth) {
    const { user, fetchUser } = useAuth()
    if (!user.value) await fetchUser()
    if (!user.value) {
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }
  }
  next()
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
