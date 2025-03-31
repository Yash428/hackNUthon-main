import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { languageOptions } from '../i18n/i18n';
import { ChevronDown, Check, Globe } from 'lucide-react';

interface LanguageSelectorProps {
  isCollapsed?: boolean;
}

const LanguageSelector = ({ isCollapsed = false }: LanguageSelectorProps) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find current language name
  const currentLanguage = languageOptions.find(lang => lang.code === i18n.language);

  // Handle language change
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    // Save language preference to localStorage
    localStorage.setItem('i18nextLng', langCode);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // If sidebar is collapsed, show only the globe icon
  if (isCollapsed) {
    return (
      <div className="px-3 py-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-cancer-blue/5 text-gray-700 hover:text-cancer-blue transition-colors"
          title={t('common.selectLanguage')}
        >
          <Globe size={20} />
        </button>
        
        {isOpen && (
          <div 
            ref={dropdownRef}
            className="absolute left-16 z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-36"
          >
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
              >
                {lang.name}
                {i18n.language === lang.code && (
                  <Check size={16} className="ml-auto text-cancer-blue" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full version with language name displayed
  return (
    <div className="px-3 py-2 relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between space-x-3 px-3 py-2 rounded-lg hover:bg-cancer-blue/5 text-gray-700 hover:text-cancer-blue transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Globe size={20} />
          <span>{currentLanguage?.name || 'English'}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 right-0 z-10 mt-1 mx-3 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
          {languageOptions.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
            >
              {lang.name}
              {i18n.language === lang.code && (
                <Check size={16} className="ml-auto text-cancer-blue" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 