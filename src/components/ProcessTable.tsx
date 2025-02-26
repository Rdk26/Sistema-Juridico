import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Skeleton } from './Skeleton';

type Processo = {
  client: string;
  number: string;
  section: string; // Alterado de 'court' para 'section'
  lastUpdate: string;
  status: string;
};

// Dados de exemplo moçambicanos
const initialProcesses: Processo[] = [
  {
    client: "Escritório de Advocacia Maputo",
    number: "001/2024/SCC-M",
    section: "Secção Cível Comercial - Tribunal Judicial da Cidade de Maputo",
    lastUpdate: "2024-03-10",
    status: "Em andamento"
  },
  {
    client: "MozElectric, SARL",
    number: "045/2023/SCP-B",
    section: "Secção de Contencioso Previdenciário - Tribunal Judicial da Beira",
    lastUpdate: "2024-02-28",
    status: "Concluído"
  },
  {
    client: "Associação dos Agricultores de Nampula",
    number: "078/2024/STT-N",
    section: "Secção de Trabalho e Tributária - Tribunal Judicial de Nampula",
    lastUpdate: "2024-03-15",
    status: "Aguardando"
  }
];

// Função de cores para status (mantida)
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'em andamento':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'concluído':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'aguardando':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
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
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="texto-escuro text-xl font-semibold">Processos Jurídicos</h2>
          <div className="flex gap-3">
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Processo
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="p-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <table className="tabela-juridica w-full">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>N° Processo</th>
              <th>Secção</th> {/* Nome alterado */}
              <th>Última Movimentação</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {processos.map((processo) => (
              <tr key={processo.number} className="texto-escuro">
                <td>{processo.client}</td>
                <td className="font-mono">{processo.number}</td>
                <td>{processo.section}</td> {/* Campo alterado */}
                <td>{processo.lastUpdate}</td>
                <td>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(processo.status)}`}>
                    {processo.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}