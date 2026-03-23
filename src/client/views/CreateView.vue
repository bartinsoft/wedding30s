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
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300"
              :class="step <= currentStep
                ? 'bg-gold-500 text-white'
                : 'bg-gray-800 text-gray-500 border border-gray-700'"
            >
              <svg v-if="step < currentStep" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>{{ step }}</span>
            </div>
            <div
              v-if="step < 4"
              class="w-16 md:w-24 h-0.5 transition-all duration-300"
              :class="step < currentStep ? 'bg-gold-500' : 'bg-gray-800'"
            ></div>
          </template>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 mt-8">
          <div>
            <transition name="fade" mode="out-in">
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
                        class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white
                               placeholder-gray-600 focus:outline-none focus:border-gold-400/50 focus:ring-1
                               focus:ring-gold-400/20 transition-all"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Partner 2</label>
                      <input
                        v-model="form.partner2"
                        type="text"
                        placeholder="First name"
                        class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white
                               placeholder-gray-600 focus:outline-none focus:border-gold-400/50 focus:ring-1
                               focus:ring-gold-400/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Wedding Date</label>
                    <input
                      v-model="form.date"
                      type="date"
                      class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white
                             focus:outline-none focus:border-gold-400/50 focus:ring-1
                             focus:ring-gold-400/20 transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                      v-model="form.location"
                      type="text"
                      placeholder="City, Country"
                      class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white
                             placeholder-gray-600 focus:outline-none focus:border-gold-400/50 focus:ring-1
                             focus:ring-gold-400/20 transition-all"
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
                      class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white
                             placeholder-gray-600 focus:outline-none focus:border-gold-400/50 focus:ring-1
                             focus:ring-gold-400/20 transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      v-model="form.email"
                      type="email"
                      placeholder="your@email.com"
                      class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white
                             placeholder-gray-600 focus:outline-none focus:border-gold-400/50 focus:ring-1
                             focus:ring-gold-400/20 transition-all"
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
                      class="cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300"
                      :class="form.template === tpl.id
                        ? 'border-gold-400 shadow-lg shadow-gold-500/10'
                        : 'border-white/5 hover:border-white/20'"
                      @click="form.template = tpl.id"
                    >
                      <div
                        class="aspect-[3/4] flex items-center justify-center p-4"
                        :class="tpl.bg"
                      >
                        <div class="text-center">
                          <p :class="[tpl.scriptColor, 'font-script text-lg']">
                            {{ form.partner1 || 'Emma' }} & {{ form.partner2 || 'James' }}
                          </p>
                          <div class="w-8 h-px mx-auto my-2" :class="tpl.lineColor"></div>
                          <p :class="[tpl.textColor, 'font-serif text-[10px] tracking-widest uppercase']">
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
                        class="aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 flex"
                        :class="form.palette === palette.id
                          ? 'border-gold-400 scale-105'
                          : 'border-white/5 hover:border-white/20'"
                      >
                        <div class="w-1/2 h-full" :class="palette.color1"></div>
                        <div class="w-1/2 h-full" :class="palette.color2"></div>
                      </div>
                      <p class="text-[11px] text-gray-400 text-center mt-2">{{ palette.name }}</p>
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
                           hover:border-gold-400/30 transition-all cursor-pointer"
                    @click="triggerFileInput"
                  >
                    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
                    <div v-if="!form.photoPreview">
                      <svg class="w-10 h-10 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <textarea
                      v-model="form.story"
                      rows="4"
                      placeholder="How did you meet? Share your love story..."
                      class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white
                             placeholder-gray-600 focus:outline-none focus:border-gold-400/50 focus:ring-1
                             focus:ring-gold-400/20 transition-all resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-4">Menu</label>
                    <div class="space-y-4">
                      <div v-for="course in ['Starter', 'Main Course', 'Dessert']" :key="course">
                        <label class="block text-xs text-gray-500 mb-1">{{ course }}</label>
                        <input
                          v-model="(form.menu as Record<string, string>)[course.toLowerCase().replace(' ', '_')]"
                          type="text"
                          :placeholder="`Describe the ${course.toLowerCase()}...`"
                          class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white
                                 placeholder-gray-600 focus:outline-none focus:border-gold-400/50 focus:ring-1
                                 focus:ring-gold-400/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <label class="block text-sm font-medium text-gray-300">Day Program</label>
                      <button @click="addProgramEntry" class="text-sm text-gold-400 hover:text-gold-300 transition-colors">
                        + Add Entry
                      </button>
                    </div>
                    <div class="space-y-3">
                      <div
                        v-for="(entry, index) in form.program"
                        :key="index"
                        class="flex gap-3"
                      >
                        <input
                          v-model="entry.time"
                          type="time"
                          class="w-28 bg-gray-900 border border-white/10 rounded-xl px-3 py-3 text-white
                                 focus:outline-none focus:border-gold-400/50 transition-all text-sm"
                        />
                        <input
                          v-model="entry.description"
                          type="text"
                          placeholder="e.g. Ceremony begins"
                          class="flex-1 bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white
                                 placeholder-gray-600 focus:outline-none focus:border-gold-400/50 transition-all"
                        />
                        <button
                          @click="form.program.splice(index, 1)"
                          class="text-gray-600 hover:text-red-400 transition-colors px-2"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="currentStep === 4" key="step4">
                <h2 class="section-title text-white mb-2">Preview & Publish</h2>
                <p class="text-gray-400 mb-10">Your wedding website is ready!</p>

                <div class="space-y-6">
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
                        <dt class="text-gray-400">Template</dt>
                        <dd class="text-white">
                          {{ templateOptions.find(t => t.id === form.template)?.name }}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <button
                    @click="publish"
                    class="w-full btn-primary text-lg py-4"
                    :disabled="isPublishing"
                  >
                    <span v-if="isPublishing">Publishing...</span>
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

            <div class="flex justify-between mt-12">
              <button
                v-if="currentStep > 1"
                @click="currentStep--"
                class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div v-else></div>

              <button
                v-if="currentStep < 4"
                @click="nextStep"
                class="btn-primary"
              >
                Continue
                <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div class="hidden lg:block">
            <div class="sticky top-28">
              <p class="text-sm text-gray-500 mb-4 text-center">Live Preview</p>
              <WeddingPreview :form="form" />
            </div>
          </div>
        </div>

        <div class="lg:hidden mt-12">
          <p class="text-sm text-gray-500 mb-4 text-center">Preview</p>
          <WeddingPreview :form="form" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import WeddingPreview from '@/components/WeddingPreview.vue'

const router = useRouter()
const currentStep = ref(1)
const isPublishing = ref(false)
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
    bg: 'bg-gradient-to-br from-cream-50 to-sage-100',
    scriptColor: 'text-sage-600',
    lineColor: 'bg-sage-400',
    textColor: 'text-sage-500',
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    bg: 'bg-white',
    scriptColor: 'text-gray-700',
    lineColor: 'bg-gray-300',
    textColor: 'text-gray-500',
  },
  {
    id: 'romantic-blush',
    name: 'Romantic Blush',
    bg: 'bg-gradient-to-br from-blush-50 to-cream-100',
    scriptColor: 'text-blush-500',
    lineColor: 'bg-blush-300',
    textColor: 'text-blush-400',
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    bg: 'bg-gradient-to-br from-gray-900 to-gray-800',
    scriptColor: 'text-gold-400',
    lineColor: 'bg-gold-400',
    textColor: 'text-gold-300',
  },
]

const palettes = [
  { id: 'sage-cream', name: 'Sage', color1: 'bg-sage-400', color2: 'bg-cream-100' },
  { id: 'blush-gold', name: 'Blush', color1: 'bg-blush-300', color2: 'bg-gold-300' },
  { id: 'navy-gold', name: 'Navy', color1: 'bg-blue-900', color2: 'bg-gold-400' },
  { id: 'terracotta', name: 'Terra', color1: 'bg-orange-700', color2: 'bg-cream-200' },
  { id: 'lavender', name: 'Lavender', color1: 'bg-purple-300', color2: 'bg-cream-50' },
  { id: 'mono', name: 'Mono', color1: 'bg-gray-800', color2: 'bg-gray-200' },
]

const formattedDate = computed(() => {
  if (!form.value.date) return 'Your Wedding Date'
  return new Date(form.value.date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
})

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  form.value.photo = file
  form.value.photoPreview = URL.createObjectURL(file)
}

function addProgramEntry() {
  form.value.program.push({ time: '', description: '' })
}

async function nextStep() {
  if (currentStep.value === 1 && !weddingId.value) {
    await saveWedding()
  }
  currentStep.value++
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
  } catch {
    // silent
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
    // silent
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(16px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>
