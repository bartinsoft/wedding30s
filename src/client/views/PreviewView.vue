<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <router-link to="/" class="font-script text-2xl text-gold-400">Wedding30s</router-link>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-400">Preview Mode</span>
          <router-link to="/create" class="btn-primary text-sm py-2 px-6">
            Create Yours
          </router-link>
        </div>
      </div>
    </nav>

    <div class="pt-24 pb-16 max-w-5xl mx-auto px-6">
      <div v-if="loading" class="text-center py-20">
        <div class="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-gray-400 mt-4">Loading preview...</p>
      </div>

      <template v-else-if="wedding">
        <div class="text-center mb-8">
          <p class="font-script text-gold-400 text-xl mb-2">Preview</p>
          <h1 class="font-serif text-3xl text-white">
            {{ wedding.partner1 }} & {{ wedding.partner2 }}
          </h1>
        </div>

        <div class="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div class="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-white/5">
            <div class="w-3 h-3 rounded-full bg-red-400/60"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-400/60"></div>
            <div class="w-3 h-3 rounded-full bg-green-400/60"></div>
            <span class="ml-3 text-xs text-gray-500">preview.wedding30s.com</span>
          </div>
          <iframe
            v-if="previewUrl"
            :src="previewUrl"
            class="w-full border-0"
            style="height: 80vh"
          ></iframe>
          <div v-else class="bg-cream-50 flex items-center justify-center" style="height: 80vh">
            <div class="text-center p-12">
              <p class="font-script text-sage-600 text-4xl">
                {{ wedding.partner1 }} & {{ wedding.partner2 }}
              </p>
              <div class="w-24 h-px bg-gold-400 mx-auto my-6"></div>
              <p class="font-serif text-gray-600 text-xl tracking-widest uppercase">
                {{ formattedDate }}
              </p>
              <p class="font-sans text-gray-400 mt-4">{{ wedding.location }}</p>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="text-center py-20">
        <p class="text-gray-400">Wedding not found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{ id: string }>()

interface Wedding {
  partner1: string
  partner2: string
  date: string
  location: string
  slug?: string
}

const loading = ref(true)
const wedding = ref<Wedding | null>(null)

const previewUrl = computed(() => {
  if (!wedding.value?.slug) return ''
  return `/${wedding.value.slug}/index.html`
})

const formattedDate = computed(() => {
  if (!wedding.value?.date) return ''
  return new Date(wedding.value.date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
})

onMounted(async () => {
  try {
    const res = await fetch(`/api/weddings/${props.id}`)
    wedding.value = await res.json()
  } catch {
    // silent
  } finally {
    loading.value = false
  }
})
</script>
