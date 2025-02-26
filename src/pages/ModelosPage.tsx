// components/ModelosPage.tsx
import { Search, FileText, Download, Clock, Star } from 'lucide-react';
import { useState } from 'react';

type Modelo = {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  formato: string;
  downloads: number;
  ultimaAtualizacao: string;
};

export default function ModelosPage() {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todos');

  const modelos: Modelo[] = [
    {
      id: 1,
      nome: 'Contrato de Prestação de Serviços',
      categoria: 'Contratos',
      descricao: 'Modelo padrão para contratação de serviços jurídicos',
      formato: 'DOCX',
      downloads: 245,
      ultimaAtualizacao: '2024-03-15'
    },
    {
      id: 2,
      nome: 'Petição Inicial - Ação de Divórcio',
      categoria: 'Petições',
      descricao: 'Modelo para ação de divórcio consensual',
      formato: 'PDF',
      downloads: 178,
      ultimaAtualizacao: '2024-02-28'
    },
    {
      id: 3,
      nome: 'Estatuto Social - Empresa Ltda',
      categoria: 'Societário',
      descricao: 'Modelo para constituição de sociedade limitada',
      formato: 'DOCX',
      downloads: 89,
      ultimaAtualizacao: '2024-03-10'
    },
    {
      id: 4,
      nome: 'Recurso Ordinário',
      categoria: 'Recursos',
      descricao: 'Modelo para interposição de recurso ordinário',
      formato: 'PDF',
      downloads: 132,
      ultimaAtualizacao: '2024-01-20'
    }
  ];

  const categorias = ['todos', 'Contratos', 'Petições', 'Recursos', 'Societário'];

  const modelosFiltrados = modelos.filter(modelo => {
    const buscaMatch = modelo.nome.toLowerCase().includes(busca.toLowerCase()) ||
      modelo.descricao.toLowerCase().includes(busca.toLowerCase());
    
    const categoriaMatch = categoriaSelecionada === 'todos' || 
      modelo.categoria === categoriaSelecionada;
    
    return buscaMatch && categoriaMatch;
  });

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
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        
        <select
          className="card-juridico p-3"
          value={categoriaSelecionada}
          onChange={(e) => setCategoriaSelecionada(e.target.value)}
        >
          {categorias.map(categoria => (
            <option key={categoria} value={categoria}>
              {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </option>
          ))}
        </select>
        
        <button className="btn-primary flex items-center justify-center gap-2">
          <FileText className="w-5 h-5" />
          Novo Modelo
        </button>
      </div>

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
          <div key={modelo.id} className="card-juridico p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="texto-escuro text-xl font-semibold">{modelo.nome}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {modelo.categoria} • {modelo.formato}
                </p>
              </div>
              <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                {modelo.downloads} downloads
              </span>
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
                <button className="btn-primary flex items-center gap-2 px-4 py-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <FileText className="w-4 h-4" />
                  Visualizar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}