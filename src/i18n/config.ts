
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import el from './el.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    el: { translation: el }
  },
  lng: 'el', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
});

export default i18n;
