<template>
  <div class="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <router-link to="/"><img src="/logo.png" alt="Wedding30s" class="h-16 brightness-[2] mx-auto mb-4" /></router-link>
        <h1 class="font-serif text-2xl">{{ $t('auth.register') }}</h1>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <input
            v-model="name" type="text" autocomplete="name"
            :placeholder="$t('auth.name')"
            class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-400/50 transition-all"
          />
        </div>
        <div>
          <input
            v-model="email" type="email" required autocomplete="email"
            :placeholder="$t('auth.email')"
            class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-400/50 transition-all"
          />
        </div>
        <div>
          <input
            v-model="password" type="password" required autocomplete="new-password" minlength="8"
            :placeholder="$t('auth.password')"
            class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-400/50 transition-all"
          />
        </div>

        <p v-if="error" class="text-red-400 text-xs">{{ error }}</p>

        <button type="submit" :disabled="submitting" class="w-full btn-primary py-3 text-sm disabled:opacity-50">
          {{ submitting ? '...' : $t('auth.registerButton') }}
        </button>
      </form>

      <div class="relative my-5 flex items-center">
        <div class="flex-1 border-t border-white/10"></div>
        <span class="px-3 text-xs text-gray-500">{{ $t('auth.or') }}</span>
        <div class="flex-1 border-t border-white/10"></div>
      </div>

      <button
        @click="handleGoogleSignup"
        class="w-full flex items-center justify-center gap-3 py-3 rounded-full bg-white text-sm text-gray-700 hover:bg-gray-100 transition-all"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {{ $t('auth.googleSignup') }}
      </button>

      <p class="mt-6 text-center text-sm text-gray-400">
        {{ $t('auth.hasAccount') }}
        <router-link to="/login" class="text-gold-400 hover:text-gold-300 transition-colors">
          {{ $t('auth.loginLink') }}
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { register, loginWithGoogle } = useAuth()

const name = ref('')
const email = ref((route.query.email as string) || '')
const password = ref('')
const error = ref('')
const submitting = ref(false)

async function handleRegister() {
  error.value = ''
  submitting.value = true
  try {
    await register(email.value, password.value, name.value || undefined)
    router.push((route.query.redirect as string) || '/my-weddings')
  } catch (e: any) {
    error.value = e.message
  } finally {
    submitting.value = false
  }
}

let googleInitialized = false

function initGoogle() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId || googleInitialized) return

  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.onload = () => {
    (window as any).google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: any) => {
        try {
          await loginWithGoogle(response.credential)
          router.push((route.query.redirect as string) || '/my-weddings')
        } catch (e: any) {
          error.value = e.message
        }
      },
    })
    googleInitialized = true
  }
  document.head.appendChild(script)
}

function handleGoogleSignup() {
  if (!googleInitialized) {
    initGoogle()
    setTimeout(() => {
      if (googleInitialized) (window as any).google.accounts.id.prompt()
    }, 500)
  } else {
    (window as any).google.accounts.id.prompt()
  }
}

onMounted(initGoogle)
</script>
