export type Ticket = {
  id: number;
  titulo: string;
  categoria: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'aberto' | 'em andamento' | 'resolvido';
  dataCriacao: string;
  descricao: string;
  email: string;
  nome: string;
  respostas?: {
    autor: string;
    mensagem: string;
    data: string;
  }[];
}; 