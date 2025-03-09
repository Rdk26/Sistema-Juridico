
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

function App() {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
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
    </ThemeProvider>
  );
}

export default App;