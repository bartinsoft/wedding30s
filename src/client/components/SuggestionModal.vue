<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @mousedown.self="$emit('close')">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>

        <div class="relative bg-gray-900 rounded-2xl border border-white/10 w-full max-w-sm sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
          <button
            @click="$emit('close')"
            class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="p-6">
            <div v-if="submitted" class="text-center py-10">
              <div class="w-14 h-14 mx-auto mb-5 rounded-full bg-gold-400/10 flex items-center justify-center">
                <svg class="w-7 h-7 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 class="font-serif text-xl text-white mb-2">{{ $t('suggestions.thankYou') }}</h2>
              <p class="text-gray-400 text-sm">{{ $t('suggestions.confirmationMessage') }}</p>
              <button @click="$emit('close')" class="mt-6 text-gold-400 hover:text-gold-300 text-sm transition-colors">
                {{ $t('suggestions.close') }}
              </button>
            </div>

            <template v-else>
              <h2 class="font-serif text-xl text-white mb-1">{{ $t('suggestions.title') }}</h2>
              <p class="text-gray-400 text-xs mb-5">{{ $t('suggestions.subtitle') }}</p>

              <form @submit.prevent="submit" class="space-y-4">
                <div>
                  <label class="block text-xs font-medium text-gray-300 mb-1.5">{{ $t('suggestions.email') }} *</label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    :placeholder="$t('suggestions.emailPlaceholder')"
                    class="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-white
                           focus:outline-none focus:border-gold-400/50 transition-all text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-300 mb-1.5">{{ $t('suggestions.description') }} *</label>
                  <textarea
                    v-model="form.description"
                    required
                    rows="4"
                    :placeholder="$t('suggestions.descriptionPlaceholder')"
                    class="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-white
                           focus:outline-none focus:border-gold-400/50 transition-all text-sm resize-none"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-300 mb-1.5">
                    {{ $t('suggestions.links') }}
                    <span class="text-gray-500 font-normal">{{ $t('suggestions.optional') }}</span>
                  </label>
                  <textarea
                    v-model="form.links"
                    rows="2"
                    :placeholder="$t('suggestions.linksPlaceholder')"
                    class="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-white
                           focus:outline-none focus:border-gold-400/50 transition-all text-sm resize-none"
                  ></textarea>
                </div>

                <div ref="turnstileContainer"></div>

                <p v-if="error" class="text-red-400 text-xs">{{ error }}</p>

                <button
                  type="submit"
                  :disabled="sending"
                  class="w-full btn-primary py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ sending ? $t('suggestions.sending') : $t('suggestions.send') }}
                </button>
              </form>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  visible: boolean
  weddingId?: string
}>()

defineEmits<{
  close: []
}>()

const form = ref({
  email: '',
  description: '',
  links: '',
})

const submitted = ref(false)
const sending = ref(false)
const error = ref('')
const turnstileContainer = ref<HTMLElement | null>(null)
let turnstileToken = ''
let turnstileRendered = false

const isDev = window.location.hostname !== 'wedding30s.com'

watch(() => props.visible, async (open) => {
  if (open && !turnstileRendered && !isDev) {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
    if (!siteKey) return

    await nextTick()
    if (!turnstileContainer.value) return

    if (!(window as any).turnstile) {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.onload = () => {
        renderTurnstile(siteKey)
      }
      document.head.appendChild(script)
    } else {
      renderTurnstile(siteKey)
    }
  }
})

function renderTurnstile(siteKey: string) {
  if (!turnstileContainer.value || turnstileRendered) return
  ;(window as any).turnstile.render(turnstileContainer.value, {
    sitekey: siteKey,
    theme: 'dark',
    callback: (token: string) => { turnstileToken = token },
  })
  turnstileRendered = true
}

async function submit() {
  error.value = ''
  sending.value = true

  try {
    const res = await fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form.value,
        turnstileToken,
        weddingId: props.weddingId || undefined,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      error.value = data.error || 'Something went wrong'
      return
    }

    submitted.value = true
  } catch {
    error.value = 'Connection error. Please try again.'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
