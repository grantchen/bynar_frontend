import common_de from "./de/comman.json";
import common_en from "./en/comman.json";
import common_es from "./es/comman.json";
import common_fr from "./fr/comman.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";


i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: common_en,
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
    lng: localStorage.getItem('lang') ?? "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });
export {i18n}