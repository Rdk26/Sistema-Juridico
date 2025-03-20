import { Ticket } from '../types/suporte';

// Simulando um banco de dados local
let tickets: Ticket[] = [
  {
    id: 1,
    titulo: "Erro ao acessar relatórios",
    categoria: "Sistema",
    prioridade: "alta",
    status: "aberto",
    dataCriacao: "2024-03-20",
    descricao: "Não consigo acessar os relatórios financeiros",
    email: "cliente@exemplo.com",
    nome: "João Silva"
  },
  {
    id: 2,
    titulo: "Dúvida sobre processo",
    categoria: "Jurídico",
    prioridade: "media",
    status: "em andamento",
    dataCriacao: "2024-03-19",
    descricao: "Como adicionar um novo processo?",
    email: "advogado@exemplo.com",
    nome: "Maria Santos"
  }
];

export const suporteService = {
  // Listar todos os tickets
  listarTickets: async (): Promise<Ticket[]> => {
    return tickets;
  },

  // Buscar ticket por ID
  buscarTicketPorId: async (id: number): Promise<Ticket | undefined> => {
    return tickets.find(ticket => ticket.id === id);
  },

  // Criar novo ticket
  criarTicket: async (novoTicket: Omit<Ticket, 'id' | 'dataCriacao'>): Promise<Ticket> => {
    const ticket: Ticket = {
      ...novoTicket,
      id: Math.max(...tickets.map(t => t.id), 0) + 1,
      dataCriacao: new Date().toISOString().split('T')[0],
      status: "aberto"
    };
    tickets.push(ticket);
    return ticket;
  },

  // Atualizar ticket
  atualizarTicket: async (id: number, dadosAtualizados: Partial<Ticket>): Promise<Ticket | undefined> => {
    const index = tickets.findIndex(ticket => ticket.id === id);
    if (index === -1) return undefined;

    tickets[index] = {
      ...tickets[index],
      ...dadosAtualizados
    };
    return tickets[index];
  },

  // Excluir ticket
  excluirTicket: async (id: number): Promise<boolean> => {
    const index = tickets.findIndex(ticket => ticket.id === id);
    if (index === -1) return false;

    tickets = tickets.filter(ticket => ticket.id !== id);
    return true;
  },

  // Atualizar status do ticket
  atualizarStatus: async (id: number, novoStatus: Ticket['status']): Promise<Ticket | undefined> => {
    return suporteService.atualizarTicket(id, { status: novoStatus });
  }
}; 