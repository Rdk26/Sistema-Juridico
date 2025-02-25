import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProcessosPage from './pages/ProcessosPage';
import FinanceiroPage from './pages/FinanceiroPage';

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
          <Route path="/processos" element={<ProcessosPage />} />
          <Route path="/financeiro" element={<FinanceiroPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;