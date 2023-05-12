import common_de from "./de/comman.json";
import common_en from "./en/comman.json";
import common_es from "./es/comman.json";
import common_fr from "./fr/comman.json";
import i18next from "i18next";
console.log(localStorage.getItem('lang'),"get-language")
i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: localStorage.getItem('lang'), // language to use
  resources: {
    en: {
      translation: common_en, // 'common' is our custom namespace
    },
    de: {
      translation: common_de,
    },
    es: {
      translation: common_es,
    },
    fr: {
      translation: common_fr,
    },
  },
});
