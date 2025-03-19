// components/ReportsSection.tsx
import { useState } from 'react';
import { 
  FileText, 
  Eye, 
  Download, 
  Trash2, 
  Edit, 
  Plus, 
  Upload 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { SearchInput } from './ui/SearchInput';

type Documento = {
  nome: string;
  url: string;
  tipo: string;
  dataUpload: string;
};

type Relatorio = {
  id: number;
  tipo: string;
  periodo: string;
  categoria: string;
  situacao: 'pendente' | 'em andamento' | 'concluído';
  detalhes: string;
  documentos: Documento[];
};

const categorias = ['Financeiro', 'Processual', 'Atividades', 'Recursos Humanos'];
const situacoes = ['pendente', 'em andamento', 'concluído'];

const relatoriosMock: Relatorio[] = [
  {
    id: 1,
    tipo: 'Financeiro',
    periodo: '2024-03',
    categoria: 'Financeiro',
    situacao: 'concluído',
    detalhes: 'Relatório financeiro do mês de Março/2024',
    documentos: [
      {
        nome: 'relatorio-financeiro-marco.pdf',
        url: '/docs/relatorio-marco.pdf',
        tipo: 'application/pdf',
        dataUpload: '2024-03-31'
      }
    ]
  },
  {
    id: 2,
    tipo: 'Processual',
    periodo: '2024-04',
    categoria: 'Jurídico',
    situacao: 'em andamento',
    detalhes: 'Relatório de processos jurídicos em andamento',
    documentos: []
  }
];

export function ReportsSection() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>(relatoriosMock);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<Relatorio | null>(null);
  const [abaAtiva, setAbaAtiva] = useState('dados');
  const [filtros, setFiltros] = useState({
    tipo: 'todos',
    situacao: 'todos',
    periodo: ''
  });

  const handleCriarRelatorio = () => {
    setRelatorioSelecionado({
      id: 0,
      tipo: '',
      periodo: '',
      categoria: '',
      situacao: 'pendente',
      detalhes: '',
      documentos: []
    });
    setIsEditModalOpen(true);
  };

  const handleSubmeterRelatorio = (relatorio: Relatorio) => {
    if (relatorio.id) {
      setRelatorios(prev => prev.map(r => r.id === relatorio.id ? relatorio : r));
    } else {
      setRelatorios(prev => [...prev, {
        ...relatorio,
        id: Math.max(...prev.map(r => r.id), 0) + 1
      }]);
    }
    setIsEditModalOpen(false);
  };

  const handleExcluirRelatorio = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este relatório?')) {
      setRelatorios(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleUploadDocumento = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && relatorioSelecionado) {
      const novosDocumentos = Array.from(files).map(file => ({
        nome: file.name,
        url: URL.createObjectURL(file),
        tipo: file.type,
        dataUpload: new Date().toISOString().split('T')[0]
      }));

      setRelatorioSelecionado(prev => ({
        ...prev!,
        documentos: [...prev!.documentos, ...novosDocumentos]
      }));
    }
  };

  const relatoriosFiltrados = relatorios.filter(relatorio => {
    return (
      (filtros.tipo === 'todos' || relatorio.tipo === filtros.tipo) &&
      (filtros.situacao === 'todos' || relatorio.situacao === filtros.situacao) &&
      (filtros.periodo === '' || relatorio.periodo.includes(filtros.periodo))
    );
  });

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20';
      case 'em andamento': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20';
      case 'concluído': return 'bg-green-100 text-green-800 dark:bg-green-900/20';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="card-juridico">
      <div className="flex items-center justify-between mb-6">
        <h2 className="texto-escuro text-xl font-semibold">Relatórios</h2>
        <Button onClick={handleCriarRelatorio}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Relatório
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Select value={filtros.tipo} onValueChange={v => setFiltros(prev => ({ ...prev, tipo: v }))}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os Tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Tipos</SelectItem>
            {categorias.map(tipo => (
              <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filtros.situacao} onValueChange={v => setFiltros(prev => ({ ...prev, situacao: v }))}>
          <SelectTrigger>
            <SelectValue placeholder="Todas Situações" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas Situações</SelectItem>
            {situacoes.map(situacao => (
              <SelectItem key={situacao} value={situacao}>
                {situacao.charAt(0).toUpperCase() + situacao.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <SearchInput
          type="month"
          value={filtros.periodo}
          onChange={e => setFiltros(prev => ({ ...prev, periodo: e.target.value }))}
          placeholder="Pesquisar por ano-mês"
        />
      </div>

      <table className="tabela-juridica w-full">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Período</th>
            <th>Categoria</th>
            <th>Situação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {relatoriosFiltrados.map(relatorio => (
            <tr key={relatorio.id}>
              <td>{relatorio.tipo}</td>
              <td>{relatorio.periodo}</td>
              <td>{relatorio.categoria}</td>
              <td>
                <span className={`px-2.5 py-0.5 rounded-full text-xs ${getSituacaoColor(relatorio.situacao)}`}>
                  {relatorio.situacao}
                </span>
              </td>
              <td>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRelatorioSelecionado(relatorio);
                      setIsViewModalOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRelatorioSelecionado(relatorio);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleExcluirRelatorio(relatorio.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Visualização */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Relatório</DialogTitle>
          </DialogHeader>

          {relatorioSelecionado && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="font-medium">Tipo:</label>
                  <p>{relatorioSelecionado.tipo}</p>
                </div>
                <div>
                  <label className="font-medium">Período:</label>
                  <p>{relatorioSelecionado.periodo}</p>
                </div>
                <div>
                  <label className="font-medium">Categoria:</label>
                  <p>{relatorioSelecionado.categoria}</p>
                </div>
                <div>
                  <label className="font-medium">Situação:</label>
                  <p className={getSituacaoColor(relatorioSelecionado.situacao) + " px-2 py-1 rounded-full inline-block"}>
                    {relatorioSelecionado.situacao}
                  </p>
                </div>
              </div>

              <div>
                <label className="font-medium">Detalhes:</label>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {relatorioSelecionado.detalhes}
                </p>

                <div className="mt-4">
                  <label className="font-medium">Documentos:</label>
                  <div className="mt-2 space-y-2">
                    {relatorioSelecionado.documentos.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{doc.nome}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição/Criação */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {relatorioSelecionado?.id ? 'Editar Relatório' : 'Novo Relatório'}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="dados">Dados Básicos</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="dados">
              <div className="space-y-4 py-4">
                <Select
                  value={relatorioSelecionado?.tipo || ''}
                  onValueChange={v => setRelatorioSelecionado(prev => ({ ...prev!, tipo: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="month"
                  label="Período *"
                  value={relatorioSelecionado?.periodo || ''}
                  onChange={e => setRelatorioSelecionado(prev => ({ ...prev!, periodo: e.target.value }))}
                />

                <Select
                  value={relatorioSelecionado?.categoria || ''}
                  onValueChange={v => setRelatorioSelecionado(prev => ({ ...prev!, categoria: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={relatorioSelecionado?.situacao || ''}
                  onValueChange={v => setRelatorioSelecionado(prev => ({ ...prev!, situacao: v as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a Situação" />
                  </SelectTrigger>
                  <SelectContent>
                    {situacoes.map(sit => (
                      <SelectItem key={sit} value={sit}>
                        {sit.charAt(0).toUpperCase() + sit.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  label="Detalhes"
                  value={relatorioSelecionado?.detalhes || ''}
                  onChange={e => setRelatorioSelecionado(prev => ({ ...prev!, detalhes: e.target.value }))}
                />
              </div>
            </TabsContent>

            <TabsContent value="documentos">
              <div className="py-4 space-y-4">
                <input
                  type="file"
                  id="upload-documento"
                  className="hidden"
                  onChange={handleUploadDocumento}
                  multiple
                />
                <label
                  htmlFor="upload-documento"
                  className="btn-primary flex items-center gap-2 cursor-pointer mb-4"
                >
                  <Upload className="w-4 h-4" />
                  Adicionar Documentos
                </label>

                <div className="space-y-2">
                  {relatorioSelecionado?.documentos.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{doc.nome}</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const novosDocs = relatorioSelecionado.documentos.filter((_, i) => i !== index);
                          setRelatorioSelecionado(prev => ({ ...prev!, documentos: novosDocs }));
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => relatorioSelecionado && handleSubmeterRelatorio(relatorioSelecionado)}
              disabled={!relatorioSelecionado?.tipo || !relatorioSelecionado?.periodo}
            >
              {relatorioSelecionado?.id ? 'Salvar Alterações' : 'Criar Relatório'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}   