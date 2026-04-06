<template>
  <div class="min-h-screen bg-cream-50 flex items-center justify-center">
    <div v-if="notFound" class="text-center p-8">
      <p class="text-gray-400 font-sans text-sm">Wedding not found</p>
      <router-link to="/" class="text-gold-400 hover:text-gold-300 text-sm mt-4 inline-block">&larr; Home</router-link>
    </div>
    <div v-else class="text-center p-8">
      <div class="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-gray-400 mt-4 font-sans text-sm">Loading wedding...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ slug: string }>()
const notFound = ref(false)

onMounted(async () => {
  try {
    const res = await fetch(`/api/wedding-page/${props.slug}`)
    if (res.ok) {
      // Wedding exists — redirect to Express which serves the full HTML page
      const port = import.meta.env.DEV ? ':3000' : ''
      window.location.replace(`${window.location.protocol}//${window.location.hostname}${port}/${props.slug}`)
    } else {
      notFound.value = true
    }
  } catch {
    notFound.value = true
  }
})
</script>
