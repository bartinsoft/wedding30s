<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <router-link to="/"><img src="/logo.png" alt="Wedding30s" class="h-12 md:h-20 brightness-[2]" /></router-link>
      </div>
    </nav>

    <div class="pt-24 md:pt-32 pb-16 max-w-3xl mx-auto px-4 md:px-6">
      <!-- Aviso Legal -->
      <div v-if="page === 'legal'" class="legal-content">
        <h1 class="font-serif text-3xl mb-8">{{ $t('legal.legalTitle') }}</h1>
        <p class="text-sm text-gray-400 mb-8">{{ $t('legal.lastUpdated') }}</p>

        <h2>{{ $t('legal.legal1Title') }}</h2>
        <p>{{ $t('legal.legal1p1') }}</p>
        <ul>
          <li><strong>{{ $t('legal.legal1Company') }}</strong> BARTINSOFT SL</li>
          <li><strong>{{ $t('legal.legal1Cif') }}</strong> B56799588</li>
          <li><strong>{{ $t('legal.legal1Address') }}</strong> Calle Hilados 20, Torrejon de Ardoz, Madrid</li>
          <li><strong>{{ $t('legal.legal1Registry') }}</strong> {{ $t('legal.legal1RegistryValue') }}</li>
          <li><strong>{{ $t('legal.legal1Email') }}</strong> support@wedding30s.com</li>
          <li><strong>{{ $t('legal.legal1Website') }}</strong> https://wedding30s.com</li>
        </ul>

        <h2>{{ $t('legal.legal2Title') }}</h2>
        <p>{{ $t('legal.legal2p1') }}</p>

        <h2>{{ $t('legal.legal3Title') }}</h2>
        <p>{{ $t('legal.legal3p1') }}</p>
        <p>{{ $t('legal.legal3p2') }}</p>

        <h2>{{ $t('legal.legal4Title') }}</h2>
        <p>{{ $t('legal.legal4p1') }}</p>

        <h2>{{ $t('legal.legal5Title') }}</h2>
        <p>{{ $t('legal.legal5p1') }}</p>

        <h2>{{ $t('legal.legal6Title') }}</h2>
        <p>{{ $t('legal.legal6p1') }}</p>
      </div>

      <!-- Politica de Privacidad -->
      <div v-else-if="page === 'privacy'" class="legal-content">
        <h1 class="font-serif text-3xl mb-8">{{ $t('legal.privacyTitle') }}</h1>
        <p class="text-sm text-gray-400 mb-8">{{ $t('legal.lastUpdated') }}</p>

        <h2>{{ $t('legal.privacy1Title') }}</h2>
        <ul>
          <li><strong>{{ $t('legal.privacy1Controller') }}</strong> BARTINSOFT SL</li>
          <li><strong>{{ $t('legal.legal1Cif') }}</strong> B56799588</li>
          <li><strong>{{ $t('legal.privacy1Address') }}</strong> Calle Hilados 20, Torrejon de Ardoz, Madrid</li>
          <li><strong>{{ $t('legal.privacy1Email') }}</strong> support@wedding30s.com</li>
        </ul>

        <h2>{{ $t('legal.privacy2Title') }}</h2>
        <p>{{ $t('legal.privacy2p1') }}</p>
        <ul>
          <li v-html="$t('legal.privacy2item1')"></li>
          <li v-html="$t('legal.privacy2item2')"></li>
          <li v-html="$t('legal.privacy2item3')"></li>
          <li v-html="$t('legal.privacy2item4')"></li>
        </ul>

        <h2>{{ $t('legal.privacy3Title') }}</h2>
        <p>{{ $t('legal.privacy3p1') }}</p>
        <ul>
          <li>{{ $t('legal.privacy3item1') }}</li>
          <li>{{ $t('legal.privacy3item2') }}</li>
          <li>{{ $t('legal.privacy3item3') }}</li>
          <li>{{ $t('legal.privacy3item4') }}</li>
          <li>{{ $t('legal.privacy3item5') }}</li>
        </ul>

        <h2>{{ $t('legal.privacy4Title') }}</h2>
        <ul>
          <li v-html="$t('legal.privacy4item1')"></li>
          <li v-html="$t('legal.privacy4item2')"></li>
          <li v-html="$t('legal.privacy4item3')"></li>
        </ul>

        <h2>{{ $t('legal.privacy5Title') }}</h2>
        <p>{{ $t('legal.privacy5p1') }}</p>
        <ul>
          <li v-html="$t('legal.privacy5item1')"></li>
          <li v-html="$t('legal.privacy5item2')"></li>
          <li v-html="$t('legal.privacy5item3')"></li>
          <li v-html="$t('legal.privacy5item4')"></li>
        </ul>
        <p>{{ $t('legal.privacy5p2') }}</p>

        <h2>{{ $t('legal.privacy6Title') }}</h2>
        <p>{{ $t('legal.privacy6p1') }}</p>

        <h2>{{ $t('legal.privacy7Title') }}</h2>
        <ul>
          <li v-html="$t('legal.privacy7item1')"></li>
          <li v-html="$t('legal.privacy7item2')"></li>
          <li v-html="$t('legal.privacy7item3')"></li>
        </ul>

        <h2>{{ $t('legal.privacy8Title') }}</h2>
        <p v-html="$t('legal.privacy8p1')"></p>
        <p v-html="$t('legal.privacy8p2')"></p>

        <h2>{{ $t('legal.privacy9Title') }}</h2>
        <p>{{ $t('legal.privacy9p1') }}</p>
        <ul>
          <li v-html="$t('legal.privacy9item1')"></li>
          <li v-html="$t('legal.privacy9item2')"></li>
        </ul>
        <p>{{ $t('legal.privacy9p2') }}</p>

        <h2>{{ $t('legal.privacy10Title') }}</h2>
        <p>{{ $t('legal.privacy10p1') }}</p>
      </div>

      <!-- Terminos y Condiciones -->
      <div v-else-if="page === 'terms'" class="legal-content">
        <h1 class="font-serif text-3xl mb-8">{{ $t('legal.termsTitle') }}</h1>
        <p class="text-sm text-gray-400 mb-8">{{ $t('legal.lastUpdated') }}</p>

        <h2>{{ $t('legal.terms1Title') }}</h2>
        <p>{{ $t('legal.terms1p1') }}</p>

        <h2>{{ $t('legal.terms2Title') }}</h2>
        <p>{{ $t('legal.terms2p1') }}</p>
        <ul>
          <li>{{ $t('legal.terms2item1') }}</li>
          <li>{{ $t('legal.terms2item2') }}</li>
          <li>{{ $t('legal.terms2item3') }}</li>
        </ul>
        <p>{{ $t('legal.terms2p2') }}</p>

        <h2>{{ $t('legal.terms3Title') }}</h2>
        <p>{{ $t('legal.terms3p1') }}</p>
        <p>{{ $t('legal.terms3p2') }}</p>

        <h2>{{ $t('legal.terms4Title') }}</h2>
        <ul>
          <li>{{ $t('legal.terms4item1') }}</li>
          <li>{{ $t('legal.terms4item2') }}</li>
          <li>{{ $t('legal.terms4item3') }}</li>
          <li>{{ $t('legal.terms4item4') }}</li>
          <li>{{ $t('legal.terms4item5') }}</li>
        </ul>

        <h2>{{ $t('legal.terms5Title') }}</h2>
        <p>{{ $t('legal.terms5p1') }}</p>

        <h2>{{ $t('legal.terms6Title') }}</h2>
        <p>{{ $t('legal.terms6p1') }}</p>
        <p>{{ $t('legal.terms6p2') }}</p>

        <h2>{{ $t('legal.terms7Title') }}</h2>
        <p>{{ $t('legal.terms7p1') }}</p>

        <h2>{{ $t('legal.terms8Title') }}</h2>
        <p>{{ $t('legal.terms8p1') }}</p>

        <h2>{{ $t('legal.terms9Title') }}</h2>
        <p>{{ $t('legal.terms9p1') }}</p>

        <h2>{{ $t('legal.terms10Title') }}</h2>
        <p>{{ $t('legal.terms10p1') }}</p>

        <h2>{{ $t('legal.terms11Title') }}</h2>
        <p v-html="$t('legal.terms11p1')"></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()
const page = computed(() => route.params.page as string)
</script>

<style scoped>
.legal-content h2 {
  @apply font-serif text-xl text-white mt-8 mb-3;
}

.legal-content p {
  @apply text-gray-300 text-sm leading-relaxed mb-3;
}

.legal-content ul {
  @apply list-disc pl-6 mb-4 space-y-1;
}

.legal-content li {
  @apply text-gray-300 text-sm leading-relaxed;
}

.legal-content a {
  @apply text-gold-400 hover:text-gold-300 transition-colors;
}
</style>
