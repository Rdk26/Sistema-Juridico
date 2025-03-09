import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  
  const metrics = [
    { label: 'Meta Mensal', value: 'MT 50.000,00' },
    { label: 'A Receber', value: 'MT 35.000,00' },
    { label: 'Saldo Atual', value: 'MT 28.500,00' },
  ];
  const handleThemeToggle = () => {
    toggleTheme(); // Agora funciona sem parâmetros
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 w-64"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={handleThemeToggle} // Usando o novo handler
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <div className="px-6 py-4 grid grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="card-juridico">
            <p className="texto-escuro text-sm">{metric.label}</p>
            <p className="texto-escuro text-2xl font-semibold mt-1">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}