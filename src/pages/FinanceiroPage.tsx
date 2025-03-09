// components/FinanceiroPage.tsx
import { useState } from 'react';
import { Banknote, Clock, TrendingUp, PieChart } from 'lucide-react';
import { 
  PieChart as RechartsPieChart,
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip, 
  Legend
} from 'recharts';
import { FinanceChart } from '../components/FinanceChart';

// Tipos
type Categoria = {
  nome: string;
  valor: number;
  cor: string;
};

type Metrica = {
  titulo: string;
  valor: string;
  icone: JSX.Element;
  variacao: string;
};

// Função de formatação monetária
const formatarMoeda = (valor: number) => {
  return `${new Intl.NumberFormat('pt-MZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor)} MT`; // Alterado para MT
};

export default function FinanceiroPage() {
  const [periodo, setPeriodo] = useState('mensal');

  // Dados mockados
  const metricas: Metrica[] = [
    { 
      titulo: "Receita Total", 
      valor: formatarMoeda(245600), 
      icone: <Banknote className="w-6 h-6" />,
      variacao: "+12% vs último mês"
    },
    { 
      titulo: "Despesas", 
      valor: formatarMoeda(178200), 
      icone: <Clock className="w-6 h-6" />,
      variacao: "-5% vs último mês"
    },
    { 
      titulo: "Saldo Atual", 
      valor: formatarMoeda(67400), 
      icone: <TrendingUp className="w-6 h-6" />,
      variacao: "+7% vs último mês"
    }
  ];

  const categorias: Categoria[] = [
    { nome: "Honorários", valor: 120000, cor: "#3B82F6" },
    { nome: "Despesas Operacionais", valor: 85600, cor: "#10B981" },
    { nome: "Impostos", valor: 45000, cor: "#F59E0B" },
    { nome: "Investimentos", valor: 35000, cor: "#6366F1" }
  ];

  return (
    <main className="flex-1 overflow-auto p-6">
      <h1 className="text-3xl font-bold mb-8 texto-escuro">Gestão Financeira</h1>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select 
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="card-juridico p-3"
        >
          <option value="mensal">Mensal</option>
          <option value="trimestral">Trimestral</option>
          <option value="anual">Anual</option>
        </select>
        
        <input 
          type="month" 
          className="card-juridico p-3"
          defaultValue="2024-03"
        />
        
        <select className="card-juridico p-3">
          <option>Todas Categorias</option>
          <option>Honorários</option>
          <option>Despesas Operacionais</option>
          <option>Impostos</option>
        </select>
        
        <button className="btn-primary flex items-center justify-center gap-2">
          <PieChart className="w-5 h-5" />
          Gerar Relatório
        </button>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metricas.map((metrica, index) => (
          <div key={index} className="card-juridico p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="texto-escuro text-lg font-semibold">{metrica.titulo}</p>
                <p className="text-3xl font-semibold mt-2 text-gray-900 dark:text-white">{metrica.valor}</p>
                <span className={`text-sm ${
                  metrica.variacao.startsWith('+') 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {metrica.variacao}
                </span>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                {metrica.icone}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FinanceChart />
        
        <div className="card-juridico p-6">
          <h2 className="texto-escuro text-xl font-semibold mb-6">Distribuição por Categoria</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categorias}
                  dataKey="valor"
                  nameKey="nome"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {categorias.map((entry, index) => (
                    <Cell key={index} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatarMoeda(value)}
                />
                <Legend 
                  formatter={(value) => (
                    <span className="texto-escuro">{value}</span>
                  )}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Últimas Transações */}
      <div className="card-juridico p-6">
        <h2 className="texto-escuro text-xl font-semibold mb-6">Últimas Transações</h2>
        <div className="overflow-x-auto">
          <table className="tabela-juridica w-full">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => {
                const valor = 15000 + (index * 2500);
                return (
                  <tr key={index} className="texto-escuro">
                    <td>2024-03-{15 + index}</td>
                    <td>Pagamento de Honorários #{index + 1}</td>
                    <td>Honorários</td>
                    <td className="font-mono">{formatarMoeda(valor)}</td>
                    <td>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Concluído
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}