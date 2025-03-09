// pages/RelatoriosPage.tsx
import { useState } from 'react';
import { 
  Download, 
  Calendar,
  AlertCircle,
  BarChart4,
  PieChart as PieChartIcon,
  Info,
  Gavel,
  Clock,
  TrendingUp,
  Activity,
  Bell,
  CheckCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import {
  BarChart,
  PieChart as RechartsPieChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  Cell
} from 'recharts';
import ExcelJS from 'exceljs';
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

const coresGrafico = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#8B5CF6'];

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

  const handleExportExcel = async () => {
    const dados = getDadosRelatorio();
    if (dados.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório');

    const headers = Object.keys(dados[0]);
    worksheet.columns = headers.map(header => ({
      header: header.charAt(0).toUpperCase() + header.slice(1),
      key: header,
      width: 20
    }));

    dados.forEach(item => worksheet.addRow(item));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, `relatorio_${tipoRelatorio}.xlsx`);
  };

  const formatarValor = (value: number): string => {
    if (tipoRelatorio === 'financeiro') {
      return new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: 'MZN'
      }).format(value);
    }
    return value.toString();
  };

  const CardEstatistica = ({ titulo, valor, icone, variacao }: { 
    titulo: string;
    valor: string;
    icone: React.ReactNode;
    variacao?: string;
  }) => (
    <div className="card-juridico p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="bg-primary/10 p-3 rounded-full text-primary">{icone}</div>
      <div>
        <h3 className="texto-escuro font-medium">{titulo}</h3>
        <p className="text-2xl font-bold">{valor}</p>
        {variacao && (
          <span className={`text-sm ${
            variacao.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {variacao} vs período anterior
          </span>
        )}
      </div>
    </div>
  );

  const renderLegendaDetalhada = () => {
    switch(tipoRelatorio) {
      case 'processos-por-status':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card-juridico p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-[#3B82F6] rounded-full"></div>
                <h3 className="font-semibold">Processos Ativos</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Casos em andamento com atividades recentes
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold">45</span>
                <span className="text-sm text-green-600">+2 esta semana</span>
              </div>
            </div>

            <div className="card-juridico p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                <h3 className="font-semibold">Arquivados</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Casos sem movimentação há mais de 1 ano
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold">12</span>
                <span className="text-sm text-gray-500">Estável</span>
              </div>
            </div>

            <div className="card-juridico p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
                <h3 className="font-semibold">Concluídos</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Casos finalizados com sucesso
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold">23</span>
                <span className="text-sm text-green-600">+5 este mês</span>
              </div>
            </div>
          </div>
        );

      case 'atividades-por-tipo':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card-juridico p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Audiências</h3>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Próxima: 15/03/2024
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Duração média: 2h
                </p>
              </div>
            </div>

            <div className="card-juridico p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold">Petições</h3>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Tempo médio: 3 dias
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Taxa de sucesso: 82%
                </p>
              </div>
            </div>

            <div className="card-juridico p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold">Consultas</h3>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Clientes/mês: 18
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Horas totais: 42h
                </p>
              </div>
            </div>
          </div>
        );

      case 'notificacoes-por-tribunal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card-juridico p-4 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold">Urgentes</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Prazos a vencer em 7 dias
              </p>
              <p className="text-2xl font-bold mt-2">5</p>
            </div>

            <div className="card-juridico p-4 bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">Concluídas</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Cumpridas no prazo
              </p>
              <p className="text-2xl font-bold mt-2">28</p>
            </div>

            <div className="card-juridico p-4 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold">Em Andamento</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Prazos maiores que 15 dias
              </p>
              <p className="text-2xl font-bold mt-2">14</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderGrafico = () => {
    const dados = getDadosRelatorio();
    
    switch(tipoRelatorio) {
      case 'financeiro':
        return (
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="mes" 
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              tickFormatter={(value: number) => formatarValor(value)}
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip 
              formatter={(value: number) => formatarValor(value)}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Legend 
              formatter={(value) => (
                <span className="text-gray-600 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
            <Bar 
              dataKey="receita" 
              fill="#3B82F6" 
              name="Receita (MT)"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="despesa" 
              fill="#EF4444" 
              name="Despesa (MT)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'processos-por-status':
        return (
          <RechartsPieChart>
            <Pie
              data={dados}
              dataKey="quantidade"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={2}
              label={({ 
                name, 
                percent 
              }) => `${name}\n${(percent * 100).toFixed(0)}%`}
            >
              {dados.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={coresGrafico[index % coresGrafico.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [
                formatarValor(value),
                'Quantidade'
              ]}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
          </RechartsPieChart>
        );

      case 'atividades-por-tipo':
        return (
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="tipo" 
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip 
              formatter={(value: number) => [
                formatarValor(value),
                'Quantidade'
              ]}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Legend 
              formatter={(value) => (
                <span className="text-gray-600 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
            <Bar 
              dataKey="quantidade" 
              fill="#3B82F6"
              name="Atividades"
              radius={[4, 4, 0, 0]}
              label={{ 
                position: 'top', 
                fill: '#1e293b',
                formatter: (value: number) => value
              }}
            />
          </BarChart>
        );

      case 'notificacoes-por-tribunal':
        return (
          <RechartsPieChart>
            <Pie
              data={dados}
              dataKey="quantidade"
              nameKey="tribunal"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={70}
              paddingAngle={2}
              label={({ 
                tribunal, 
                percent 
              }) => `${tribunal}\n${(percent * 100).toFixed(0)}%`}
            >
              {dados.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={coresGrafico[index % coresGrafico.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [
                formatarValor(value),
                'Notificações'
              ]}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle"
              formatter={(value) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
          </RechartsPieChart>
        );

      default:
        return null;
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex flex-col gap-4">
        <h1 className="text-3xl font-bold texto-escuro flex items-center gap-3">
          <BarChart4 className="w-8 h-8" />
          Relatórios Analíticos
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardEstatistica
            titulo="Receita Total"
            valor={new Intl.NumberFormat('pt-MZ', {
              style: 'currency',
              currency: 'MZN'
            }).format(2456000)}
            icone={<TrendingUp className="w-6 h-6" />}
            variacao="+12%"
          />
          
          <CardEstatistica
            titulo="Processos Ativos"
            valor="45"
            icone={<Gavel className="w-6 h-6" />}
          />
          
          <CardEstatistica
            titulo="Média de Resolução"
            valor="28 dias"
            icone={<Clock className="w-6 h-6" />}
            variacao="-5%"
          />
        </div>
      </div>

      <Tabs value={tipoRelatorio} onValueChange={v => setTipoRelatorio(v as RelatorioTipo)}>
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <TabsTrigger value="financeiro">
              <span className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4" />
                Financeiro
              </span>
            </TabsTrigger>
            <TabsTrigger value="processos-por-status">
              <span className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Status
              </span>
            </TabsTrigger>
            <TabsTrigger value="atividades-por-tipo">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Atividades
              </span>
            </TabsTrigger>
            <TabsTrigger value="notificacoes-por-tribunal">
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notificações
              </span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 items-start">
            <Button onClick={handleExportExcel} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <TabsContent value={tipoRelatorio}>
          <div className="card-juridico p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Select value={periodo} onValueChange={v => setPeriodo(v as Periodo)}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Calendar className="w-4 h-4 mr-2" />
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
                <div className="flex gap-2 flex-1">
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="card-juridico p-2 flex-1"
                    aria-label="Data inicial"
                  />
                  <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="card-juridico p-2 flex-1"
                    aria-label="Data final"
                  />
                </div>
              )}
            </div>

            {renderLegendaDetalhada()}

            <div className="h-[400px] mb-8">
              <ResponsiveContainer width="100%" height="100%">
              {renderGrafico() ?? <div />}
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto">
              <table className="tabela-juridica w-full">
                <thead>
                  <tr>
                    {Object.keys(getDadosRelatorio()[0] || {}).map(key => (
                      <th key={key} className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                          <Info className="w-4 h-4 ml-2 inline-block text-gray-400" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getDadosRelatorio().map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      {Object.values(item).map((value, i) => (
                        <td key={i} className="px-4 py-3 whitespace-nowrap">
                          {typeof value === 'number' ? formatarValor(value) : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}