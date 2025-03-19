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
  Bell,
  UserCog,
  LogOut
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useState } from 'react';

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const menuItems: MenuItem[] = [
  { icon: Home, label: 'Dashboard' },
  { icon: FileText, label: 'Processos' },
  { icon: Scale, label: 'Financeiro' },
  { icon: FileCheck, label: 'Modelos' },
  { icon: Activity, label: 'Atividades' },
  { icon: Users, label: 'Clientes'},
  { icon: UserCog, label: 'Pessoal Interno'},
  { icon: Bell, label: 'Notificações'},
  { icon: BarChart3, label: 'Relatórios'},
  { icon: Settings, label: 'Configurações' },
  { icon: HelpCircle, label: 'Suporte' },
];

export default function Sidebar() {
  const { theme } = useTheme();
  const [userData] = useState({
    name: "Uriel Menete",
    email: "uriel@mdlegal.mz",
    avatar: ""
  });

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <aside className={`fixed md:relative z-50 h-screen flex flex-col w-20 hover:w-64 transition-all duration-300 ease-in-out shadow-xl group
      ${theme === 'dark' 
        ? 'bg-[#2A3F54] border-r border-gray-700' 
        : 'bg-white border-r border-gray-200'}`}>
      
      {/* Cabeçalho */}
      <div className="p-4 md:p-6 flex items-center gap-3">
        <Gavel className={`w-8 h-8 min-w-[32px] transition-transform duration-300 group-hover:rotate-12 
          ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`} />
        <h1 className={`text-xl font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300
          ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          MD Legal Suite
        </h1>
      </div>

      {/* Menu Principal */}
      <nav className="mt-6 flex-1 px-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={`/${item.label.toLowerCase()}`}
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-lg mx-2 mb-2
              transition-all duration-300 
              ${theme === 'dark' 
                ? 'hover:bg-[#34495E]' 
                : 'hover:bg-gray-100'}
              ${isActive ? (theme === 'dark' ? 'bg-[#34495E]' : 'bg-gray-100') : ''}`
            }
          >
            <item.icon className={`w-6 h-6 min-w-[24px] transition-transform duration-300 
              group-hover:scale-110 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            
            <span className={`whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Seção do Usuário */}
      <div className={`p-4 border-t ${
        theme === 'dark' 
          ? 'border-[#34495E] hover:bg-[#34495E]' 
          : 'border-gray-200 hover:bg-gray-100'
      } transition-colors`}>
        <div className="flex items-center gap-3">
          {/* Avatar do Usuário */}
          <div className="min-w-[40px]">
            {userData.avatar ? (
              <img 
                src={userData.avatar} 
                alt="Avatar do Usuário" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="font-medium text-white">
                  {getInitials(userData.name)}
                </span>
              </div>
            )}
          </div>

          {/* Informações do Usuário */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="font-medium truncate">{userData.name}</p>
            <p className="text-sm text-gray-300 truncate">{userData.email}</p>
            
            {/* Botão de Logout */}
            <button className="mt-2 flex items-center gap-2 text-sm hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Sair da Conta</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}