<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <router-link to="/"><img src="/logo.png" alt="Wedding30s" class="h-12 md:h-20 brightness-[2]" /></router-link>
        <div class="flex items-center gap-2 md:gap-4">
          <router-link v-if="user" to="/my-weddings" class="text-sm text-gray-400 hover:text-gold-400 transition-colors">
            {{ $t('auth.myWeddings') }}
          </router-link>
          <router-link :to="`/create?id=${id}&token=${token}`" class="text-sm text-gold-400 hover:text-gold-300 transition-colors">
            {{ $t('dashboard.editWebsite') }}
          </router-link>
        </div>
      </div>
    </nav>

    <div class="pt-24 md:pt-32 pb-12 md:pb-16 max-w-6xl mx-auto px-4 md:px-6">
      <div v-if="loading" class="text-center py-20">
        <div class="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-gray-400 mt-4">{{ $t('dashboard.loading') }}</p>
      </div>

      <template v-else>
        <div
          v-if="showCreateAccountBanner"
          class="mb-8 p-4 md:p-6 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div class="flex-1">
            <p class="text-white font-medium text-sm">{{ $t('auth.createAccountBanner') }}</p>
            <p class="text-gray-400 text-xs mt-1">{{ $t('auth.createAccountBannerSub') }}</p>
          </div>
          <router-link
            :to="`/register?email=${encodeURIComponent(wedding?.email || '')}&redirect=/my-weddings`"
            class="btn-primary text-sm py-2 px-6 flex-shrink-0"
          >
            {{ $t('auth.createAccountButton') }}
          </router-link>
        </div>

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
              <code class="text-gold-400 text-sm break-all flex-1">
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
            <div class="mt-2 w-28 h-28 bg-white rounded-lg p-1.5">
              <img
                v-if="weddingUrl"
                :src="qrUrl"
                alt="QR Code"
                class="w-full h-full"
              />
            </div>
            <button
              v-if="weddingUrl"
              @click="downloadQr"
              class="mt-2 text-xs text-gold-400 hover:text-gold-300 transition-colors"
            >
              {{ $t('dashboard.downloadQr') }}
            </button>
          </div>

          <div class="p-6 rounded-2xl bg-gray-900/50 border border-white/5">
            <p class="text-sm text-gray-400 mb-1">{{ $t('dashboard.weddingDate') }}</p>
            <p class="text-2xl font-serif text-white mt-2">{{ formattedDate }}</p>
            <p v-if="daysUntil > 0" class="text-gold-400 text-sm mt-1">
              {{ $t('dashboard.daysToGo', { days: daysUntil }) }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
          <div
            v-for="stat in stats"
            :key="stat.labelKey"
            class="p-5 rounded-2xl bg-gray-900/50 border border-white/5 text-center"
          >
            <p class="text-3xl font-serif" :class="stat.color">{{ stat.value }}</p>
            <p class="text-sm text-gray-400 mt-1">{{ $t('dashboard.' + stat.labelKey) }}</p>
          </div>
        </div>

        <div v-if="menuSummary.length > 0" class="mb-8 md:mb-12 rounded-2xl bg-gray-900/50 border border-white/5 p-4 md:p-6">
          <h2 class="font-serif text-lg text-white mb-4">{{ $t('dashboard.menuSummary') }}</h2>
          <div class="space-y-4">
            <div v-for="menu in menuSummary" :key="menu.name">
              <div class="flex items-center justify-between mb-2">
                <span class="text-gold-400 font-medium text-sm">{{ menu.name }}</span>
                <span class="text-white font-serif text-lg">{{ menu.total }}</span>
              </div>
              <div v-if="menu.sections.length > 0" class="pl-4 space-y-2">
                <div v-for="section in menu.sections" :key="section.section">
                  <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">{{ section.section }}</p>
                  <div class="pl-2 space-y-0.5">
                    <div v-for="dish in section.dishes" :key="dish.name" class="flex items-center justify-between text-sm">
                      <span class="text-gray-400">{{ dish.name }}</span>
                      <span class="text-gray-300">{{ dish.count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

          <div v-else class="divide-y divide-white/5">
            <div
              v-for="group in guestGroups"
              :key="group.key"
              class="p-4 md:p-6 hover:bg-white/[0.02] transition-colors"
            >
              <div class="flex items-start justify-between mb-3">
                <div>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-sage-500/20 text-sage-400': group.guests[0].attending === 'yes',
                      'bg-red-500/20 text-red-400': group.guests[0].attending === 'no',
                    }"
                  >
                    {{ group.guests[0].attending === 'yes' ? $t('dashboard.statusConfirmed') : $t('dashboard.statusDeclined') }}
                  </span>
                  <span class="text-gray-500 text-xs ml-2">{{ group.guests.length }} {{ group.guests.length === 1 ? 'persona' : 'personas' }}</span>
                </div>
                <span v-if="group.email" class="text-gray-500 text-xs">{{ group.email }}</span>
              </div>

              <div class="space-y-2">
                <div
                  v-for="guest in group.guests"
                  :key="guest.id"
                  class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 pl-2 border-l-2 border-white/10 ml-1"
                >
                  <span class="text-white text-sm font-medium min-w-[140px]">{{ guest.name }}</span>
                  <span class="text-sm">
                    <span v-if="guest.menu_type" class="text-gold-400 text-xs">{{ guest.menu_type }}</span>
                    <span v-if="guest.menu_type && guest.menu_choice" class="text-gray-600"> &middot; </span>
                    <span class="text-gray-400">{{ guest.menu_choice || '' }}</span>
                  </span>
                  <span v-if="guest.allergies" class="text-red-400/70 text-xs">{{ guest.allergies }}</span>
                </div>
              </div>

              <p v-if="group.message" class="mt-3 text-gray-500 text-xs italic pl-3 border-l border-gold-400/20">
                "{{ group.message }}"
              </p>
            </div>
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
import { useAuth } from '@/composables/useAuth'

const props = defineProps<{ id: string }>()
const route = useRoute()
const { locale } = useI18n()
const { user, fetchUser } = useAuth()
const token = computed(() => (route.query.token as string) || '')
const showCreateAccountBanner = computed(() => !user.value && route.query.published === 'true')

interface Wedding {
  partner1_name: string
  partner2_name: string
  date: string
  slug: string
  location: string
  email: string
  menu: string | null
}

interface Guest {
  id: string
  name: string
  attending: 'yes' | 'no' | 'pending'
  email: string | null
  menu_type: string
  menu_choice: string | null
  menu: string
  allergies: string
  message: string
  created_at: string
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

const qrUrl = computed(() => {
  if (!weddingUrl.value) return ''
  return `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(weddingUrl.value)}`
})

async function downloadQr() {
  try {
    const res = await fetch(qrUrl.value)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-${wedding.value?.slug || 'wedding'}.png`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    window.open(qrUrl.value, '_blank')
  }
}

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
  return [
    { labelKey: 'totalResponses', value: guests.value.length, color: 'text-white' },
    { labelKey: 'confirmed', value: confirmed, color: 'text-sage-400' },
    { labelKey: 'declined', value: declined, color: 'text-red-400' },
  ]
})

const menuSummary = computed(() => {
  const confirmedGuests = guests.value.filter(g => g.attending === 'yes')
  if (confirmedGuests.length === 0) return []

  const menuMap: Record<string, { total: number; sections: Record<string, Record<string, number>> }> = {}

  for (const guest of confirmedGuests) {
    const menuType = guest.menu_type || 'default'
    if (!menuMap[menuType]) {
      menuMap[menuType] = { total: 0, sections: {} }
    }
    menuMap[menuType].total++

    if (guest.menu_choice) {
      // menu_choice format: "LANGOSTINOS, PESCADO" — each dish belongs to a section
      // We try to match against wedding menu data to find the section
      const dishes = guest.menu_choice.split(',').map((d: string) => d.trim())
      for (const dish of dishes) {
        if (!dish) continue
        const section = findDishSection(dish) || '—'
        if (!menuMap[menuType].sections[section]) {
          menuMap[menuType].sections[section] = {}
        }
        menuMap[menuType].sections[section][dish] = (menuMap[menuType].sections[section][dish] || 0) + 1
      }
    }
  }

  return Object.entries(menuMap).map(([name, data]) => ({
    name,
    total: data.total,
    sections: Object.entries(data.sections).map(([section, dishes]) => ({
      section,
      dishes: Object.entries(dishes).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    })),
  })).sort((a, b) => b.total - a.total)
})

function findDishSection(dish: string): string | null {
  if (!wedding.value?.menu) return null
  try {
    const menus = typeof wedding.value.menu === 'string' ? JSON.parse(wedding.value.menu) : wedding.value.menu
    if (!Array.isArray(menus)) return null
    for (const menu of menus) {
      if (menu.sections) {
        for (const section of menu.sections) {
          if (section.items) {
            for (const item of section.items) {
              const name = typeof item === 'string' ? item : item.name
              if (name && name.toUpperCase() === dish.toUpperCase()) {
                return section.name || menu.name
              }
            }
          }
        }
      }
    }
  } catch { /* */ }
  return null
}

// Group guests by submission (same email + message + created_at)
const guestGroups = computed(() => {
  const groups: { key: string; email: string; message: string; guests: any[] }[] = []
  const groupMap = new Map<string, number>()

  for (const guest of guests.value) {
    // Group by email + created_at rounded to the second (same submission)
    const created = guest.created_at ? new Date(guest.created_at).toISOString().slice(0, 19) : ''
    const key = `${guest.email || ''}|${created}`

    if (groupMap.has(key)) {
      groups[groupMap.get(key)!].guests.push(guest)
    } else {
      groupMap.set(key, groups.length)
      groups.push({
        key,
        email: guest.email || '',
        message: guest.message || '',
        guests: [guest],
      })
    }
  }

  return groups
})

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(weddingUrl.value)
  } catch {
    // Fallback for non-secure contexts
    const textarea = document.createElement('textarea')
    textarea.value = weddingUrl.value
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

onMounted(async () => {
  fetchUser()
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
