import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Check localStorage for theme preference or use system preference as default
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('chatbot-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    
    // Check for system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  });
  
  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;
    const oldTheme = theme === 'dark' ? 'light' : 'dark';
    
    root.classList.remove(`chatbot-${oldTheme}`);
    root.classList.add(`chatbot-${theme}`);
    
    // Save to localStorage
    localStorage.setItem('chatbot-theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 