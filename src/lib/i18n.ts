import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import arTranslation from '../locales/ar/translation.json'
import enTranslation from '../locales/en/translation.json'

// Get language from localStorage or default to Arabic
const savedLanguage = localStorage.getItem('language') || 'ar'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: arTranslation
      },
      en: {
        translation: enTranslation
      }
    },
    lng: savedLanguage,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false // Disable suspense to avoid blank screens
    }
  })

// Update HTML attributes when language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
})

export default i18n
