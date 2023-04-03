import common_de from "./translation/de/comman.json";
import common_en from "./translation/en/comman.json";
import i18next from "i18next";
i18next.init({
    interpolation: { escapeValue: false },  // React already does escaping
    lng: localStorage.getItem("lang") === "de"?'de':'en',                              // language to use
    resources: {
        en: {
            translation: common_en               // 'common' is our custom namespace
        },
        de: {
            translation: common_de   
        },
    },
});