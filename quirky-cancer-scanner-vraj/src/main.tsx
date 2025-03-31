import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import i18n configuration
import './i18n/i18n'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18n'

createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
);
