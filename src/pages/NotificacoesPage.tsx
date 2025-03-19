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
  Upload,
  Trash2,
  Eye,
  Edit,
  Download,
  Bell,
  CheckCircle,
  Filter
} from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { format, parseISO, differenceInDays } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { SearchInput } from '../components/ui/SearchInput';

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
  const [filtros, setFiltros] = useState({
    termoBusca: '',
    tipo: 'todos',
    status: 'todos',
    data: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificacaoEditando, setNotificacaoEditando] = useState<Notificacao | null>(null);
  const [notificacaoVisualizando, setNotificacaoVisualizando] = useState<Notificacao | null>(null);
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [abaAtiva, setAbaAtiva] = useState('dados');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState<Notificacao | null>(null);

  const novaNotificacaoPadrao: Notificacao = {
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
  };

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
    const matchesTexto = notificacao.numeroProcesso.toLowerCase().includes(filtros.termoBusca.toLowerCase()) ||
      notificacao.descricao.toLowerCase().includes(filtros.termoBusca.toLowerCase()) ||
      notificacao.tribunal.toLowerCase().includes(filtros.termoBusca.toLowerCase());

    const matchesTipo = filtros.tipo === 'todos' || notificacao.tipo === filtros.tipo;
    const matchesStatus = filtros.status === 'todos' || notificacao.status === filtros.status;
    const matchesData = !filtros.data || notificacao.dataNotificacao === filtros.data;

    return matchesTexto && matchesTipo && matchesStatus && matchesData;
  });

  const validarCampos = (notificacao: Notificacao) => {
    const novosErros: { [key: string]: string } = {};
    
    if (!notificacao.numeroProcesso?.trim()) novosErros.numeroProcesso = "Campo obrigatório";
    if (!notificacao.descricao?.trim()) novosErros.descricao = "Campo obrigatório";
    if (!notificacao.prazo) novosErros.prazo = "Campo obrigatório";
    if (!notificacao.tribunal?.trim()) novosErros.tribunal = "Campo obrigatório";
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = () => {
    if (!notificacaoEditando) return;

    if (validarCampos(notificacaoEditando)) {
      setNotificacoes(prev => {
        if (notificacaoEditando.id === 0) {
          // Criar nova notificação
          const novoId = prev.length > 0 ? Math.max(...prev.map(n => n.id)) + 1 : 1;
          return [...prev, { ...notificacaoEditando, id: novoId }];
        } else {
          // Editar existente
          return prev.map(n => n.id === notificacaoEditando.id ? notificacaoEditando : n);
        }
      });
      setIsModalOpen(false);
      setNotificacaoEditando(null);
    }
  };

  const handleAdicionarParte = () => {
    setNotificacaoEditando(prev => ({
      ...(prev || novaNotificacaoPadrao),
      partesEnvolvidas: [...(prev?.partesEnvolvidas || []), '']
    }));
  };

  const handleRemoverParte = (index: number) => {
    setNotificacaoEditando(prev => {
      if (!prev) return null;
      const novasPartes = [...prev.partesEnvolvidas];
      novasPartes.splice(index, 1);
      return { ...prev, partesEnvolvidas: novasPartes };
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && notificacaoEditando) {
      const novosAnexos = Array.from(files).map(file => ({
        nome: file.name,
        url: URL.createObjectURL(file)
      }));
      
      setNotificacaoEditando({
        ...notificacaoEditando,
        anexos: [...notificacaoEditando.anexos, ...novosAnexos]
      });
    }
  };

  const handleRemoverAnexo = (index: number) => {
    setNotificacaoEditando(prev => {
      if (!prev) return null;
      const novosAnexos = [...prev.anexos];
      novosAnexos.splice(index, 1);
      return { ...prev, anexos: novosAnexos };
    });
  };

  const handleVisualizar = (notificacao: Notificacao) => {
    setNotificacaoSelecionada(notificacao);
    setIsViewModalOpen(true);
  };

  const handleApagar = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta notificação?')) {
      setNotificacoes(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleDownloadDocumento = (anexo: { nome: string; url: string }) => {
    // Implementação completa do download
    const link = document.createElement('a');
    link.href = anexo.url;
    link.download = anexo.nome;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFormularioValido = Object.keys(erros).length === 0;

  const exportarParaExcel = () => {
    // Implementação completa da exportação para Excel
    console.log("Exportando relatório para Excel...");
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      {/* Cabeçalho e Filtros */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold texto-escuro">Notificações</h1>
        <Button 
          onClick={() => {
            setNotificacaoEditando({ ...novaNotificacaoPadrao });
            setIsModalOpen(true);
            setErros({});
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Notificação
        </Button>
      </div>

      {/* Seção de Filtros e Exportação */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex-1">
          <SearchInput
            placeholder="Buscar notificação..."
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
            <SelectItem value="processo">Processo</SelectItem>
            <SelectItem value="prazo">Prazo</SelectItem>
            <SelectItem value="audiencia">Audiência</SelectItem>
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
            <SelectItem value="nao_lida">Não lida</SelectItem>
            <SelectItem value="lida">Lida</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          onClick={exportarParaExcel} 
          className="flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Exportar Relatório
        </Button>
        <Input
          type="date"
          value={filtros.data}
          onChange={(e) => setFiltros(prev => ({ ...prev, data: e.target.value }))}
          placeholder="Filtrar por data"
        />
      </div>

      {/* Listagem de Notificações */}
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
              {/* Alerta de prazo próximo */}
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
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(notificacao.status)}`}>
                    {notificacao.status.toUpperCase()}
                  </span>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVisualizar(notificacao)}
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNotificacaoEditando(notificacao);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApagar(notificacao.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Corpo do Card */}
              <div className="space-y-2">
                <p className="text-sm mb-4 line-clamp-3">{notificacao.descricao}</p>
                
                <div className="flex items-center gap-2 text-sm">
                  <Gavel className="w-4 h-4" />
                  <span>{notificacao.tribunal}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <CalendarClock className="w-4 h-4" />
                  <span>Prazo: {formatarData(notificacao.prazo)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPrioridadeBadge(notificacao.prioridade)}`}>
                    Prioridade: {notificacao.prioridade.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação/Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {notificacaoEditando?.id ? 'Editar Notificação' : 'Nova Notificação'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <Input
                label="Número do Processo *"
                value={notificacaoEditando?.numeroProcesso || ''}
                onChange={(e) => setNotificacaoEditando(prev => ({
                  ...prev!,
                  numeroProcesso: e.target.value
                }))}
                error={erros.numeroProcesso}
              />

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
                  <SelectItem value="citação">Citação</SelectItem>
                  <SelectItem value="notificação">Notificação</SelectItem>
                  <SelectItem value="diligência">Diligência</SelectItem>
                </SelectContent>
              </Select>

              <Input
                label="Tribunal *"
                value={notificacaoEditando?.tribunal || ''}
                onChange={(e) => setNotificacaoEditando(prev => ({
                  ...prev!,
                  tribunal: e.target.value
                }))}
              />

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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Partes Envolvidas</label>
                <div className="space-y-2">
                  {notificacaoEditando?.partesEnvolvidas.map((parte, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={parte}
                        onChange={(e) => {
                          const novasPartes = [...notificacaoEditando!.partesEnvolvidas];
                          novasPartes[index] = e.target.value;
                          setNotificacaoEditando(prev => ({
                            ...prev!,
                            partesEnvolvidas: novasPartes
                          }));
                        }}
                        placeholder="Nome da parte"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoverParte(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={handleAdicionarParte}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Parte
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea
                  value={notificacaoEditando?.descricao || ''}
                  onChange={(e) => setNotificacaoEditando(prev => ({
                    ...prev!,
                    descricao: e.target.value
                  }))}
                  rows={4}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Anexos</label>
                <div className="space-y-2">
                  {notificacaoEditando?.anexos.map((anexo, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{anexo.nome}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocumento(anexo)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoverAnexo(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <input
                    type="file"
                    id="upload-anexo"
                    className="hidden"
                    onChange={handleFileUpload}
                    multiple
                  />
                  <label
                    htmlFor="upload-anexo"
                    className="btn-primary flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Adicionar Anexos
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {notificacaoEditando?.id ? 'Atualizar Notificação' : 'Criar Notificação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <div className="text-2xl font-bold texto-escuro">Detalhes da Notificação</div>
          </DialogHeader>

          {notificacaoSelecionada && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="font-medium texto-escuro">Número do Processo:</label>
                  <p className="texto-escuro">{notificacaoSelecionada.numeroProcesso}</p>
                </div>
                <div>
                  <label className="font-medium texto-escuro">Tipo:</label>
                  <p className="texto-escuro">{notificacaoSelecionada.tipo}</p>
                </div>
                <div>
                  <label className="font-medium texto-escuro">Tribunal:</label>
                  <p className="texto-escuro">{notificacaoSelecionada.tribunal}</p>
                </div>
                <div>
                  <label className="font-medium texto-escuro">Data da Notificação:</label>
                  <p className="texto-escuro">{formatarData(notificacaoSelecionada.dataNotificacao)}</p>
                </div>
                <div>
                  <label className="font-medium texto-escuro">Prazo:</label>
                  <p className={`texto-escuro ${isPrazoProximo(notificacaoSelecionada.prazo) ? 'text-red-500' : ''}`}>
                    {formatarData(notificacaoSelecionada.prazo)}
                  </p>
                </div>
                <div>
                  <label className="font-medium texto-escuro">Status:</label>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(notificacaoSelecionada.status)}`}>
                    {notificacaoSelecionada.status}
                  </span>
                </div>
                <div>
                  <label className="font-medium texto-escuro">Prioridade:</label>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs ${getPrioridadeBadge(notificacaoSelecionada.prioridade)}`}>
                    {notificacaoSelecionada.prioridade}
                  </span>
                </div>
              </div>

              <div>
                <div>
                  <label className="font-medium texto-escuro">Partes Envolvidas:</label>
                  <div className="mt-2 space-y-2">
                    {notificacaoSelecionada.partesEnvolvidas.map((parte, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="texto-escuro">{parte}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="font-medium texto-escuro">Descrição:</label>
                  <p className="texto-escuro mt-2">{notificacaoSelecionada.descricao}</p>
                </div>

                {notificacaoSelecionada.anexos.length > 0 && (
                  <div className="mt-4">
                    <label className="font-medium texto-escuro">Anexos:</label>
                    <div className="mt-2 space-y-2">
                      {notificacaoSelecionada.anexos.map((anexo, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="texto-escuro">{anexo.nome}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadDocumento(anexo)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}