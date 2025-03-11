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
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

type Modelo = {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  formato: string;
  ultimaAtualizacao: string;
  arquivo?: File;
};

export default function ModelosPage() {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modeloEditando, setModeloEditando] = useState<Modelo | null>(null);
  const [modeloVisualizando, setModeloVisualizando] = useState<Modelo | null>(null);
  const [novoModelo, setNovoModelo] = useState<Partial<Modelo>>({
    categoria: 'Contratos',
    formato: 'DOCX'
  });

  const [modelos, setModelos] = useState<Modelo[]>([
    {
      id: 1,
      nome: 'Contrato de Prestação de Serviços',
      categoria: 'Contratos',
      descricao: 'Modelo padrão para contratação de serviços jurídicos',
      formato: 'DOCX',
      ultimaAtualizacao: '2024-03-15'
    },
    {
      id: 2,
      nome: 'Petição Inicial - Ação de Divórcio',
      categoria: 'Petições',
      descricao: 'Modelo para ação de divórcio consensual',
      formato: 'PDF',
      ultimaAtualizacao: '2024-02-28'
    },
  ]);

  const categorias = ['Contratos', 'Petições', 'Recursos', 'Societário'];

  const modelosFiltrados = modelos.filter(modelo => {
    const buscaMatch = modelo.nome.toLowerCase().includes(busca.toLowerCase()) ||
      modelo.descricao.toLowerCase().includes(busca.toLowerCase());
    
    const categoriaMatch = categoriaSelecionada === 'todos' || 
      modelo.categoria === categoriaSelecionada;
    
    return buscaMatch && categoriaMatch;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (arquivo) {
      const formato = arquivo.name.split('.').pop()?.toUpperCase() || 'DOCX';
      
      if (modeloEditando) {
        setModeloEditando(anterior => ({
          ...anterior!,
          arquivo,
          formato
        }));
      } else {
        setNovoModelo(anterior => ({
          ...anterior,
          arquivo,
          formato
        }));
      }
    }
  };

  const handleSubmit = () => {
    if (modeloEditando) {
      setModelos(anterior => 
        anterior.map(modelo => 
          modelo.id === modeloEditando.id ? { ...modeloEditando } : modelo
        )
      );
    } else {
      const novoModeloCompleto: Modelo = {
        id: Math.max(...modelos.map(modelo => modelo.id), 0) + 1,
        nome: novoModelo.nome!,
        categoria: novoModelo.categoria!,
        descricao: novoModelo.descricao!,
        formato: novoModelo.formato!,
        ultimaAtualizacao: new Date().toISOString().split('T')[0],
        arquivo: novoModelo.arquivo
      };
      setModelos(anterior => [...anterior, novoModeloCompleto]);
    }

    setIsModalOpen(false);
    setModeloEditando(null);
    setNovoModelo({ categoria: 'Contratos', formato: 'DOCX' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este modelo?')) {
      setModelos(anterior => anterior.filter(modelo => modelo.id !== id));
    }
  };

  const handleDownload = (modelo: Modelo) => {
    if (!modelo.arquivo) {
      alert('Arquivo não disponível para download');
      return;
    }

    const url = URL.createObjectURL(modelo.arquivo);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${modelo.nome}.${modelo.formato.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleVisualizar = (modelo: Modelo) => {
    if (!modelo.arquivo) {
      alert('Arquivo não disponível para visualização');
      return;
    }
    setModeloVisualizando(modelo);
  };

  const VisualizadorArquivo = () => {
    const [conteudoHTML, setConteudoHTML] = useState('');

    useEffect(() => {
      const carregarConteudo = async () => {
        if (modeloVisualizando?.arquivo) {
          if (modeloVisualizando.formato === 'PDF') {
            return;
          }
          
          const leitor = new FileReader();
          leitor.onload = async (evento) => {
            const buffer = evento.target?.result;
            if (buffer) {
              try {
                const resultado = await mammoth.convertToHtml({ arrayBuffer: buffer as ArrayBuffer });
                setConteudoHTML(resultado.value);
              } catch (erro) {
                console.error('Erro na conversão do documento:', erro);
                alert('Não foi possível exibir este formato de arquivo');
                setModeloVisualizando(null);
              }
            }
          };
          leitor.readAsArrayBuffer(modeloVisualizando.arquivo);
        }
      };

      carregarConteudo();
    }, [modeloVisualizando]);

    if (!modeloVisualizando?.arquivo) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">{modeloVisualizando.nome}</h2>
            <Button
              variant="outline"
              onClick={() => setModeloVisualizando(null)}
            >
              <X className="w-4 h-4 mr-2" />
              Fechar
            </Button>
          </div>
          
          {modeloVisualizando.formato === 'PDF' ? (
            <iframe 
              src={URL.createObjectURL(modeloVisualizando.arquivo)} 
              className="flex-1 w-full" 
              title="Visualizador de PDF"
            />
          ) : (
            <div 
              className="prose max-w-none p-4 overflow-auto"
              dangerouslySetInnerHTML={{ __html: conteudoHTML }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <h1 className="text-3xl font-bold mb-8 texto-escuro">Modelos Jurídicos</h1>

      {/* Filtros e Busca */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar modelos..."
            className="pl-10 w-full card-juridico p-3"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </div>
        
        <select
          className="card-juridico p-3"
          value={categoriaSelecionada}
          onChange={(evento) => setCategoriaSelecionada(evento.target.value)}
        >
          <option value="todos">Todos</option>
          {categorias.map(categoria => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
        
        <button 
          className="btn-primary flex items-center justify-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Novo Modelo
        </button>
      </div>

      {/* Modal de Edição/Criação */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {modeloEditando ? 'Editar Modelo' : 'Novo Modelo'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              label="Nome do Modelo *"
              value={modeloEditando?.nome || novoModelo.nome || ''}
              onChange={(evento) => {
                if (modeloEditando) {
                  setModeloEditando({ ...modeloEditando, nome: evento.target.value });
                } else {
                  setNovoModelo({ ...novoModelo, nome: evento.target.value });
                }
              }}
            />

            <Select
              value={modeloEditando?.categoria || novoModelo.categoria}
              onValueChange={(valor) => {
                if (modeloEditando) {
                  setModeloEditando({ ...modeloEditando, categoria: valor });
                } else {
                  setNovoModelo({ ...novoModelo, categoria: valor });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              label="Descrição *"
              value={modeloEditando?.descricao || novoModelo.descricao || ''}
              onChange={(evento) => {
                if (modeloEditando) {
                  setModeloEditando({ ...modeloEditando, descricao: evento.target.value });
                } else {
                  setNovoModelo({ ...novoModelo, descricao: evento.target.value });
                }
              }}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Upload do Documento *</label>
              <div className="card-juridico p-4 flex flex-col items-center gap-4">
                <input
                  type="file"
                  accept=".docx,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="btn-primary flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Selecionar Arquivo
                </label>
                
                {(modeloEditando?.arquivo || novoModelo.arquivo) && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4" />
                    <span>{(modeloEditando || novoModelo).arquivo?.name}</span>
                    <span className="text-gray-500">({(modeloEditando || novoModelo).formato})</span>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 text-center">
                  Formatos aceitos: .docx, .pdf (Tamanho máximo: 5MB)
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsModalOpen(false);
                setModeloEditando(null);
                setNovoModelo({ categoria: 'Contratos', formato: 'DOCX' });
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={
                !(modeloEditando?.nome || novoModelo.nome) ||
                !(modeloEditando?.categoria || novoModelo.categoria) ||
                !(modeloEditando?.descricao || novoModelo.descricao) ||
                !(modeloEditando?.arquivo || novoModelo.arquivo)
              }
            >
              {modeloEditando ? 'Salvar Alterações' : 'Criar Modelo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-juridico p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 dark:bg-primary/100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-primary dark:text-white" />
            </div>
            <div>
              <p className="texto-escuro text-lg font-semibold">Total de Modelos</p>
              <p className="text-3xl font-bold">{modelos.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card-juridico p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="texto-escuro text-lg font-semibold">Downloads no Mês</p>
              <p className="text-3xl font-bold">1.245</p>
            </div>
          </div>
        </div>
        
        <div className="card-juridico p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="texto-escuro text-lg font-semibold">Modelos Favoritos</p>
              <p className="text-3xl font-bold">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Modelos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modelosFiltrados.map(modelo => (
          <div key={modelo.id} className="card-juridico p-6 relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setModeloEditando(modelo);
                  setIsModalOpen(true);
                }}
              >
                <Pencil className="w-4 h-4 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(modelo.id)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="texto-escuro text-xl font-semibold">{modelo.nome}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {modelo.categoria} • {modelo.formato}
                </p>
              </div>
            </div>
            
            <p className="texto-escuro mb-4">{modelo.descricao}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="texto-escuro">
                  Atualizado em {new Date(modelo.ultimaAtualizacao).toLocaleDateString('pt-MZ')}
                </span>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(modelo)}
                  disabled={!modelo.arquivo}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleVisualizar(modelo)}
                  disabled={!modelo.arquivo}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Visualizar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modeloVisualizando && <VisualizadorArquivo />}
    </main>
  );
}