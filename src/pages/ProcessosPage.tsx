import { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


type Processo = {
  identificador: number;
  numeroProcesso: string;
  cliente: string;
  descricao: string;
  status: 'ativo' | 'arquivado' | 'concluido';
  dataInicio: string;
  prazoFinal: string;
  responsavel: string;
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
    responsavel: "Dra. Ana Mondlane"
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

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold texto-escuro">Gestão de Processos Jurídicos</h1>
        <Button onClick={() => { setProcessoEmEdicao(null); setModalAberto(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Processo
        </Button>
      </div>

      {/* Seção de Filtros e Exportação */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar processo..."
            className="pl-10 w-full card-juridico p-3"
            value={filtros.termoBusca}
            onChange={(e) => setFiltros(prev => ({ 
              ...prev, 
              termoBusca: e.target.value 
            }))}
          />
        </div>
        
        <select
          className="card-juridico p-3"
          value={filtros.statusSelecionado}
          onChange={(e) => setFiltros(prev => ({ 
            ...prev, 
            statusSelecionado: e.target.value 
          }))}
        >
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="arquivado">Arquivado</option>
          <option value="concluido">Concluído</option>
        </select>

        <input
          type="date"
          className="card-juridico p-3"
          value={filtros.dataSelecionada}
          onChange={(e) => setFiltros(prev => ({ 
            ...prev, 
            dataSelecionada: e.target.value 
          }))}
        />

        <Button 
          onClick={exportarParaExcel} 
          className="flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
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
                          setProcessoEmEdicao(processo); 
                          setModalAberto(true); 
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => excluirProcesso(processo.identificador)}
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

      {/* Modal de Edição/Criação */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {processoEmEdicao ? 'Editar Processo Jurídico' : 'Cadastrar Novo Processo'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
            
            <Input
              label="Descrição *"
              value={processoEmEdicao?.descricao || ''}
              onChange={e => setProcessoEmEdicao(prev => ({ 
                ...prev!, 
                descricao: e.target.value 
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
              label="Data de Início *"
              type="date"
              value={processoEmEdicao?.dataInicio || ''}
              onChange={e => setProcessoEmEdicao(prev => ({ 
                ...prev!, 
                dataInicio: e.target.value 
              }))}
            />
            
            <Input
              label="Responsável *"
              value={processoEmEdicao?.responsavel || ''}
              onChange={e => setProcessoEmEdicao(prev => ({ 
                ...prev!, 
                responsavel: e.target.value 
              }))}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setModalAberto(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => salvarProcesso(processoEmEdicao!)}
              disabled={!processoEmEdicao?.numeroProcesso}
            >
              {processoEmEdicao ? 'Atualizar Processo' : 'Cadastrar Processo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}