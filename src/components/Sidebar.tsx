import { NavLink } from 'react-router-dom';
import {
  Home,
  FileText,
  Scale,
  FileCheck,
  Activity,
  BarChart3,
  Settings,
  HelpCircle,
  Gavel,
  Users,
  Bell            
} from 'lucide-react';

// Definindo tipo para os itens do menu
interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

// Lista de itens do menu
const menuItems: MenuItem[] = [
  { icon: Home, label: 'Dashboard' },
  { icon: FileText, label: 'Processos' },
  { icon: Scale, label: 'Financeiro' },
  { icon: FileCheck, label: 'Modelos' },
  { icon: Activity, label: 'Atividades' },
  { icon: Users, label: 'Pessoas'},
  { icon: Bell, label: 'Intimações'},
  { icon: BarChart3, label: 'Relatórios'},
  { icon: Settings, label: 'Configurações' },
  { icon: HelpCircle, label: 'Suporte' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-[#2A3F54] text-white flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <Gavel className="w-8 h-8" />
        <h1 className="text-xl font-semibold">MD Legal Suite</h1>
      </div>
      <nav className="mt-6 flex-1">
        {menuItems.map((item: MenuItem) => (
          <NavLink
            key={item.label}
            to={`/${item.label.toLowerCase()}`}
            className={({ isActive }) => 
              `flex items-center gap-4 px-6 py-3 transition-colors ${
                isActive 
                  ? 'bg-[#34495E] text-white' 
                  : 'text-gray-300 hover:bg-[#34495E]'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}