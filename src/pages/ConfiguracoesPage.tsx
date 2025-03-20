// pages/ConfiguracoesPage.tsx
import { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Bell,
  Shield,
  Palette,
  Trash2,
  Save,
  Settings,
  Loader,
  AlertCircle,
  Moon,
  Monitor,
  Sun,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Switch } from '../components/ui/Switch';
import { useTheme } from '../components/ThemeProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { toast } from 'react-hot-toast';

type UserData = {
  name: string;
  email: string;
  lastPasswordChange: string;
};

type AppSettings = {
  notifications: boolean;
  language: string;
  twoFactorAuth: boolean;
};

export default function ConfiguracoesPage() {
  const { theme, toggleTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  // Estados principais
  const [userData, setUserData] = useState<UserData>({
    name: "Uriel Menete",
    email: "advogado@mdlegal.mz",
    lastPasswordChange: "2024-03-01"
  });

  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    language: 'pt',
    twoFactorAuth: false
  });

  // Estados do formulário de senha
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  // Carregar configurações salvas
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  // Validar formato de e-mail
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validar senha
  const validatePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      setErrors(prev => ({ ...prev, password: 'As senhas não coincidem' }));
      return false;
    }
    if (passwordData.new.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Senha deve ter pelo menos 8 caracteres' }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: '' }));
    return true;
  };

  // Salvar configurações
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    if (!validateEmail(userData.email)) {
      setErrors(prev => ({ ...prev, email: 'E-mail inválido' }));
      setIsSaving(false);
      return;
    }

    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Salvar no localStorage
      localStorage.setItem('appSettings', JSON.stringify(settings));
      localStorage.setItem('userData', JSON.stringify(userData));
      
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  // Alterar senha
  const handlePasswordChange = async () => {
    if (!validatePassword()) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserData(prev => ({
        ...prev,
        lastPasswordChange: new Date().toISOString().split('T')[0]
      }));

      setPasswordData({ current: '', new: '', confirm: '' });
      setIsPasswordModalOpen(false);
      toast.success('Senha alterada com sucesso!');
    } catch (error) {
      toast.error('Erro ao alterar senha');
    }
  };

  // Excluir conta
  const handleDeleteAccount = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.clear();
      toast.success('Conta excluída com sucesso');
      window.location.reload();
    } catch (error) {
      toast.error('Erro ao excluir conta');
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      {/* Modal de Exclusão de Conta */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão de Conta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Tem certeza que deseja excluir permanentemente sua conta? 
              Todos os dados serão perdidos e esta ação não pode ser desfeita.
            </p>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Esta operação é irreversível</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="btn-outline">
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              className="btn-destructive"
            >
              Confirmar Exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Alteração de Senha */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              label="Senha Atual"
              value={passwordData.current}
              onChange={(event) => setPasswordData(prev => ({ ...prev, current: event.target.value }))}
            />
            <Input
              type="password"
              label="Nova Senha"
              value={passwordData.new}
              onChange={(event) => setPasswordData(prev => ({ ...prev, new: event.target.value }))}
            />
            <Input
              type="password"
              label="Confirmar Nova Senha"
              value={passwordData.confirm}
              onChange={(event) => setPasswordData(prev => ({ ...prev, confirm: event.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button onClick={handlePasswordChange}>
              {isSaving ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                'Confirmar Alteração'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Conteúdo Principal */}
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
                value={userData.name}
                onChange={(event) => setUserData(prev => ({ ...prev, name: event.target.value }))}
              />
            </div>
            
            <div>
              <Input
                type="email"
                label="E-mail"
                value={userData.email}
                onChange={(event) => {
                  setUserData(prev => ({ ...prev, email: event.target.value }));
                  setErrors(prev => ({ ...prev, email: '' }));
                }}
                error={errors.email}
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
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, twoFactorAuth: checked }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-opacity-10 bg-azul rounded-lg">
              <div>
                <h3 className="font-medium">Alterar Senha</h3>
                <p className="texto-escuro text-sm opacity-75">
                  Última alteração: {new Date(userData.lastPasswordChange).toLocaleDateString('pt-MZ')}
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => setIsPasswordModalOpen(true)}
              >
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
              <label className="block texto-escuro mb-2">Idioma do Sistema</label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
              >
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
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
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
                className={theme === 'light' ? 'btn-primary' : 'btn-outline'}
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
            <div className="border-t pt-6">
              <h3 className="font-medium text-vermelho mb-2 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Zona Perigosa
              </h3>
              <div className="flex flex-col gap-4">
                <p className="texto-escuro text-sm">
                  A exclusão da conta é permanente e não pode ser desfeita.
                </p>
                <Button 
                  variant="destructive"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="btn-destructive"
                >
                  Excluir Conta Permanentemente
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="outline" className="btn-outline">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving} className="btn-primary">
            {isSaving ? (
              <div className="flex items-center">
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </main>
  );
}