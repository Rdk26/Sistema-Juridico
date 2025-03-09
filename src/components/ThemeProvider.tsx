import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';
type ThemeContextType = {
  theme: Theme;
  toggleTheme: (newTheme?: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
    return savedTheme ? savedTheme as Theme : systemTheme;
  });

  const toggleTheme = (newTheme?: Theme) => {
    setTheme(prev => {
      const calculatedTheme = newTheme || (prev === 'dark' ? 'light' : 'dark');
      
      if (calculatedTheme === 'system') {
        localStorage.removeItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
        document.documentElement.classList.toggle('dark', systemTheme === 'dark');
        return 'system';
      }
      
      localStorage.setItem('theme', calculatedTheme);
      document.documentElement.classList.toggle('dark', calculatedTheme === 'dark');
      return calculatedTheme;
    });
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);