// pages/ClientesPage.tsx
import { useState, useEffect } from 'react';
import { Plus, Search, User, Briefcase, Mail, Phone, Calendar } from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';

type Cliente = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  dataCadastro: string;
  tipo: 'PS' | 'PC'; // PS = Pessoa Singular, PC = Pessoa Coletiva
};

const clientesMock: Cliente[] = [
  {
    id: 1,
    nome: 'Carlos Macuácua',
    email: 'carlos@mozholding.co.mz',
    telefone: '+258 84 123 4567',
    empresa: 'Moza Holdings',
    dataCadastro: '2024-02-15',
    tipo: 'PC'
  },
  {
    id: 2,
    nome: 'Ana Maria dos Santos',
    email: 'ana.santos@email.com',
    telefone: '+258 82 987 6543',
    empresa: 'Particular',
    dataCadastro: '2024-03-10',
    tipo: 'PS'
  },
];

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setClientes(clientesMock);
      setIsLoading(false);
    }, 1000);
  }, []);

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.email.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.empresa.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleSubmit = (cliente: Cliente) => {
    const novoCliente = {
      ...cliente,
      dataCadastro: cliente.id ? cliente.dataCadastro : new Date().toISOString().split('T')[0]
    };

    if (novoCliente.id) {
      setClientes(prev => prev.map(c => c.id === novoCliente.id ? novoCliente : c));
    } else {
      setClientes(prev => [...prev, { 
        ...novoCliente, 
        id: Math.max(...prev.map(c => c.id), 0) + 1 
      }]);
    }
    setIsModalOpen(false);
    setClienteEditando(null);
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold texto-escuro">Clientes</h1>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => {
            setClienteEditando(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      <div className="mb-6 card-juridico p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <Input
          placeholder="Pesquisar clientes..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="flex-1 border-0 px-3 py-2"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <table className="tabela-juridica w-full">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Empresa</th>
              <th>Contacto</th>
              <th>Data de Cadastro</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map(cliente => (
              <tr 
                key={cliente.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => {
                  setClienteEditando(cliente);
                  setIsModalOpen(true);
                }}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    {cliente.nome}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {cliente.empresa}
                  </div>
                </td>
                <td>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {cliente.email}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <Phone className="w-4 h-4" />
                      {cliente.telefone}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(cliente.dataCadastro).toLocaleDateString('pt-MZ')}
                  </div>
                </td>
                <td>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs ${
                    cliente.tipo === 'PC' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20' 
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20'
                  }`}>
                    {cliente.tipo === 'PC' ? 'Pessoa Coletiva' : 'Pessoa Singular'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {clienteEditando ? 'Editar Cliente' : 'Novo Cliente'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Input
                label="Nome Completo *"
                value={clienteEditando?.nome || ''}
                onChange={(e) => setClienteEditando(prev => ({
                  ...(prev || {
                    id: 0,
                    nome: '',
                    email: '',
                    telefone: '',
                    empresa: '',
                    dataCadastro: '',
                    tipo: 'PS'
                  }),
                  nome: e.target.value
                }))}
              />

            <div className="grid grid-cols-2 gap-4">
              <Input
                 label="Email *"
                 type="email"
                 value={clienteEditando?.email || ''}
                 onChange={(e) => setClienteEditando(prev => ({
                   ...(prev || {
                     id: 0,
                     nome: '',
                     email: '',
                     telefone: '',
                     empresa: '',
                     dataCadastro: '',
                     tipo: 'PS'
                   }),
                   email: e.target.value
                 }))}
               />

              <Input
                label="Telefone *"
                value={clienteEditando?.telefone || ''}
                onChange={(e) => setClienteEditando(prev => ({
                  ...(prev || {
                    id: 0,
                    nome: '',
                    email: '',
                    telefone: '',
                    empresa: '',
                    dataCadastro: '',
                    tipo: 'PS'
                  }),
                  telefone: e.target.value
                }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                 label="Empresa"
                 value={clienteEditando?.empresa || ''}
                 onChange={(e) => setClienteEditando(prev => ({
                   ...(prev || {
                     id: 0,
                     nome: '',
                     email: '',
                     telefone: '',
                     empresa: '',
                     dataCadastro: '',
                     tipo: 'PS'
                   }),
                   empresa: e.target.value
                 }))}
               />

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo *</label>
                <select
                   value={clienteEditando?.tipo || 'PS'}
                   onChange={(e) => setClienteEditando(prev => ({
                     ...(prev || {
                       id: 0,
                       nome: '',
                       email: '',
                       telefone: '',
                       empresa: '',
                       dataCadastro: '',
                       tipo: 'PS'
                     }),
                     tipo: e.target.value as 'PS' | 'PC'
                   }))}
                   className="card-juridico p-3 w-full"
                 >
                  <option value="PS">Pessoa Singular</option>
                  <option value="PC">Pessoa Coletiva</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <button 
              className="btn-primary"
              onClick={() => clienteEditando && handleSubmit(clienteEditando)}
              disabled={!clienteEditando?.nome || !clienteEditando?.email}
            >
              {clienteEditando ? 'Salvar Alterações' : 'Criar Cliente'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}