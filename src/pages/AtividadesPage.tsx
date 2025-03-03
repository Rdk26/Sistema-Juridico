// pages/AtividadesPage.tsx
import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Plus,
  ListFilter,
  GripVertical,
} from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

type Atividade = {
  id: number;
  tipo: 'tarefa' | 'evento' | 'lembrete';
  titulo: string;
  descricao: string;
  data: string;
  concluida: boolean;
  prioridade?: 'alta' | 'media' | 'baixa';
};

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
  const [ordenacao, setOrdenacao] = useState<'data' | 'prioridade'>('data');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Atividade>>({});
  const [modoEdicao, setModoEdicao] = useState(false);
  const itensPorPagina = 5;

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

  const atividadesOrdenadas = [...atividadesFiltradas].sort((a, b) => {
    if (ordenacao === 'prioridade') {
      const prioridades = { alta: 3, media: 2, baixa: 1, undefined: 0 };
      return prioridades[b.prioridade as keyof typeof prioridades] - prioridades[a.prioridade as keyof typeof prioridades];
    }
    return new Date(a.data).getTime() - new Date(b.data).getTime();
  });

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const atividadesPagina = atividadesOrdenadas.slice(indexUltimoItem - itensPorPagina, indexUltimoItem);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(atividades);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setAtividades(items);
  };

  const abrirModalEdicao = (atividade?: Atividade) => {
    if (atividade) {
      setFormData(atividade);
      setModoEdicao(true);
    } else {
      setFormData({
        tipo: 'tarefa',
        data: new Date().toISOString().split('T')[0]
      });
      setModoEdicao(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.titulo || !formData.data) return;

    const newActivity: Atividade = {
      ...formData,
      id: modoEdicao ? formData.id! : Math.max(...atividades.map(a => a.id), 0) + 1,
      concluida: formData.concluida || false
    } as Atividade;

    const novasAtividades = modoEdicao 
      ? atividades.map(a => a.id === newActivity.id ? newActivity : a)
      : [...atividades, newActivity];

    setAtividades(novasAtividades);
    setIsModalOpen(false);
    setFormData({});
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold texto-escuro">Gestão de Atividades</h1>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => abrirModalEdicao()}
        >
          <Plus className="w-4 h-4" />
          Nova Atividade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as any)}
          className="card-juridico p-3"
        >
          <option value="data">Ordenar por Data</option>
          <option value="prioridade">Ordenar por Prioridade</option>
        </select>

        <div className="card-juridico p-3 flex items-center gap-2">
          <ListFilter className="w-5 h-5" />
          <span>Itens por página: {itensPorPagina}</span>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="atividades">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 gap-4"
            >
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="h-24 w-full" />
                  ))}
                </div>
              ) : (
                atividadesPagina.map((atividade, index) => (
                  <Draggable 
                    key={atividade.id} 
                    draggableId={atividade.id.toString()} 
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="card-juridico p-6 relative"
                      >
                        <div 
                          {...provided.dragHandleProps}
                          className="absolute left-2 top-1/2 -translate-y-1/2"
                        >
                          <GripVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        
                        <div className="flex items-start justify-between gap-4 ml-4">
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
                          
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => abrirModalEdicao(atividade)}
                              className="text-sm text-primary hover:underline"
                            >
                              Editar
                            </button>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs ${
                              atividade.concluida 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20'
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                              {atividade.concluida ? 'Concluída' : 'Pendente'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: Math.ceil(atividadesOrdenadas.length / itensPorPagina) }).map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-md ${
              paginaAtual === index + 1 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => setPaginaAtual(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {modoEdicao ? 'Editar Atividade' : 'Nova Atividade'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título *</label>
              <Input
                value={formData.titulo || ''}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                value={formData.descricao || ''}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo *</label>
                <select
                  value={formData.tipo || 'tarefa'}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
                  className="card-juridico p-3 w-full"
                >
                  <option value="tarefa">Tarefa</option>
                  <option value="evento">Evento</option>
                  <option value="lembrete">Lembrete</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data *</label>
                <input
                  type="date"
                  value={formData.data || ''}
                  onChange={(e) => setFormData({...formData, data: e.target.value})}
                  className="card-juridico p-3 w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prioridade</label>
                <select
                  value={formData.prioridade || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    prioridade: e.target.value as any || undefined
                  })}
                  className="card-juridico p-3 w-full"
                >
                  <option value="">Sem prioridade</option>
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>

              <div className="space-y-2 flex items-center gap-4 mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.concluida || false}
                    onChange={(e) => setFormData({...formData, concluida: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Concluída</span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <button 
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!formData.titulo || !formData.data}
            >
              {modoEdicao ? 'Salvar Alterações' : 'Criar Atividade'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}