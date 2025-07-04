import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(Backend)
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      fallbackLng: 'en',
      load: 'languageOnly',
      supportedLngs: ['cs','de','el','en','es','fr','hi','id','it','ja','ko','pl','ru','sv','th','vi','zh-CN'],
      nonExplicitSupportedLngs: true,
      detection: {
        order: ['navigator', 'querystring', 'cookie', 'localStorage', 'htmlTag', 'path'],
      },
      //debug: true,
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      react: {
        useSuspense: false,
      },
    });

export default i18n;
