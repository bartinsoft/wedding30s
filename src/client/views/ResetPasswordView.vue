<template>
  <div class="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <router-link to="/"><img src="/logo.png" alt="Wedding30s" class="h-16 brightness-[2] mx-auto mb-4" /></router-link>
        <h1 class="font-serif text-2xl">{{ $t('auth.resetPassword') }}</h1>
      </div>

      <div v-if="done" class="text-center py-8">
        <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-gold-400/10 flex items-center justify-center">
          <svg class="w-7 h-7 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p class="text-gray-300 text-sm">{{ $t('auth.passwordResetSuccess') }}</p>
        <router-link to="/login" class="inline-block mt-6 btn-primary py-2 px-8 text-sm">
          {{ $t('auth.loginButton') }}
        </router-link>
      </div>

      <form v-else @submit.prevent="handleReset" class="space-y-4">
        <input
          v-model="password" type="password" required autocomplete="new-password" minlength="8"
          :placeholder="$t('auth.newPassword')"
          class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-400/50 transition-all"
        />
        <input
          v-model="confirmPassword" type="password" required autocomplete="new-password" minlength="8"
          :placeholder="$t('auth.confirmPassword')"
          class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-400/50 transition-all"
        />
        <p v-if="error" class="text-red-400 text-xs">{{ error }}</p>
        <button type="submit" :disabled="submitting" class="w-full btn-primary py-3 text-sm disabled:opacity-50">
          {{ submitting ? '...' : $t('auth.resetPasswordButton') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const token = route.query.token as string || ''

const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const submitting = ref(false)
const done = ref(false)

async function handleReset() {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  submitting.value = true
  try {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: password.value }),
    })
    if (!res.ok) {
      const data = await res.json()
      error.value = data.error
      return
    }
    done.value = true
  } catch {
    error.value = 'Connection error'
  } finally {
    submitting.value = false
  }
}
</script>
