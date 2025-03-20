// pages/SuportePage.tsx
import { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  Mail, 
  Phone, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2,
  User,
  FileText,
  Download,
  Clock,
  Search,
  BookOpen,
  Video,
  HelpCircle,
  ChevronRight,
  Trash2,
  Edit,
  Loader,
  Eye
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { SearchInput } from '../components/ui/SearchInput';
import { suporteService } from '../services/suporteService';
import { Ticket } from '../types/suporte';
import { toast } from 'react-hot-toast';

export default function SuportePage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    categoria: '',
    prioridade: 'media' as const,
    mensagem: '',
    titulo: ''
  });

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [ticketSelecionado, setTicketSelecionado] = useState<Ticket | null>(null);
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    carregarTickets();
  }, []);

  const carregarTickets = async () => {
    try {
      setIsLoading(true);
      const dados = await suporteService.listarTickets();
      setTickets(dados);
    } catch (erro) {
      toast.error('Erro ao carregar tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await suporteService.criarTicket({
        ...formData,
        descricao: formData.mensagem,
        status: 'aberto'
      });
      toast.success('Ticket criado com sucesso!');
      setFormData({ nome: '', email: '', categoria: '', prioridade: 'media', mensagem: '', titulo: '' });
      carregarTickets();
    } catch (erro) {
      toast.error('Erro ao criar ticket');
    }
  };

  const handleExcluirTicket = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este ticket?')) {
      try {
        await suporteService.excluirTicket(id);
        toast.success('Ticket excluído com sucesso!');
        carregarTickets();
      } catch (erro) {
        toast.error('Erro ao excluir ticket');
      }
    }
  };

  const handleAtualizarStatus = async (id: number, novoStatus: Ticket['status']) => {
    try {
      await suporteService.atualizarStatus(id, novoStatus);
      toast.success('Status atualizado com sucesso!');
      carregarTickets();
    } catch (erro) {
      toast.error('Erro ao atualizar status');
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return 'bg-blue-100 text-blue-800';
      case 'em andamento': return 'bg-purple-100 text-purple-800';
      case 'resolvido': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ticketsFiltrados = tickets.filter(ticket => 
    ticket.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
    ticket.categoria.toLowerCase().includes(termoBusca.toLowerCase()) ||
    ticket.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold texto-escuro flex items-center gap-3">
          <LifeBuoy className="w-8 h-8" />
          Suporte Técnico
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Estamos aqui para ajudar. Entre em contato ou consulte nossos recursos de apoio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seção de Contato Direto */}
        <div className="card-juridico p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Enviar Solicitação
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              <Input
                label="Seu Nome *"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="flex-1"
                required
                placeholder="Digite seu nome completo"
              />
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <Input
                label="Seu Email *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="flex-1"
                required
                placeholder="exemplo@email.com"
              />
            </div>

            <Input
              label="Título do Ticket *"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              required
              placeholder="Descreva brevemente o problema"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <select
                  className="card-juridico w-full p-3"
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  required
                >
                  <option value="">Selecione uma categoria...</option>
                  <option value="sistema">Sistema</option>
                  <option value="juridico">Jurídico</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Prioridade</label>
                <select
                  className="card-juridico w-full p-3"
                  value={formData.prioridade}
                  onChange={(e) => setFormData({...formData, prioridade: e.target.value as any})}
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            <Textarea
              label="Descreva seu Problema *"
              value={formData.mensagem}
              onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
              rows={5}
              required
              placeholder="Descreva detalhadamente o problema que está enfrentando..."
            />

            <Button type="submit" className="btn-primary">
              Enviar Solicitação
            </Button>
          </form>
        </div>

        {/* Seção de Informações de Contato */}
        <div className="space-y-6">
          <div className="card-juridico p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contato Emergencial
            </h2>
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <span className="font-medium">Suporte 24h:</span>
                <a href="tel:+258841234567" className="text-primary hover:underline">
                  +258 84 123 4567
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">WhatsApp:</span>
                <a href="https://wa.me/258841234567" className="text-primary hover:underline">
                  +258 84 123 4567
                </a>
              </p>
            </div>
          </div>

          <div className="card-juridico p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contato por Email
            </h2>
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <span className="font-medium">Suporte Geral:</span>
                <a href="mailto:suporte@mdlegal.mz" className="text-primary hover:underline">
                  suporte@mdlegal.mz
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">Urgências:</span>
                <a href="mailto:emergencia@mdlegal.mz" className="text-primary hover:underline">
                  emergencia@mdlegal.mz
                </a>
              </p>
            </div>
          </div>

          <div className="card-juridico p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Recursos de Aprendizado
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Documentação do Sistema
              </Button>
              <Button variant="outline" className="justify-start">
                <Video className="w-4 h-4 mr-2" />
                Tutoriais em Vídeo
              </Button>
              <Button variant="outline" className="justify-start">
                <HelpCircle className="w-4 h-4 mr-2" />
                Perguntas Frequentes (FAQ)
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="w-4 h-4 mr-2" />
                Manuais em PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Tickets Recentes */}
      <div className="card-juridico p-4 md:p-6 mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Tickets Recentes
          </h2>
          <Button onClick={() => setIsModalOpen(true)} className="btn-primary">
            Ver Todos
          </Button>
        </div>

        <div className="mb-4">
          <SearchInput
            placeholder="Buscar tickets..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {ticketsFiltrados.map(ticket => (
              <div 
                key={ticket.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-4"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex flex-col">
                    <h3 className="font-medium">{ticket.titulo}</h3>
                    <p className="text-sm text-gray-500">
                      {ticket.categoria} • {new Date(ticket.dataCriacao).toLocaleDateString('pt-MZ')}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs ${getPrioridadeColor(ticket.prioridade)}`}>
                      {ticket.prioridade}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setTicketSelecionado(ticket);
                      setIsViewModalOpen(true);
                    }}
                    className="btn-outline"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setTicketSelecionado(ticket);
                      setIsEditModalOpen(true);
                    }}
                    className="btn-outline"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleExcluirTicket(ticket.id)}
                    className="btn-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Todos os Tickets */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-4 md:p-6">
          <DialogHeader>
            <DialogTitle>Todos os Tickets</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {ticketsFiltrados.map(ticket => (
              <div 
                key={ticket.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex flex-col">
                    <h3 className="font-medium">{ticket.titulo}</h3>
                    <p className="text-sm text-gray-500">
                      {ticket.categoria} • {new Date(ticket.dataCriacao).toLocaleDateString('pt-MZ')}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs ${getPrioridadeColor(ticket.prioridade)}`}>
                      {ticket.prioridade}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setTicketSelecionado(ticket);
                      setIsViewModalOpen(true);
                    }}
                    className="btn-outline"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setTicketSelecionado(ticket);
                      setIsEditModalOpen(true);
                    }}
                    className="btn-outline"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleExcluirTicket(ticket.id)}
                    className="btn-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="btn-outline">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ticket</DialogTitle>
          </DialogHeader>
          {ticketSelecionado && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="card-juridico w-full p-3"
                  value={ticketSelecionado.status}
                  onChange={(e) => handleAtualizarStatus(ticketSelecionado.id, e.target.value as Ticket['status'])}
                >
                  <option value="aberto">Aberto</option>
                  <option value="em andamento">Em Andamento</option>
                  <option value="resolvido">Resolvido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Prioridade</label>
                <select
                  className="card-juridico w-full p-3"
                  value={ticketSelecionado.prioridade}
                  onChange={(e) => suporteService.atualizarTicket(ticketSelecionado.id, { 
                    prioridade: e.target.value as Ticket['prioridade'] 
                  })}
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Detalhes do Ticket</label>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p><strong>Título:</strong> {ticketSelecionado.titulo}</p>
                  <p><strong>Categoria:</strong> {ticketSelecionado.categoria}</p>
                  <p><strong>Cliente:</strong> {ticketSelecionado.nome}</p>
                  <p><strong>Email:</strong> {ticketSelecionado.email}</p>
                  <p><strong>Descrição:</strong> {ticketSelecionado.descricao}</p>
                  <p><strong>Data de Criação:</strong> {new Date(ticketSelecionado.dataCriacao).toLocaleDateString('pt-MZ')}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="btn-outline">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Ticket</DialogTitle>
          </DialogHeader>

          {ticketSelecionado && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Informações Básicas</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Título:</span> {ticketSelecionado.titulo}</p>
                    <p><span className="font-medium">Categoria:</span> {ticketSelecionado.categoria}</p>
                    <p><span className="font-medium">Prioridade:</span> 
                      <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs ${getPrioridadeColor(ticketSelecionado.prioridade)}`}>
                        {ticketSelecionado.prioridade}
                      </span>
                    </p>
                    <p><span className="font-medium">Status:</span>
                      <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(ticketSelecionado.status)}`}>
                        {ticketSelecionado.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Informações do Cliente</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Nome:</span> {ticketSelecionado.nome}</p>
                    <p><span className="font-medium">Email:</span> {ticketSelecionado.email}</p>
                    <p><span className="font-medium">Data de Criação:</span> {new Date(ticketSelecionado.dataCriacao).toLocaleDateString('pt-MZ')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Descrição do Problema</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="whitespace-pre-wrap">{ticketSelecionado.descricao}</p>
                </div>
              </div>

              {ticketSelecionado.respostas && ticketSelecionado.respostas.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Histórico de Respostas</h3>
                  <div className="space-y-4">
                    {ticketSelecionado.respostas.map((resposta, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{resposta.autor}</p>
                          <span className="text-sm text-gray-500">
                            {new Date(resposta.data).toLocaleDateString('pt-MZ')}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{resposta.mensagem}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="btn-outline">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}