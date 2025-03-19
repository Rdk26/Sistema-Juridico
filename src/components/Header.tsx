import { Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { SearchInput } from './ui/SearchInput';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  
  const metrics = [
    { label: 'Meta Mensal', value: 'MT 50.000,00' },
    { label: 'A Receber', value: 'MT 35.000,00' },
    { label: 'Saldo Atual', value: 'MT 28.500,00' },
  ];
  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <SearchInput />
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={handleThemeToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <div className="px-4 md:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="card-juridico">
            <p className="texto-escuro text-sm">{metric.label}</p>
            <p className="texto-escuro text-xl md:text-2xl font-semibold mt-1">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}