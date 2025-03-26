import { Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { SearchInput } from './ui/SearchInput';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { Button } from './ui/Button';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

type Notificacao = {
  id: number;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
};

const notificacoesMock: Notificacao[] = [
  {
    id: 1,
    titulo: "Novo Prazo",
    mensagem: "Processo 001/2024/TJCM tem um novo prazo para 15/04/2024",
    data: "2024-03-25T10:30:00",
    lida: false
  },
  {
    id: 2,
    titulo: "Audiência Agendada",
    mensagem: "Audiência do processo 002/2024/TJCM foi agendada para 20/04/2024",
    data: "2024-03-24T15:45:00",
    lida: true
  },
  {
    id: 3,
    titulo: "Documento Recebido",
    mensagem: "Novo documento recebido no processo 003/2024/TJCM",
    data: "2024-03-23T09:15:00",
    lida: true
  }
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isNotificacoesOpen, setIsNotificacoesOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(notificacoesMock);
  
  const metrics = [
    { label: 'Meta Mensal', value: 'MT 50.000,00' },
    { label: 'A Receber', value: 'MT 35.000,00' },
    { label: 'Saldo Atual', value: 'MT 28.500,00' },
  ];

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <SearchInput />
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative"
            onClick={() => setIsNotificacoesOpen(true)}
          >
            <Bell className="w-5 h-5" />
            {notificacoesNaoLidas > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificacoesNaoLidas}
              </span>
            )}
          </button>
          <button
            onClick={handleThemeToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <div className="px-4 md:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="card-juridico">
            <p className="texto-escuro text-sm">{metric.label}</p>
            <p className="texto-escuro text-xl md:text-2xl font-semibold mt-1">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Modal de Notificações */}
      <Dialog open={isNotificacoesOpen} onOpenChange={setIsNotificacoesOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Notificações</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {notificacoes.map((notificacao) => (
              <div 
                key={notificacao.id}
                className={`p-4 rounded-lg border ${
                  notificacao.lida 
                    ? 'bg-white dark:bg-gray-800' 
                    : 'bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{notificacao.titulo}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {notificacao.mensagem}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {format(new Date(notificacao.data), "d 'de' MMMM 'às' HH:mm", { locale: pt })}
                    </p>
                  </div>
                  {!notificacao.lida && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNotificacoes(prev => 
                          prev.map(n => 
                            n.id === notificacao.id ? { ...n, lida: true } : n
                          )
                        );
                      }}
                    >
                      Marcar como lida
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}