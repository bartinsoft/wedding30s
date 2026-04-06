<template>
  <div class="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <router-link to="/"><img src="/logo.png" alt="Wedding30s" class="h-16 brightness-[2] mx-auto mb-4" /></router-link>
        <h1 class="font-serif text-2xl">{{ $t('auth.forgotPassword') }}</h1>
        <p class="text-gray-400 text-sm mt-2">{{ $t('auth.forgotPasswordSubtitle') }}</p>
      </div>

      <div v-if="sent" class="text-center py-8">
        <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-gold-400/10 flex items-center justify-center">
          <svg class="w-7 h-7 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="text-gray-300 text-sm">{{ $t('auth.resetEmailSent') }}</p>
        <router-link to="/login" class="inline-block mt-6 text-gold-400 hover:text-gold-300 text-sm transition-colors">
          &larr; {{ $t('auth.backToLogin') }}
        </router-link>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <input
          v-model="email" type="email" required autocomplete="email"
          :placeholder="$t('auth.email')"
          class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-400/50 transition-all"
        />
        <p v-if="error" class="text-red-400 text-xs">{{ error }}</p>
        <button type="submit" :disabled="submitting" class="w-full btn-primary py-3 text-sm disabled:opacity-50">
          {{ submitting ? '...' : $t('auth.sendResetLink') }}
        </button>
        <p class="text-center">
          <router-link to="/login" class="text-sm text-gray-400 hover:text-gold-400 transition-colors">
            &larr; {{ $t('auth.backToLogin') }}
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const error = ref('')
const submitting = ref(false)
const sent = ref(false)

async function handleSubmit() {
  error.value = ''
  submitting.value = true
  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    })
    if (!res.ok) {
      const data = await res.json()
      error.value = data.error
      return
    }
    sent.value = true
  } catch {
    error.value = 'Connection error'
  } finally {
    submitting.value = false
  }
}
</script>
