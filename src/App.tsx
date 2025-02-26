import { useState } from 'react';
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
import IntimacoesPage from './pages/IntimacoesPage';
import PessoasPage from './pages/PessoasPage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <Routes>
          <Route 
            path="/" 
            element={<Dashboard onThemeToggle={() => setIsDarkMode(!isDarkMode)} />} 
          />
          <Route path="/Dashboard" element={<Dashboard onThemeToggle={function (): void {
            throw new Error('Function not implemented.');
          } } />} />
          <Route path="/Atividades" element={<AtividadesPage />} />
          <Route path="/Configurações" element={<ConfiguracoesPage />} />
          <Route path="/financeiro" element={<FinanceiroPage />} />
          <Route path="/Intimações" element={<IntimacoesPage />} />
          <Route path="/Modelos" element={<ModelosPage />} />
          <Route path="/Pessoas" element={<PessoasPage />} />
          <Route path="/processos" element={<ProcessosPage />} />
          <Route path="/Relatórios" element={<RelatoriosPage />} />
          <Route path="/Suporte" element={<SuportePage />} />

        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;