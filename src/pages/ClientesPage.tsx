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
  Clock
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
  tipo: 'PS' | 'PC';
  nuito: string;
  contacto: string;
  email: string;
  empresa: string;
  dataCadastro: string;
  status: 'ativo' | 'inativo' | 'potencial';
  historicoInteracoes: Interacao[];
  documentos: Documento[];
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
  dataUpload: string;
};

const clientesMock: Cliente[] = [
  {
    id: 1,
    nome: 'Moza Holdings',
    tipo: 'PC',
    nuito: '123456789',
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
    documentos: []
  },
  // ... outros clientes
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ativo': return 'bg-green-100 text-green-800';
    case 'inativo': return 'bg-red-100 text-red-800';
    case 'potencial': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visualizacao, setVisualizacao] = useState<'tabela' | 'cards'>('tabela');
  const [filtros, setFiltros] = useState({
    texto: '',
    tipo: 'todos',
    status: 'todos',
    data: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setClientes(clientesMock);
      setIsLoading(false);
    }, 1000);
  }, []);

  const clientesFiltrados = clientes.filter(cliente => {
    const matchesTexto = cliente.nome.toLowerCase().includes(filtros.texto.toLowerCase()) ||
      cliente.empresa.toLowerCase().includes(filtros.texto.toLowerCase()) ||
      cliente.email.toLowerCase().includes(filtros.texto.toLowerCase());

    const matchesTipo = filtros.tipo === 'todos' || cliente.tipo === filtros.tipo;
    const matchesStatus = filtros.status === 'todos' || cliente.status === filtros.status;
    const matchesData = !filtros.data || cliente.dataCadastro === filtros.data;

    return matchesTexto && matchesTipo && matchesStatus && matchesData;
  });

  const metricas = {
    totalClientes: clientes.length,
    clientesAtivos: clientes.filter(c => c.status === 'ativo').length,
    taxaConversao: '32%'
  };
  const [abaAtiva, setAbaAtiva] = useState('dados');

  const dataGrafico = [
    { tipo: 'PS', quantidade: clientes.filter(c => c.tipo === 'PS').length },
    { tipo: 'PC', quantidade: clientes.filter(c => c.tipo === 'PC').length }
  ];
  const handleFiltroTextoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros(prev => ({ ...prev, texto: e.target.value }));
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold texto-escuro">Gestão de Clientes</h1>
        <Button onClick={() => setIsModalOpen(true)}>
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
          onChange={handleFiltroTextoChange}
          className="pl-10"
        />
      </div>

        <Select
          value={filtros.tipo}
          onValueChange={value => setFiltros(prev => ({ ...prev, tipo: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos Tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Tipos</SelectItem>
            <SelectItem value="PS">Pessoa Singular</SelectItem>
            <SelectItem value="PC">Pessoa Coletiva</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filtros.status}
          onValueChange={value => setFiltros(prev => ({ ...prev, status: value }))}
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
          onChange={e => setFiltros(prev => ({ ...prev, data: e.target.value }))}
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
                data={dataGrafico}
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
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
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
              Tabela
            </Button>
            <Button
              variant={visualizacao === 'cards' ? 'default' : 'outline'}
              onClick={() => setVisualizacao('cards')}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Cards
            </Button>
          </div>

          {visualizacao === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {clientesFiltrados.map(cliente => (
                <div key={cliente.id} className="card-juridico p-4 hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-full ${cliente.tipo === 'PC' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                      {cliente.tipo === 'PC' ? (
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
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{cliente.contacto}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{cliente.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(cliente.dataCadastro).toLocaleDateString('pt-MZ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(cliente.status)}`}>
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
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map(cliente => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td>{cliente.nome}</td>
                    <td>{cliente.tipo === 'PC' ? 'Pessoa Coletiva' : 'Pessoa Singular'}</td>
                    <td>{cliente.contacto}</td>
                    <td>{cliente.empresa}</td>
                    <td>{new Date(cliente.dataCadastro).toLocaleDateString('pt-MZ')}</td>
                    <td>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(cliente.status)}`}>
                        {cliente.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Modal de Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {clienteEditando ? 'Editar Cliente' : 'Novo Cliente'}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="dados">Dados Principais</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

            <TabsContent value="dados">
              <div className="grid gap-4 py-4">
                <Input
                  label="Nome Completo/Razão Social *"
                  value={clienteEditando?.nome || ''}
                  onChange={e => setClienteEditando(prev => ({ ...prev!, nome: e.target.value }))}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={clienteEditando?.tipo || 'PS'}
                    onValueChange={value => setClienteEditando(prev => ({ ...prev!, tipo: value as 'PS' | 'PC' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de Cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PS">Pessoa Singular</SelectItem>
                      <SelectItem value="PC">Pessoa Coletiva</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    label="NUIT *"
                    value={clienteEditando?.nuito || ''}
                    onChange={e => setClienteEditando(prev => ({ ...prev!, nuito: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Contacto *"
                    value={clienteEditando?.contacto || ''}
                    onChange={e => setClienteEditando(prev => ({ ...prev!, contacto: e.target.value }))}
                  />

                  <Input
                    label="Email *"
                    type="email"
                    value={clienteEditando?.email || ''}
                    onChange={e => setClienteEditando(prev => ({ ...prev!, email: e.target.value }))}
                  />
                </div>

                {clienteEditando?.tipo === 'PC' && (
                  <Input
                    label="Empresa"
                    value={clienteEditando?.empresa || ''}
                    onChange={e => setClienteEditando(prev => ({ ...prev!, empresa: e.target.value }))}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="historico">
              <div className="space-y-4">
                {clienteEditando?.historicoInteracoes.map((interacao, index) => (
                  <div key={index} className="card-juridico p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(interacao.data).toLocaleDateString('pt-MZ')}</span>
                      <span className="capitalize">{interacao.tipo}</span>
                    </div>
                    <p className="text-sm mt-2">{interacao.descricao}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button>
              {clienteEditando ? 'Salvar Alterações' : 'Criar Cliente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}