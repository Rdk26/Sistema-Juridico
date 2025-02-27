// pages/AtividadesPage.tsx
import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Plus,
  ListFilter,
  Loader2
} from 'lucide-react';
import { Skeleton } from '../components/Skeleton';

type Atividade = {
  id: number;
  tipo: 'tarefa' | 'evento' | 'lembrete';
  titulo: string;
  descricao: string;
  data: string;
  concluida: boolean;
  prioridade?: 'alta' | 'media' | 'baixa';
};

// Dados mockados com exemplos moçambicanos
const atividadesMock: Atividade[] = [
  {
    id: 1,
    tipo: 'tarefa',
    titulo: 'Revisar contrato de parceria',
    descricao: 'Verificar cláusulas do contrato com Empresa Moza Holdings',
    data: '2024-03-20',
    concluida: false,
    prioridade: 'alta'
  },
  {
    id: 2,
    tipo: 'evento',
    titulo: 'Audiência - Processo 045/2023',
    descricao: 'Tribunal Judicial da Beira - Secção Cível',
    data: '2024-03-22',
    concluida: false
  },
  {
    id: 3,
    tipo: 'lembrete',
    titulo: 'Prazo para recurso',
    descricao: 'Processo 078/2024/STT-N - Vence em 25/03',
    data: '2024-03-25',
    concluida: false,
    prioridade: 'media'
  }
];

const getStatusColor = (prioridade?: string) => {
  switch (prioridade) {
    case 'alta': return 'bg-red-100 text-red-800 dark:bg-red-900/20';
    case 'media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20';
    case 'baixa': return 'bg-green-100 text-green-800 dark:bg-green-900/20';
    default: return 'bg-gray-100 dark:bg-gray-800';
  }
};

const getIcone = (tipo: string) => {
  switch (tipo) {
    case 'tarefa': return <CheckCircle className="w-5 h-5" />;
    case 'evento': return <Calendar className="w-5 h-5" />;
    case 'lembrete': return <AlertTriangle className="w-5 h-5" />;
    default: return <Clock className="w-5 h-5" />;
  }
};

export default function AtividadesPage() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  useEffect(() => {
    setTimeout(() => {
      setAtividades(atividadesMock);
      setIsLoading(false);
    }, 1200);
  }, []);

  const atividadesFiltradas = atividades.filter(atividade => {
    const matchTipo = filtroTipo === 'todos' || atividade.tipo === filtroTipo;
    const matchStatus = filtroStatus === 'todos' || 
      (filtroStatus === 'concluidas' ? atividade.concluida : !atividade.concluida);
    return matchTipo && matchStatus;
  });

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold texto-escuro">Gestão de Atividades</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Atividade
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <select 
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="card-juridico p-3"
        >
          <option value="todos">Todos os Tipos</option>
          <option value="tarefa">Tarefas</option>
          <option value="evento">Eventos</option>
          <option value="lembrete">Lembretes</option>
        </select>

        <select 
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="card-juridico p-3"
        >
          <option value="todos">Todos os Status</option>
          <option value="pendentes">Pendentes</option>
          <option value="concluidas">Concluídas</option>
        </select>

        <div className="card-juridico p-3 flex items-center gap-2">
          <ListFilter className="w-5 h-5" />
          <span className="text-sm">Ordenar por Data</span>
        </div>
      </div>

      {/* Lista de Atividades */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {atividadesFiltradas.map((atividade) => (
            <div key={atividade.id} className="card-juridico p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${getStatusColor(atividade.prioridade)}`}>
                      {getIcone(atividade.tipo)}
                    </div>
                    <h3 className="text-lg font-semibold texto-escuro">
                      {atividade.titulo}
                    </h3>
                    {atividade.prioridade && (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(atividade.prioridade)}`}>
                        {atividade.prioridade.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {atividade.descricao}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(atividade.data).toLocaleDateString('pt-MZ')}</span>
                  </div>
                </div>
                <button 
                  className={`p-2 rounded-md transition-colors ${
                    atividade.concluida 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                  }`}
                >
                  <CheckCircle className={`w-5 h-5 ${atividade.concluida && 'fill-green-500'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sem resultados */}
      {!isLoading && atividadesFiltradas.length === 0 && (
        <div className="card-juridico p-6 text-center text-gray-500 dark:text-gray-400">
          Nenhuma atividade encontrada com os filtros selecionados
        </div>
      )}
    </main>
  );
}