<template>
  <div class="min-h-screen bg-cream-50 flex items-center justify-center">
    <div class="text-center p-8">
      <div class="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-gray-400 mt-4 font-sans text-sm">Loading wedding...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps<{ slug: string }>()

onMounted(() => {
  window.location.href = '/' + props.slug + '/index.html'
})
</script>
