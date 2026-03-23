import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'

function detectLocale(): string {
  const saved = localStorage.getItem('wedding30s-locale')
  if (saved && ['en', 'es'].includes(saved)) return saved

  const browserLang = navigator.language.split('-')[0]
  if (['en', 'es'].includes(browserLang)) return browserLang

  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, es },
})

export function setLocale(locale: string) {
  i18n.global.locale.value = locale as 'en' | 'es'
  localStorage.setItem('wedding30s-locale', locale)
}

export default i18n
