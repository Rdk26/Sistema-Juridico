// pages/ModelosPage.tsx
import { useState, useEffect } from 'react';
import * as mammoth from 'mammoth';
import { 
  Search, 
  FileText, 
  Download, 
  Clock, 
  Star, 
  Plus, 
  Upload, 
  Trash2, 
  Pencil,
  X,
  Edit,
  Filter,
  File,
  Eye
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';

interface Modelo {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'peticao' | 'contrato' | 'procuração' | 'outros';
  formato: 'docx' | 'pdf';
  dataCriacao: string;
  ultimaAtualizacao: string;
  arquivo: {
    nome: string;
    url: string;
    dataUpload: string;
  };
  historicoVersoes: {
    id: string;
    numero: number;
    data: string;
    formato: string;
    observacoes: string;
  }[];
}

const getCategoriaStyle = (categoria: string) => {
  switch (categoria) {
    case 'peticao':
      return 'bg-blue-100 text-blue-800';
    case 'contrato':
      return 'bg-green-100 text-green-800';
    case 'procuração':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getFormatoStyle = (formato: string) => {
  switch (formato) {
    case 'pdf':
      return 'bg-red-100 text-red-800';
    case 'docx':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const categorias = ['peticao', 'contrato', 'procuração', 'outros'];

const modelosMock: Modelo[] = [
  {
    id: '1',
    nome: 'Petição Inicial',
    descricao: 'Modelo padrão para petição inicial',
    categoria: 'peticao',
    formato: 'docx',
    dataCriacao: '2024-03-20',
    ultimaAtualizacao: '2024-03-20',
    arquivo: {
      nome: 'peticao-inicial.docx',
      url: '/modelos/peticao-inicial.docx',
      dataUpload: '2024-03-20'
    },
    historicoVersoes: []
  },
  {
    id: '2',
    nome: 'Contrato de Prestação de Serviços',
    descricao: 'Modelo para contrato de prestação de serviços',
    categoria: 'contrato',
    formato: 'pdf',
    dataCriacao: '2024-03-15',
    ultimaAtualizacao: '2024-03-18',
    arquivo: {
      nome: 'contrato-servicos.pdf',
      url: '/modelos/contrato-servicos.pdf',
      dataUpload: '2024-03-18'
    },
    historicoVersoes: []
  },
];

export default function ModelosPage() {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modeloEditando, setModeloEditando] = useState<Modelo | null>(null);
  const [modeloSelecionado, setModeloSelecionado] = useState<Modelo | null>(null);
  const [modelos, setModelos] = useState<Modelo[]>(modelosMock);

  const handleEdit = (modelo: Modelo) => {
    setModeloEditando(modelo);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este modelo?')) {
      setModelos(anterior => anterior.filter(modelo => modelo.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modeloEditando?.id) {
      setModelos(anterior => anterior.map(modelo => 
        modelo.id === modeloEditando.id ? {
          ...modeloEditando,
          formato: modeloEditando.formato as 'docx' | 'pdf',
          categoria: modeloEditando.categoria as 'peticao' | 'contrato' | 'procuração' | 'outros'
        } : modelo
      ));
    } else {
      const novoModelo: Modelo = {
        id: Date.now().toString(),
        nome: modeloEditando?.nome || '',
        descricao: modeloEditando?.descricao || '',
        categoria: (modeloEditando?.categoria || 'outros') as 'peticao' | 'contrato' | 'procuração' | 'outros',
        formato: (modeloEditando?.formato || 'docx') as 'docx' | 'pdf',
        dataCriacao: new Date().toISOString(),
        ultimaAtualizacao: new Date().toISOString(),
        arquivo: {
          nome: modeloEditando?.arquivo?.nome || '',
          url: modeloEditando?.arquivo?.url || '',
          dataUpload: new Date().toISOString()
        },
        historicoVersoes: []
      };
      setModelos(prev => [...prev, novoModelo]);
    }
    setIsModalOpen(false);
    setModeloEditando(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const formato = file.name.split('.').pop()?.toLowerCase() as 'docx' | 'pdf' || 'docx';
      setModeloEditando(prev => ({
        ...prev!,
        arquivo: {
          nome: file.name,
          url: url,
          dataUpload: new Date().toISOString()
        },
        formato
      }));
    }
  };

  const handleDownload = (modelo: Modelo) => {
    const link = document.createElement('a');
    link.href = modelo.arquivo.url;
    link.download = modelo.arquivo.nome;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVisualizar = (modelo: Modelo) => {
    setModeloSelecionado(modelo);
    setIsViewModalOpen(true);
  };

  const modelosFiltrados = modelos.filter(modelo => {
    const buscaMatch = modelo.nome.toLowerCase().includes(busca.toLowerCase()) ||
      modelo.descricao.toLowerCase().includes(busca.toLowerCase());
    
    const categoriaMatch = categoriaSelecionada === 'todos' || 
      modelo.categoria === categoriaSelecionada;
    
    return buscaMatch && categoriaMatch;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modelos de Documentos</h1>
        <Button onClick={() => {
          setModeloEditando({
            id: '',
            nome: '',
            descricao: '',
            categoria: 'outros',
            formato: 'docx',
            dataCriacao: '',
            ultimaAtualizacao: '',
            arquivo: {
              nome: '',
              url: '',
              dataUpload: ''
            },
            historicoVersoes: []
          });
          setIsModalOpen(true);
        }}>
          Novo Modelo
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <SearchInput
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar modelos..."
        />
        <Select
          value={categoriaSelecionada}
          onValueChange={setCategoriaSelecionada}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as Categorias</SelectItem>
            {categorias.map(categoria => (
              <SelectItem key={categoria} value={categoria}>
                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modelosFiltrados.map(modelo => (
          <div key={modelo.id} className="card-juridico p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">{modelo.nome}</h3>
                <p className="text-sm text-gray-500">{modelo.descricao}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs ${getFormatoStyle(modelo.formato)}`}>
                {modelo.formato.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`px-2.5 py-0.5 rounded-full text-xs ${getCategoriaStyle(modelo.categoria)}`}>
                {modelo.categoria.charAt(0).toUpperCase() + modelo.categoria.slice(1)}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVisualizar(modelo)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(modelo)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(modelo)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(modelo.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edição/Criação */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {modeloEditando?.id ? 'Editar Modelo' : 'Novo Modelo'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={modeloEditando?.nome || ''}
                onChange={(e) => setModeloEditando(prev => ({
                  ...prev!,
                  nome: e.target.value
                }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={modeloEditando?.descricao || ''}
                onChange={(e) => setModeloEditando(prev => ({
                  ...prev!,
                  descricao: e.target.value
                }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={modeloEditando?.categoria || 'outros'}
                  onValueChange={(value) => setModeloEditando(prev => ({
                    ...prev!,
                    categoria: value as 'peticao' | 'contrato' | 'procuração' | 'outros'
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(categoria => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="formato">Formato</Label>
                <Select
                  value={modeloEditando?.formato || 'docx'}
                  onValueChange={(value) => setModeloEditando(prev => ({
                    ...prev!,
                    formato: value as 'docx' | 'pdf'
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="docx">DOCX</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="arquivo">Arquivo</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".docx,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="arquivo"
                />
                <Label
                  htmlFor="arquivo"
                  className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>Selecionar Arquivo</span>
                </Label>
                {modeloEditando?.arquivo?.nome && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4" />
                    <span>{modeloEditando.arquivo.nome}</span>
                    <span className="text-gray-500">({modeloEditando.formato})</span>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {modeloEditando?.id ? 'Salvar Alterações' : 'Criar Modelo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[800px] p-4 md:p-6">
          <DialogHeader>
            <DialogTitle>
              <div className="text-xl font-bold mb-4">
                Detalhes do Modelo: {modeloSelecionado?.nome}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4 md:space-y-6">
              <div className="card-juridico p-4">
                <h3 className="text-base font-semibold mb-3">Informações Principais</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Nome:</span>
                    <span>{modeloSelecionado?.nome}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Categoria:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs ${getCategoriaStyle(modeloSelecionado?.categoria || 'outros')}`}>
                      {modeloSelecionado?.categoria.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Formato:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs ${getFormatoStyle(modeloSelecionado?.formato || 'docx')}`}>
                      {modeloSelecionado?.formato.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Data de Criação:</span>
                    <span>
                      {modeloSelecionado?.dataCriacao 
                        ? new Date(modeloSelecionado.dataCriacao).toLocaleDateString('pt-MZ') 
                        : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Última Atualização:</span>
                    <span>
                      {modeloSelecionado?.ultimaAtualizacao 
                        ? new Date(modeloSelecionado.ultimaAtualizacao).toLocaleDateString('pt-MZ') 
                        : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-juridico p-4">
                <h3 className="text-base font-semibold mb-3">Descrição</h3>
                <p className="text-gray-600">{modeloSelecionado?.descricao}</p>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="card-juridico p-4">
                <h3 className="text-base font-semibold mb-3">Arquivo</h3>
                {modeloSelecionado?.arquivo ? (
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">{modeloSelecionado.arquivo.nome}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(modeloSelecionado.arquivo.dataUpload).toLocaleDateString('pt-MZ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (modeloSelecionado.arquivo.nome.toLowerCase().endsWith('.pdf')) {
                            window.open(modeloSelecionado.arquivo.url, '_blank');
                          } else {
                            alert('Este tipo de arquivo não pode ser visualizado diretamente');
                          }
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = modeloSelecionado.arquivo.url;
                          link.download = modeloSelecionado.arquivo.nome;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 border rounded-lg text-center text-gray-500">
                    Nenhum arquivo associado a este modelo
                  </div>
                )}
              </div>

              <div className="card-juridico p-4">
                <h3 className="text-base font-semibold mb-3">Histórico de Versões</h3>
                {modeloSelecionado?.historicoVersoes && modeloSelecionado.historicoVersoes.length > 0 ? (
                  <div className="space-y-2">
                    {modeloSelecionado.historicoVersoes.map((versao) => (
                      <div key={versao.id} className="p-2 border rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">Versão {versao.numero}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(versao.data).toLocaleDateString('pt-MZ')}
                            </div>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs ${getFormatoStyle(versao.formato)}`}>
                            {versao.formato.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{versao.observacoes}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 border rounded-lg text-center text-gray-500">
                    Não há histórico de versões registrado
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <div className="mt-6">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}