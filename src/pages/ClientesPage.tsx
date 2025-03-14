// pages/ClientesPage.tsx
import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  LayoutGrid,
  Table,
  BadgePercent,
  Clock,
  Trash2,
  Edit,
  File,
  Eye,
  Upload,
  Download
} from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';

type Cliente = {
  id: number;
  nome: string;
  tipo: 'PessoaSingular' | 'PessoaColetiva';
  numeroIdentificacaoFiscal: string;
  contacto: string;
  email: string;
  empresa: string;
  dataCadastro: string;
  status: 'ativo' | 'inativo' | 'potencial';
  historicoInteracoes: Interacao[];
  documentos: Documento[];
  historicoServicos: Servico[];
};

type Interacao = {
  id: number;
  data: string;
  tipo: 'reuniao' | 'email' | 'ligacao';
  descricao: string;
};

type Documento = {
  id: number;
  nome: string;
  tipo: string;
  url: string;
  dataUpload: string;
};

type Servico = {
  id: number;
  servico: string;
  advogado: string;
  dataInicio: string;
  dataConclusao: string | null;
  status: 'Em andamento' | 'Concluído' | 'Cancelado';
  comentarios: string;
};

const clientesMock: Cliente[] = [
  {
    id: 1,
    nome: 'Moza Holdings',
    tipo: 'PessoaColetiva',
    numeroIdentificacaoFiscal: '123456789',
    contacto: '+258 84 123 4567',
    email: 'contato@mozholding.co.mz',
    empresa: 'Moza Holdings',
    dataCadastro: '2023-01-15',
    status: 'ativo',
    historicoInteracoes: [
      {
        id: 1,
        data: '2024-03-20',
        tipo: 'reuniao',
        descricao: 'Revisão de contrato de prestação de serviços'
      }
    ],
    documentos: [
      {
        id: 1,
        nome: 'Contrato.pdf',
        tipo: 'application/pdf',
        url: 'https://example.com/documentos/contrato.pdf',
        dataUpload: '2024-03-20'
      }
    ],
    historicoServicos: [
      {
        id: 1,
        servico: 'Elaboração de Contrato',
        advogado: 'Dr. João Silva',
        dataInicio: '2024-01-15',
        dataConclusao: '2024-02-10',
        status: 'Concluído',
        comentarios: 'Contrato de prestação de serviços elaborado com sucesso'
      }
    ]
  },
];

const obterCorStatus = (status: string) => {
  switch (status) {
    case 'ativo': return 'bg-green-100 text-green-800';
    case 'inativo': return 'bg-red-100 text-red-800';
    case 'potencial': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Em andamento': return 'bg-blue-100 text-blue-800';
    case 'Concluído': return 'bg-green-100 text-green-800';
    case 'Cancelado': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const servicosDisponiveis = [
  'Consulta Jurídica',
  'Elaboração de Contrato',
  'Representação em Processo',
  'Due Diligence',
  'Consultoria Legal'
];

const advogadosDisponiveis = [
  'Dr. João Silva',
  'Dra. Maria Santos',
  'Dr. Pedro Almeida',
  'Dra. Ana Costa'
];

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [visualizacao, setVisualizacao] = useState<'tabela' | 'cards'>('tabela');
  const [filtros, setFiltros] = useState({
    texto: '',
    tipo: 'todos',
    status: 'todos',
    data: ''
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [clienteVisualizando, setClienteVisualizando] = useState<Cliente | null>(null);
  const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('dados');

  useEffect(() => {
    setTimeout(() => {
      setClientes(clientesMock);
      setCarregando(false);
    }, 1000);
  }, []);

  const clientesFiltrados = clientes.filter(cliente => {
    const correspondeTexto = cliente.nome.toLowerCase().includes(filtros.texto.toLowerCase()) ||
      cliente.empresa.toLowerCase().includes(filtros.texto.toLowerCase()) ||
      cliente.email.toLowerCase().includes(filtros.texto.toLowerCase());

    const correspondeTipo = filtros.tipo === 'todos' || cliente.tipo === filtros.tipo;
    const correspondeStatus = filtros.status === 'todos' || cliente.status === filtros.status;
    const correspondeData = !filtros.data || cliente.dataCadastro === filtros.data;

    return correspondeTexto && correspondeTipo && correspondeStatus && correspondeData;
  });

  const metricas = {
    totalClientes: clientes.length,
    clientesAtivos: clientes.filter(cliente => cliente.status === 'ativo').length,
    taxaConversao: '32%'
  };

  const dadosGrafico = [
    { tipo: 'PessoaSingular', quantidade: clientes.filter(cliente => cliente.tipo === 'PessoaSingular').length },
    { tipo: 'PessoaColetiva', quantidade: clientes.filter(cliente => cliente.tipo === 'PessoaColetiva').length }
  ];

  const manipularSubmissao = () => {
    if (clienteEditando) {
      if (clienteEditando.id) {
        setClientes(anterior => anterior.map(cliente => 
          cliente.id === clienteEditando.id ? clienteEditando : cliente
        ));
      } else {
        const novoCliente = {
          ...clienteEditando,
          id: Date.now(),
          dataCadastro: new Date().toISOString().split('T')[0],
          historicoInteracoes: [],
          documentos: []
        };
        setClientes(anterior => [...anterior, novoCliente as Cliente]);
      }
      setModalAberto(false);
      setClienteEditando(null);
    }
  };

  const manipularExclusao = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente permanentemente?')) {
      setClientes(anterior => anterior.filter(cliente => cliente.id !== id));
    }
  };

  const abrirModalEdicao = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setModalAberto(true);
  };

  const handleVisualizarDetalhes = (cliente: Cliente) => {
    setClienteVisualizando(cliente);
    setIsDetalhesModalOpen(true);
  };

  const validarNIF = (nif: string) => {
    const nifLimpo = nif.replace(/\D/g, '');
    return /^\d{9}$/.test(nifLimpo);
  };

  const handleUploadDocumento = (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivos = event.target.files;
    if (arquivos && arquivos.length > 0) {
      const novosDocumentos = Array.from(arquivos).map(arquivo => ({
        id: Date.now(),
        nome: arquivo.name,
        tipo: arquivo.type,
        url: URL.createObjectURL(arquivo),
        dataUpload: new Date().toISOString().split('T')[0]
      }));
      
      setClienteEditando(anterior => ({
        ...anterior!,
        documentos: [...(anterior?.documentos || []), ...novosDocumentos]
      }));
    }
  };

  const handleDownloadDocumento = (documento: Documento) => {
    const link = document.createElement('a');
    link.href = documento.url;
    link.download = documento.nome;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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
  };

  const handleAdicionarServico = () => {
    if (clienteEditando) {
      const novoServico: Servico = { // Explicitly type as Servico
        id: Date.now(),
        servico: '',
        advogado: '',
        dataInicio: new Date().toISOString().split('T')[0],
        dataConclusao: null,
        status: 'Em andamento', // Correct union type
        comentarios: ''
      };
      
      setClienteEditando(anterior => ({
        ...anterior!,
        historicoServicos: [...(anterior?.historicoServicos || []), novoServico]
      }));
    }
  };

  const handleRemoverServico = (indice: number) => {
    if (clienteEditando) {
      setClienteEditando(anterior => ({
        ...anterior!,
        historicoServicos: anterior!.historicoServicos.filter((_, index) => index !== indice)
      }));
    }
  };

  const handleServicoChange = (indice: number, campo: keyof Servico, valor: string | null) => {
    if (clienteEditando) {
      const novosServicos = [...clienteEditando.historicoServicos];
      novosServicos[indice] = {
        ...novosServicos[indice],
        [campo]: valor
      };
      
      setClienteEditando(anterior => ({
        ...anterior!,
        historicoServicos: novosServicos
      }));
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold texto-escuro">Gestão de Clientes</h1>
        <Button onClick={() => {
          setClienteEditando({
            id: 0,
            nome: '',
            tipo: 'PessoaSingular',
            numeroIdentificacaoFiscal: '',
            contacto: '',
            email: '',
            empresa: '',
            dataCadastro: '',
            status: 'ativo',
            historicoInteracoes: [],
            documentos: [],
            historicoServicos: []
          });
          setModalAberto(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Filtros e Métricas */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Pesquisar clientes..."
            value={filtros.texto}
            onChange={evento => setFiltros(anterior => ({ ...anterior, texto: evento.target.value }))}
            className="pl-10"
          />
        </div>

        <Select
          value={filtros.tipo}
          onValueChange={valor => setFiltros(anterior => ({ ...anterior, tipo: valor }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos Tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Tipos</SelectItem>
            <SelectItem value="PessoaSingular">Pessoa Singular</SelectItem>
            <SelectItem value="PessoaColetiva">Pessoa Coletiva</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filtros.status}
          onValueChange={valor => setFiltros(anterior => ({ ...anterior, status: valor }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="potencial">Potencial</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filtros.data}
          onChange={evento => setFiltros(anterior => ({ ...anterior, data: evento.target.value }))}
        />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card-juridico p-4 flex items-center gap-4">
          <Building className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm">Total de Clientes</p>
            <p className="text-2xl font-bold">{metricas.totalClientes}</p>
          </div>
        </div>

        <div className="card-juridico p-4 flex items-center gap-4">
          <BadgePercent className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-sm">Taxa de Conversão</p>
            <p className="text-2xl font-bold">{metricas.taxaConversao}</p>
          </div>
        </div>

        <div className="card-juridico p-4">
          <ResponsiveContainer width="100%" height={100}>
            <RechartsPieChart>
              <Pie
                data={dadosGrafico}
                dataKey="quantidade"
                nameKey="tipo"
                cx="50%"
                cy="50%"
                outerRadius={40}
              >
                <Cell fill="#3B82F6" />
                <Cell fill="#10B981" />
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Visualização */}
      {carregando ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, indice) => (
            <Skeleton key={indice} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-4 flex gap-2">
            <Button
              variant={visualizacao === 'tabela' ? 'default' : 'outline'}
              onClick={() => setVisualizacao('tabela')}
            >
              <Table className="w-4 h-4 mr-2" />
              Visualização em Tabela
            </Button>
            <Button
              variant={visualizacao === 'cards' ? 'default' : 'outline'}
              onClick={() => setVisualizacao('cards')}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Visualização em Cards
            </Button>
          </div>

          {visualizacao === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {clientesFiltrados.map(cliente => (
                <div key={cliente.id} className="card-juridico p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${cliente.tipo === 'PessoaColetiva' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                        {cliente.tipo === 'PessoaColetiva' ? (
                          <Building className="w-6 h-6 text-blue-600" />
                        ) : (
                          <User className="w-6 h-6 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{cliente.nome}</h3>
                        <p className="text-sm text-gray-500">{cliente.empresa}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirModalEdicao(cliente)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVisualizarDetalhes(cliente)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => manipularExclusao(cliente.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{cliente.contacto}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{cliente.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(cliente.dataCadastro).toLocaleDateString('pt-MZ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs ${obterCorStatus(cliente.status)}`}>
                        {cliente.status.toUpperCase()}
                      </span>
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
                  <th>Tipo</th>
                  <th>Contacto</th>
                  <th>Empresa</th>
                  <th>Data Cadastro</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map(cliente => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td>{cliente.nome}</td>
                    <td>{cliente.tipo === 'PessoaColetiva' ? 'Pessoa Coletiva' : 'Pessoa Singular'}</td>
                    <td>{cliente.contacto}</td>
                    <td>{cliente.empresa}</td>
                    <td>{new Date(cliente.dataCadastro).toLocaleDateString('pt-MZ')}</td>
                    <td>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs ${obterCorStatus(cliente.status)}`}>
                        {cliente.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => abrirModalEdicao(cliente)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVisualizarDetalhes(cliente)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => manipularExclusao(cliente.id)}
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
        </>
      )}

      {/* Modal de Detalhes */}
      <Dialog open={isDetalhesModalOpen} onOpenChange={setIsDetalhesModalOpen}>
      <DialogContent className="sm:max-w-[800px] p-8">
        <DialogHeader>
          <DialogTitle>
            <div className="text-2xl font-bold mb-6">
              Detalhes do Cliente: {clienteVisualizando?.nome}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Informações Principais</h3>
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-600">Nome:</span>
                  <span className="text-lg">{clienteVisualizando?.nome}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-600">Tipo:</span>
                  <span className="text-lg">
                    {clienteVisualizando?.tipo === 'PessoaColetiva' 
                      ? 'Pessoa Coletiva' 
                      : 'Pessoa Singular'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-600">NIF:</span>
                  <span className="text-lg">{clienteVisualizando?.numeroIdentificacaoFiscal}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-600">Contacto:</span>
                  <span className="text-lg">{clienteVisualizando?.contacto}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="text-lg">{clienteVisualizando?.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-600">Empresa:</span>
                  <span className="text-lg">{clienteVisualizando?.empresa}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-600">Data de Cadastro:</span>
                  <span className="text-lg">
                    {clienteVisualizando?.dataCadastro 
                      ? new Date(clienteVisualizando.dataCadastro).toLocaleDateString('pt-MZ') 
                      : ''}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs ${obterCorStatus(clienteVisualizando?.status || 'ativo')}`}>
                    {(clienteVisualizando?.status || 'ativo').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Documentos</h3>
              {clienteVisualizando?.documentos && clienteVisualizando.documentos.length > 0 ? (
                <div className="space-y-2">
                  {clienteVisualizando.documentos.map((documento) => (
                    <div key={documento.id} className="flex items-center p-3 border rounded-lg">
                      <File className="w-5 h-5 mr-2 text-gray-500" />
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
                        onClick={() => handleDownloadDocumento(documento)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-gray-500">Não há documentos associados a este cliente</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Histórico de Interacções</h3>
              {clienteVisualizando?.historicoInteracoes && clienteVisualizando.historicoInteracoes.length > 0 ? (
                <div className="space-y-4">
                  {clienteVisualizando.historicoInteracoes.map((interacao) => (
                    <div key={interacao.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(interacao.data).toLocaleDateString('pt-MZ')}</span>
                        <span className="capitalize">{interacao.tipo}</span>
                      </div>
                      <p className="text-sm mt-2 text-gray-600">{interacao.descricao}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-gray-500">Não há histórico de interacções para este cliente</p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Histórico de Serviços</h3>
              {clienteVisualizando?.historicoServicos && clienteVisualizando.historicoServicos.length > 0 ? (
                <div className="space-y-4">
                  {clienteVisualizando.historicoServicos.map(servico => (
                    <div key={servico.id} className="p-4 border rounded-lg">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-600">Serviço:</span>
                          <span className="font-semibold">{servico.servico}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-600">Advogado:</span>
                          <span className="font-semibold">{servico.advogado}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-600">Período:</span>
                          <span className="font-semibold">
                            {new Date(servico.dataInicio).toLocaleDateString('pt-MZ')} - 
                            {servico.dataConclusao 
                              ? new Date(servico.dataConclusao).toLocaleDateString('pt-MZ') 
                              : 'Em andamento'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(servico.status)}`}>
                            {servico.status}
                          </span>
                        </div>
                        {servico.comentarios && (
                          <div className="mt-2">
                            <span className="font-medium text-gray-600">Comentários:</span>
                            <p className="text-gray-600">{servico.comentarios}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-gray-500">Não há histórico de serviços para este cliente</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDetalhesModalOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

      {/* Modal de Edição */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {clienteEditando?.id ? `Editar Cliente: ${clienteEditando.nome}` : 'Cadastrar Novo Cliente'}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="dados">Dados Principais</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="servicos">Serviços</TabsTrigger>
            </TabsList>

            <TabsContent value="dados">
              <div className="grid gap-4 py-4">
                <Input
                  label="Nome Completo/Razão Social *"
                  value={clienteEditando?.nome || ''}
                  onChange={evento => setClienteEditando(anterior => ({ ...anterior!, nome: evento.target.value }))}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={clienteEditando?.tipo || 'PessoaSingular'}
                    onValueChange={valor => setClienteEditando(anterior => ({ ...anterior!, tipo: valor as 'PessoaSingular' | 'PessoaColetiva' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de Cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PessoaSingular">Pessoa Singular</SelectItem>
                      <SelectItem value="PessoaColetiva">Pessoa Coletiva</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
  label="Número de Identificação Fiscal *"
  value={clienteEditando?.numeroIdentificacaoFiscal || ''}
  onChange={(evento) => {
    const valor = evento.target.value
      .replace(/\D/g, '') // Remove todos os caracteres não numéricos
      .replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') // Formata com espaços
      .trim()
      .slice(0, 11); // Limita para 9 dígitos (com espaços)

    setClienteEditando(anterior => ({
      ...anterior!,
      numeroIdentificacaoFiscal: valor
    }));
  }}
  placeholder="Ex: 123 456 789"
/>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Contacto *"
                    value={clienteEditando?.contacto || ''}
                    onChange={evento => setClienteEditando(anterior => ({ ...anterior!, contacto: evento.target.value }))}
                  />

                  <Input
                    label="Email *"
                    type="email"
                    value={clienteEditando?.email || ''}
                    onChange={evento => setClienteEditando(anterior => ({ ...anterior!, email: evento.target.value }))}
                  />
                </div>

                {clienteEditando?.tipo === 'PessoaColetiva' && (
                  <Input
                    label="Empresa"
                    value={clienteEditando?.empresa || ''}
                    onChange={evento => setClienteEditando(anterior => ({ ...anterior!, empresa: evento.target.value }))}
                  />
                )}

                <Select
                  value={clienteEditando?.status || 'ativo'}
                  onValueChange={valor => setClienteEditando(anterior => ({ ...anterior!, status: valor as 'ativo' | 'inativo' | 'potencial' }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status do Cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="potencial">Potencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="historico">
              <div className="space-y-4">
                {clienteEditando?.historicoInteracoes.map((interacao, indice) => (
                  <div key={indice} className="card-juridico p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(interacao.data).toLocaleDateString('pt-MZ')}</span>
                      <span className="capitalize">{interacao.tipo}</span>
                    </div>
                    <p className="text-sm mt-2 text-gray-600">{interacao.descricao}</p>
                  </div>
                ))}
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
                  {clienteEditando?.documentos.map((documento, indice) => (
                    <div key={indice} className="card-juridico p-2 flex items-center gap-2">
                      <File className="w-4 h-4" />
                      <span className="text-sm flex-1">{documento.nome}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocumento(documento)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const novosDocumentos = clienteEditando?.documentos
                              .filter((_, index) => index !== indice);
                            setClienteEditando(anterior => ({ 
                              ...anterior!, 
                              documentos: novosDocumentos! 
                            }));
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="servicos">
              <div className="space-y-4 py-4">
                {clienteEditando?.historicoServicos.map((servico, indice) => (
                  <div key={indice} className="card-juridico p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        value={servico.servico}
                        onValueChange={(valor) => handleServicoChange(indice, 'servico', valor)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {servicosDisponiveis.map(servicoOption => (
                            <SelectItem key={servicoOption} value={servicoOption}>
                              {servicoOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={servico.advogado}
                        onValueChange={(valor) => handleServicoChange(indice, 'advogado', valor)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Advogado Responsável" />
                        </SelectTrigger>
                        <SelectContent>
                          {advogadosDisponiveis.map(advogado => (
                            <SelectItem key={advogado} value={advogado}>
                              {advogado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="date"
                        label="Data de Início"
                        value={servico.dataInicio}
                        onChange={(e) => handleServicoChange(indice, 'dataInicio', e.target.value)}
                      />

                      <Input
                        type="date"
                        label="Data de Conclusão"
                        value={servico.dataConclusao || ''}
                        onChange={(e) => handleServicoChange(indice, 'dataConclusao', e.target.value || null)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        value={servico.status}
                        onValueChange={(valor) => handleServicoChange(indice, 'status', valor)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Em andamento">Em andamento</SelectItem>
                          <SelectItem value="Concluído">Concluído</SelectItem>
                          <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        label="Comentários"
                        value={servico.comentarios}
                        onChange={(e) => handleServicoChange(indice, 'comentarios', e.target.value)}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoverServico(indice)}
                      className="mt-4"
                    >
                      Remover Serviço
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={handleAdicionarServico}
                  className="mt-4"
                >
                  Adicionar Novo Serviço
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button
              onClick={manipularSubmissao}
              disabled={
                !clienteEditando?.nome ||
                !clienteEditando.numeroIdentificacaoFiscal ||
                !validarNIF(clienteEditando.numeroIdentificacaoFiscal) ||
                !clienteEditando.contacto ||
                !clienteEditando.email
              }
            >
              {clienteEditando?.id ? 'Salvar Alterações' : 'Criar Novo Cliente'}
            </Button>
            {clienteEditando?.id && (
              <Button
                variant="destructive"
                onClick={() => manipularExclusao(clienteEditando.id)}
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