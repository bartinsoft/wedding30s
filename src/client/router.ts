import type { RouteRecordRaw } from 'vue-router'
import LandingView from './views/LandingView.vue'
import CreateView from './views/CreateView.vue'
import PreviewView from './views/PreviewView.vue'
import DashboardView from './views/DashboardView.vue'
import WeddingView from './views/WeddingView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', component: LandingView },
  { path: '/create', component: CreateView },
  { path: '/preview/:id', component: PreviewView, props: true },
  { path: '/dashboard/:id', component: DashboardView, props: true },
  { path: '/:slug', component: WeddingView, props: true },
]
