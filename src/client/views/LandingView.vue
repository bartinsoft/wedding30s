<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <span class="font-script text-2xl text-gold-400">Wedding30s</span>
        <router-link to="/create" class="btn-primary text-sm py-2 px-6">
          Get Started
        </router-link>
      </div>
    </nav>

    <section class="relative pt-32 pb-24 px-6 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent"></div>
      <div class="absolute top-20 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
      <div class="absolute top-40 right-1/4 w-80 h-80 bg-sage-500/5 rounded-full blur-3xl"></div>

      <div class="relative max-w-5xl mx-auto text-center">
        <p class="font-script text-gold-400 text-2xl md:text-3xl mb-6">Say "I do" to simplicity</p>
        <h1 class="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-tight tracking-tight">
          Create Your Wedding Website
          <span class="block text-gold-400 mt-2">in 30 Seconds</span>
        </h1>
        <p class="mt-8 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Beautiful, elegant, and effortless. Fill in your details, choose a style,
          and share with your guests. No design skills needed.
        </p>
        <div class="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/create" class="btn-primary text-lg px-12 py-4">
            Start Free
            <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>
          <a href="#templates" class="btn-secondary text-lg px-12 py-4">
            See Templates
          </a>
        </div>

        <div class="mt-20 relative">
          <div class="absolute -inset-4 bg-gradient-to-r from-gold-500/20 via-sage-500/20 to-blush-400/20 rounded-2xl blur-xl"></div>
          <div class="relative bg-gray-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div class="flex items-center gap-2 px-4 py-3 bg-gray-900/80 border-b border-white/5">
              <div class="w-3 h-3 rounded-full bg-red-400/60"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-400/60"></div>
              <div class="w-3 h-3 rounded-full bg-green-400/60"></div>
              <span class="ml-3 text-xs text-gray-500">emma-james.wedding30s.com</span>
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
        <h2 class="section-title text-white">How It Works</h2>
        <p class="section-subtitle">Three simple steps to your perfect wedding website</p>

        <div class="mt-16 grid md:grid-cols-3 gap-12">
          <div v-for="step in steps" :key="step.number" class="group">
            <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-500/10 border border-gold-500/20
                        flex items-center justify-center text-gold-400 font-serif text-2xl
                        group-hover:bg-gold-500/20 transition-all duration-300">
              {{ step.number }}
            </div>
            <h3 class="font-serif text-2xl text-white mb-3">{{ step.title }}</h3>
            <p class="text-gray-400 leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="templates" class="py-24 px-6 bg-gray-900/50">
      <div class="max-w-6xl mx-auto text-center">
        <h2 class="section-title text-white">Choose Your Style</h2>
        <p class="section-subtitle">Elegant templates designed for every couple</p>

        <div class="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="template in templates"
            :key="template.name"
            class="group cursor-pointer"
          >
            <div class="relative rounded-xl overflow-hidden border border-white/5
                        group-hover:border-gold-400/30 transition-all duration-500
                        group-hover:shadow-lg group-hover:shadow-gold-500/5">
              <div
                class="aspect-[3/4] flex items-center justify-center p-8"
                :class="template.bg"
              >
                <div class="text-center">
                  <p :class="[template.scriptColor, 'font-script text-2xl']">Emma & James</p>
                  <div class="w-12 h-px mx-auto my-3" :class="template.lineColor"></div>
                  <p :class="[template.textColor, 'font-serif text-sm tracking-widest uppercase']">
                    June 15, 2026
                  </p>
                </div>
              </div>
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300
                          flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100">
                <span class="btn-primary text-sm py-2 px-6">Use Template</span>
              </div>
            </div>
            <h3 class="mt-4 font-serif text-lg text-white">{{ template.name }}</h3>
            <p class="text-sm text-gray-500">{{ template.tagline }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 px-6">
      <div class="max-w-5xl mx-auto text-center">
        <h2 class="section-title text-white">Everything You Need</h2>
        <p class="section-subtitle">All the features to make your wedding website perfect</p>

        <div class="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="p-8 rounded-2xl bg-gray-900/50 border border-white/5
                   hover:border-gold-400/20 transition-all duration-300 text-left"
          >
            <div class="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5">
              <span class="text-2xl">{{ feature.icon }}</span>
            </div>
            <h3 class="font-serif text-xl text-white mb-2">{{ feature.title }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 px-6 bg-gray-900/50">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="section-title text-white">Simple Pricing</h2>
        <p class="section-subtitle">Preview for free, publish when you're ready</p>

        <div class="mt-16 relative">
          <div class="absolute -inset-1 bg-gradient-to-r from-gold-500/30 to-sage-500/30 rounded-3xl blur-lg"></div>
          <div class="relative bg-gray-900 rounded-3xl border border-white/10 p-10 md:p-14">
            <p class="font-script text-gold-400 text-3xl mb-2">One-time payment</p>
            <div class="flex items-baseline justify-center gap-2 mt-6">
              <span class="font-serif text-7xl text-white font-light">&euro;29</span>
            </div>
            <p class="text-gray-400 mt-3">No subscriptions. No hidden fees. Yours forever.</p>

            <div class="w-full h-px bg-white/10 my-8"></div>

            <ul class="space-y-4 text-left max-w-sm mx-auto">
              <li v-for="item in pricingFeatures" :key="item" class="flex items-start gap-3">
                <svg class="w-5 h-5 text-sage-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-300">{{ item }}</span>
              </li>
            </ul>

            <router-link to="/create" class="btn-primary mt-10 text-lg px-14 py-4">
              Create Your Website
              <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </router-link>
            <p class="text-gray-500 text-sm mt-4">Preview is always free</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="py-16 px-6 border-t border-white/5">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="text-center md:text-left">
          <span class="font-script text-2xl text-gold-400">Wedding30s</span>
          <p class="text-gray-500 text-sm mt-2">&copy; {{ new Date().getFullYear() }} wedding30s.com</p>
        </div>
        <div class="flex gap-6">
          <a href="#" class="text-gray-500 hover:text-gold-400 transition-colors">Instagram</a>
          <a href="#" class="text-gray-500 hover:text-gold-400 transition-colors">Twitter</a>
          <a href="#" class="text-gray-500 hover:text-gold-400 transition-colors">Pinterest</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const steps = [
  {
    number: '1',
    title: 'Fill in Your Details',
    description: 'Enter your names, wedding date, and venue. It takes less than a minute.',
  },
  {
    number: '2',
    title: 'Choose Your Style',
    description: 'Pick a template and color palette that matches your wedding aesthetic.',
  },
  {
    number: '3',
    title: 'Share with Guests',
    description: 'Get a beautiful link and QR code to share with your guests instantly.',
  },
]

const templates = [
  {
    name: 'Classic Garden',
    tagline: 'Timeless elegance',
    bg: 'bg-gradient-to-br from-cream-50 to-sage-100',
    scriptColor: 'text-sage-600',
    lineColor: 'bg-sage-400',
    textColor: 'text-sage-500',
  },
  {
    name: 'Minimal White',
    tagline: 'Clean & modern',
    bg: 'bg-white',
    scriptColor: 'text-gray-700',
    lineColor: 'bg-gray-300',
    textColor: 'text-gray-500',
  },
  {
    name: 'Romantic Blush',
    tagline: 'Soft & dreamy',
    bg: 'bg-gradient-to-br from-blush-50 to-cream-100',
    scriptColor: 'text-blush-500',
    lineColor: 'bg-blush-300',
    textColor: 'text-blush-400',
  },
  {
    name: 'Modern Dark',
    tagline: 'Bold & sophisticated',
    bg: 'bg-gradient-to-br from-gray-900 to-gray-800',
    scriptColor: 'text-gold-400',
    lineColor: 'bg-gold-400',
    textColor: 'text-gold-300',
  },
]

const features = [
  {
    icon: '📱',
    title: 'QR Code Sharing',
    description: 'Share your wedding website with a beautiful QR code for your invitations.',
  },
  {
    icon: '✉️',
    title: 'RSVP Management',
    description: 'Collect RSVPs, menu choices, and dietary requirements in one place.',
  },
  {
    icon: '📸',
    title: 'Photo Gallery',
    description: 'Showcase your engagement photos and share memories with guests.',
  },
  {
    icon: '⏱️',
    title: 'Countdown Timer',
    description: 'Build excitement with a live countdown to your special day.',
  },
  {
    icon: '📋',
    title: 'Day Program',
    description: 'Share the schedule so guests know exactly what to expect.',
  },
  {
    icon: '🌐',
    title: 'Custom Domain',
    description: 'Your wedding site lives at a beautiful, shareable URL.',
  },
]

const pricingFeatures = [
  'Custom wedding website with your chosen template',
  'RSVP management with guest list',
  'QR code for your invitations',
  'Menu selection and dietary preferences',
  'Countdown timer and day program',
  'Mobile-optimized design',
  'Active for 1 year after your wedding',
  'Free preview before publishing',
]
</script>
