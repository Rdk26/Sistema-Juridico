// pages/RelatoriosPage.tsx
import { useState } from 'react';
import { Filter, Download, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import {
  BarChart,
  PieChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie
} from 'recharts';
import { utils, writeFile } from 'xlsx';
import { saveAs } from 'file-saver';

type RelatorioTipo = 
  | 'financeiro'
  | 'processos-por-status'
  | 'atividades-por-tipo'
  | 'notificacoes-por-tribunal';

type Periodo = 
  | 'ultimos-7-dias' 
  | 'mes-atual' 
  | 'trimestre' 
  | 'ano-atual' 
  | 'personalizado';

// Dados mockados com exemplos moçambicanos
const dadosMock = {
  financeiro: [
    { mes: 'Jan', receita: 450000, despesa: 320000 },
    { mes: 'Fev', receita: 480000, despesa: 340000 },
    { mes: 'Mar', receita: 510000, despesa: 360000 },
  ],
  processosStatus: [
    { status: 'Ativo', quantidade: 45 },
    { status: 'Arquivado', quantidade: 12 },
    { status: 'Concluído', quantidade: 23 },
  ],
  atividadesTipo: [
    { tipo: 'Audiência', quantidade: 32 },
    { tipo: 'Petição', quantidade: 45 },
    { tipo: 'Consulta', quantidade: 18 },
  ],
  notificacoesTribunal: [
    { tribunal: 'TJCM', quantidade: 28 },
    { tribunal: 'TJB', quantidade: 15 },
    { tribunal: 'TRM', quantidade: 9 },
  ]
};

export default function RelatoriosPage() {
  const [tipoRelatorio, setTipoRelatorio] = useState<RelatorioTipo>('financeiro');
  const [periodo, setPeriodo] = useState<Periodo>('mes-atual');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const getDadosRelatorio = () => {
    switch(tipoRelatorio) {
      case 'financeiro': 
        return dadosMock.financeiro;
      case 'processos-por-status':
        return dadosMock.processosStatus;
      case 'atividades-por-tipo':
        return dadosMock.atividadesTipo;
      case 'notificacoes-por-tribunal':
        return dadosMock.notificacoesTribunal;
      default:
        return [];
    }
  };

  const handleExportExcel = () => {
    const worksheet = utils.json_to_sheet(getDadosRelatorio());
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Relatório");
    const excelBuffer = writeFile(workbook, "relatorio.xlsx", { type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "relatorio.xlsx");
  };

  const renderGrafico = () => {
    const dados = getDadosRelatorio();
    
    switch(tipoRelatorio) {
      case 'financeiro':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="receita" fill="#3B82F6" name="Receita (MT)" />
              <Bar dataKey="despesa" fill="#EF4444" name="Despesa (MT)" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'processos-por-status':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={dados}
                dataKey="quantidade"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="quantidade" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <h1 className="text-3xl font-bold texto-escuro">Relatórios Analíticos</h1>
        <div className="flex gap-2">
          <Button onClick={handleExportExcel}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select value={tipoRelatorio} onValueChange={v => setTipoRelatorio(v as RelatorioTipo)}>
          <SelectTrigger className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <SelectValue placeholder="Tipo de Relatório" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="financeiro">Financeiro</SelectItem>
            <SelectItem value="processos-por-status">Processos por Status</SelectItem>
            <SelectItem value="atividades-por-tipo">Atividades por Tipo</SelectItem>
            <SelectItem value="notificacoes-por-tribunal">Notificações por Tribunal</SelectItem>
          </SelectContent>
        </Select>

        <Select value={periodo} onValueChange={v => setPeriodo(v as Periodo)}>
          <SelectTrigger className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ultimos-7-dias">Últimos 7 dias</SelectItem>
            <SelectItem value="mes-atual">Mês Atual</SelectItem>
            <SelectItem value="trimestre">Trimestre</SelectItem>
            <SelectItem value="ano-atual">Ano Atual</SelectItem>
            <SelectItem value="personalizado">Personalizado</SelectItem>
          </SelectContent>
        </Select>

        {periodo === 'personalizado' && (
          <div className="flex gap-2">
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="card-juridico p-2"
            />
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="card-juridico p-2"
            />
          </div>
        )}
      </div>

      <div className="card-juridico p-6">
        {renderGrafico()}

        <div className="mt-6 overflow-x-auto">
          <table className="tabela-juridica w-full">
            <thead>
              <tr>
                {Object.keys(getDadosRelatorio()[0]).map(key => (
                  <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getDadosRelatorio().map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}