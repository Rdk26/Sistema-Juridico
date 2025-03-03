// pages/NotificacoesPage.tsx
import { useState, useEffect } from 'react';
import { Plus, Search, ScrollText, CalendarClock, Gavel, User, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

type Notificacao = {
  id: number;
  numeroProcesso: string;
  descricao: string;
  dataNotificacao: string;
  partesEnvolvidas: string[];
  tipo: 'citação' | 'notificação' | 'diligência';
  status: 'pendente' | 'cumprida' | 'expirada';
  prazo: string;
  tribunal: string;
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
    prazo: "2024-04-01",
    tribunal: "Tribunal Judicial da Cidade de Maputo"
  },
  {
    id: 2,
    numeroProcesso: "045/2023/TJB",
    descricao: "Citação para depoimento",
    dataNotificacao: "2024-02-28",
    partesEnvolvidas: ["Carlos Macuácua", "Banco de Moçambique"],
    tipo: "citação",
    status: "cumprida",
    prazo: "2024-03-15",
    tribunal: "Tribunal Judicial da Beira"
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

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificacaoEditando, setNotificacaoEditando] = useState<Notificacao | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setNotificacoes(notificacoesMock);
      setIsLoading(false);
    }, 1000);
  }, []);

  const notificacoesFiltradas = notificacoes.filter(notificacao =>
    notificacao.numeroProcesso.toLowerCase().includes(filtro.toLowerCase()) ||
    notificacao.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
    notificacao.tribunal.toLowerCase().includes(filtro.toLowerCase())
  );

  const formatarData = (data: string) => {
    return format(parseISO(data), "dd 'de' MMMM 'de' yyyy", { locale: pt });
  };

  const handleSubmit = (notificacao: Notificacao) => {
    if (notificacao.id) {
      setNotificacoes(prev => prev.map(n => n.id === notificacao.id ? notificacao : n));
    } else {
      setNotificacoes(prev => [...prev, { 
        ...notificacao, 
        id: Math.max(...prev.map(n => n.id), 0) + 1 
      }]);
    }
    setIsModalOpen(false);
    setNotificacaoEditando(null);
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold texto-escuro">Notificações</h1>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => {
            setNotificacaoEditando(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Nova Notificação
        </button>
      </div>

      <div className="mb-6 card-juridico p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <Input
          placeholder="Pesquisar..."
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
              <th>N° Processo</th>
              <th>Descrição</th>
              <th>Tribunal</th>
              <th>Data Notificação</th>
              <th>Prazo</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {notificacoesFiltradas.map(notificacao => (
              <tr 
                key={notificacao.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => {
                  setNotificacaoEditando(notificacao);
                  setIsModalOpen(true);
                }}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <ScrollText className="w-5 h-5 text-primary" />
                    {notificacao.numeroProcesso}
                  </div>
                </td>
                <td className="max-w-xs">
                  <p className="line-clamp-2">{notificacao.descricao}</p>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Gavel className="w-4 h-4" />
                    {notificacao.tribunal}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4" />
                    {formatarData(notificacao.dataNotificacao)}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4" />
                    {formatarData(notificacao.prazo)}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(notificacao.status)}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(notificacao.status)}`}>
                      {notificacao.status.charAt(0).toUpperCase() + notificacao.status.slice(1)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle >
              {notificacaoEditando ? 'Editar Notificação' : 'Nova Notificação'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Input
              label="Número do Processo *"
              value={notificacaoEditando?.numeroProcesso || ''}
              onChange={(e) => setNotificacaoEditando(prev => ({
                ...(prev || {
                  id: 0,
                  numeroProcesso: '',
                  descricao: '',
                  dataNotificacao: new Date().toISOString().split('T')[0],
                  partesEnvolvidas: [],
                  tipo: 'notificação',
                  status: 'pendente',
                  prazo: '',
                  tribunal: ''
                }),
                numeroProcesso: e.target.value
              }))}
            />

            <Input
              label="Descrição *"
              value={notificacaoEditando?.descricao || ''}
              onChange={(e) => setNotificacaoEditando(prev => ({
                ...(prev || {
                  id: 0,
                  numeroProcesso: '',
                  descricao: '',
                  dataNotificacao: new Date().toISOString().split('T')[0],
                  partesEnvolvidas: [],
                  tipo: 'notificação',
                  status: 'pendente',
                  prazo: '',
                  tribunal: ''
                }),
                tribunal: e.target.value
              }))}
            />

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo *</label>
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
                <label className="text-sm font-medium">Status *</label>
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Partes Envolvidas</label>
              <div className="card-juridico p-4 space-y-2">
                {notificacaoEditando?.partesEnvolvidas.map((parte, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <input
                      value={parte}
                      onChange={(e) => {
                        const novasPartes = [...notificacaoEditando.partesEnvolvidas];
                        novasPartes[index] = e.target.value;
                        setNotificacaoEditando(prev => ({
                          ...prev!,
                          partesEnvolvidas: novasPartes
                        }));
                      }}
                      className="flex-1 bg-transparent outline-none"
                    />
                    <button
                      onClick={() => {
                        const novasPartes = notificacaoEditando.partesEnvolvidas.filter((_, i) => i !== index);
                        setNotificacaoEditando(prev => ({
                          ...prev!,
                          partesEnvolvidas: novasPartes
                        }));
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              <button
                onClick={() => setNotificacaoEditando(prev => ({
                  ...(prev || {
                    id: 0,
                    numeroProcesso: '',
                    descricao: '',
                    dataNotificacao: new Date().toISOString().split('T')[0],
                    partesEnvolvidas: [],
                    tipo: 'notificação',
                    status: 'pendente',
                    prazo: '',
                    tribunal: ''
                  }),
                  partesEnvolvidas: [...(prev?.partesEnvolvidas || []), '']
                }))}
                className="btn-primary flex items-center gap-2 w-full"
              >
                <Plus className="w-4 h-4" />
                Adicionar Parte
              </button>
              </div>
            </div>

            <Input
              label="Tribunal *"
              value={notificacaoEditando?.tribunal || ''}
              onChange={(e) => setNotificacaoEditando(prev => ({
                ...prev!,
                tribunal: e.target.value
              }))}
            />
          </div>

          <DialogFooter>
            <button 
              className="btn-primary"
              onClick={() => notificacaoEditando && handleSubmit(notificacaoEditando)}
              disabled={!notificacaoEditando?.numeroProcesso || !notificacaoEditando?.descricao}
            >
              {notificacaoEditando ? 'Salvar Alterações' : 'Criar Notificação'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}