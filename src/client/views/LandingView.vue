<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <img src="/logo.png" alt="Wedding30s" class="h-12 md:h-20 brightness-[2]" />
        <div class="flex items-center gap-2 md:gap-3">
          <button
            @click="toggleLocale"
            class="text-sm text-gray-400 hover:text-gold-400 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold-400/30"
          >
            {{ $i18n.locale === 'en' ? 'ES' : 'EN' }}
          </button>
          <router-link
            v-if="user"
            to="/my-weddings"
            class="text-sm text-gray-400 hover:text-gold-400 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold-400/30"
          >
            {{ $t('auth.myWeddings') }}
          </router-link>
          <router-link
            v-else
            to="/login"
            class="text-sm text-gray-400 hover:text-gold-400 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold-400/30"
          >
            {{ $t('auth.login') }}
          </router-link>
          <router-link to="/create" class="btn-primary text-sm py-2 px-6">
            {{ $t('landing.getStarted') }}
          </router-link>
        </div>
      </div>
    </nav>

    <section class="relative pt-32 pb-24 px-6 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent"></div>
      <div class="absolute top-20 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
      <div class="absolute top-40 right-1/4 w-80 h-80 bg-sage-500/5 rounded-full blur-3xl"></div>

      <div class="relative max-w-5xl mx-auto text-center">
        <p class="font-script text-gold-400 text-2xl md:text-3xl mb-6">{{ $t('landing.heroScript') }}</p>
        <h1 class="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-tight tracking-tight">
          {{ $t('landing.heroTitle') }}
          <span class="block text-gold-400 mt-2">{{ $t('landing.heroTitleAccent') }}</span>
        </h1>
        <p class="mt-8 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {{ $t('landing.heroDescription') }}
        </p>
        <div class="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/create" class="btn-primary text-lg px-12 py-4">
            {{ $t('landing.startFree') }}
            <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>
          <a href="#templates" class="btn-secondary text-lg px-12 py-4">
            {{ $t('landing.seeTemplates') }}
          </a>
        </div>

        <div class="mt-20 relative">
          <div class="absolute -inset-4 bg-gradient-to-r from-gold-500/20 via-sage-500/20 to-blush-400/20 rounded-2xl blur-xl"></div>
          <div class="relative bg-gray-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div class="flex items-center gap-2 px-4 py-3 bg-gray-900/80 border-b border-white/5">
              <div class="w-3 h-3 rounded-full bg-red-400/60"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-400/60"></div>
              <div class="w-3 h-3 rounded-full bg-green-400/60"></div>
              <span class="ml-3 text-xs text-gray-500">wedding30s.com/20260615-emma-james</span>
            </div>
            <div class="aspect-[16/9] bg-gradient-to-br from-cream-100 via-cream-50 to-sage-50 flex items-center justify-center">
              <div class="text-center p-12">
                <p class="font-script text-sage-600 text-3xl md:text-5xl">Emma & James</p>
                <div class="w-24 h-px bg-gold-400 mx-auto my-6"></div>
                <p class="font-serif text-gray-600 text-xl md:text-2xl tracking-widest uppercase">June 15, 2026</p>
                <p class="font-sans text-gray-400 mt-4">Tuscany, Italy</p>
                <div class="mt-8 inline-flex items-center px-8 py-3 bg-sage-500 text-white rounded-full text-sm">
                  RSVP Now
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 px-6">
      <div class="max-w-5xl mx-auto text-center">
        <h2 class="section-title text-white">{{ $t('landing.howItWorks') }}</h2>
        <p class="section-subtitle">{{ $t('landing.howItWorksSubtitle') }}</p>

        <div class="mt-16 grid md:grid-cols-3 gap-12">
          <div v-for="(step, index) in steps" :key="index" class="group">
            <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-500/10 border border-gold-500/20
                        flex items-center justify-center text-gold-400 font-serif text-2xl
                        group-hover:bg-gold-500/20 transition-all duration-300">
              {{ index + 1 }}
            </div>
            <h3 class="font-serif text-2xl text-white mb-3">{{ step.title }}</h3>
            <p class="text-gray-400 leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="templates" class="py-24 px-6 bg-gray-900/50">
      <div class="max-w-6xl mx-auto text-center">
        <h2 class="section-title text-white">{{ $t('landing.chooseStyle') }}</h2>
        <p class="section-subtitle">{{ $t('landing.chooseStyleSubtitle') }}</p>

        <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <router-link
            v-for="tpl in templates"
            :key="tpl.nameKey"
            :to="`/create?template=${tpl.id}`"
            class="group cursor-pointer block"
          >
            <div class="relative rounded-xl overflow-hidden border border-white/5
                        group-hover:border-gold-400/30 transition-all duration-500
                        group-hover:shadow-lg group-hover:shadow-gold-500/5">
              <div
                class="aspect-[3/4] flex items-center justify-center p-8"
                :style="{ background: getTemplateThumbnailColors(tpl).bg }"
              >
                <div class="text-center">
                  <p class="font-script text-2xl" :style="{ color: getTemplateThumbnailColors(tpl).primary }">Emma & James</p>
                  <div class="w-12 h-px mx-auto my-3" :style="{ background: getTemplateThumbnailColors(tpl).accent }"></div>
                  <p class="font-serif text-sm tracking-widest uppercase" :style="{ color: getTemplateThumbnailColors(tpl).textLight }">
                    June 15, 2026
                  </p>
                </div>
              </div>
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300
                          flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100">
                <span class="btn-primary text-sm py-2 px-6">{{ $t('landing.useTemplate') }}</span>
              </div>
            </div>
            <h3 class="mt-4 font-serif text-lg text-white">{{ $t('landing.' + tpl.nameKey) }}</h3>
            <p class="text-sm text-gray-500">{{ $t('landing.' + tpl.tagKey) }}</p>
          </router-link>
        </div>
      </div>
    </section>

    <section class="py-24 px-6">
      <div class="max-w-5xl mx-auto text-center">
        <h2 class="section-title text-white">{{ $t('landing.everythingYouNeed') }}</h2>
        <p class="section-subtitle">{{ $t('landing.everythingYouNeedSubtitle') }}</p>

        <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          <div
            v-for="feature in features"
            :key="feature.titleKey"
            class="p-8 rounded-2xl bg-gray-900/50 border border-white/5
                   hover:border-gold-400/20 transition-all duration-300 text-left"
          >
            <div class="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5">
              <span class="text-2xl">{{ feature.icon }}</span>
            </div>
            <h3 class="font-serif text-xl text-white mb-2">{{ $t('landing.' + feature.titleKey) }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">{{ $t('landing.' + feature.descKey) }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 px-6 bg-gray-900/50">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="section-title text-white">{{ $t('landing.simplePricing') }}</h2>
        <p class="section-subtitle">{{ $t('landing.simplePricingSubtitle') }}</p>

        <div class="mt-16 relative">
          <div class="absolute -inset-1 bg-gradient-to-r from-gold-500/30 to-sage-500/30 rounded-3xl blur-lg"></div>
          <div class="relative bg-gray-900 rounded-3xl border border-white/10 p-10 md:p-14">
            <p class="font-script text-gold-400 text-3xl mb-2">{{ $t('landing.oneTimePayment') }}</p>
            <div class="flex items-baseline justify-center gap-2 mt-6">
              <span class="font-serif text-7xl text-white font-light">&euro;29</span>
            </div>
            <p class="text-gray-400 mt-3">{{ $t('landing.noSubscriptions') }}</p>

            <div class="w-full h-px bg-white/10 my-8"></div>

            <ul class="space-y-4 text-left max-w-sm mx-auto">
              <li v-for="n in 8" :key="n" class="flex items-start gap-3">
                <svg class="w-5 h-5 text-sage-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-300">{{ $t('landing.pricingFeature' + n) }}</span>
              </li>
            </ul>

            <router-link to="/create" class="btn-primary mt-10 text-lg px-14 py-4">
              {{ $t('landing.createYourWebsite') }}
              <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </router-link>
            <p class="text-gray-500 text-sm mt-4">{{ $t('landing.previewFree') }}</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="py-12 px-6 border-t border-white/5">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="text-center md:text-left">
          <img src="/logo.png" alt="Wedding30s" class="h-16 brightness-[2]" />
          <p class="text-gray-500 text-sm mt-2">&copy; {{ new Date().getFullYear() }} wedding30s.com</p>
        </div>
        <div class="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-1 text-sm text-gray-500">
          <router-link to="/legal/legal" class="hover:text-gold-400 transition-colors">{{ $t('landing.legalNotice') }}</router-link>
          <router-link to="/legal/privacy" class="hover:text-gold-400 transition-colors">{{ $t('landing.privacy') }}</router-link>
          <router-link to="/legal/terms" class="hover:text-gold-400 transition-colors">{{ $t('landing.terms') }}</router-link>
          <router-link to="/login" class="hover:text-gold-400 transition-colors">{{ $t('auth.login') }}</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'
import { TEMPLATES, getTemplateThumbnailColors } from '@/config/templates'
import { useAuth } from '@/composables/useAuth'

const { user, fetchUser } = useAuth()
onMounted(() => fetchUser())

const { t, locale } = useI18n()

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'es' : 'en')
}

const steps = computed(() => [
  { title: t('landing.step1Title'), description: t('landing.step1Desc') },
  { title: t('landing.step2Title'), description: t('landing.step2Desc') },
  { title: t('landing.step3Title'), description: t('landing.step3Desc') },
])

const templates = TEMPLATES

const features = [
  { icon: '📱', titleKey: 'featureQrTitle', descKey: 'featureQrDesc' },
  { icon: '✉️', titleKey: 'featureRsvpTitle', descKey: 'featureRsvpDesc' },
  { icon: '📸', titleKey: 'featurePhotoTitle', descKey: 'featurePhotoDesc' },
  { icon: '⏱️', titleKey: 'featureCountdownTitle', descKey: 'featureCountdownDesc' },
  { icon: '📋', titleKey: 'featureProgramTitle', descKey: 'featureProgramDesc' },
  { icon: '🍽️', titleKey: 'featureMenuTitle', descKey: 'featureMenuDesc' },
]
</script>
