<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <router-link to="/"><img src="/logo.png" alt="Wedding30s" class="h-20 brightness-[2]" /></router-link>
        <router-link :to="`/create?id=${id}&token=${token}`" class="text-sm text-gold-400 hover:text-gold-300 transition-colors">
          {{ $t('dashboard.editWebsite') }}
        </router-link>
      </div>
    </nav>

    <div class="pt-24 pb-16 max-w-6xl mx-auto px-6">
      <div v-if="loading" class="text-center py-20">
        <div class="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-gray-400 mt-4">{{ $t('dashboard.loading') }}</p>
      </div>

      <template v-else>
        <div class="mb-12">
          <p class="font-script text-gold-400 text-2xl mb-2">{{ $t('dashboard.yourWeddingWebsite') }}</p>
          <h1 class="font-serif text-4xl md:text-5xl text-white">
            {{ wedding?.partner1_name }} & {{ wedding?.partner2_name }}
          </h1>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mb-12">
          <div class="p-6 rounded-2xl bg-gray-900/50 border border-white/5">
            <p class="text-sm text-gray-400 mb-1">{{ $t('dashboard.weddingUrl') }}</p>
            <div class="flex items-center gap-2 mt-2">
              <code class="text-gold-400 text-sm truncate flex-1">
                {{ weddingUrl }}
              </code>
              <button
                @click="copyUrl"
                class="flex-shrink-0 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <svg v-if="!copied" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <svg v-else class="w-4 h-4 text-sage-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6 rounded-2xl bg-gray-900/50 border border-white/5">
            <p class="text-sm text-gray-400 mb-1">{{ $t('dashboard.qrCode') }}</p>
            <div class="mt-2 w-24 h-24 bg-white rounded-lg flex items-center justify-center">
              <div ref="qrContainer" class="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-[8px] text-gray-400">
                QR Code
              </div>
            </div>
          </div>

          <div class="p-6 rounded-2xl bg-gray-900/50 border border-white/5">
            <p class="text-sm text-gray-400 mb-1">{{ $t('dashboard.weddingDate') }}</p>
            <p class="text-2xl font-serif text-white mt-2">{{ formattedDate }}</p>
            <p v-if="daysUntil > 0" class="text-gold-400 text-sm mt-1">
              {{ $t('dashboard.daysToGo', { days: daysUntil }) }}
            </p>
          </div>
        </div>

        <div class="grid sm:grid-cols-4 gap-4 mb-12">
          <div
            v-for="stat in stats"
            :key="stat.labelKey"
            class="p-5 rounded-2xl bg-gray-900/50 border border-white/5 text-center"
          >
            <p class="text-3xl font-serif" :class="stat.color">{{ stat.value }}</p>
            <p class="text-sm text-gray-400 mt-1">{{ $t('dashboard.' + stat.labelKey) }}</p>
          </div>
        </div>

        <div class="rounded-2xl bg-gray-900/50 border border-white/5 overflow-hidden">
          <div class="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 class="font-serif text-xl text-white">{{ $t('dashboard.guestListRsvps') }}</h2>
            <span class="text-sm text-gray-400">{{ $t('dashboard.guests', { count: guests.length }) }}</span>
          </div>

          <div v-if="guests.length === 0" class="p-12 text-center">
            <p class="text-gray-500">{{ $t('dashboard.noRsvps') }}</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left text-sm text-gray-400 border-b border-white/5">
                  <th class="px-6 py-3 font-medium">{{ $t('dashboard.name') }}</th>
                  <th class="px-6 py-3 font-medium">{{ $t('dashboard.attending') }}</th>
                  <th class="px-6 py-3 font-medium">{{ $t('dashboard.menuHeader') }}</th>
                  <th class="px-6 py-3 font-medium">{{ $t('dashboard.allergies') }}</th>
                  <th class="px-6 py-3 font-medium">{{ $t('dashboard.message') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="guest in guests"
                  :key="guest.id"
                  class="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td class="px-6 py-4 text-white">{{ guest.name }}</td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="{
                        'bg-sage-500/20 text-sage-400': guest.attending === 'yes',
                        'bg-red-500/20 text-red-400': guest.attending === 'no',
                        'bg-yellow-500/20 text-yellow-400': guest.attending === 'pending',
                      }"
                    >
                      {{ guest.attending === 'yes' ? $t('dashboard.statusConfirmed') : guest.attending === 'no' ? $t('dashboard.statusDeclined') : $t('dashboard.statusPending') }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-gray-300 text-sm">{{ guest.menu || '-' }}</td>
                  <td class="px-6 py-4 text-gray-300 text-sm">{{ guest.allergies || '-' }}</td>
                  <td class="px-6 py-4 text-gray-400 text-sm max-w-xs truncate">{{ guest.message || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ id: string }>()
const route = useRoute()
const { locale } = useI18n()
const token = computed(() => (route.query.token as string) || '')

interface Wedding {
  partner1_name: string
  partner2_name: string
  date: string
  slug: string
  location: string
}

interface Guest {
  id: string
  name: string
  attending: 'yes' | 'no' | 'pending'
  menu: string
  allergies: string
  message: string
}

const loading = ref(true)
const copied = ref(false)
const wedding = ref<Wedding | null>(null)
const guests = ref<Guest[]>([])
const qrContainer = ref<HTMLElement | null>(null)

const weddingUrl = computed(() => {
  if (!wedding.value?.slug) return ''
  return `${window.location.origin}/${wedding.value.slug}`
})

const formattedDate = computed(() => {
  if (!wedding.value?.date) return ''
  const loc = locale.value === 'es' ? 'es-ES' : 'en-US'
  return new Date(wedding.value.date + 'T00:00:00').toLocaleDateString(loc, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
})

const daysUntil = computed(() => {
  if (!wedding.value?.date) return 0
  const weddingDate = new Date(wedding.value.date + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
})

const stats = computed(() => {
  const confirmed = guests.value.filter(g => g.attending === 'yes').length
  const declined = guests.value.filter(g => g.attending === 'no').length
  const pending = guests.value.filter(g => g.attending === 'pending').length
  return [
    { labelKey: 'totalInvited', value: guests.value.length, color: 'text-white' },
    { labelKey: 'confirmed', value: confirmed, color: 'text-sage-400' },
    { labelKey: 'declined', value: declined, color: 'text-red-400' },
    { labelKey: 'pending', value: pending, color: 'text-yellow-400' },
  ]
})

async function copyUrl() {
  await navigator.clipboard.writeText(weddingUrl.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

onMounted(async () => {
  try {
    const tp = token.value ? `?token=${token.value}` : ''
    const [weddingRes, guestsRes] = await Promise.all([
      fetch(`/api/weddings/${props.id}${tp}`),
      fetch(`/api/weddings/${props.id}/guests${tp}`),
    ])
    wedding.value = await weddingRes.json()
    guests.value = await guestsRes.json()
  } catch {
    //
  } finally {
    loading.value = false
  }
})
</script>
