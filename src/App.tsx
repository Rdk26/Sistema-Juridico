import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProcessosPage from './pages/ProcessosPage';
import FinanceiroPage from './pages/FinanceiroPage';
import ModelosPage from './pages/ModelosPage';
import AtividadesPage from './pages/AtividadesPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import RelatoriosPage from './pages/RelatoriosPage';
import SuportePage from './pages/SuportePage';
import NotificacoesPage from './pages/NotificacoesPage';
import ClientesPage from './pages/ClientesPage';
import PessoalInternoPage from './pages/PessoalInternoPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider>
      <Toaster position="bottom-right" />
      <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Atividades" element={<AtividadesPage />} />
            <Route path="/Configurações" element={<ConfiguracoesPage />} />
            <Route path="/financeiro" element={<FinanceiroPage />} />
            <Route path="/Notificações" element={<NotificacoesPage />} />
            <Route path="/Modelos" element={<ModelosPage />} />
            <Route path="/Clientes" element={<ClientesPage />} />
            <Route path="/Pessoal Interno" element={<PessoalInternoPage />} />
            <Route path="/processos" element={<ProcessosPage />} />
            <Route path="/Relatórios" element={<RelatoriosPage />} />
            <Route path="/Suporte" element={<SuportePage />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;