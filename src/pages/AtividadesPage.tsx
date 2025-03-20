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
  Download,
  FileText,
  Upload,
  Eye,
  Activity,
  File
} from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';

interface Atividade {
  id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  prioridade: 'baixa' | 'media' | 'alta';
  responsavel: string;
  dataPrevista: string;
  dataConclusao?: string;
  documentos: {
    id: string;
    nome: string;
    url: string;
    dataUpload: string;
  }[];
  historicoAtualizacoes: {
    id: string;
    usuario: string;
    data: string;
    status: string;
    comentario: string;
  }[];
}

const atividadesMock: Atividade[] = [
  {
    id: '1',
    titulo: 'Audiência Preliminar',
    descricao: 'Audiência para discussão de preliminares',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Carlos Mahumane',
    dataPrevista: '2024-04-15',
    documentos: [
      {
        id: '1',
        nome: 'Petição Inicial.pdf',
        url: '/documentos/peticao-inicial.pdf',
        dataUpload: '2024-03-20'
      }
    ],
    historicoAtualizacoes: []
  },
  {
    id: '2',
    titulo: 'Elaboração de Petição',
    descricao: 'Petição inicial para ação de divórcio',
    status: 'concluida',
    prioridade: 'media',
    responsavel: 'Ana Mondlane',
    dataPrevista: '2024-03-28',
    dataConclusao: '2024-03-25',
    documentos: [],
    historicoAtualizacoes: []
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
  const [atividades, setAtividades] = useState<Atividade[]>(atividadesMock);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<Atividade | null>(null);
  const [atividadeEditando, setAtividadeEditando] = useState<Atividade | null>(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [documentosTemporarios, setDocumentosTemporarios] = useState<Array<{
    id: string;
    nome: string;
    url: string;
    dataUpload: string;
  }>>([]);
  const [filtros, setFiltros] = useState({
    status: 'todos',
    prioridade: 'todos',
    tipo: 'todos',
    termoBusca: ''
  });

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = () => {
    if (atividadeEditando) {
      if (atividadeEditando.id) {
        // Atualizar atividade existente
        setAtividades(prev => prev.map(a => 
          a.id === atividadeEditando.id ? {
            ...atividadeEditando,
            documentos: documentosTemporarios.map(doc => ({
              id: doc.id,
              nome: doc.nome,
              url: doc.url,
              dataUpload: doc.dataUpload
            })),
            historicoAtualizacoes: atividadeEditando.historicoAtualizacoes
          } : a
        ));
      } else {
        // Criar nova atividade
        const novaAtividade: Atividade = {
          ...atividadeEditando,
          id: Date.now().toString(),
          status: 'pendente' as const,
          documentos: documentosTemporarios.map(doc => ({
            id: doc.id,
            nome: doc.nome,
            url: doc.url,
            dataUpload: doc.dataUpload
          })),
          historicoAtualizacoes: []
        };
        setAtividades(prev => [...prev, novaAtividade]);
      }
    }
    setIsModalOpen(false);
    setAtividadeEditando(null);
    setDocumentosTemporarios([]);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta atividade?')) {
      setAtividades(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleEdit = (atividade: Atividade) => {
    setAtividadeEditando(atividade);
    setDocumentosTemporarios(atividade.documentos.map(doc => ({
      id: doc.id,
      nome: doc.nome,
      url: doc.url,
      dataUpload: doc.dataUpload
    })));
    setIsModalOpen(true);
  };

  const handleUploadDocumento = () => {
    if (arquivoSelecionado) {
      const novoDocumento = {
        id: Date.now().toString(),
        nome: arquivoSelecionado.name,
        url: URL.createObjectURL(arquivoSelecionado),
        dataUpload: new Date().toISOString().split('T')[0]
      };

      setDocumentosTemporarios(prev => [...prev, novoDocumento]);
      setArquivoSelecionado(null);
    }
  };

  const handleExcluirDocumentoTemporario = (id: string) => {
    setDocumentosTemporarios(prev => prev.filter(doc => doc.id !== id));
  };

  const handleVisualizarDocumento = (url: string) => {
    window.open(url, '_blank');
  };

  const handleExcluirDocumento = (id: string) => {
    if (atividadeSelecionada) {
      setAtividades(prev => prev.map(a => 
        a.id === id ? {
          ...a,
          documentos: a.documentos.filter(doc => doc.id !== id),
          historicoAtualizacoes: a.historicoAtualizacoes.filter(hist => hist.id !== id)
        } : a
      ));
    }
  };

  const handleVisualizarDetalhes = (atividade: Atividade) => {
    setAtividadeSelecionada(atividade);
    setIsDetalhesModalOpen(true);
  };

  const marcarComoConcluida = (id: string) => {
    setAtividades(prev => prev.map(a => 
      a.id === id ? {
        ...a,
        status: 'concluida' as const,
        dataConclusao: new Date().toISOString().split('T')[0]
      } : a
    ));
  };

  const atividadesFiltradas = atividades.filter(atividade => {
    return (
      (filtros.status === 'todos' || atividade.status === filtros.status) &&
      (filtros.prioridade === 'todos' || atividade.prioridade === filtros.prioridade) &&
      (filtros.termoBusca === '' || 
        atividade.titulo.toLowerCase().includes(filtros.termoBusca.toLowerCase()) ||
        atividade.descricao.toLowerCase().includes(filtros.termoBusca.toLowerCase()) ||
        atividade.responsavel.toLowerCase().includes(filtros.termoBusca.toLowerCase()))
    );
  });

  const metricas = {
    total: atividades.length,
    concluidas: atividades.filter(a => a.status === 'concluida').length,
    atrasadas: atividades.filter(a => 
      new Date(a.dataPrevista) < new Date() && a.status !== 'concluida'
    ).length
  };

  const exportarParaExcel = () => {
    // Implemente a lógica para exportar para Excel
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold texto-escuro flex items-center gap-3">
          <Activity className="w-8 h-8" />
          Atividades
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gerencie suas atividades e acompanhe o progresso.
        </p>
      </div>

      {/* Filtros e Busca */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Select
          value={filtros.status}
          onValueChange={value => setFiltros(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="concluida">Concluída</SelectItem>
            <SelectItem value="atrasada">Atrasada</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filtros.prioridade}
          onValueChange={value => setFiltros(prev => ({ ...prev, prioridade: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filtros.tipo}
          onValueChange={value => setFiltros(prev => ({ ...prev, tipo: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="audiencia">Audiência</SelectItem>
            <SelectItem value="peticao">Petição</SelectItem>
            <SelectItem value="diligencia">Diligência</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>

        <SearchInput
          placeholder="Buscar atividades..."
          value={filtros.termoBusca}
          onChange={(e) => setFiltros(prev => ({ ...prev, termoBusca: e.target.value }))}
        />
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => {
            setAtividadeEditando({
              id: '',
              titulo: '',
              descricao: '',
              status: 'pendente',
              prioridade: 'media',
              responsavel: '',
              dataPrevista: '',
              documentos: [],
              historicoAtualizacoes: []
            });
            setDocumentosTemporarios([]);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Atividade
        </Button>

        <Button
          onClick={exportarParaExcel}
          variant="outline"
          className="btn-outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVisualizarDetalhes(atividade)}
                    className="btn-outline"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {atividade.status !== 'concluida' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(atividade)}
                        className="btn-outline"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-100 hover:bg-green-50"
                        onClick={() => marcarComoConcluida(atividade.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(atividade.id)}
                    className="btn-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={isDetalhesModalOpen} onOpenChange={setIsDetalhesModalOpen}>
        <DialogContent className="sm:max-w-[800px] p-4 md:p-6">
          <DialogHeader>
            <DialogTitle>
              <div className="text-xl font-bold mb-4">
                Detalhes da Atividade: {atividadeSelecionada?.titulo}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4 md:space-y-6">
              <div className="card-juridico p-4">
                <h3 className="text-base font-semibold mb-3">Informações Principais</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Título:</span>
                    <span>{atividadeSelecionada?.titulo}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusStyle(atividadeSelecionada?.status || 'pendente')}`}>
                      {atividadeSelecionada?.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Prioridade:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs ${getPrioridadeStyle(atividadeSelecionada?.prioridade || 'media')}`}>
                      {atividadeSelecionada?.prioridade.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Responsável:</span>
                    <span>{atividadeSelecionada?.responsavel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Data Prevista:</span>
                    <span>
                      {atividadeSelecionada?.dataPrevista 
                        ? new Date(atividadeSelecionada.dataPrevista).toLocaleDateString('pt-MZ') 
                        : ''}
                    </span>
                  </div>
                  {atividadeSelecionada?.dataConclusao && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Data de Conclusão:</span>
                      <span>
                        {new Date(atividadeSelecionada.dataConclusao).toLocaleDateString('pt-MZ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-juridico p-4">
                <h3 className="text-base font-semibold mb-3">Descrição</h3>
                <p className="text-gray-600">{atividadeSelecionada?.descricao}</p>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="card-juridico p-4">
                <h3 className="text-base font-semibold mb-3">Documentos</h3>
                {atividadeSelecionada?.documentos && atividadeSelecionada.documentos.length > 0 ? (
                  <div className="space-y-2">
                    {atividadeSelecionada.documentos.map((documento) => (
                      <div key={documento.nome} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium">{documento.nome}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(documento.dataUpload).toLocaleDateString('pt-MZ')}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (documento.nome.toLowerCase().endsWith('.pdf')) {
                                window.open(documento.url, '_blank');
                              } else {
                                alert('Este tipo de arquivo não pode ser visualizado diretamente');
                              }
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = documento.url;
                              link.download = documento.nome;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 border rounded-lg text-center text-gray-500">
                    Não há documentos associados a esta atividade
                  </div>
                )}
              </div>

              <div className="card-juridico p-4">
                <h3 className="text-base font-semibold mb-3">Histórico de Atualizações</h3>
                {atividadeSelecionada?.historicoAtualizacoes && atividadeSelecionada.historicoAtualizacoes.length > 0 ? (
                  <div className="space-y-2">
                    {atividadeSelecionada.historicoAtualizacoes.map((atualizacao) => (
                      <div key={atualizacao.id} className="p-2 border rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{atualizacao.usuario}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(atualizacao.data).toLocaleDateString('pt-MZ')}
                            </div>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusStyle(atualizacao.status)}`}>
                            {atualizacao.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{atualizacao.comentario}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 border rounded-lg text-center text-gray-500">
                    Não há histórico de atualizações registrado
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <div className="mt-6">
              <Button variant="outline" onClick={() => setIsDetalhesModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição/Criação */}
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
                value={atividadeEditando?.prioridade || 'media'}
                onValueChange={value => setAtividadeEditando(prev => ({
                  ...prev!,
                  prioridade: value as 'baixa' | 'media' | 'alta'
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
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

              <Input
                label="Responsável *"
                value={atividadeEditando?.responsavel || ''}
                onChange={e => setAtividadeEditando(prev => ({
                  ...prev!,
                  responsavel: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Documentos</label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  onChange={(e) => setArquivoSelecionado(e.target.files?.[0] || null)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleUploadDocumento} 
                  disabled={!arquivoSelecionado}
                  className="btn-primary"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>

              <div className="space-y-2 mt-2">
                {documentosTemporarios.map(documento => (
                  <div key={documento.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{documento.nome}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExcluirDocumentoTemporario(documento.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="btn-outline">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!atividadeEditando?.titulo || !atividadeEditando.responsavel}
              className="btn-primary"
            >
              {atividadeEditando?.id ? 'Salvar Alterações' : 'Criar Atividade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}