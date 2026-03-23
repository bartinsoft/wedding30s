<template>
  <div class="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
    <div class="flex items-center gap-2 px-3 py-2 bg-gray-900 border-b border-white/5">
      <div class="w-2 h-2 rounded-full bg-red-400/60"></div>
      <div class="w-2 h-2 rounded-full bg-yellow-400/60"></div>
      <div class="w-2 h-2 rounded-full bg-green-400/60"></div>
      <span class="ml-2 text-[10px] text-gray-600">{{ previewSlug }}.wedding30s.com</span>
    </div>

    <div :class="templateBg" class="transition-all duration-500">
      <div class="py-16 px-8 text-center">
        <p :class="templateScriptColor" class="font-script text-3xl md:text-4xl transition-colors duration-300">
          {{ displayPartner1 }} & {{ displayPartner2 }}
        </p>

        <div class="w-16 h-px mx-auto my-6 transition-colors duration-300" :class="templateLineColor"></div>

        <p :class="templateTextColor" class="font-serif text-sm tracking-[0.3em] uppercase transition-colors duration-300">
          {{ displayDate }}
        </p>

        <p :class="templateSubtextColor" class="font-sans text-sm mt-3 transition-colors duration-300">
          {{ form.location || 'Your City' }}
          <span v-if="form.venue"> &middot; {{ form.venue }}</span>
        </p>
      </div>

      <div v-if="form.story" class="px-8 pb-8">
        <div class="max-w-sm mx-auto">
          <p :class="templateSubtextColor" class="text-sm leading-relaxed text-center line-clamp-3">
            {{ form.story }}
          </p>
        </div>
      </div>

      <div v-if="hasProgram" class="px-8 pb-8">
        <div class="max-w-xs mx-auto">
          <p :class="templateTextColor" class="font-serif text-xs tracking-widest uppercase text-center mb-4">
            Program
          </p>
          <div class="space-y-2">
            <div
              v-for="entry in visibleProgram"
              :key="entry.time"
              class="flex items-center gap-3 text-xs"
              :class="templateSubtextColor"
            >
              <span class="font-medium w-12 text-right">{{ entry.time }}</span>
              <span class="w-px h-3" :class="templateLineColor"></span>
              <span>{{ entry.description }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="px-8 pb-12 text-center">
        <div
          class="inline-flex items-center px-6 py-2.5 rounded-full text-xs font-medium tracking-wide uppercase transition-all duration-300"
          :class="templateButtonClass"
        >
          RSVP
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ProgramEntry {
  time: string
  description: string
}

interface FormData {
  partner1: string
  partner2: string
  date: string
  location: string
  venue: string
  template: string
  story: string
  program: ProgramEntry[]
}

const props = defineProps<{ form: FormData }>()

const displayPartner1 = computed(() => props.form.partner1 || 'Emma')
const displayPartner2 = computed(() => props.form.partner2 || 'James')

const displayDate = computed(() => {
  if (!props.form.date) return 'Your Wedding Date'
  return new Date(props.form.date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
})

const previewSlug = computed(() => {
  const p1 = (props.form.partner1 || 'emma').toLowerCase().replace(/\s+/g, '')
  const p2 = (props.form.partner2 || 'james').toLowerCase().replace(/\s+/g, '')
  return `${p1}-${p2}`
})

const hasProgram = computed(() =>
  props.form.program.some(e => e.time && e.description)
)

const visibleProgram = computed(() =>
  props.form.program.filter(e => e.time && e.description).slice(0, 4)
)

const templateStyles = computed(() => {
  const styles: Record<string, {
    bg: string
    script: string
    text: string
    subtext: string
    line: string
    button: string
  }> = {
    'classic-garden': {
      bg: 'bg-gradient-to-b from-cream-50 via-cream-50 to-sage-50',
      script: 'text-sage-600',
      text: 'text-sage-500',
      subtext: 'text-sage-400',
      line: 'bg-sage-300',
      button: 'bg-sage-500 text-white',
    },
    'minimal-white': {
      bg: 'bg-white',
      script: 'text-gray-800',
      text: 'text-gray-500',
      subtext: 'text-gray-400',
      line: 'bg-gray-200',
      button: 'bg-gray-900 text-white',
    },
    'romantic-blush': {
      bg: 'bg-gradient-to-b from-blush-50 via-cream-50 to-blush-50',
      script: 'text-blush-500',
      text: 'text-blush-400',
      subtext: 'text-blush-300',
      line: 'bg-blush-200',
      button: 'bg-blush-400 text-white',
    },
    'modern-dark': {
      bg: 'bg-gradient-to-b from-gray-900 to-gray-800',
      script: 'text-gold-400',
      text: 'text-gold-300',
      subtext: 'text-gray-400',
      line: 'bg-gold-500/40',
      button: 'bg-gold-500 text-gray-900',
    },
  }
  return styles[props.form.template] || styles['classic-garden']
})

const templateBg = computed(() => templateStyles.value.bg)
const templateScriptColor = computed(() => templateStyles.value.script)
const templateTextColor = computed(() => templateStyles.value.text)
const templateSubtextColor = computed(() => templateStyles.value.subtext)
const templateLineColor = computed(() => templateStyles.value.line)
const templateButtonClass = computed(() => templateStyles.value.button)
</script>
