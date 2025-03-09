// pages/ConfiguracoesPage.tsx
import { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  Shield,
  Globe,
  Palette,
  Trash2,
  Save,
  Settings,
  Download,
  FileText,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Switch } from '../components/ui/Switch';
import { useTheme } from '../components/ThemeProvider';

export default function ConfiguracoesPage() {
  const { theme, toggleTheme } = useTheme();
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [email, setEmail] = useState('advogado@mdlegal.mz');
  const [idioma, setIdioma] = useState('pt');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Configurações salvas com sucesso!');
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold texto-escuro flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Configurações do Sistema
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção de Perfil */}
        <div className="card-juridico p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            Perfil do Usuário
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block texto-escuro mb-2">Nome Completo</label>
              <input
                type="text"
                className="card-juridico w-full p-3"
                defaultValue="Uriel Menete"
              />
            </div>
            
            <div>
              <label className="block texto-escuro mb-2">E-mail</label>
              <input
                type="email"
                className="card-juridico w-full p-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Configurações de Segurança */}
        <div className="card-juridico p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Segurança
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-opacity-10 bg-vermelho rounded-lg">
              <div>
                <h3 className="font-medium">Autenticação de Dois Fatores</h3>
                <p className="texto-escuro text-sm opacity-75">
                  Proteção adicional para sua conta
                </p>
              </div>
              <Switch 
                checked={twoFactorAuth}
                onCheckedChange={setTwoFactorAuth}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-opacity-10 bg-azul rounded-lg">
              <div>
                <h3 className="font-medium">Alterar Senha</h3>
                <p className="texto-escuro text-sm opacity-75">
                  Última alteração: 15 dias atrás
                </p>
              </div>
              <Button variant="outline">
                <Lock className="w-4 h-4 mr-2" />
                Redefinir
              </Button>
            </div>
          </div>
        </div>

        {/* Preferências de Notificação */}
        <div className="card-juridico p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block texto-escuro mb-2">Frequência de Alertas</label>
              <Select value={idioma} onValueChange={setIdioma}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português (Moçambique)</SelectItem>
                  <SelectItem value="en">Inglês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-opacity-10 bg-verde rounded-lg">
              <div>
                <h3 className="font-medium">Notificações por E-mail</h3>
                <p className="texto-escuro text-sm opacity-75">
                  Receber alertas importantes
                </p>
              </div>
              <Switch
                checked={notificacoesAtivas}
                onCheckedChange={setNotificacoesAtivas}
              />
            </div>
          </div>
        </div>

        {/* Aparência */}
        <div className="card-juridico p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Aparência
          </h2>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => toggleTheme('light')}
              >
                <Sun className="w-4 h-4 mr-2" />
                Tema Claro
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => toggleTheme('dark')}
              >
                <Moon className="w-4 h-4 mr-2" />
                Tema Escuro
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => toggleTheme('system')}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Seguir Sistema
              </Button>
            </div>
          </div>
        </div>

        {/* Configurações Avançadas */}
        <div className="card-juridico p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Avançado
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Exportar Dados</h3>
              <div className="flex gap-4">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Tudo
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Somente Documentos
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium text-vermelho mb-2 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Zona Perigosa
              </h3>
              <div className="flex flex-col gap-4">
                <p className="texto-escuro text-sm">
                  A exclusão da conta é permanente e não pode ser desfeita.
                </p>
                <Button variant="destructive">
                  Excluir Conta Permanentemente
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </form>
    </main>
  );
}