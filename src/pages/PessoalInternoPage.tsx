// pages/PessoalInternoPage.tsx
import { useState, useEffect } from 'react';
import { Plus, Search, User, Briefcase, Phone, Calendar, BadgeInfo, FileDown,} from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

type Funcionario = {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  dataContratacao: string;
  contacto: string;
  status: 'ativo' | 'inativo';
  historicoCargos: HistoricoCargo[];
};
type HistoricoCargo = {
    id: number;
    cargo: string;
    departamento: string;
    dataInicio: string;
    dataFim: string | null;
  };

// Dados mockados com exemplos moçambicanos
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
      ]
    },
    {
      id: 2,
      nome: 'Ana Maria Mondlane',
      cargo: 'Assistente Jurídica',
      departamento: 'Departamento Legal',
      dataContratacao: '2022-08-01',
      contacto: '+258 82 987 6543',
      status: 'ativo',
      historicoCargos: []
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
  const [filtro, setFiltro] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [funcionarioEditando, setFuncionarioEditando] = useState<Funcionario | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setFuncionarios(funcionariosMock);
      setIsLoading(false);
    }, 1000);
  }, []);

  const funcionariosFiltrados = funcionarios.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(filtro.toLowerCase()) ||
    funcionario.departamento.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleSubmit = (funcionario: Funcionario) => {
    const novoFuncionario = {
      ...funcionario,
      dataContratacao: funcionario.id ? funcionario.dataContratacao : new Date().toISOString().split('T')[0]
    };

    if (novoFuncionario.id) {
      setFuncionarios(prev => prev.map(f => f.id === novoFuncionario.id ? novoFuncionario : f));
    } else {
      setFuncionarios(prev => [...prev, { 
        ...novoFuncionario, 
        id: Math.max(...prev.map(f => f.id), 0) + 1 
      }]);
    }
    setIsModalOpen(false);
    setFuncionarioEditando(null);
  };
  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Funcionários');

    // Configurar cabeçalhos
    worksheet.columns = [
      { header: 'Nome', key: 'nome', width: 25 },
      { header: 'Cargo', key: 'cargo', width: 25 },
      { header: 'Departamento', key: 'departamento', width: 20 },
      { header: 'Contacto', key: 'contacto', width: 15 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Data Contratação', key: 'dataContratacao', width: 15 },
      { header: 'Cargos Anteriores', key: 'historico', width: 40 }
    ];

    // Formatar cabeçalhos
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).border = {
      bottom: { style: 'thin' }
    };

    // Adicionar dados
    funcionarios.forEach(funcionario => {
      worksheet.addRow({
        nome: funcionario.nome,
        cargo: funcionario.cargo,
        departamento: funcionario.departamento,
        contacto: funcionario.contacto,
        status: funcionario.status.toUpperCase(),
        dataContratacao: new Date(funcionario.dataContratacao).toLocaleDateString('pt-MZ'),
        historico: funcionario.historicoCargos
          .map(c => `${c.cargo} (${new Date(c.dataInicio).toLocaleDateString('pt-MZ')} - ${c.dataFim ? new Date(c.dataFim).toLocaleDateString('pt-MZ') : 'Atual'})`)
          .join('\n')
      });
    });

    // Gerar arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, 'funcionarios.xlsx');
  };

  return (
<main className="flex-1 overflow-auto p-6">
      {/* Cabeçalho com botão de exportação */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold texto-escuro">Pessoal Interno</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExportExcel}
            className="btn-primary flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Exportar Excel
          </button>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              setFuncionarioEditando(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Novo Funcionário
          </button>
        </div>
      </div>

      <div className="mb-6 card-juridico p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <Input
          placeholder="Pesquisar por nome, cargo ou departamento..."
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
              <th>Cargo</th>
              <th>Departamento</th>
              <th>Data de Contratação</th>
              <th>Contacto</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {funcionariosFiltrados.map(funcionario => (
              <tr 
                key={funcionario.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => {
                  setFuncionarioEditando(funcionario);
                  setIsModalOpen(true);
                }}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    {funcionario.nome}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {funcionario.cargo}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <BadgeInfo className="w-4 h-4" />
                    {funcionario.departamento}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(funcionario.dataContratacao).toLocaleDateString('pt-MZ')}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {funcionario.contacto}
                  </div>
                </td>
                <td>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(funcionario.status)}`}>
                    {funcionario.status.charAt(0).toUpperCase() + funcionario.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {funcionarioEditando ? 'Editar Funcionário' : 'Novo Funcionário'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Input
              label="Nome Completo *"
              value={funcionarioEditando?.nome || ''}
              onChange={(e) => setFuncionarioEditando(prev => ({
                ...(prev || {
                  id: 0,
                  nome: '',
                  cargo: '',
                  departamento: '',
                  dataContratacao: '',
                  contacto: '',
                  status: 'ativo',
                  historicoCargos: []
                }),
                nome: e.target.value
              }))}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Cargo *"
                value={funcionarioEditando?.cargo || ''}
                onChange={(e) => setFuncionarioEditando(prev => ({
                  ...(prev || {
                    id: 0,
                    nome: '',
                    cargo: '',
                    departamento: '',
                    dataContratacao: '',
                    contacto: '',
                    status: 'ativo',
                    historicoCargos: []
                  }),
                  cargo: e.target.value
                }))}
              />

              <Input
                label="Departamento *"
                value={funcionarioEditando?.departamento || ''}
                onChange={(e) => setFuncionarioEditando(prev => ({
                  ...(prev || {
                    id: 0,
                    nome: '',
                    cargo: '',
                    departamento: '',
                    dataContratacao: '',
                    contacto: '',
                    status: 'ativo',
                    historicoCargos: []
                  }),
                  departamento: e.target.value
                }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Contacto *"
                value={funcionarioEditando?.contacto || ''}
                onChange={(e) => setFuncionarioEditando(prev => ({
                  ...(prev || {
                    id: 0,
                    nome: '',
                    cargo: '',
                    departamento: '',
                    dataContratacao: '',
                    contacto: '',
                    status: 'ativo',
                    historicoCargos: []
                  }),
                  contacto: e.target.value
                }))}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Status *</label>
                <Select
                  value={funcionarioEditando?.status || 'ativo'}
                  onValueChange={(value: 'ativo' | 'inativo') => setFuncionarioEditando(prev => ({
                    ...(prev || {
                      id: 0,
                      nome: '',
                      cargo: '',
                      departamento: '',
                      dataContratacao: '',
                      contacto: '',
                      status: 'ativo',
                      historicoCargos: []
                    }),
                    status: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Histórico de Cargos</label>
              <div className="card-juridico p-4 space-y-4">
                {funcionarioEditando?.historicoCargos.map((cargo) => (
                  <div key={cargo.id} className="flex justify-between items-start border-b pb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <p className="font-medium">{cargo.cargo}</p>
                      </div>
                      <div className="ml-6">
                        <p className="text-sm text-gray-600">{cargo.departamento}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(cargo.dataInicio).toLocaleDateString('pt-MZ')} - 
                          {cargo.dataFim ? new Date(cargo.dataFim).toLocaleDateString('pt-MZ') : 'Atual'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-primary text-sm hover:underline">
                        Editar
                      </button>
                      <button className="text-red-600 text-sm hover:underline">
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
                <button className="btn-primary flex items-center gap-2 w-full mt-4">
                  <Plus className="w-4 h-4" />
                  Adicionar Cargo Anterior
                </button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <button 
              className="btn-primary"
              onClick={() => funcionarioEditando && handleSubmit(funcionarioEditando)}
              disabled={!funcionarioEditando?.nome || !funcionarioEditando?.cargo || !funcionarioEditando?.departamento}
            >
              {funcionarioEditando ? 'Salvar Alterações' : 'Criar Funcionário'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}