// components/FinanceChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', receita: 40000, despesas: 32000 },
  { month: 'Fev', receita: 45000, despesas: 38000 },
  { month: 'Mar', receita: 35000, despesas: 29000 },
];

export function FinanceChart() {
  return (
    <div className="card-juridico">
      <div className="flex justify-between items-center mb-6">
        <h2 className="texto-escuro text-xl font-semibold">Fluxo Financeiro</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm">Receitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm">Despesas</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
  formatter={(value) => 
    `${new Intl.NumberFormat('pt-MZ').format(value as number)} MT`
  }
/>
            <Legend />
            <Bar dataKey="receita" fill="#3B82F6" name="Receitas" />
            <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}