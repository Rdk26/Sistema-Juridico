import React from 'react';
import { FileText, Calendar, Tag, Filter } from 'lucide-react';

export function ReportsSection() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-6">Relatórios</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Relatório</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select className="pl-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 py-2">
                <option>Financeiro</option>
                <option>Processual</option>
                <option>Atividades</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Período</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                className="pl-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 py-2"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select className="pl-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 py-2">
                <option>Todas</option>
                <option>Cível</option>
                <option>Trabalhista</option>
                <option>Tributário</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Situação</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select className="pl-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 py-2">
                <option>Todos</option>
                <option>Em andamento</option>
                <option>Concluídos</option>
                <option>Arquivados</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            Visualizar
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Gerar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}