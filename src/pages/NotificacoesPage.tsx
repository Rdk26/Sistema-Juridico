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
  Download
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
  const [notificacaoVisualizando, setNotificacaoVisualizando] = useState<Notificacao | null>(null);
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [abaAtiva, setAbaAtiva] = useState('dados');

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
    const matchesTexto = notificacao.numeroProcesso.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      notificacao.descricao.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      notificacao.tribunal.toLowerCase().includes(filtroTexto.toLowerCase());

    const matchesTipo = filtroTipo === 'todos' || notificacao.tipo === filtroTipo;
    const matchesStatus = filtroStatus === 'todos' || notificacao.status === filtroStatus;
    const matchesData = !filtroData || notificacao.dataNotificacao === filtroData;

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
    setNotificacaoVisualizando(notificacao);
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

      {/* Modal de Edição/Criação */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <div className="text-2xl font-bold">
              <DialogTitle>
                {notificacaoEditando?.id === 0 ? 'Nova Notificação' : 'Editar Notificação'}
              </DialogTitle>
            </div>
          </DialogHeader>

          <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="dados">Dados Principais</TabsTrigger>
              <TabsTrigger value="anexos">Anexos</TabsTrigger>
            </TabsList>

            <TabsContent value="dados">
              <div className="grid gap-4 py-4">
                <Input
                  label="Número do Processo *"
                  value={notificacaoEditando?.numeroProcesso || ''}
                  onChange={(e) => {
                    setErros(prev => ({ ...prev, numeroProcesso: '' }));
                    setNotificacaoEditando(prev => ({
                      ...(prev || novaNotificacaoPadrao),
                      numeroProcesso: e.target.value
                    }));
                  }}
                  className={erros.numeroProcesso ? 'border-red-500' : ''}
                />

                <Textarea
                  label="Descrição *"
                  value={notificacaoEditando?.descricao || ''}
                  onChange={(e) => {
                    setErros(prev => ({ ...prev, descricao: '' }));
                    setNotificacaoEditando(prev => ({
                      ...prev!,
                      descricao: e.target.value
                    }));
                  }}
                  className={erros.descricao ? 'border-red-500' : ''}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      label="Tipo *"
                      className="hidden"
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
                        <SelectItem value="notificação">Notificação</SelectItem>
                        <SelectItem value="citação">Citação</SelectItem>
                        <SelectItem value="diligência">Diligência</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Input
                      label="Prioridade *"
                      className="hidden"
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
                    className={erros.dataNotificacao ? 'border-red-500' : ''}
                  />

                  <Input
                    label="Prazo *"
                    type="date"
                    value={notificacaoEditando?.prazo || ''}
                    onChange={(e) => {
                      setErros(prev => ({ ...prev, prazo: '' }));
                      setNotificacaoEditando(prev => ({
                        ...prev!,
                        prazo: e.target.value
                      }));
                    }}
                    className={erros.prazo ? 'border-red-500' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    label="Partes Envolvidas"
                    className="hidden"
                  />
                  <div className="card-juridico p-4 flex flex-wrap gap-2">
                    {notificacaoEditando?.partesEnvolvidas.map((parte, index) => (
                      <div key={index} className="bg-gray-50 px-2 py-1 rounded-full flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <input
                          value={parte}
                          onChange={(e) => {
                            setNotificacaoEditando(prev => {
                              if (!prev) return null;
                              const novasPartes = [...prev.partesEnvolvidas];
                              novasPartes[index] = e.target.value;
                              return { ...prev, partesEnvolvidas: novasPartes };
                            });
                          }}
                          className="bg-transparent outline-none text-sm"
                        />
                        <button
                          onClick={() => handleRemoverParte(index)}
                          className="text-red-500 hover:text-red-700 ml-1"
                        >
                          <Trash2 className="w-4 h-4" />
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

                <div className="space-y-2">
                  <Input
                    label="Status *"
                    className="hidden"
                  />
                  <Select
                    value={notificacaoEditando?.status || 'pendente'}
                    onValueChange={(value) => setNotificacaoEditando(prev => ({
                      ...prev!,
                      status: value as 'pendente' | 'cumprida' | 'expirada'
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="cumprida">Cumprida</SelectItem>
                      <SelectItem value="expirada">Expirada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  label="Tribunal *"
                  value={notificacaoEditando?.tribunal || ''}
                  onChange={(e) => {
                    setErros(prev => ({ ...prev, tribunal: '' }));
                    setNotificacaoEditando(prev => ({
                      ...prev!,
                      tribunal: e.target.value
                    }));
                  }}
                  className={erros.tribunal ? 'border-red-500' : ''}
                />
              </div>
            </TabsContent>

            <TabsContent value="anexos">
              <div className="space-y-4 py-4">
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
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadDocumento(anexo)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoverAnexo(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsModalOpen(false);
                setNotificacaoEditando(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormularioValido}
              className="relative"
            >
              {notificacaoEditando?.id === 0 ? 'Criar Notificação' : 'Salvar Alterações'}
              {!isFormularioValido && (
                <span className="absolute -right-2 -top-2 animate-ping inline-flex h-5 w-5 rounded-full bg-red-400 opacity-75"></span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização */}
      <Dialog open={!!notificacaoVisualizando} onOpenChange={() => setNotificacaoVisualizando(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="text-2xl font-bold">
              <DialogTitle>Detalhes da Notificação</DialogTitle>
            </div>
          </DialogHeader>
          
          {notificacaoVisualizando && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Input label="Número do Processo" className="hidden" />
                  <p className="text-gray-600">{notificacaoVisualizando.numeroProcesso}</p>
                </div>

                <div>
                  <Input label="Status" className="hidden" />
                  <p className={`${getStatusColor(notificacaoVisualizando.status)} px-2 py-1 rounded-full text-xs`}>
                    {notificacaoVisualizando.status.toUpperCase()}
                  </p>
                </div>

                <div>
                  <Input label="Tipo" className="hidden" />
                  <p className="text-gray-600">{notificacaoVisualizando.tipo}</p>
                </div>

                <div>
                  <Input label="Prioridade" className="hidden" />
                  <p className="text-gray-600">{notificacaoVisualizando.prioridade}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Input label="Data da Notificação" className="hidden" />
                  <p className="text-gray-600">{formatarData(notificacaoVisualizando.dataNotificacao)}</p>
                </div>

                <div>
                  <Input label="Prazo" className="hidden" />
                  <p className="text-gray-600">{formatarData(notificacaoVisualizando.prazo)}</p>
                </div>

                <div>
                  <Input label="Tribunal" className="hidden" />
                  <p className="text-gray-600">{notificacaoVisualizando.tribunal}</p>
                </div>
              </div>

              {/* Seções para Partes Envolvidas e Anexos */}
              <div className="col-span-2 space-y-4">
                {notificacaoVisualizando.partesEnvolvidas.length > 0 && (
                  <div>
                    <Input label="Partes Envolvidas" className="hidden" />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {notificacaoVisualizando.partesEnvolvidas.map((parte, index) => (
                        <div key={index} className="bg-gray-100 px-2 py-1 rounded">
                          <span className="text-xs">{parte}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {notificacaoVisualizando.anexos.length > 0 && (
                  <div>
                    <Input label="Anexos" className="hidden" />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {notificacaoVisualizando.anexos.map((anexo, index) => (
                        <div key={index} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-2">
                          <FileText className="w-3 h-3" />
                          <span className="text-xs">{anexo.nome}</span>
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