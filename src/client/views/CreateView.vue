<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <router-link to="/" class="font-script text-2xl text-gold-400">Wedding30s</router-link>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-400">Step {{ currentStep }} of 4</span>
        </div>
      </div>
    </nav>

    <div class="pt-20 pb-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center justify-center gap-2 py-8">
          <template v-for="step in 4" :key="step">
            <button
              class="flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-500 cursor-pointer"
              :class="step <= currentStep
                ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20'
                : 'bg-gray-800 text-gray-500 border border-gray-700'"
              @click="step < currentStep ? currentStep = step : null"
            >
              <svg v-if="step < currentStep" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>{{ step }}</span>
            </button>
            <div
              v-if="step < 4"
              class="w-16 md:w-24 h-0.5 transition-all duration-500"
              :class="step < currentStep ? 'bg-gold-500' : 'bg-gray-800'"
            ></div>
          </template>
        </div>

        <div class="flex gap-12 mt-8" :class="currentStep === 4 ? '' : 'lg:flex-row flex-col'">
          <div :class="currentStep === 4 ? 'w-full' : 'lg:w-[58%] w-full'">
            <transition name="slide" mode="out-in">
              <div v-if="currentStep === 1" key="step1">
                <h2 class="section-title text-white mb-2">Names & Date</h2>
                <p class="text-gray-400 mb-10">Tell us about your big day</p>

                <div class="space-y-6">
                  <div class="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Partner 1</label>
                      <input
                        v-model="form.partner1"
                        type="text"
                        placeholder="First name"
                        class="form-input-field"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Partner 2</label>
                      <input
                        v-model="form.partner2"
                        type="text"
                        placeholder="First name"
                        class="form-input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Wedding Date</label>
                    <input
                      v-model="form.date"
                      type="date"
                      class="form-input-field"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                      v-model="form.location"
                      type="text"
                      placeholder="City, Country"
                      class="form-input-field"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      Venue Name
                      <span class="text-gray-600 font-normal">(optional)</span>
                    </label>
                    <input
                      v-model="form.venue"
                      type="text"
                      placeholder="e.g. Villa Cora"
                      class="form-input-field"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      v-model="form.email"
                      type="email"
                      placeholder="your@email.com"
                      class="form-input-field"
                    />
                    <p class="text-xs text-gray-500 mt-2">For RSVP notifications and managing your website</p>
                  </div>
                </div>
              </div>

              <div v-else-if="currentStep === 2" key="step2">
                <h2 class="section-title text-white mb-2">Choose Your Style</h2>
                <p class="text-gray-400 mb-10">Pick a template and colors that match your vibe</p>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-4">Template</label>
                  <div class="grid grid-cols-2 gap-4">
                    <div
                      v-for="tpl in templateOptions"
                      :key="tpl.id"
                      class="cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 group"
                      :class="form.template === tpl.id
                        ? 'border-gold-400 shadow-lg shadow-gold-500/10 scale-[1.02]'
                        : 'border-white/5 hover:border-white/20'"
                      @click="form.template = tpl.id"
                    >
                      <div
                        class="aspect-[3/4] flex items-center justify-center p-4 relative overflow-hidden"
                        :style="{ background: tpl.bgGradient }"
                      >
                        <svg class="absolute top-0 left-0 h-full w-auto opacity-15 pointer-events-none" viewBox="0 0 140 500" fill="none">
                          <path d="M70 0 C67 50 73 100 66 150 C59 200 76 250 70 300" :stroke="tpl.svgColor" stroke-width="2.5" fill="none"/>
                          <ellipse cx="42" cy="35" rx="30" ry="12" transform="rotate(-35 42 35)" :fill="tpl.svgColor" opacity="0.5"/>
                          <ellipse cx="98" cy="75" rx="28" ry="11" transform="rotate(30 98 75)" :fill="tpl.svgColor" opacity="0.45"/>
                          <ellipse cx="38" cy="120" rx="32" ry="12" transform="rotate(-40 38 120)" :fill="tpl.svgColor" opacity="0.5"/>
                          <ellipse cx="100" cy="165" rx="29" ry="11" transform="rotate(35 100 165)" :fill="tpl.svgColor" opacity="0.45"/>
                        </svg>
                        <svg class="absolute top-0 right-0 h-full w-auto opacity-15 pointer-events-none" style="transform: scaleX(-1)" viewBox="0 0 140 500" fill="none">
                          <path d="M70 0 C73 50 67 100 74 150 C81 200 64 250 70 300" :stroke="tpl.svgColor" stroke-width="2.5" fill="none"/>
                          <ellipse cx="98" cy="40" rx="30" ry="12" transform="rotate(35 98 40)" :fill="tpl.svgColor" opacity="0.5"/>
                          <ellipse cx="42" cy="80" rx="28" ry="11" transform="rotate(-30 42 80)" :fill="tpl.svgColor" opacity="0.45"/>
                          <ellipse cx="102" cy="125" rx="32" ry="12" transform="rotate(40 102 125)" :fill="tpl.svgColor" opacity="0.5"/>
                        </svg>
                        <div class="text-center relative z-10">
                          <p :style="{ color: tpl.scriptColor }" class="font-script text-lg">
                            {{ form.partner1 || 'Emma' }} & {{ form.partner2 || 'James' }}
                          </p>
                          <div class="flex items-center justify-center gap-2 my-2">
                            <span class="w-6 h-px" :style="{ background: tpl.accentColor }"></span>
                            <span class="w-1.5 h-1.5 rotate-45" :style="{ background: tpl.accentColor }"></span>
                            <span class="w-6 h-px" :style="{ background: tpl.accentColor }"></span>
                          </div>
                          <p :style="{ color: tpl.textColor }" class="font-serif text-[10px] tracking-widest uppercase">
                            {{ formattedDate }}
                          </p>
                        </div>
                      </div>
                      <div class="bg-gray-900 px-3 py-2 text-center">
                        <p class="text-sm text-white">{{ tpl.name }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-10">
                  <label class="block text-sm font-medium text-gray-300 mb-4">Color Palette</label>
                  <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    <div
                      v-for="palette in palettes"
                      :key="palette.id"
                      class="cursor-pointer group"
                      @click="form.palette = palette.id"
                    >
                      <div
                        class="aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300"
                        :class="form.palette === palette.id
                          ? 'border-gold-400 scale-110 shadow-lg shadow-gold-500/10'
                          : 'border-white/5 hover:border-white/20'"
                      >
                        <div class="w-full h-full flex flex-col">
                          <div class="flex-1 flex items-center justify-center" :style="{ background: palette.bg }">
                            <span class="font-script text-xs" :style="{ color: palette.primary }">A & B</span>
                          </div>
                          <div class="h-1.5 flex">
                            <div class="flex-1" :style="{ background: palette.primary }"></div>
                            <div class="flex-1" :style="{ background: palette.accent }"></div>
                            <div class="flex-1" :style="{ background: palette.bg }"></div>
                          </div>
                        </div>
                      </div>
                      <p class="text-[11px] text-gray-400 text-center mt-2 group-hover:text-gray-300 transition-colors">{{ palette.name }}</p>
                    </div>
                  </div>
                </div>

                <div class="mt-10">
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Couple Photo
                    <span class="text-gray-600 font-normal">(optional)</span>
                  </label>
                  <div
                    class="border-2 border-dashed border-white/10 rounded-xl p-8 text-center
                           hover:border-gold-400/30 transition-all cursor-pointer group"
                    @click="triggerFileInput"
                  >
                    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
                    <div v-if="!form.photoPreview">
                      <svg class="w-10 h-10 mx-auto text-gray-600 group-hover:text-gold-400/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p class="text-gray-500 mt-3 text-sm">Click to upload a photo</p>
                    </div>
                    <img v-else :src="form.photoPreview" class="w-32 h-32 mx-auto rounded-xl object-cover" />
                  </div>
                </div>
              </div>

              <div v-else-if="currentStep === 3" key="step3">
                <h2 class="section-title text-white mb-2">Your Content</h2>
                <p class="text-gray-400 mb-10">Add details your guests will love (all optional)</p>

                <div class="space-y-8">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Your Story</label>
                    <RichTextEditor
                      v-model="form.story"
                      placeholder="How did you meet? Share your love story..."
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-4">Menu</label>
                    <div class="space-y-4">
                      <div v-for="course in menuCoursesDef" :key="course.key" class="relative">
                        <div class="flex items-center gap-2 mb-1.5">
                          <span class="text-base">{{ course.icon }}</span>
                          <label class="text-xs text-gray-400 font-medium uppercase tracking-wider">{{ course.label }}</label>
                        </div>
                        <input
                          v-model="(form.menu as Record<string, string>)[course.key]"
                          type="text"
                          :placeholder="course.placeholder"
                          class="form-input-field"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <label class="block text-sm font-medium text-gray-300">Day Program</label>
                      <button @click="addProgramEntry" class="text-sm text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Entry
                      </button>
                    </div>
                    <div class="space-y-3">
                      <transition-group name="list">
                        <div
                          v-for="(entry, index) in form.program"
                          :key="'prog-' + index"
                          class="flex gap-3 items-center group"
                        >
                          <div class="relative">
                            <input
                              v-model="entry.time"
                              type="time"
                              class="w-28 bg-gray-900 border border-white/10 rounded-xl px-3 py-3 text-white
                                     focus:outline-none focus:border-gold-400/50 transition-all text-sm"
                            />
                          </div>
                          <input
                            v-model="entry.description"
                            type="text"
                            placeholder="e.g. Ceremony begins"
                            class="flex-1 form-input-field"
                          />
                          <button
                            @click="form.program.splice(index, 1)"
                            class="text-gray-700 hover:text-red-400 transition-colors px-1 opacity-0 group-hover:opacity-100"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </transition-group>
                      <div v-if="form.program.length === 0" class="text-center py-8 text-gray-600 text-sm">
                        No entries yet. Click "Add Entry" to build your program.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="currentStep === 4" key="step4">
                <h2 class="section-title text-white mb-2">Preview & Publish</h2>
                <p class="text-gray-400 mb-6">Your wedding website is ready! Scroll through the preview below.</p>

                <div class="mb-8">
                  <WeddingPreview :form="form" :full-width="true" />
                </div>

                <div class="max-w-xl mx-auto space-y-6">
                  <div class="p-6 rounded-2xl bg-gray-900/50 border border-white/5">
                    <h3 class="font-serif text-xl text-white mb-4">Summary</h3>
                    <dl class="space-y-3 text-sm">
                      <div class="flex justify-between">
                        <dt class="text-gray-400">Couple</dt>
                        <dd class="text-white">{{ form.partner1 }} & {{ form.partner2 }}</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-400">Date</dt>
                        <dd class="text-white">{{ formattedDate }}</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-400">Location</dt>
                        <dd class="text-white">{{ form.location }}</dd>
                      </div>
                      <div v-if="form.venue" class="flex justify-between">
                        <dt class="text-gray-400">Venue</dt>
                        <dd class="text-white">{{ form.venue }}</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-400">Style</dt>
                        <dd class="text-white">
                          {{ templateOptions.find(t => t.id === form.template)?.name }}
                          &middot;
                          {{ palettes.find(p => p.id === form.palette)?.name }}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <button
                    @click="publish"
                    class="w-full btn-primary text-lg py-4"
                    :disabled="isPublishing"
                  >
                    <span v-if="isPublishing" class="flex items-center justify-center gap-3">
                      <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Publishing...
                    </span>
                    <span v-else>
                      Publish for &euro;29
                      <svg class="ml-2 w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>

                  <button
                    @click="sharePreview"
                    class="w-full btn-secondary py-3"
                  >
                    Share Preview Link (Free)
                  </button>
                </div>
              </div>
            </transition>

            <div v-if="currentStep < 4" class="flex justify-between mt-12">
              <button
                v-if="currentStep > 1"
                @click="goBack"
                class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div v-else></div>

              <button
                @click="nextStep"
                class="btn-primary"
                :disabled="!canProceed"
              >
                <span v-if="isSaving" class="flex items-center gap-2">
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Saving...
                </span>
                <span v-else class="flex items-center gap-2">
                  Continue
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <div v-if="currentStep < 4" class="hidden lg:block lg:w-[42%]">
            <div class="sticky top-28">
              <p class="text-sm text-gray-500 mb-4 text-center font-sans tracking-wide">Live Preview</p>
              <WeddingPreview :form="form" />
            </div>
          </div>
        </div>

        <div v-if="currentStep < 4" class="lg:hidden mt-12">
          <p class="text-sm text-gray-500 mb-4 text-center">Preview</p>
          <WeddingPreview :form="form" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import WeddingPreview from '@/components/WeddingPreview.vue'
import RichTextEditor from '@/components/RichTextEditor.vue'

const router = useRouter()
const currentStep = ref(1)
const isPublishing = ref(false)
const isSaving = ref(false)
const weddingId = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const form = ref({
  partner1: '',
  partner2: '',
  date: '',
  location: '',
  venue: '',
  email: '',
  template: 'classic-garden',
  palette: 'sage-cream',
  photo: null as File | null,
  photoPreview: '',
  story: '',
  menu: {
    starter: '',
    main_course: '',
    dessert: '',
  },
  program: [
    { time: '15:00', description: 'Ceremony' },
    { time: '16:00', description: 'Cocktail Hour' },
    { time: '18:00', description: 'Dinner & Celebration' },
  ],
})

const templateOptions = [
  {
    id: 'classic-garden',
    name: 'Classic Garden',
    bgGradient: 'linear-gradient(135deg, #FDFBF7, #E8EDE0)',
    scriptColor: '#5C6B45',
    accentColor: '#C4A35A',
    textColor: '#6B8C4E',
    svgColor: '#7A8B5E',
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    bgGradient: '#FFFFFF',
    scriptColor: '#333333',
    accentColor: '#999999',
    textColor: '#666666',
    svgColor: '#CCCCCC',
  },
  {
    id: 'romantic-blush',
    name: 'Romantic Blush',
    bgGradient: 'linear-gradient(135deg, #FFF5F5, #FFE8E8)',
    scriptColor: '#D4A0A0',
    accentColor: '#C4A35A',
    textColor: '#B07070',
    svgColor: '#D4A0A0',
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    bgGradient: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    scriptColor: '#D4A853',
    accentColor: '#D4A853',
    textColor: '#C4A35A',
    svgColor: '#D4A853',
  },
]

const palettes = [
  { id: 'sage-cream', name: 'Classic Garden', primary: '#7A8B5E', accent: '#C4A35A', bg: '#FDFBF7' },
  { id: 'blush-gold', name: 'Romantic Blush', primary: '#D4A0A0', accent: '#C4A35A', bg: '#FFF5F5' },
  { id: 'mono', name: 'Minimal White', primary: '#333333', accent: '#999999', bg: '#FFFFFF' },
  { id: 'navy-gold', name: 'Navy Elegance', primary: '#1B3A5C', accent: '#C4A35A', bg: '#F5F5F5' },
  { id: 'terracotta', name: 'Sunset Gold', primary: '#8B4513', accent: '#DAA520', bg: '#FFF8DC' },
  { id: 'lavender', name: 'Lavender Dream', primary: '#6B4C7A', accent: '#C4A35A', bg: '#F8F0FF' },
]

const menuCoursesDef = [
  { key: 'starter', label: 'Starter', icon: '🥗', placeholder: 'e.g. Burrata with heirloom tomatoes' },
  { key: 'main_course', label: 'Main Course', icon: '🍽️', placeholder: 'e.g. Pan-seared salmon with asparagus' },
  { key: 'dessert', label: 'Dessert', icon: '🍰', placeholder: 'e.g. Tiramisu with fresh berries' },
]

const formattedDate = computed(() => {
  if (!form.value.date) return 'Your Wedding Date'
  return new Date(form.value.date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
})

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return form.value.partner1 && form.value.partner2 && form.value.date && form.value.email
  }
  return true
})

let saveTimeout: ReturnType<typeof setTimeout> | null = null

watch(form, () => {
  if (!weddingId.value) return
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => saveWedding(), 2000)
}, { deep: true })

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  form.value.photo = file
  form.value.photoPreview = URL.createObjectURL(file)

  if (weddingId.value) {
    const fd = new FormData()
    fd.append('photo', file)
    try {
      await fetch(`/api/weddings/${weddingId.value}/photo`, {
        method: 'POST',
        body: fd,
      })
    } catch {
      //
    }
  }
}

function addProgramEntry() {
  form.value.program.push({ time: '', description: '' })
}

function goBack() {
  currentStep.value--
}

async function nextStep() {
  if (currentStep.value === 1 && !weddingId.value) {
    isSaving.value = true
    await saveWedding()
    isSaving.value = false
  } else if (weddingId.value) {
    await saveWedding()
  }
  currentStep.value++
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function saveWedding() {
  try {
    const body = {
      partner1: form.value.partner1,
      partner2: form.value.partner2,
      date: form.value.date,
      location: form.value.location,
      venue: form.value.venue,
      email: form.value.email,
      template: form.value.template,
      palette: form.value.palette,
      story: form.value.story,
      menu: form.value.menu,
      program: form.value.program,
    }

    const method = weddingId.value ? 'PUT' : 'POST'
    const url = weddingId.value ? `/api/weddings/${weddingId.value}` : '/api/weddings'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    if (!weddingId.value) {
      weddingId.value = data.id
    }

    if (form.value.photo && !weddingId.value) {
      const fd = new FormData()
      fd.append('photo', form.value.photo)
      await fetch(`/api/weddings/${data.id}/photo`, {
        method: 'POST',
        body: fd,
      })
    }
  } catch {
    //
  }
}

async function publish() {
  isPublishing.value = true
  await saveWedding()

  try {
    const res = await fetch(`/api/weddings/${weddingId.value}/publish`, {
      method: 'POST',
    })
    const data = await res.json()

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl
    } else if (data.slug) {
      router.push(`/dashboard/${weddingId.value}`)
    }
  } catch {
    //
  } finally {
    isPublishing.value = false
  }
}

async function sharePreview() {
  await saveWedding()
  if (weddingId.value) {
    const url = `${window.location.origin}/preview/${weddingId.value}`
    await navigator.clipboard.writeText(url)
    alert('Preview link copied to clipboard!')
  }
}
</script>

<style scoped>
.form-input-field {
  width: 100%;
  background: rgb(17 24 39);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  transition: all 0.2s ease;
}

.form-input-field::placeholder {
  color: rgb(75 85 99);
}

.form-input-field:focus {
  outline: none;
  border-color: rgba(212, 168, 83, 0.5);
  box-shadow: 0 0 0 2px rgba(212, 168, 83, 0.1);
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
