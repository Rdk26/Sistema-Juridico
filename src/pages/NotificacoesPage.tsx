// pages/NotificacoesPage.tsx
import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  CalendarClock, 
  Gavel, 
  User, 
  CheckCircle2, 
  Clock, 
  XCircle,
  AlertCircle,
  FileText,
  Upload
} from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { format, parseISO, differenceInDays } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Button } from '../components/ui/Button';

type Notificacao = {
  id: number;
  numeroProcesso: string;
  descricao: string;
  dataNotificacao: string;
  partesEnvolvidas: string[];
  tipo: 'citação' | 'notificação' | 'diligência';
  status: 'pendente' | 'cumprida' | 'expirada';
  prioridade: 'baixa' | 'média' | 'alta';
  prazo: string;
  tribunal: string;
  anexos: { nome: string; url: string }[];
};

const notificacoesMock: Notificacao[] = [
  {
    id: 1,
    numeroProcesso: "001/2024/TJCM",
    descricao: "Notificação para audiência preliminar",
    dataNotificacao: "2024-03-15",
    partesEnvolvidas: ["Estado Moçambicano", "Empresa Moza Holdings"],
    tipo: "notificação",
    status: "pendente",
    prioridade: "alta",
    prazo: "2024-04-01",
    tribunal: "Tribunal Judicial da Cidade de Maputo",
    anexos: []
  },
  {
    id: 2,
    numeroProcesso: "045/2023/TJB",
    descricao: "Citação para depoimento",
    dataNotificacao: "2024-02-28",
    partesEnvolvidas: ["Carlos Macuácua", "Banco de Moçambique"],
    tipo: "citação",
    status: "cumprida",
    prioridade: "média",
    prazo: "2024-03-15",
    tribunal: "Tribunal Judicial da Beira",
    anexos: []
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'cumprida': return 'bg-green-100 text-green-800 dark:bg-green-900/20';
    case 'pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20';
    case 'expirada': return 'bg-red-100 text-red-800 dark:bg-red-900/20';
    default: return 'bg-gray-100 dark:bg-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'cumprida': return <CheckCircle2 className="w-4 h-4" />;
    case 'pendente': return <Clock className="w-4 h-4" />;
    case 'expirada': return <XCircle className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

const getPrioridadeBadge = (prioridade: string) => {
  switch(prioridade) {
    case 'alta': return 'bg-red-100 text-red-800 dark:bg-red-900/20';
    case 'média': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700';
  }
};

const isPrazoProximo = (prazo: string) => {
  const diffDays = differenceInDays(parseISO(prazo), new Date());
  return diffDays <= 3 && diffDays >= 0;
};

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroData, setFiltroData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificacaoEditando, setNotificacaoEditando] = useState<Notificacao | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setNotificacoes(notificacoesMock);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatarData = (data: string) => {
    return format(parseISO(data), "dd 'de' MMMM 'de' yyyy", { locale: pt });
  };

  const notificacoesFiltradas = notificacoes.filter(notificacao => {
    const matchesTexto = notificacao.numeroProcesso.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      notificacao.descricao.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      notificacao.tribunal.toLowerCase().includes(filtroTexto.toLowerCase());

    const matchesTipo = filtroTipo === 'todos' || notificacao.tipo === filtroTipo;
    const matchesStatus = filtroStatus === 'todos' || notificacao.status === filtroStatus;
    const matchesData = !filtroData || notificacao.dataNotificacao === filtroData;

    return matchesTexto && matchesTipo && matchesStatus && matchesData;
  });

  const handleSubmit = (notificacao: Notificacao) => {
    if (notificacao.id) {
      setNotificacoes(prev => prev.map(n => n.id === notificacao.id ? notificacao : n));
    } else {
      setNotificacoes(prev => [...prev, { 
        ...notificacao, 
        id: Math.max(...prev.map(n => n.id), 0) + 1 
      }]);
    }
    setIsModalOpen(false);
    setNotificacaoEditando(null);
  };

  const handleAdicionarParte = () => {
    setNotificacaoEditando(prev => ({
      ...(prev || {
        id: 0,
        numeroProcesso: '',
        descricao: '',
        dataNotificacao: new Date().toISOString().split('T')[0],
        partesEnvolvidas: [],
        tipo: 'notificação',
        status: 'pendente',
        prioridade: 'baixa',
        prazo: '',
        tribunal: '',
        anexos: []
      }),
      partesEnvolvidas: [...(prev?.partesEnvolvidas || []), '']
    }));
  };

  const handleRemoverParte = (index: number) => {
    const novasPartes = notificacaoEditando?.partesEnvolvidas.filter((_, i) => i !== index) || [];
    setNotificacaoEditando(prev => prev ? { ...prev, partesEnvolvidas: novasPartes } : null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const novosAnexos = Array.from(files).map(file => ({
        nome: file.name,
        url: URL.createObjectURL(file)
      }));
      
      setNotificacaoEditando(prev => prev ? {
        ...prev,
        anexos: [...prev.anexos, ...novosAnexos]
      } : null);
    }
  };

  const handleRemoverAnexo = (index: number) => {
    const novosAnexos = notificacaoEditando?.anexos.filter((_, i) => i !== index) || [];
    setNotificacaoEditando(prev => prev ? { ...prev, anexos: novosAnexos } : null);
  };

  const isFormularioValido = Boolean(
    notificacaoEditando?.numeroProcesso &&
    notificacaoEditando?.descricao &&
    notificacaoEditando?.prazo &&
    notificacaoEditando?.tribunal
  );

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold texto-escuro">Notificações</h1>
        <Button 
          onClick={() => {
            setNotificacaoEditando(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Notificação
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
  <div className="relative flex items-center">
    <Search className="absolute left-3 w-5 h-5 text-gray-400" />
    <Input
      placeholder="Pesquisar..."
      value={filtroTexto}
      onChange={(e) => setFiltroTexto(e.target.value)}
      className="pl-10"
    />
  </div>

        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os Tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Tipos</SelectItem>
            <SelectItem value="notificação">Notificação</SelectItem>
            <SelectItem value="citação">Citação</SelectItem>
            <SelectItem value="diligência">Diligência</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="cumprida">Cumprida</SelectItem>
            <SelectItem value="expirada">Expirada</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          placeholder="Filtrar por data"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {notificacoesFiltradas.map(notificacao => (
            <div
              key={notificacao.id}
              className="card-juridico p-4 hover:shadow-lg transition-shadow relative"
            >
              {isPrazoProximo(notificacao.prazo) && (
                <div className="absolute top-2 right-2 animate-pulse">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
              )}

              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(notificacao.status)}
                  <h3 className="font-semibold">{notificacao.numeroProcesso}</h3>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(notificacao.status)}`}>
                  {notificacao.status.toUpperCase()}
                </span>
              </div>

              <p className="text-sm mb-4 line-clamp-3">{notificacao.descricao}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Gavel className="w-4 h-4" />
                  <span>{notificacao.tribunal}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4" />
                  <span>Prazo: {formatarData(notificacao.prazo)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPrioridadeBadge(notificacao.prioridade)}`}>
                    Prioridade: {notificacao.prioridade.toUpperCase()}
                  </span>
                </div>

                {notificacao.anexos.length > 0 && (
                  <div className="mt-2 border-t pt-2">
                    <p className="text-xs font-medium mb-1">Anexos:</p>
                    <div className="flex flex-wrap gap-1">
                      {notificacao.anexos.map((anexo, index) => (
                        <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                          <FileText className="w-3 h-3" />
                          <span className="text-xs">{anexo.nome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {notificacaoEditando ? 'Editar Notificação' : 'Nova Notificação'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Input
              label="Número do Processo *"
              value={notificacaoEditando?.numeroProcesso || ''}
              onChange={(e) => setNotificacaoEditando(prev => ({
                ...(prev || {
                  id: 0,
                  numeroProcesso: '',
                  descricao: '',
                  dataNotificacao: new Date().toISOString().split('T')[0],
                  partesEnvolvidas: [],
                  tipo: 'notificação',
                  status: 'pendente',
                  prioridade: 'baixa',
                  prazo: '',
                  tribunal: '',
                  anexos: []
                }),
                numeroProcesso: e.target.value
              }))}
            />

            <Input
              label="Descrição *"
              value={notificacaoEditando?.descricao || ''}
              onChange={(e) => setNotificacaoEditando(prev => ({
                ...prev!,
                descricao: e.target.value
              }))}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo *</label>
                <Select
                  value={notificacaoEditando?.tipo || 'notificação'}
                  onValueChange={(value) => setNotificacaoEditando(prev => ({
                    ...prev!,
                    tipo: value as 'citação' | 'notificação' | 'diligência'
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notificação">Notificação</SelectItem>
                    <SelectItem value="citação">Citação</SelectItem>
                    <SelectItem value="diligência">Diligência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prioridade *</label>
                <Select
                  value={notificacaoEditando?.prioridade || 'baixa'}
                  onValueChange={(value) => setNotificacaoEditando(prev => ({
                    ...prev!,
                    prioridade: value as 'baixa' | 'média' | 'alta'
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="média">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Data da Notificação *"
                type="date"
                value={notificacaoEditando?.dataNotificacao || ''}
                onChange={(e) => setNotificacaoEditando(prev => ({
                  ...prev!,
                  dataNotificacao: e.target.value
                }))}
              />

              <Input
                label="Prazo *"
                type="date"
                value={notificacaoEditando?.prazo || ''}
                onChange={(e) => setNotificacaoEditando(prev => ({
                  ...prev!,
                  prazo: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Partes Envolvidas</label>
              <div className="card-juridico p-4 flex flex-wrap gap-2">
                {notificacaoEditando?.partesEnvolvidas.map((parte, index) => (
                  <div key={index} className="bg-primary/10 px-2 py-1 rounded-full flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <input
                      value={parte}
                      onChange={(e) => {
                        const novasPartes = [...notificacaoEditando.partesEnvolvidas];
                        novasPartes[index] = e.target.value;
                        setNotificacaoEditando(prev => ({
                          ...prev!,
                          partesEnvolvidas: novasPartes
                        }));
                      }}
                      className="bg-transparent outline-none text-sm"
                    />
                    <button
                      onClick={() => handleRemoverParte(index)}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAdicionarParte}
                  className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Parte
                </button>
              </div>
            </div>

            <Input
              label="Tribunal *"
              value={notificacaoEditando?.tribunal || ''}
              onChange={(e) => setNotificacaoEditando(prev => ({
                ...prev!,
                tribunal: e.target.value
              }))}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Anexos</label>
              <div className="card-juridico p-4 space-y-2">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  multiple
                />
                <label 
                  htmlFor="file-upload"
                  className="btn-primary flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Adicionar Anexo
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {notificacaoEditando?.anexos?.map((anexo, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                      <FileText className="w-3 h-3" />
                      <span className="text-xs">{anexo.nome}</span>
                      <button 
                        onClick={() => handleRemoverAnexo(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => notificacaoEditando && handleSubmit(notificacaoEditando)}
              disabled={!isFormularioValido}
            >
              {notificacaoEditando ? 'Salvar Alterações' : 'Criar Notificação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}