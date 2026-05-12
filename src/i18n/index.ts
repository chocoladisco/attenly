import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en'
import de from './de'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  lng: localStorage.getItem('lang') ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
