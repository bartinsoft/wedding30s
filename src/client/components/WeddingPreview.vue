<template>
  <div class="preview-wrapper" :class="{ 'preview-fullwidth': fullWidth }">
    <div v-if="!fullWidth" class="preview-browser-bar">
      <div class="preview-dots">
        <span class="preview-dot preview-dot-red"></span>
        <span class="preview-dot preview-dot-yellow"></span>
        <span class="preview-dot preview-dot-green"></span>
      </div>
      <span class="preview-url">{{ previewSlug }}.wedding30s.com</span>
    </div>

    <div
      ref="scrollContainer"
      class="preview-viewport"
      :class="{ 'preview-viewport-full': fullWidth }"
    >
      <div
        class="preview-site"
        :style="siteStyles"
      >
        <div class="preview-bg-pattern" :style="bgPatternStyle"></div>

        <section class="preview-hero">
          <template v-if="decorations === 'branches'">
            <svg class="preview-branch preview-branch-left" viewBox="0 0 140 500" fill="none">
              <defs>
                <linearGradient id="prevLeaf1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" :stop-color="colors.primaryLight" />
                  <stop offset="50%" :stop-color="colors.primary" />
                  <stop offset="100%" :stop-color="colors.primaryDark" />
                </linearGradient>
              </defs>
              <path d="M70 0 C67 50 73 100 66 150 C59 200 76 250 70 300 C64 350 74 400 70 480" stroke="url(#prevLeaf1)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <ellipse cx="42" cy="35" rx="30" ry="12" transform="rotate(-35 42 35)" fill="url(#prevLeaf1)" opacity="0.5"/>
              <ellipse cx="98" cy="75" rx="28" ry="11" transform="rotate(30 98 75)" fill="url(#prevLeaf1)" opacity="0.45"/>
              <ellipse cx="38" cy="120" rx="32" ry="12" transform="rotate(-40 38 120)" fill="url(#prevLeaf1)" opacity="0.5"/>
              <ellipse cx="100" cy="165" rx="29" ry="11" transform="rotate(35 100 165)" fill="url(#prevLeaf1)" opacity="0.45"/>
              <ellipse cx="40" cy="210" rx="30" ry="12" transform="rotate(-30 40 210)" fill="url(#prevLeaf1)" opacity="0.45"/>
              <ellipse cx="96" cy="255" rx="27" ry="11" transform="rotate(32 96 255)" fill="url(#prevLeaf1)" opacity="0.4"/>
              <ellipse cx="42" cy="300" rx="28" ry="11" transform="rotate(-35 42 300)" fill="url(#prevLeaf1)" opacity="0.4"/>
              <ellipse cx="95" cy="345" rx="26" ry="10" transform="rotate(28 95 345)" fill="url(#prevLeaf1)" opacity="0.35"/>
              <ellipse cx="44" cy="390" rx="25" ry="10" transform="rotate(-28 44 390)" fill="url(#prevLeaf1)" opacity="0.3"/>
            </svg>
            <svg class="preview-branch preview-branch-right" viewBox="0 0 140 500" fill="none">
              <path d="M70 0 C73 50 67 100 74 150 C81 200 64 250 70 300 C76 350 66 400 70 480" stroke="url(#prevLeaf1)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <ellipse cx="98" cy="40" rx="30" ry="12" transform="rotate(35 98 40)" fill="url(#prevLeaf1)" opacity="0.5"/>
              <ellipse cx="42" cy="80" rx="28" ry="11" transform="rotate(-30 42 80)" fill="url(#prevLeaf1)" opacity="0.45"/>
              <ellipse cx="102" cy="125" rx="32" ry="12" transform="rotate(40 102 125)" fill="url(#prevLeaf1)" opacity="0.5"/>
              <ellipse cx="40" cy="170" rx="29" ry="11" transform="rotate(-35 40 170)" fill="url(#prevLeaf1)" opacity="0.45"/>
              <ellipse cx="100" cy="215" rx="30" ry="12" transform="rotate(30 100 215)" fill="url(#prevLeaf1)" opacity="0.45"/>
              <ellipse cx="44" cy="260" rx="27" ry="11" transform="rotate(-32 44 260)" fill="url(#prevLeaf1)" opacity="0.4"/>
              <ellipse cx="98" cy="305" rx="28" ry="11" transform="rotate(35 98 305)" fill="url(#prevLeaf1)" opacity="0.4"/>
              <ellipse cx="45" cy="350" rx="26" ry="10" transform="rotate(-28 45 350)" fill="url(#prevLeaf1)" opacity="0.35"/>
            </svg>
            <svg class="preview-rings" viewBox="0 0 80 60" fill="none">
              <circle cx="30" cy="30" r="16" :stroke="colors.accent" stroke-width="2.5" fill="none"/>
              <circle cx="50" cy="30" r="16" :stroke="colors.accent" stroke-width="2.5" fill="none"/>
            </svg>
            <svg v-for="n in 6" :key="'petal-' + n" :class="'preview-petal preview-petal-' + n" viewBox="0 0 20 20" fill="none">
              <ellipse cx="10" cy="10" rx="4" ry="7.5" :transform="'rotate(' + (n * 15 - 20) + ' 10 10)'" :fill="n % 2 === 0 ? colors.primary : colors.accent" opacity="0.7"/>
            </svg>
          </template>

          <template v-else-if="decorations === 'hearts'">
            <svg v-for="n in 6" :key="'heart-' + n" :class="'preview-petal preview-petal-' + n" viewBox="0 0 20 20" fill="none">
              <path d="M10 17 C5 12 1 8 1 5.5 C1 3 3 1 5.5 1 C7.5 1 9 2.5 10 4 C11 2.5 12.5 1 14.5 1 C17 1 19 3 19 5.5 C19 8 15 12 10 17Z" :fill="n % 2 === 0 ? colors.primary : colors.accent" opacity="0.5"/>
            </svg>
          </template>

          <template v-else-if="decorations === 'geometric'">
            <svg class="preview-deco-corner preview-deco-tl" viewBox="0 0 80 80" fill="none" style="position:absolute;top:8%;left:5%;width:60px;opacity:0.4;">
              <path d="M0 40 L0 2 L2 0 L40 0" :stroke="colors.accent" stroke-width="1.5" fill="none"/>
              <circle cx="40" cy="0" r="2" :fill="colors.accent"/>
            </svg>
            <svg class="preview-deco-corner preview-deco-br" viewBox="0 0 80 80" fill="none" style="position:absolute;bottom:8%;right:5%;width:60px;opacity:0.4;">
              <path d="M80 40 L80 78 L78 80 L40 80" :stroke="colors.accent" stroke-width="1.5" fill="none"/>
              <circle cx="40" cy="80" r="2" :fill="colors.accent"/>
            </svg>
          </template>

          <div class="preview-hero-content">
            <p class="preview-hero-date-top" :style="{ color: colors.primary }">
              {{ displayDateShort }}
            </p>

            <div class="preview-ornament">
              <span class="preview-ornament-line" :style="{ background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)` }"></span>
              <span class="preview-ornament-diamond" :style="{ background: colors.accent }"></span>
              <span class="preview-ornament-line" :style="{ background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)` }"></span>
            </div>

            <h1 class="preview-hero-names" :style="{ color: colors.primary }">
              {{ displayPartner1 }}
              <span class="preview-ampersand" :style="{ color: colors.accent }">&#38;</span>
              {{ displayPartner2 }}
            </h1>

            <div class="preview-ornament">
              <span class="preview-ornament-line" :style="{ background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)` }"></span>
              <span class="preview-ornament-diamond" :style="{ background: colors.accent }"></span>
              <span class="preview-ornament-line" :style="{ background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)` }"></span>
            </div>

            <p class="preview-hero-location" :style="{ color: colors.textLight }">
              {{ form.location || 'Your City' }}
              <span v-if="form.venue"> &middot; {{ form.venue }}</span>
            </p>
          </div>

          <div class="preview-scroll-indicator">
            <span :style="{ color: colors.primary }">{{ $t('weddingPreview.scroll') }}</span>
            <div class="preview-scroll-arrow" :style="{ borderColor: colors.primary }"></div>
          </div>
        </section>

        <div class="preview-divider">
          <svg width="200" height="50" viewBox="0 0 260 72" fill="none">
            <path d="M0 36 Q35 14 78 36" :stroke="colors.primary" stroke-width="0.8" fill="none" opacity="0.25"/>
            <path d="M182 36 Q225 58 260 36" :stroke="colors.primary" stroke-width="0.8" fill="none" opacity="0.25"/>
            <circle cx="117" cy="28" r="12" :stroke="colors.accent" stroke-width="2" fill="none" opacity="0.35"/>
            <circle cx="143" cy="28" r="12" :stroke="colors.accent" stroke-width="2" fill="none" opacity="0.35"/>
          </svg>
        </div>

        <section class="preview-countdown" v-if="form.date">
          <h2 class="preview-section-script" :style="{ color: colors.text }">{{ $t('weddingPreview.countdown') }}</h2>
          <div class="preview-countdown-grid">
            <div v-for="unit in countdownUnits" :key="unit.label" class="preview-countdown-item">
              <span class="preview-countdown-number" :style="{ color: colors.text }">{{ unit.value }}</span>
              <span class="preview-countdown-label" :style="{ color: colors.textLight }">{{ unit.label }}</span>
            </div>
          </div>
        </section>

        <div class="preview-divider" v-if="form.date">
          <svg width="120" height="20" viewBox="0 0 120 20" fill="none">
            <path d="M0 10 H50" :stroke="colors.accent" stroke-width="0.5" opacity="0.3"/>
            <rect x="54" y="6" width="8" height="8" :fill="colors.accent" opacity="0.2" transform="rotate(45 58 10)"/>
            <path d="M66 10 H120" :stroke="colors.accent" stroke-width="0.5" opacity="0.3"/>
          </svg>
        </div>

        <section ref="storySection" class="preview-announcement" v-if="form.story" :style="announcementBg">
          <div class="preview-announcement-inner">
            <p class="preview-announcement-date" :style="{ color: colors.textLight }">
              {{ displayDate }}
            </p>
            <h2 class="preview-announcement-headline" :style="{ color: colors.text }">
              {{ $t('weddingPreview.ourStory') }}
            </h2>
            <div class="preview-announcement-body" :style="{ color: colors.textLight }" v-html="form.story"></div>
          </div>
        </section>

        <section ref="programSection" class="preview-program" v-if="hasProgram">
          <div class="preview-divider">
            <svg width="120" height="20" viewBox="0 0 120 20" fill="none">
              <path d="M0 10 H50" :stroke="colors.accent" stroke-width="0.5" opacity="0.3"/>
              <rect x="54" y="6" width="8" height="8" :fill="colors.accent" opacity="0.2" transform="rotate(45 58 10)"/>
              <path d="M66 10 H120" :stroke="colors.accent" stroke-width="0.5" opacity="0.3"/>
            </svg>
          </div>

          <h2 class="preview-section-script" :style="{ color: colors.text }">{{ $t('weddingPreview.dayProgram') }}</h2>
          <p class="preview-section-subtitle" :style="{ color: colors.textLight }">
            {{ displayDate }}
          </p>

          <div class="preview-program-timeline">
            <div class="preview-program-line" :style="{ background: `linear-gradient(180deg, transparent, ${colors.accent}40, transparent)` }"></div>
            <div
              v-for="entry in visibleProgram"
              :key="entry.time + entry.description"
              class="preview-program-entry"
            >
              <span class="preview-program-time" :style="{ color: colors.primary }">{{ entry.time }}</span>
              <span class="preview-program-dot" :style="{ background: colors.accent, boxShadow: `0 0 0 3px ${colors.bg}` }"></span>
              <span class="preview-program-desc" :style="{ color: colors.textLight }">{{ entry.description }}</span>
            </div>
          </div>
        </section>

        <section ref="menuSection" class="preview-menu" v-if="hasMenu" :style="announcementBg">
          <div class="preview-divider">
            <svg width="120" height="20" viewBox="0 0 120 20" fill="none">
              <path d="M0 10 H50" :stroke="colors.accent" stroke-width="0.5" opacity="0.3"/>
              <rect x="54" y="6" width="8" height="8" :fill="colors.accent" opacity="0.2" transform="rotate(45 58 10)"/>
              <path d="M66 10 H120" :stroke="colors.accent" stroke-width="0.5" opacity="0.3"/>
            </svg>
          </div>

          <h2 class="preview-section-script" :style="{ color: colors.text }">{{ $t('weddingPreview.theMenu') }}</h2>

          <div class="preview-menu-cards">
            <div
              v-for="menu in form.menus"
              :key="menu.name"
              class="preview-menu-card"
              :style="{ borderColor: colors.accent + '25', boxShadow: `0 4px 20px ${colors.text}0a` }"
            >
              <div class="preview-menu-card-top" :style="{ background: `linear-gradient(90deg, ${colors.primaryLight}, ${colors.accentLight}, ${colors.primaryLight})` }"></div>
              <h3 class="preview-menu-card-title" :style="{ color: colors.text }">{{ menu.name }}</h3>
              <div v-for="section in menu.sections" :key="section.name" style="margin-top: 0.5rem;">
                <p v-if="section.name" style="font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.2rem;" :style="{ color: colors.primary }">
                  {{ section.name }}
                  <span v-if="section.choose" style="font-weight: 400; text-transform: none; font-style: italic;"> (a elegir)</span>
                </p>
                <p
                  v-for="item in section.items.filter(i => i.name)"
                  :key="item.name"
                  class="preview-menu-card-desc"
                  :style="{ color: colors.textLight }"
                >{{ item.name }}</p>
              </div>
            </div>
          </div>
        </section>

        <section ref="rsvpSection" class="preview-rsvp">
          <div class="preview-divider">
            <svg width="120" height="20" viewBox="0 0 120 20" fill="none">
              <path d="M0 10 H50" :stroke="colors.accent" stroke-width="0.5" opacity="0.3"/>
              <rect x="54" y="6" width="8" height="8" :fill="colors.accent" opacity="0.2" transform="rotate(45 58 10)"/>
              <path d="M66 10 H120" :stroke="colors.accent" stroke-width="0.5" opacity="0.3"/>
            </svg>
          </div>

          <h2 class="preview-section-script" :style="{ color: colors.text }">{{ $t('weddingPreview.rsvp') }}</h2>
          <p class="preview-section-subtitle" :style="{ color: colors.textLight }">{{ $t('weddingPreview.rsvpSubtitle') }}</p>

          <div class="preview-rsvp-form" :style="{ borderColor: colors.accent + '20' }">
            <div class="preview-rsvp-field" :style="{ borderColor: colors.primaryLight }"></div>
            <div class="preview-rsvp-field" :style="{ borderColor: colors.primaryLight }"></div>
            <div class="preview-rsvp-btn" :style="{ background: colors.primary, color: colors.bg }">
              {{ $t('weddingPreview.confirmAttendance') }}
            </div>
          </div>
        </section>

        <footer class="preview-footer">
          <div class="preview-ornament">
            <span class="preview-ornament-line" :style="{ background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)` }"></span>
            <span class="preview-ornament-diamond" :style="{ background: colors.accent }"></span>
            <span class="preview-ornament-line" :style="{ background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)` }"></span>
          </div>

          <p class="preview-footer-text" :style="{ color: colors.textLight }">{{ $t('weddingPreview.withAllOurLove') }}</p>
          <p class="preview-footer-names" :style="{ color: colors.primary }">
            {{ displayPartner1 }} & {{ displayPartner2 }}
          </p>
          <p class="preview-footer-date" :style="{ color: colors.textLight }">{{ displayDate }}</p>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPaletteColors, getTemplateById } from '@/config/templates'

const { t, locale } = useI18n()

interface ProgramEntry {
  time: string
  description: string
}

interface MenuItemData {
  name: string
}

interface MenuSectionData {
  name: string
  items: MenuItemData[]
  choose: boolean
}

interface MenuData {
  name: string
  sections: MenuSectionData[]
}

interface FormData {
  partner1: string
  partner2: string
  date: string
  location: string
  venue: string
  template: string
  palette: string
  story: string
  menuEnabled: boolean
  menus: MenuData[]
  program: ProgramEntry[]
  photoPreview?: string
}

const props = withDefaults(defineProps<{
  form: FormData
  fullWidth?: boolean
}>(), {
  fullWidth: false,
})

const scrollContainer = ref<HTMLElement | null>(null)
const storySection = ref<HTMLElement | null>(null)
const menuSection = ref<HTMLElement | null>(null)
const programSection = ref<HTMLElement | null>(null)
const rsvpSection = ref<HTMLElement | null>(null)

const sectionRefs: Record<string, typeof storySection> = {
  story: storySection,
  menu: menuSection,
  program: programSection,
  rsvp: rsvpSection,
}

function scrollToSection(section: string) {
  const el = sectionRefs[section]?.value
  const container = scrollContainer.value
  if (el && container) {
    const containerRect = container.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const scrollOffset = elRect.top - containerRect.top + container.scrollTop
    const centered = scrollOffset - (container.clientHeight / 2) + (elRect.height / 2)
    container.scrollTo({ top: Math.max(0, centered), behavior: 'smooth' })
  }
}

defineExpose({ scrollToSection })

const colors = computed(() => getPaletteColors(props.form.palette))
const templateConfig = computed(() => getTemplateById(props.form.template))
const decorations = computed(() => templateConfig.value?.decorations || 'branches')

const displayPartner1 = computed(() => props.form.partner1 || 'Emma')
const displayPartner2 = computed(() => props.form.partner2 || 'James')

const dateLocale = computed(() => locale.value === 'es' ? 'es-ES' : 'en-US')

const displayDate = computed(() => {
  if (!props.form.date) return locale.value === 'es' ? 'Tu fecha de boda' : 'Your Wedding Date'
  return new Date(props.form.date + 'T00:00:00').toLocaleDateString(dateLocale.value, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
})

const displayDateShort = computed(() => {
  if (!props.form.date) return 'DD · MM · YYYY'
  const d = new Date(props.form.date + 'T00:00:00')
  const month = d.toLocaleDateString(dateLocale.value, { month: 'short' }).toUpperCase()
  const day = d.getDate()
  const year = d.getFullYear()
  return locale.value === 'es'
    ? `${day} · ${month} · ${year}`
    : `${month} · ${day} · ${year}`
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
  props.form.program.filter(e => e.time && e.description)
)

const hasMenu = computed(() => {
  return props.form.menuEnabled && props.form.menus.length > 0 &&
    props.form.menus.some(m => m.sections.some(s => s.items.some(i => i.name)))
})

const siteStyles = computed(() => ({
  '--preview-bg': colors.value.bg,
  '--preview-text': colors.value.text,
  '--preview-text-light': colors.value.textLight,
  '--preview-primary': colors.value.primary,
  '--preview-accent': colors.value.accent,
  backgroundColor: colors.value.bg,
  color: colors.value.text,
}))

const bgPatternStyle = computed(() => ({
  backgroundImage: `
    radial-gradient(circle at 20% 50%, ${colors.value.primary} 1px, transparent 1px),
    radial-gradient(circle at 80% 20%, ${colors.value.accent} 1px, transparent 1px),
    radial-gradient(circle at 60% 80%, ${colors.value.primary} 1px, transparent 1px)
  `,
  backgroundSize: '60px 60px, 80px 80px, 70px 70px',
}))

const announcementBg = computed(() => ({
  background: `linear-gradient(180deg, transparent 0%, ${colors.value.primary}0a 30%, ${colors.value.primary}0a 70%, transparent 100%)`,
}))

const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let countdownInterval: ReturnType<typeof setInterval> | null = null

function updateCountdown() {
  if (!props.form.date) return
  const target = new Date(props.form.date + 'T12:00:00').getTime()
  const now = Date.now()
  const diff = Math.max(0, target - now)
  countdown.value = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const countdownUnits = computed(() => [
  { value: countdown.value.days, label: t('weddingPreview.days') },
  { value: countdown.value.hours, label: t('weddingPreview.hours') },
  { value: countdown.value.minutes, label: t('weddingPreview.min') },
  { value: countdown.value.seconds, label: t('weddingPreview.sec') },
])

onMounted(() => {
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
.preview-wrapper {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  background: #111;
}

.preview-wrapper.preview-fullwidth {
  border-radius: 0;
  border: none;
  box-shadow: none;
}

.preview-browser-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(17, 17, 17, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.preview-dots {
  display: flex;
  gap: 5px;
}

.preview-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.preview-dot-red { background: rgba(255, 95, 87, 0.6); }
.preview-dot-yellow { background: rgba(255, 189, 46, 0.6); }
.preview-dot-green { background: rgba(39, 201, 63, 0.6); }

.preview-url {
  margin-left: 8px;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.3);
  font-family: 'Inter', system-ui, sans-serif;
}

.preview-viewport {
  height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.15) transparent;
}

.preview-viewport-full {
  height: auto;
  max-height: 80vh;
}

.preview-viewport::-webkit-scrollbar {
  width: 4px;
}

.preview-viewport::-webkit-scrollbar-track {
  background: transparent;
}

.preview-viewport::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.preview-site {
  position: relative;
  font-family: 'Cormorant Garamond', Georgia, serif;
  min-height: 100%;
  overflow: hidden;
}

.preview-bg-pattern {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.03;
}

.preview-hero {
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 3rem 1.5rem;
}

.preview-branch {
  position: absolute;
  z-index: 1;
  pointer-events: none;
  height: 360px;
  width: auto;
  opacity: 0.4;
}

.preview-branch-left {
  top: -2%;
  left: -1%;
  animation: previewSway1 7s ease-in-out infinite;
  transform-origin: top center;
}

.preview-branch-right {
  top: -2%;
  right: -1%;
  animation: previewSway2 8s ease-in-out infinite;
  transform-origin: top center;
  transform: scaleX(-1);
}

.preview-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  opacity: 0.06;
  z-index: 0;
  pointer-events: none;
  animation: previewRingsFloat 4s ease-in-out infinite;
}

.preview-petal {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  z-index: 1;
  width: 16px;
  height: 16px;
}

.preview-petal-1 { top: 8%; left: 15%; animation: previewPetal1 9s ease-in-out 1s infinite; }
.preview-petal-2 { top: 4%; left: 45%; animation: previewPetal2 10s ease-in-out 3s infinite; }
.preview-petal-3 { top: 2%; right: 20%; animation: previewPetal1 8s ease-in-out 0.5s infinite; }
.preview-petal-4 { top: 12%; right: 32%; animation: previewPetal2 11s ease-in-out 4.5s infinite; }
.preview-petal-5 { top: 6%; left: 68%; animation: previewPetal1 9.5s ease-in-out 2s infinite; }
.preview-petal-6 { top: 10%; left: 28%; animation: previewPetal2 8.5s ease-in-out 5.5s infinite; }

@keyframes previewPetal1 {
  0% { opacity: 0; transform: translateY(0) translateX(0) rotate(0deg); }
  8% { opacity: 0.6; }
  50% { opacity: 0.4; transform: translateY(150px) translateX(20px) rotate(150deg); }
  100% { opacity: 0; transform: translateY(300px) translateX(-15px) rotate(360deg); }
}

@keyframes previewPetal2 {
  0% { opacity: 0; transform: translateY(0) translateX(0) rotate(0deg); }
  8% { opacity: 0.55; }
  50% { opacity: 0.35; transform: translateY(130px) translateX(-18px) rotate(-140deg); }
  100% { opacity: 0; transform: translateY(280px) translateX(20px) rotate(-340deg); }
}

@keyframes previewSway1 {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(1.5deg) translateX(2px); }
  75% { transform: rotate(-1deg) translateX(-1px); }
}

@keyframes previewSway2 {
  0%, 100% { transform: scaleX(-1) rotate(0deg); }
  25% { transform: scaleX(-1) rotate(-1.5deg) translateX(-2px); }
  75% { transform: scaleX(-1) rotate(1deg) translateX(1px); }
}

@keyframes previewRingsFloat {
  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
  50% { transform: translate(-50%, -50%) rotate(5deg) translateY(-3px); }
}

.preview-hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.preview-hero-date-top {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.7rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: 1rem;
}

.preview-hero-names {
  font-family: 'Great Vibes', cursive;
  font-size: 3rem;
  line-height: 1.1;
  margin: 0;
}

.preview-ampersand {
  display: block;
  font-size: 0.5em;
  line-height: 1.8;
}

.preview-hero-location {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.85rem;
  margin-top: 1rem;
  letter-spacing: 0.1em;
}

.preview-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin: 1rem 0;
}

.preview-ornament-line {
  width: 40px;
  height: 1px;
}

.preview-ornament-diamond {
  width: 6px;
  height: 6px;
  transform: rotate(45deg);
  flex-shrink: 0;
}

.preview-scroll-indicator {
  position: absolute;
  bottom: 1.2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  animation: previewBounce 2.5s ease-in-out infinite;
  z-index: 2;
}

.preview-scroll-indicator span {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.5;
}

.preview-scroll-arrow {
  width: 12px;
  height: 12px;
  border-right: 1px solid;
  border-bottom: 1px solid;
  transform: rotate(45deg);
  opacity: 0.3;
}

@keyframes previewBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(5px); }
}

.preview-divider {
  display: flex;
  justify-content: center;
  padding: 0.8rem 0;
}

.preview-countdown {
  padding: 2rem 1.5rem;
  text-align: center;
}

.preview-countdown-grid {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 1.2rem;
}

.preview-countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-countdown-number {
  font-family: 'Playfair Display', 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 300;
  line-height: 1;
}

.preview-countdown-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-top: 0.3rem;
}

.preview-section-script {
  font-family: 'Great Vibes', cursive;
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 0.3rem;
}

.preview-section-subtitle {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.75rem;
  font-style: italic;
  text-align: center;
  margin-bottom: 1.5rem;
}

.preview-announcement {
  padding: 3rem 1.5rem;
  text-align: center;
}

.preview-announcement-inner {
  max-width: 450px;
  margin: 0 auto;
}

.preview-announcement-date {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.85rem;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.preview-announcement-headline {
  font-family: 'Playfair Display', 'Cormorant Garamond', serif;
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.preview-announcement-body {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.9rem;
  line-height: 1.9;
}

.preview-announcement-body :deep(a) {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}

.preview-announcement-body :deep(a[href*="maps.google"])::before,
.preview-announcement-body :deep(a[href*="maps.app.goo.gl"])::before {
  content: "\uD83D\uDCCD ";
}

.preview-announcement-body :deep(a[href^="tel:"])::before {
  content: "\uD83D\uDCDE ";
}

.preview-announcement-body :deep(a[href^="mailto:"])::before {
  content: "\u2709\uFE0F ";
}

.preview-program {
  padding: 2rem 1.5rem 3rem;
  text-align: center;
}

.preview-program-timeline {
  position: relative;
  max-width: 320px;
  margin: 0 auto;
  padding-left: 1rem;
}

.preview-program-line {
  position: absolute;
  left: 69px;
  top: 8px;
  bottom: 8px;
  width: 1px;
}

.preview-program-entry {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem 0;
  position: relative;
}

.preview-program-time {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.75rem;
  font-weight: 600;
  width: 42px;
  text-align: right;
  flex-shrink: 0;
}

.preview-program-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.preview-program-desc {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.8rem;
}

.preview-menu {
  padding: 2.5rem 1.5rem;
  text-align: center;
}

.preview-menu-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 1rem auto 0;
}

.preview-menu-card {
  background: white;
  border-radius: 12px;
  padding: 1.2rem 1rem;
  border: 1px solid;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.preview-menu-card-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0.5;
}

.preview-menu-card-icon {
  font-size: 1.2rem;
}

.preview-menu-card-title {
  font-family: 'Playfair Display', 'Cormorant Garamond', serif;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0.3rem 0;
}

.preview-menu-card-desc {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.8rem;
  line-height: 1.6;
}

.preview-rsvp {
  padding: 2.5rem 1.5rem;
  text-align: center;
}

.preview-rsvp-form {
  max-width: 300px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid;
}

.preview-rsvp-field {
  height: 32px;
  border-radius: 8px;
  border: 1px solid;
  margin-bottom: 0.8rem;
}

.preview-rsvp-btn {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-align: center;
  margin-top: 0.5rem;
}

.preview-footer {
  padding: 3rem 1.5rem 2rem;
  text-align: center;
}

.preview-footer-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.8rem;
  font-style: italic;
  line-height: 1.8;
}

.preview-footer-names {
  font-family: 'Great Vibes', cursive;
  font-size: 1.6rem;
  margin-top: 0.5rem;
}

.preview-footer-date {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.6rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  opacity: 0.4;
  margin-top: 1.5rem;
}
</style>
