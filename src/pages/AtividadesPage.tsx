// pages/AtividadesPage.tsx
import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Edit,
  Trash2,
  AlertCircle,
  Filter,
  Download
} from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';

type Atividade = {
  id: number;
  titulo: string;
  tipo: 'audiencia' | 'peticao' | 'diligencia' | 'outro';
  descricao: string;
  dataPrevista: string;
  dataConclusao?: string;
  status: 'pendente' | 'concluida' | 'atrasada';
  responsavel: string;
  prioridade: 'alta' | 'media' | 'baixa';
};

const atividadesMock: Atividade[] = [
  {
    id: 1,
    titulo: 'Audiência Preliminar',
    tipo: 'audiencia',
    descricao: 'Audiência para discussão de preliminares',
    dataPrevista: '2024-04-15',
    status: 'pendente',
    responsavel: 'Carlos Mahumane',
    prioridade: 'alta'
  },
  {
    id: 2,
    titulo: 'Elaboração de Petição',
    tipo: 'peticao',
    descricao: 'Petição inicial para ação de divórcio',
    dataPrevista: '2024-03-28',
    dataConclusao: '2024-03-25',
    status: 'concluida',
    responsavel: 'Ana Mondlane',
    prioridade: 'media'
  },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'concluida': return 'bg-green-100 text-green-800';
    case 'pendente': return 'bg-yellow-100 text-yellow-800';
    case 'atrasada': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPrioridadeStyle = (prioridade: string) => {
  switch (prioridade) {
    case 'alta': return 'text-red-600';
    case 'media': return 'text-yellow-600';
    default: return 'text-gray-600';
  }
};

export default function AtividadesPage() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    termoBusca: '',
    tipo: 'todos',
    status: 'todos',
    prioridade: 'todos'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [atividadeEditando, setAtividadeEditando] = useState<Atividade | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setAtividades(atividadesMock);
      setIsLoading(false);
    }, 1000);
  }, []);

  const atividadesFiltradas = atividades.filter(atividade => {
    const matchesTexto = atividade.titulo.toLowerCase().includes(filtros.termoBusca.toLowerCase()) ||
      atividade.descricao.toLowerCase().includes(filtros.termoBusca.toLowerCase());

    const matchesTipo = filtros.tipo === 'todos' || atividade.tipo === filtros.tipo;
    const matchesStatus = filtros.status === 'todos' || atividade.status === filtros.status;
    const matchesPrioridade = filtros.prioridade === 'todos' || atividade.prioridade === filtros.prioridade;

    return matchesTexto && matchesTipo && matchesStatus && matchesPrioridade;
  });

  const metricas = {
    total: atividades.length,
    concluidas: atividades.filter(a => a.status === 'concluida').length,
    atrasadas: atividades.filter(a => 
      new Date(a.dataPrevista) < new Date() && a.status !== 'concluida'
    ).length
  };

  const marcarComoConcluida = (id: number) => {
    setAtividades(prev => prev.map(atividade => 
      atividade.id === id ? { 
        ...atividade, 
        status: 'concluida',
        dataConclusao: new Date().toISOString().split('T')[0]
      } : atividade
    ));
  };

  const handleSubmit = () => {
    if (atividadeEditando) {
        if (atividadeEditando.id) {
            setAtividades(prev => prev.map(a => 
                a.id === atividadeEditando.id ? atividadeEditando : a
            ));
        } else {
            const novaAtividade: Atividade = { // Tipo explícito
                ...atividadeEditando,
                id: Date.now(),
                status: 'pendente' as const, // Tipo literal
                dataConclusao: undefined
            };
            setAtividades(prev => [...prev, novaAtividade]);
        }
    }
    setIsModalOpen(false);
    setAtividadeEditando(null);
};

  const handleDelete = (id: number) => {
    setAtividades(prev => prev.filter(a => a.id !== id));
  };

  const exportarParaExcel = () => {
    // Implemente a lógica para exportar para Excel
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold texto-escuro">Gestão de Atividades</h1>
        <Button onClick={() => {
          setAtividadeEditando({
            id: 0,
            titulo: '',
            tipo: 'audiencia',
            descricao: '',
            dataPrevista: new Date().toISOString().split('T')[0],
            status: 'pendente',
            responsavel: '',
            prioridade: 'media'
          });
          setIsModalOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Atividade
        </Button>
      </div>

      {/* Seção de Filtros e Exportação */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex-1">
          <SearchInput
            placeholder="Buscar atividade..."
            value={filtros.termoBusca}
            onChange={(e) => setFiltros(prev => ({ 
              ...prev, 
              termoBusca: e.target.value 
            }))}
          />
        </div>
        
        <Select
          value={filtros.tipo}
          onValueChange={(value) => setFiltros(prev => ({ 
            ...prev, 
            tipo: value 
          }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="audiencia">Audiência</SelectItem>
            <SelectItem value="prazo">Prazo</SelectItem>
            <SelectItem value="reuniao">Reunião</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filtros.status}
          onValueChange={(value) => setFiltros(prev => ({ 
            ...prev, 
            status: value 
          }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="concluida">Concluída</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          onClick={exportarParaExcel} 
          className="flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Exportar Relatório
        </Button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card-juridico p-4 flex items-center gap-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-sm">Atividades Concluídas</p>
            <p className="text-2xl font-bold">{metricas.concluidas}</p>
          </div>
        </div>

        <div className="card-juridico p-4 flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-yellow-600" />
          <div>
            <p className="text-sm">Atividades Pendentes</p>
            <p className="text-2xl font-bold">{atividadesFiltradas.length - metricas.concluidas}</p>
          </div>
        </div>

        <div className="card-juridico p-4 flex items-center gap-4">
          <Clock className="w-8 h-8 text-red-600" />
          <div>
            <p className="text-sm">Atividades Atrasadas</p>
            <p className="text-2xl font-bold">{metricas.atrasadas}</p>
          </div>
        </div>
      </div>

      {/* Lista de Atividades */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))
        ) : (
          atividadesFiltradas.map(atividade => (
            <div key={atividade.id} className="card-juridico p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(atividade.status)}`}>
                      {atividade.status.toUpperCase()}
                    </span>
                    <span className={`text-sm ${getPrioridadeStyle(atividade.prioridade)}`}>
                      {atividade.prioridade.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold">{atividade.titulo}</h3>
                  <p className="text-sm text-gray-600">{atividade.descricao}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(atividade.dataPrevista).toLocaleDateString('pt-MZ')}
                        {atividade.dataConclusao && (
                          <span className="ml-2 text-green-600">
                            (Concluído em {new Date(atividade.dataConclusao).toLocaleDateString('pt-MZ')})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{atividade.responsavel}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAtividadeEditando(atividade);
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {atividade.status !== 'concluida' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-100 hover:bg-green-50"
                      onClick={() => marcarComoConcluida(atividade.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-white bg-destructive hover:bg-destructive/90 dark:text-destructive-foreground"
                    onClick={() => handleDelete(atividade.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {atividadeEditando?.id ? 'Editar Atividade' : 'Nova Atividade'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              label="Título da Atividade *"
              value={atividadeEditando?.titulo || ''}
              onChange={e => setAtividadeEditando(prev => ({
                ...prev!,
                titulo: e.target.value
              }))}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                value={atividadeEditando?.tipo || 'audiencia'}
                onValueChange={value => setAtividadeEditando(prev => ({
                  ...prev!,
                  tipo: value as 'audiencia' | 'peticao' | 'diligencia' | 'outro'
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Atividade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="audiencia">Audiência</SelectItem>
                  <SelectItem value="peticao">Petição</SelectItem>
                  <SelectItem value="diligencia">Diligência</SelectItem>
                  <SelectItem value="outro">Outros</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={atividadeEditando?.prioridade || 'media'}
                onValueChange={value => setAtividadeEditando(prev => ({
                  ...prev!,
                  prioridade: value as 'alta' | 'media' | 'baixa'
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Data Prevista *"
                type="date"
                value={atividadeEditando?.dataPrevista || ''}
                onChange={e => setAtividadeEditando(prev => ({
                  ...prev!,
                  dataPrevista: e.target.value
                }))}
              />

              <Select
                value={atividadeEditando?.status || 'pendente'}
                onValueChange={value => setAtividadeEditando(prev => ({
                  ...prev!,
                  status: value as 'pendente' | 'concluida' | 'atrasada'
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="atrasada">Atrasada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input
              label="Responsável *"
              value={atividadeEditando?.responsavel || ''}
              onChange={e => setAtividadeEditando(prev => ({
                ...prev!,
                responsavel: e.target.value
              }))}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Descrição
              </label>
              <textarea
                rows={3}
                value={atividadeEditando?.descricao || ''}
                onChange={e => setAtividadeEditando(prev => ({
                  ...prev!,
                  descricao: e.target.value
                }))}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!atividadeEditando?.titulo || !atividadeEditando.responsavel}
            >
              {atividadeEditando?.id ? 'Salvar Alterações' : 'Criar Atividade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}