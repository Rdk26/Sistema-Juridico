import { useState, useEffect } from 'react';
import {  
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Eye,
  Upload,
  FileText,
  File
} from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { SearchInput } from '../components/ui/SearchInput';
import { Label } from '../components/ui/Label';


type Processo = {
  identificador: number;
  numeroProcesso: string;
  cliente: string;
  descricao: string;
  status: 'ativo' | 'arquivado' | 'concluido';
  dataInicio: string;
  prazoFinal: string;
  responsavel: string;
  documentos: {
    nome: string;
    url: string;
    tipo: string;
    dataUpload: string;
  }[];
};

const processosMock: Processo[] = [
  {
    identificador: 1,
    numeroProcesso: "001/2024/TJCM",
    cliente: "Moza Holdings",
    descricao: "Ação de Divórcio Consensual",
    status: "ativo",
    dataInicio: "2024-03-01",
    prazoFinal: "2024-06-30",
    responsavel: "Dra. Ana Mondlane",
    documentos: []
  },
  // ... outros processos
];

export default function PaginaDeProcessos() {
  const [listaProcessos, setListaProcessos] = useState<Processo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtros, setFiltros] = useState({
    termoBusca: '',
    statusSelecionado: 'todos',
    dataSelecionada: ''
  });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(5);
  const [ordenacao, setOrdenacao] = useState<{ 
    campo: keyof Processo; 
    direcao: 'ascendente' | 'descendente' 
  }>({
    campo: 'numeroProcesso',
    direcao: 'ascendente'
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [processoEmEdicao, setProcessoEmEdicao] = useState<Processo | null>(null);
  const [documentos, setDocumentos] = useState<File[]>([]);
  const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false);
  const [processoSelecionado, setProcessoSelecionado] = useState<Processo | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setListaProcessos(processosMock);
      setCarregando(false);
    }, 1500);
  }, []);

  const processosFiltrados = listaProcessos.filter(processo => {
    const correspondeTermoBusca = 
      processo.numeroProcesso.toLowerCase().includes(filtros.termoBusca.toLowerCase()) ||
      processo.cliente.toLowerCase().includes(filtros.termoBusca.toLowerCase());

    const correspondeStatus = 
      filtros.statusSelecionado === 'todos' || 
      processo.status === filtros.statusSelecionado;

    const correspondeData = 
      !filtros.dataSelecionada || 
      processo.dataInicio === filtros.dataSelecionada;

    return correspondeTermoBusca && correspondeStatus && correspondeData;
  });

  const processosOrdenados = [...processosFiltrados].sort((primeiro, segundo) => {
    const valorPrimeiro = primeiro[ordenacao.campo];
    const valorSegundo = segundo[ordenacao.campo];
    
    if (valorPrimeiro < valorSegundo) {
      return ordenacao.direcao === 'ascendente' ? -1 : 1;
    }
    if (valorPrimeiro > valorSegundo) {
      return ordenacao.direcao === 'ascendente' ? 1 : -1;
    }
    return 0;
  });

  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const processosPaginaAtual = processosOrdenados.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(processosFiltrados.length / itensPorPagina);

  const manipularOrdenacao = (campo: keyof Processo) => {
    setOrdenacao(estadoAnterior => ({
      campo,
      direcao: estadoAnterior.campo === campo && estadoAnterior.direcao === 'ascendente' 
        ? 'descendente' 
        : 'ascendente'
    }));
  };

  const exportarParaExcel = async () => {
    const pastaTrabalho = new ExcelJS.Workbook();
    const planilha = pastaTrabalho.addWorksheet('Processos');
    
    planilha.columns = [
      { header: 'Número do Processo', key: 'numeroProcesso' },
      { header: 'Cliente', key: 'cliente' },
      { header: 'Descrição', key: 'descricao' },
      { header: 'Status', key: 'status' },
      { header: 'Data de Início', key: 'dataInicio' },
      { header: 'Responsável', key: 'responsavel' }
    ];

    processosFiltrados.forEach(processo => {
      planilha.addRow(processo);
    });

    const buffer = await pastaTrabalho.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, 'processos.xlsx');
  };

  const salvarProcesso = (processo: Processo) => {
    if (processo.identificador) {
      setListaProcessos(listaAnterior => listaAnterior.map(p => 
        p.identificador === processo.identificador ? processo : p
      ));
    } else {
      setListaProcessos(listaAnterior => [...listaAnterior, { 
        ...processo, 
        identificador: Date.now() 
      }]);
    }
    setModalAberto(false);
  };

  const excluirProcesso = (identificador: number) => {
    setListaProcessos(listaAnterior => 
      listaAnterior.filter(p => p.identificador !== identificador)
    );
  };

  const obterEstiloStatus = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-blue-100 text-blue-800';
      case 'arquivado': return 'bg-gray-100 text-gray-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      default: return '';
    }
  };

  const calcularMetricas = () => ({
    processosAtivos: listaProcessos.filter(p => p.status === 'ativo').length,
    prazoMedio: '45 dias',
    taxaSucesso: '82%'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocumentos(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    // Aqui você implementaria a lógica de upload real
    console.log('Uploading files:', documentos);
    setDocumentos([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (processoEmEdicao) {
      salvarProcesso(processoEmEdicao);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-blue-100 text-blue-800';
      case 'arquivado': return 'bg-gray-100 text-gray-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      default: return '';
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold texto-escuro">Gestão de Processos Jurídicos</h1>
        <Button 
          onClick={() => { setProcessoEmEdicao(null); setModalAberto(true); }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Processo
        </Button>
      </div>

      {/* Seção de Filtros e Exportação */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex-1">
          <SearchInput
            placeholder="Buscar processo..."
            value={filtros.termoBusca}
            onChange={(e) => setFiltros(prev => ({ 
              ...prev, 
              termoBusca: e.target.value 
            }))}
          />
        </div>
        
        <Select
          value={filtros.statusSelecionado}
          onValueChange={(value) => setFiltros(prev => ({ 
            ...prev, 
            statusSelecionado: value 
          }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="arquivado">Arquivado</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filtros.dataSelecionada}
          onChange={(e) => setFiltros(prev => ({ 
            ...prev, 
            dataSelecionada: e.target.value 
          }))}
        />

        <Button 
          onClick={exportarParaExcel}
          className="btn-primary"
        >
          <Download className="w-4 h-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Cartões de Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card-juridico p-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="w-8 h-8 text-blue-600" />
            <div>
              <p className="texto-escuro text-lg font-semibold">Processos Ativos</p>
              <p className="text-4xl font-bold">{calcularMetricas().processosAtivos}</p>
            </div>
          </div>
        </div>
        
        <div className="card-juridico p-6">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-purple-600" />
            <div>
              <p className="texto-escuro text-lg font-semibold">Prazo Médio</p>
              <p className="text-4xl font-bold">{calcularMetricas().prazoMedio}</p>
            </div>
          </div>
        </div>
        
        <div className="card-juridico p-6">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="texto-escuro text-lg font-semibold">Taxa de Sucesso</p>
              <p className="text-4xl font-bold">{calcularMetricas().taxaSucesso}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Processos */}
      {carregando ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, indice) => (
            <Skeleton key={indice} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="card-juridico p-6">
          <table className="tabela-juridica w-full">
            <thead>
              <tr>
                {['numeroProcesso', 'cliente', 'descricao', 'status', 'dataInicio', 'responsavel'].map((campo) => (
                  <th 
                    key={campo} 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => manipularOrdenacao(campo as keyof Processo)}
                  >
                    <div className="flex items-center gap-1">
                      {campo.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      {ordenacao.campo === campo && (
                        ordenacao.direcao === 'ascendente' 
                          ? <ChevronUp className="w-4 h-4" /> 
                          : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                ))}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {processosPaginaAtual.map(processo => (
                <tr key={processo.identificador} className="hover:bg-gray-50">
                  <td>{processo.numeroProcesso}</td>
                  <td>{processo.cliente}</td>
                  <td className="max-w-xs truncate">{processo.descricao}</td>
                  <td>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs ${obterEstiloStatus(processo.status)}`}>
                      {processo.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(processo.dataInicio).toLocaleDateString('pt-MZ')}</td>
                  <td>{processo.responsavel}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProcessoSelecionado(processo);
                          setIsDetalhesModalOpen(true);
                        }}
                        className="btn-outline"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProcessoEmEdicao(processo);
                          setModalAberto(true);
                        }}
                        className="btn-outline"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => excluirProcesso(processo.identificador)}
                        className="btn-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Controles de Paginação */}
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Exibindo {indicePrimeiroItem + 1} - {Math.min(indiceUltimoItem, processosFiltrados.length)} de {processosFiltrados.length}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual(pagina => pagina - 1)}
              >
                Anterior
              </Button>
              <Button 
                variant="outline" 
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPaginaAtual(pagina => pagina + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      <Dialog open={isDetalhesModalOpen} onOpenChange={setIsDetalhesModalOpen}>
        <DialogContent className="sm:max-w-[800px] p-4 md:p-6">
          <DialogHeader>
            <DialogTitle>
              <div className="text-xl font-bold mb-4">
                Detalhes do Processo: {processoSelecionado?.numeroProcesso}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4 md:space-y-6">
              <div className="card-juridico p-4">
                <h3 className="text-base font-semibold mb-3">Informações Principais</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Número do Processo:</span>
                    <span>{processoSelecionado?.numeroProcesso}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Cliente:</span>
                    <span>{processoSelecionado?.cliente}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusStyle(processoSelecionado?.status || 'ativo')}`}>
                      {processoSelecionado?.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Responsável:</span>
                    <span>{processoSelecionado?.responsavel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Data de Início:</span>
                    <span>
                      {processoSelecionado?.dataInicio 
                        ? new Date(processoSelecionado.dataInicio).toLocaleDateString('pt-MZ') 
                        : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Prazo Final:</span>
                    <span>
                      {processoSelecionado?.prazoFinal 
                        ? new Date(processoSelecionado.prazoFinal).toLocaleDateString('pt-MZ') 
                        : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-juridico p-4">
                <h3 className="text-base font-semibold mb-3">Descrição</h3>
                <p className="text-gray-600">{processoSelecionado?.descricao}</p>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="card-juridico p-4">
                <h3 className="text-base font-semibold mb-3">Documentos</h3>
                {processoSelecionado?.documentos && processoSelecionado.documentos.length > 0 ? (
                  <div className="space-y-2">
                    {processoSelecionado.documentos.map((documento) => (
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
                    Não há documentos associados a este processo
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

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-[800px] p-6">
          <DialogHeader>
            <DialogTitle>
              {processoEmEdicao ? 'Editar Processo' : 'Novo Processo'}
            </DialogTitle>
            <DialogDescription>
              {processoEmEdicao 
                ? 'Edite as informações do processo' 
                : 'Preencha as informações para criar um novo processo'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Número do Processo *"
                value={processoEmEdicao?.numeroProcesso || ''}
                onChange={e => setProcessoEmEdicao(prev => ({ 
                  ...prev!, 
                  numeroProcesso: e.target.value 
                }))}
              />
              
              <Input
                label="Cliente *"
                value={processoEmEdicao?.cliente || ''}
                onChange={e => setProcessoEmEdicao(prev => ({ 
                  ...prev!, 
                  cliente: e.target.value 
                }))}
              />
              
              <Select
                value={processoEmEdicao?.status || 'ativo'}
                onValueChange={valor => setProcessoEmEdicao(prev => ({ 
                  ...prev!, 
                  status: valor as 'ativo' | 'arquivado' | 'concluido' 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="arquivado">Arquivado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                label="Responsável *"
                value={processoEmEdicao?.responsavel || ''}
                onChange={e => setProcessoEmEdicao(prev => ({ 
                  ...prev!, 
                  responsavel: e.target.value 
                }))}
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Descrição *"
                value={processoEmEdicao?.descricao || ''}
                onChange={e => setProcessoEmEdicao(prev => ({ 
                  ...prev!, 
                  descricao: e.target.value 
                }))}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Data de Início *"
                  type="date"
                  value={processoEmEdicao?.dataInicio || ''}
                  onChange={e => setProcessoEmEdicao(prev => ({ 
                    ...prev!, 
                    dataInicio: e.target.value 
                  }))}
                />
                
                <Input
                  label="Prazo Final"
                  type="date"
                  value={processoEmEdicao?.prazoFinal || ''}
                  onChange={e => setProcessoEmEdicao(prev => ({ 
                    ...prev!, 
                    prazoFinal: e.target.value 
                  }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Documentos</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button type="button" onClick={handleUpload}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              {documentos.length > 0 && (
                <div className="mt-2 space-y-2">
                  {documentos.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const novosDocs = documentos.filter((_, i) => i !== index);
                          setDocumentos(novosDocs);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalAberto(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {processoEmEdicao ? 'Salvar Alterações' : 'Criar Processo'}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}