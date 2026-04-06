<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <router-link to="/"><img src="/logo.png" alt="Wedding30s" class="h-12 md:h-20 brightness-[2]" /></router-link>
        <div class="flex items-center gap-2 md:gap-4">
          <span class="text-sm text-gray-400 hidden sm:inline">{{ user?.email }}</span>
          <button @click="handleLogout" class="text-sm text-gray-400 hover:text-gold-400 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold-400/30">
            {{ $t('auth.logout') }}
          </button>
        </div>
      </div>
    </nav>

    <div class="pt-20 md:pt-28 pb-16 max-w-4xl mx-auto px-4 md:px-6">
      <div class="flex items-center justify-between mb-8">
        <h1 class="font-serif text-2xl md:text-3xl">{{ $t('auth.myWeddings') }}</h1>
        <router-link to="/create" class="btn-primary text-sm py-2 px-6">
          {{ $t('auth.createNew') }}
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>

      <div v-else-if="weddings.length === 0" class="text-center py-20">
        <p class="text-gray-400 mb-6">{{ $t('auth.noWeddings') }}</p>
        <router-link to="/create" class="btn-primary py-3 px-8">
          {{ $t('auth.createFirst') }}
        </router-link>
      </div>

      <div v-else class="grid gap-4">
        <router-link
          v-for="w in weddings"
          :key="w.id"
          :to="`/dashboard/${w.id}`"
          class="flex items-center gap-4 p-4 md:p-6 rounded-2xl bg-gray-900/50 border border-white/5 hover:border-gold-400/20 transition-all group"
        >
          <div class="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img v-if="w.photo_url" :src="w.photo_url" class="w-full h-full object-cover" />
            <span v-else class="font-script text-gold-400 text-lg">{{ (w.partner1_name?.[0] || '') + (w.partner2_name?.[0] || '') }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-serif text-lg text-white group-hover:text-gold-400 transition-colors truncate">
              {{ w.partner1_name }} & {{ w.partner2_name }}
            </h3>
            <p class="text-sm text-gray-400 truncate">
              {{ w.date }} &middot; {{ w.location }}
            </p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <span
              class="text-xs px-2.5 py-1 rounded-full"
              :class="w.status === 'published' ? 'bg-sage-500/20 text-sage-400' : 'bg-yellow-500/20 text-yellow-400'"
            >
              {{ w.status === 'published' ? $t('auth.published') : $t('auth.draft') }}
            </span>
            <button
              @click.prevent="deleteWedding(w.id, w.partner1_name, w.partner2_name)"
              class="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </router-link>
      </div>
    </div>
  </div>

  <ConfirmModal
    :visible="!!deleteTarget"
    :title="deleteTarget?.name || ''"
    message="This wedding and all its RSVPs will be permanently deleted."
    confirm-text="Delete"
    cancel-text="Cancel"
    variant="danger"
    @confirm="confirmDelete"
    @cancel="deleteTarget = null"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import ConfirmModal from '@/components/ConfirmModal.vue'

const router = useRouter()
const { user, logout } = useAuth()

const weddings = ref<any[]>([])
const loading = ref(true)

async function handleLogout() {
  await logout()
  router.push('/')
}

const deleteTarget = ref<{ id: string; name: string } | null>(null)

function deleteWedding(id: string, p1: string, p2: string) {
  deleteTarget.value = { id, name: `${p1} & ${p2}` }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  try {
    const res = await fetch(`/api/weddings/${deleteTarget.value.id}`, { method: 'DELETE' })
    if (res.ok) {
      weddings.value = weddings.value.filter(w => w.id !== deleteTarget.value!.id)
    }
  } catch { /* */ }
  deleteTarget.value = null
}

onMounted(async () => {
  try {
    const res = await fetch('/api/users/me/weddings')
    if (res.ok) {
      weddings.value = await res.json()
    }
  } catch {
    //
  } finally {
    loading.value = false
  }
})
</script>
