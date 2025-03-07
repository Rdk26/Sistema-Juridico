// pages/SuportePage.tsx
import { useState } from 'react';
import { 
  LifeBuoy, 
  Mail, 
  Phone, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2,
  User,
  FileText,
  Download
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

export default function SuportePage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: ''
  });

  const [ticketEnviado, setTicketEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para enviar o ticket
    setTicketEnviado(true);
    setTimeout(() => setTicketEnviado(false), 5000);
    setFormData({ nome: '', email: '', mensagem: '' });
  };

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

          {ticketEnviado && (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Ticket enviado com sucesso! Responderemos em até 24h.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              <Input
                label="Seu Nome *"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="flex-1"
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
              />
            </div>

            <Textarea
              label="Descreva seu Problema *"
              value={formData.mensagem}
              onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
              rows={5}
            />

            <Button type="submit" className="w-full">
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
              <AlertCircle className="w-5 h-5" />
              Recursos Úteis
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Documentação do Sistema
              </Button>
              <Button variant="outline" className="justify-start">
                <LifeBuoy className="w-4 h-4 mr-2" />
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

      {/* Seção de Status do Sistema */}
      <div className="card-juridico p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Status do Sistema
        </h2>
        <div className="flex items-center gap-4">
          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          <p>Todos os sistemas operacionais</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Última atualização: {new Date().toLocaleDateString('pt-MZ')}
        </p>
      </div>
    </main>
  );
}