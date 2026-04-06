import type { RouteRecordRaw } from 'vue-router'
import LandingView from './views/LandingView.vue'
import CreateView from './views/CreateView.vue'
import PreviewView from './views/PreviewView.vue'
import DashboardView from './views/DashboardView.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import ForgotPasswordView from './views/ForgotPasswordView.vue'
import ResetPasswordView from './views/ResetPasswordView.vue'
import MyWeddingsView from './views/MyWeddingsView.vue'
import WeddingView from './views/WeddingView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', component: LandingView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/forgot-password', component: ForgotPasswordView },
  { path: '/reset-password', component: ResetPasswordView },
  { path: '/my-weddings', component: MyWeddingsView, meta: { requiresAuth: true } },
  { path: '/create', component: CreateView },
  { path: '/preview/:id', component: PreviewView, props: true },
  { path: '/dashboard/:id', component: DashboardView, props: true },
  { path: '/:slug', component: WeddingView, props: true },
]
