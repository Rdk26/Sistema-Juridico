import { ProcessTable } from '../components/ProcessTable';

export default function ProcessosPage() {
  return (
    <main className="flex-1 overflow-auto p-6">
      <h1 className="text-3xl font-bold mb-8 texto-escuro">Gestão de Processos</h1>
      
      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input 
          type="text" 
          placeholder="Buscar cliente..." 
          className="card-juridico p-3"
        />
        <select className="card-juridico p-3">
          <option>Todos os status</option>
          <option>Em andamento</option>
          <option>Concluído</option>
        </select>
        <input 
          type="date" 
          className="card-juridico p-3"
        />
      </div>

      {/* Tabela */}
      <ProcessTable />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="card-juridico p-6">
          <h3 className="texto-escuro text-lg font-semibold">Processos Ativos</h3>
          <p className="text-4xl text-primary font-bold mt-2">24</p>
        </div>
        
        <div className="card-juridico p-6">
          <h3 className="texto-escuro text-lg font-semibold">Prazo Médio</h3>
          <p className="text-4xl text-primary font-bold mt-2">45 dias</p>
        </div>
        
        <div className="card-juridico p-6">
          <h3 className="texto-escuro text-lg font-semibold">Taxa de Sucesso</h3>
          <p className="text-4xl text-primary font-bold mt-2">82%</p>
        </div>
      </div>
    </main>
  );
}