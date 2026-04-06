<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <router-link to="/"><img src="/logo.png" alt="Wedding30s" class="h-12 md:h-20 brightness-[2]" /></router-link>
        <div class="flex items-center gap-2 md:gap-4">
          <span class="text-sm text-gray-400">{{ $t('preview.previewMode') }}</span>
          <router-link to="/create" class="btn-primary text-sm py-2 px-6">
            {{ $t('preview.createYours') }}
          </router-link>
        </div>
      </div>
    </nav>

    <div class="pt-20 md:pt-24 pb-16 max-w-5xl mx-auto px-4 md:px-6">
      <div v-if="loading" class="text-center py-20">
        <div class="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-gray-400 mt-4">{{ $t('preview.loadingPreview') }}</p>
      </div>

      <template v-else-if="previewForm">
        <div class="text-center mb-8">
          <p class="font-script text-gold-400 text-xl mb-2">{{ $t('preview.previewLabel') }}</p>
          <h1 class="font-serif text-2xl md:text-3xl text-white">
            {{ previewForm.partner1 }} & {{ previewForm.partner2 }}
          </h1>
        </div>

        <WeddingPreview :form="previewForm" :full-width="true" />
      </template>

      <div v-else class="text-center py-20">
        <p class="text-gray-400">{{ $t('preview.weddingNotFound') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import WeddingPreview from '@/components/WeddingPreview.vue'

const props = defineProps<{ id: string }>()
const { locale } = useI18n()
const route = useRoute()
const token = route.query.token as string || ''

const loading = ref(true)
const previewForm = ref<any>(null)

function getDefaultPaletteForTemplate(template: string) {
  const map: Record<string, string> = {
    'classic-garden': 'sage-cream',
    'romantic-blush': 'blush-gold',
    'modern-minimal': 'mono',
  }
  return map[template] || 'sage-cream'
}

onMounted(async () => {
  try {
    const tp = token ? `?token=${token}` : ''
    const res = await fetch(`/api/weddings/${props.id}${tp}`)
    if (!res.ok) return
    const data = await res.json()

    const photos = data.photos ? (typeof data.photos === 'string' ? JSON.parse(data.photos) : data.photos) : []
    const menu = data.menu ? (typeof data.menu === 'string' ? JSON.parse(data.menu) : data.menu) : []
    const program = data.program ? (typeof data.program === 'string' ? JSON.parse(data.program) : data.program) : []

    // Replace real photo URLs with placeholders for shared preview
    const galleryPreviews = photos.map((_: any, idx: number) => ({
      url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="%23e8e4de" width="400" height="400"/><text x="200" y="200" text-anchor="middle" dominant-baseline="middle" font-family="serif" font-size="48" fill="%23aaa">${idx + 1}</text></svg>`)}`,
      year: '',
      label: '',
    }))

    previewForm.value = {
      partner1: data.partner1_name || '',
      partner2: data.partner2_name || '',
      date: data.date || '',
      location: data.location || '',
      venue: data.venue || '',
      template: data.template || 'classic-garden',
      palette: data.palette || getDefaultPaletteForTemplate(data.template),
      story: data.story || '',
      menuEnabled: menu.length > 0,
      menus: Array.isArray(menu) && menu[0]?.sections ? menu : [],
      program: program.length > 0 ? program : [{ time: '', description: '' }],
      galleryEnabled: galleryPreviews.length > 0,
      galleryStyle: data.gallery_style || 'grid',
      galleryPreviews,
      photoPreview: data.photo_url ? '' : '',
    }
  } catch {
    //
  } finally {
    loading.value = false
  }
})
</script>
