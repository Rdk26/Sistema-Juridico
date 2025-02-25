import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react'; // Importação do ícone
import { Skeleton } from './Skeleton';

type Processo = {
  client: string;
  number: string;
  court: string;
  lastUpdate: string;
  status: string;
};

const initialProcesses: Processo[] = [
  {
    client: "João Silva",
    number: "0001234-12.2024.8.26.0100",
    court: "1ª Vara Cível",
    lastUpdate: "2024-03-10",
    status: "Em andamento"
  },
  // ... outros processos
];

// Função de mapeamento de cores
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'em andamento':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'concluído':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'arquivado':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export function ProcessTable() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProcessos(initialProcesses);
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="card-juridico">
      {/* ... resto do código */}
      <button className="btn-primary flex items-center gap-2">
        <Plus className="w-4 h-4" /> {/* Ícone agora importado */}
        Novo Processo
      </button>
      {/* ... */}
    </div>
  );
}