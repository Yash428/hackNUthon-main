import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';

// Language options for the selector
export const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' }
];

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      hi: {
        translation: hiTranslation
      }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false // React already safes from XSS
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;

// Helper function to translate dynamic content
export const translateDynamicContent = (content: string, language: string) => {
  // For complex scenarios, you might use more sophisticated translation tools here
  // This is a basic implementation for demonstration
  const commonTerms: Record<string, Record<string, string>> = {
    en: {
      'cancer': 'cancer',
      'scan': 'scan',
      'result': 'result',
      'positive': 'positive',
      'negative': 'negative',
      'test': 'test'
    },
    hi: {
      'cancer': 'कैंसर',
      'scan': 'स्कैन',
      'result': 'परिणाम',
      'positive': 'पॉजिटिव',
      'negative': 'नेगेटिव',
      'test': 'परीक्षण'
    }
  };

  // Only process if we have the language
  if (!commonTerms[language]) return content;

  // Replace common terms in the content
  let translatedContent = content;
  Object.entries(commonTerms[language]).forEach(([term, translation]) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    translatedContent = translatedContent.replace(regex, translation);
  });

  return translatedContent;
}; 