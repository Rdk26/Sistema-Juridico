// pages/PessoalInternoPage.tsx
import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Briefcase, 
  Phone, 
  Calendar, 
  Table, 
  LayoutGrid,
  PieChart as PieChartIcon,
  Users,
  TrendingUp,
  Upload,
  Trash2,
  FileText,
  Edit,
  Eye,
  Download,
  Filter,
  X
} from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SearchInput } from '../components/ui/SearchInput';

type Funcionario = {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  dataContratacao: string;
  contacto: string;
  status: 'ativo' | 'inativo';
  historicoCargos: HistoricoCargo[];
  documentos: Documento[];
  nif?: string;
};

type HistoricoCargo = {
  id: number;
  cargo: string;
  departamento: string;
  dataInicio: string;
  dataFim: string | null;
};

type Documento = {
  nome: string;
  url: string;
  tipo: string;
  dataUpload: string;
};

const departamentos = ['Administração', 'Jurídico', 'Recursos Humanos', 'TI', 'Financeiro'];
const coresDepartamentos = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#8B5CF6'];

// Lista de cargos disponíveis para seleção
const cargos = [
  'Gestor de Operações',
  'Assistente Administrativo',
  'Analista Jurídico', 
  'Desenvolvedor Front-end',
  'Contador Sénior',
  'Especialista em RH',
  'Advogado Corporativo'
];

const funcionariosMock: Funcionario[] = [
  {
    id: 1,
    nome: 'Carlos Mahumane',
    cargo: 'Gestor de Operações',
    departamento: 'Administração',
    dataContratacao: '2020-03-15',
    contacto: '+258 84 123 4567',
    status: 'ativo',
    historicoCargos: [
      {
        id: 1,
        cargo: 'Assistente Administrativo',
        departamento: 'Administração',
        dataInicio: '2018-01-01',
        dataFim: '2020-03-14'
      }
    ],
    documentos: [
      {
        nome: 'Contrato de Trabalho.pdf',
        url: 'https://example.com/documentos/contrato.pdf',
        tipo: 'application/pdf',
        dataUpload: '2020-03-15'
      },
      {
        nome: 'Identificação.pdf',
        url: 'https://example.com/documentos/identificacao.pdf',
        tipo: 'application/pdf',
        dataUpload: '2020-03-15'
      }
    ],
  },
  {
    id: 2,
    nome: 'Ana Maria Mondlane',
    cargo: 'Assistente Jurídica',
    departamento: 'Jurídico',
    dataContratacao: '2022-08-01',
    contacto: '+258 82 987 6543',
    status: 'ativo',
    historicoCargos: [],
    documentos: [
      {
        nome: 'Curriculum Vitae.pdf',
        url: 'https://example.com/documentos/cv.pdf',
        tipo: 'application/pdf',
        dataUpload: '2022-07-15'
      }
    ],
  },
];

const getStatusColor = (status: string) => {
  return status === 'ativo' 
    ? 'bg-green-100 text-green-800 dark:bg-green-900/20' 
    : 'bg-red-100 text-red-800 dark:bg-red-900/20';
};

export default function PessoalInternoPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visualizacao, setVisualizacao] = useState<'tabela' | 'cards'>('tabela');
  const [filtros, setFiltros] = useState({
    termoBusca: '',
    departamento: 'todos',
    status: 'todos',
    dataInicio: '',
    dataFim: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [funcionarioEditando, setFuncionarioEditando] = useState<Funcionario>({
    id: 0,
    nome: '',
    cargo: '',
    departamento: '',
    dataContratacao: new Date().toISOString().split('T')[0],
    contacto: '',
    status: 'ativo',
    historicoCargos: [],
    documentos: [],
    nif: ''
  });
  const [clienteVisualizando, setClienteVisualizando] = useState<Funcionario | null>(null);
  const [abaAtiva, setAbaAtiva] = useState('dados');

  useEffect(() => {
    setTimeout(() => {
      setFuncionarios(funcionariosMock);
      setIsLoading(false);
    }, 1000);
  }, []);

  const funcionariosFiltrados = funcionarios.filter(funcionario => {
    const correspondeTexto = funcionario.nome.toLowerCase().includes(filtros.termoBusca.toLowerCase()) ||
      funcionario.cargo.toLowerCase().includes(filtros.termoBusca.toLowerCase()) ||
      funcionario.departamento.toLowerCase().includes(filtros.termoBusca.toLowerCase());

    const correspondeDepartamento = filtros.departamento === 'todos' || funcionario.departamento === filtros.departamento;
    const correspondeStatus = filtros.status === 'todos' || funcionario.status === filtros.status;
    const correspondeData = !filtros.dataInicio || !filtros.dataFim || 
      (new Date(funcionario.dataContratacao) >= new Date(filtros.dataInicio) &&
       new Date(funcionario.dataContratacao) <= new Date(filtros.dataFim));

    return correspondeTexto && correspondeDepartamento && correspondeStatus && correspondeData;
  });

  const handleSubmeter = (funcionario: Funcionario) => {
    const novoFuncionario = {
      ...funcionario,
      dataContratacao: funcionario.id ? funcionario.dataContratacao : new Date().toISOString().split('T')[0]
    };

    if (novoFuncionario.id) {
      setFuncionarios(anterior => anterior.map(f => f.id === novoFuncionario.id ? novoFuncionario : f));
    } else {
      setFuncionarios(anterior => [...anterior, { 
        ...novoFuncionario, 
        id: Math.max(...anterior.map(f => f.id), 0) + 1 
      }]);
    }
    setIsModalOpen(false);
    setFuncionarioEditando({
      id: 0,
      nome: '',
      cargo: '',
      departamento: '',
      dataContratacao: new Date().toISOString().split('T')[0],
      contacto: '',
      status: 'ativo',
      historicoCargos: [],
      documentos: [],
      nif: ''
    });
  };

  const handleUploadDocumento = (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivos = event.target.files;
    if (arquivos && arquivos.length > 0) {
      const novosDocumentos = Array.from(arquivos).map(arquivo => ({
        nome: arquivo.name,
        url: URL.createObjectURL(arquivo),
        tipo: arquivo.type,
        dataUpload: new Date().toISOString().split('T')[0]
      }));
      
      setFuncionarioEditando(anterior => ({
        ...anterior,
        documentos: [...anterior.documentos, ...novosDocumentos]
      }));
    }
  };

  const validarNIF = (nif: string) => {
    const nifLimpo = nif.replace(/\D/g, '');
    return /^\d{9}$/.test(nifLimpo);
  };

  const formularioValido = Boolean(
    funcionarioEditando.nome &&
    funcionarioEditando.cargo &&
    funcionarioEditando.departamento &&
    funcionarioEditando.contacto &&
    validarNIF(funcionarioEditando.nif || '') &&
    funcionarioEditando.historicoCargos.every(c => 
      c.cargo && 
      c.departamento && 
      c.dataInicio
    )
  );

  const excluirFuncionario = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      setFuncionarios(anterior => anterior.filter(f => f.id !== id));
      setIsModalOpen(false);
    }
  };

  const exportarParaExcel = () => {
    // Implemente a lógica para exportar os dados para Excel
    console.log('Exportar para Excel');
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold texto-escuro">Pessoal Interno</h1>
        <Button onClick={() => {
          setFuncionarioEditando({
            id: 0,
            nome: '',
            cargo: '',
            departamento: '',
            dataContratacao: new Date().toISOString().split('T')[0],
            contacto: '',
            status: 'ativo',
            historicoCargos: [],
            documentos: [],
            nif: ''
          });
          setIsModalOpen(true);
        }} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      {/* Seção de Filtros e Exportação */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex-1">
          <SearchInput
            placeholder="Buscar funcionário..."
            value={filtros.termoBusca}
            onChange={(e) => setFiltros(prev => ({ 
              ...prev, 
              termoBusca: e.target.value 
            }))}
          />
        </div>
        
        <Select
          value={filtros.departamento}
          onValueChange={(value) => setFiltros(prev => ({ 
            ...prev, 
            departamento: value 
          }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os departamentos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os departamentos</SelectItem>
            <SelectItem value="juridico">Jurídico</SelectItem>
            <SelectItem value="administrativo">Administrativo</SelectItem>
            <SelectItem value="financeiro">Financeiro</SelectItem>
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
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          onClick={exportarParaExcel}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card-juridico p-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm">Total de Funcionários</p>
              <p className="text-2xl font-bold">{funcionarios.length}</p>
            </div>
          </div>
        </div>

        <div className="card-juridico p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm">Taxa de Rotatividade</p>
              <p className="text-2xl font-bold">12%</p>
            </div>
          </div>
        </div>

        <div className="card-juridico p-4">
          <div className="flex items-center gap-3">
            <PieChartIcon className="w-6 h-6 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm mb-2">Distribuição por Departamento</p>
              <ResponsiveContainer width="100%" height={100}>
                <PieChart>
                  <Pie
                    data={departamentos.map((departamento) => ({
                      name: departamento,
                      value: funcionarios.filter(f => f.departamento === departamento).length
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={30}
                  >
                    {departamentos.map((_, indice) => (
                      <Cell key={indice} fill={coresDepartamentos[indice]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <Button 
          variant={visualizacao === 'tabela' ? 'default' : 'outline'} 
          onClick={() => setVisualizacao('tabela')}
          className={visualizacao === 'tabela' ? 'btn-view' : 'btn-view-outline'}
        >
          <Table className="w-4 h-4 mr-2" />
          Visualização em Tabela
        </Button>
        <Button 
          variant={visualizacao === 'cards' ? 'default' : 'outline'} 
          onClick={() => setVisualizacao('cards')}
          className={visualizacao === 'cards' ? 'btn-view' : 'btn-view-outline'}
        >
          <LayoutGrid className="w-4 h-4 mr-2" />
          Visualização em Cards
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, indice) => (
            <Skeleton key={indice} className="h-16 w-full" />
          ))}
        </div>
      ) : visualizacao === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {funcionariosFiltrados.map(funcionario => (
            <div key={funcionario.id} className="card-juridico p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {funcionario.nome[0]}
                </div>
                <div>
                  <h3 className="font-semibold">{funcionario.nome}</h3>
                  <p className="text-sm text-gray-500">{funcionario.cargo}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{funcionario.departamento}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{funcionario.contacto}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Contratação: {new Date(funcionario.dataContratacao).toLocaleDateString('pt-MZ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(funcionario.status)}`}>
                    {funcionario.status.charAt(0).toUpperCase() + funcionario.status.slice(1)}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => { 
                      setFuncionarioEditando(funcionario); 
                      setIsModalOpen(true); 
                    }}
                    className="btn-outline"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setClienteVisualizando(funcionario);
                      setIsViewModalOpen(true);
                    }}
                    className="btn-outline"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => excluirFuncionario(funcionario.id)}
                    className="btn-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="tabela-juridica w-full">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cargo</th>
              <th>Departamento</th>
              <th>Data de Contratação</th>
              <th>Contacto</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionariosFiltrados.map(funcionario => (
              <tr 
                key={funcionario.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td>{funcionario.nome}</td>
                <td>{funcionario.cargo}</td>
                <td>{funcionario.departamento}</td>
                <td>{new Date(funcionario.dataContratacao).toLocaleDateString('pt-MZ')}</td>
                <td>{funcionario.contacto}</td>
                <td>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(funcionario.status)}`}>
                    {funcionario.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => { 
                        setFuncionarioEditando(funcionario); 
                        setIsModalOpen(true); 
                      }}
                      className="btn-outline"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setClienteVisualizando(funcionario);
                        setIsViewModalOpen(true);
                      }}
                      className="btn-outline"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => excluirFuncionario(funcionario.id)}
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
      )}

      {/* Modal de Visualização */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
  <DialogContent className="sm:max-w-[800px] p-8">
    <DialogHeader>
      <DialogTitle>
        <div className="text-2xl font-bold mb-6">
          Dados do Funcionário
        </div>
      </DialogTitle>
    </DialogHeader>
    
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Informações Pessoais</h3>
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-600">Nome:</span>
                    <span className="text-lg">{clienteVisualizando?.nome}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-600">Cargo:</span>
                    <span className="text-lg">{clienteVisualizando?.cargo}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-600">Departamento:</span>
                    <span className="text-lg">{clienteVisualizando?.departamento}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-600">Contacto:</span>
                    <span className="text-lg">{clienteVisualizando?.contacto}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Informações de Contratação</h3>
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-600">Data de Contratação:</span>
                    <span className="text-lg">
                      {clienteVisualizando 
                        ? new Date(clienteVisualizando.dataContratacao).toLocaleDateString('pt-MZ', 
                            { day: '2-digit', month: 'long', year: 'numeric' })
                        : ''}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(clienteVisualizando?.status || 'ativo')}`}>
                      {(clienteVisualizando?.status || 'ativo').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-600">Número de Identificação Fiscal:</span>
                    <span className="text-lg">{clienteVisualizando?.nif}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Histórico de Cargos</h3>
                {clienteVisualizando?.historicoCargos && clienteVisualizando.historicoCargos.length > 0 ? (
                  clienteVisualizando.historicoCargos.map((cargo, index) => (
                    <div key={index} className="p-4 border rounded-lg mb-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-600">Cargo:</span>
                        <span className="text-lg font-semibold">{cargo.cargo}</span>
                      </div>
                      <div className="flex flex-col mt-2">
                        <span className="font-medium text-gray-600">Departamento:</span>
                        <span className="text-lg">{cargo.departamento}</span>
                      </div>
                      <div className="flex flex-col mt-2">
                        <span className="font-medium text-gray-600">Período:</span>
                        <span className="text-lg">
                          {new Date(cargo.dataInicio).toLocaleDateString('pt-MZ', 
                              { day: '2-digit', month: 'long', year: 'numeric' })} 
                          - 
                          {cargo.dataFim 
                            ? new Date(cargo.dataFim).toLocaleDateString('pt-MZ', 
                                { day: '2-digit', month: 'long', year: 'numeric' })
                            : 'Atual'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-gray-500">Não há histórico de cargos para este funcionário</p>
                  </div>
                )}
              </div>

              <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Documentos</h3>
          {clienteVisualizando?.documentos && clienteVisualizando.documentos.length > 0 ? (
            <div className="space-y-2">
              {clienteVisualizando.documentos.map((documento, index) => (
                <div key={index} className="flex items-center p-3 border rounded-lg">
                  <FileText className="w-5 h-5 mr-2 text-gray-500" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-600">Nome:</div>
                    <div className="text-sm">{documento.nome}</div>
                    <div className="font-medium text-gray-600 mt-1">Tipo:</div>
                    <div className="text-sm">{documento.tipo}</div>
                    <div className="font-medium text-gray-600 mt-1">Data de Upload:</div>
                    <div className="text-sm">
                      {new Date(documento.dataUpload).toLocaleDateString('pt-MZ')}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => {
                      // Implementação completa do download
                      const link = document.createElement('a');
                      link.href = documento.url;
                      link.download = documento.nome;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);

                      // Para URLs externas, podemos precisar de uma lógica adicional:
                      if (documento.url.startsWith('http')) {
                        fetch(documento.url)
                          .then(response => response.blob())
                          .then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            link.href = url;
                            link.download = documento.nome;
                            document.body.appendChild(link);
                            link.click();
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(link);
                          })
                          .catch(error => console.error('Erro no download:', error));
                      }
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 border rounded-lg text-center">
              <p className="text-gray-500">Não há documentos associados a este funcionário</p>
            </div>
          )}
        </div>
      </div>
    </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {funcionarioEditando.id === 0 ? 'Novo Funcionário' : 'Editar Funcionário'}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="dados">Dados Básicos</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="dados">
              <div className="grid gap-4 py-4">
                <Input
                  label="Nome Completo *"
                  value={funcionarioEditando.nome}
                  onChange={(evento) => setFuncionarioEditando(anterior => ({ 
                    ...anterior, 
                    nome: evento.target.value 
                  }))}
                />

                <div className="grid grid-cols-2 gap-4">
                  {/* Select para Cargo */}
                  <Select
                    value={funcionarioEditando.cargo}
                    onValueChange={(valor) => setFuncionarioEditando(anterior => ({ 
                      ...anterior, 
                      cargo: valor 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o Cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {cargos.map((cargoOption) => (
                        <SelectItem key={cargoOption} value={cargoOption}>
                          {cargoOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={funcionarioEditando.departamento}
                    onValueChange={(valor) => setFuncionarioEditando(anterior => ({ 
                      ...anterior, 
                      departamento: valor 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o Departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departamentos.map(departamento => (
                        <SelectItem key={departamento} value={departamento}>
                          {departamento}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Contacto *"
                    value={funcionarioEditando.contacto}
                    onChange={(evento) => setFuncionarioEditando(anterior => ({ 
                      ...anterior, 
                      contacto: evento.target.value 
                    }))}
                  />

                  <Input
                    label="Número de Identificação Fiscal *"
                    value={funcionarioEditando.nif || ''}
                    onChange={(e) => {
                      const valor = e.target.value
                        .replace(/\D/g, '')
                        .replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
                        .trim()
                        .slice(0, 11);
                        
                      setFuncionarioEditando(prev => ({
                        ...prev,
                        nif: valor
                      }));
                    }}
                    placeholder="Ex: 123 456 789"
                  />
                  {funcionarioEditando.nif && !validarNIF(funcionarioEditando.nif) && (
                    <span className="text-red-500 text-sm">NIF inválido (deve conter 9 dígitos)</span>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="historico">
              <div className="space-y-4 py-4">
                {funcionarioEditando.historicoCargos.map((cargo, indice) => (
                  <div key={indice} className="card-juridico p-4">
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Select para Cargo Anterior */}
                        <Select
                          value={cargo.cargo}
                          onValueChange={(valor) => {
                            const novosCargos = [...funcionarioEditando.historicoCargos];
                            novosCargos[indice].cargo = valor;
                            setFuncionarioEditando(prev => ({...prev, historicoCargos: novosCargos}));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o cargo anterior" />
                          </SelectTrigger>
                          <SelectContent>
                            {cargos.map((cargoOption) => (
                              <SelectItem key={cargoOption} value={cargoOption}>
                                {cargoOption}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Select para Departamento Anterior */}
                        <Select
                          value={cargo.departamento}
                          onValueChange={(valor) => {
                            const novosCargos = [...funcionarioEditando.historicoCargos];
                            novosCargos[indice].departamento = valor;
                            setFuncionarioEditando(prev => ({...prev, historicoCargos: novosCargos}));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o departamento anterior" />
                          </SelectTrigger>
                          <SelectContent>
                            {departamentos.map((departamento) => (
                              <SelectItem key={departamento} value={departamento}>
                                {departamento}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Restante do código para datas... */}
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="date"
                          label="Data Início *"
                          value={cargo.dataInicio}
                          onChange={(e) => {
                            const novosCargos = [...funcionarioEditando.historicoCargos];
                            novosCargos[indice].dataInicio = e.target.value;
                            setFuncionarioEditando(prev => ({...prev, historicoCargos: novosCargos}));
                          }}
                        />
                        
                        <Input
                          type="date"
                          label="Data Fim"
                          value={cargo.dataFim || ''}
                          onChange={(e) => {
                            const novosCargos = [...funcionarioEditando.historicoCargos];
                            novosCargos[indice].dataFim = e.target.value || null;
                            setFuncionarioEditando(prev => ({...prev, historicoCargos: novosCargos}));
                          }}
                        />
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const novosCargos = funcionarioEditando.historicoCargos
                            .filter((_, index) => index !== indice);
                          setFuncionarioEditando(prev => ({...prev, historicoCargos: novosCargos}));
                        }}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button
                  onClick={() => {
                    const novoCargo = {
                      id: Date.now(),
                      cargo: '',
                      departamento: '',
                      dataInicio: new Date().toISOString().split('T')[0],
                      dataFim: null
                    };
                    setFuncionarioEditando(prev => ({
                      ...prev,
                      historicoCargos: [...prev.historicoCargos, novoCargo]
                    }));
                  }}
                >
                  Adicionar Cargo Anterior
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="documentos">
              <div className="space-y-4 py-4">
                <input
                  type="file"
                  onChange={handleUploadDocumento}
                  multiple
                  className="hidden"
                  id="upload-documento"
                />
                <label
                  htmlFor="upload-documento"
                  className="btn-primary flex items-center gap-2 cursor-pointer mb-4"
                >
                  <Upload className="w-4 h-4" />
                  Adicionar Documentos
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {funcionarioEditando.documentos.map((documento, indice) => (
                    <div key={indice} className="card-juridico p-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm flex-1">{documento.nome}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const novosDocumentos = funcionarioEditando.documentos
                            .filter((_, index) => index !== indice);
                          setFuncionarioEditando(anterior => ({ 
                            ...anterior, 
                            documentos: novosDocumentos 
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="btn-outline">
              Cancelar
            </Button>
            <Button
              onClick={() => handleSubmeter(funcionarioEditando)}
              disabled={!formularioValido}
              className="btn-primary"
            >
              {funcionarioEditando.id === 0 ? 'Criar Funcionário' : 'Salvar Alterações'}
              {!formularioValido && (
                <div className="absolute -right-2 -top-2">
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center">
                      !
                    </span>
                  </span>
                </div>
              )}
            </Button>
            {funcionarioEditando.id !== 0 && (
              <Button
                variant="destructive"
                onClick={() => excluirFuncionario(funcionarioEditando.id)}
              >
                Excluir
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}