"use client";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Example translation resources
const resources = {
  sk: {
    translation: {
      priceListTitle: 'Cenník služieb',
      priceListDescription: 'Profesionálny cenník kaderníckych služieb. Dámske, pánske, styling, wellness, farbenie, brada, a ďalšie služby.',
      loading: 'Načítavam cenník...'
      // ...add more keys as needed
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'sk',
    fallbackLng: 'sk',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
