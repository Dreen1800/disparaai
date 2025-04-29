import React from 'react';
import { BarChart2, ChevronRight, Download, Filter, Activity, TrendingUp, DollarSign } from 'lucide-react';

const AnalyticsView = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
          <p className="text-gray-500 mt-1">Estatísticas detalhadas do desempenho da recuperação</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <select className="appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Últimos 30 dias</option>
              <option>Este mês</option>
              <option>Último trimestre</option>
              <option>Personalizado</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronRight size={16} className="transform rotate-90 text-gray-400" />
            </div>
          </div>
          <button className="flex items-center justify-center bg-white text-gray-600 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <Download size={18} className="mr-2" />
            <span>Exportar</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">ROI</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">18.3x</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="text-xs text-green-600 mt-4 flex items-center">
            <div className="flex items-center justify-center p-1 bg-green-100 rounded-full mr-1.5">
              <ChevronRight size={12} className="transform rotate-90" />
            </div>
            <span>Excelente</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tempo Médio de Conversão</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">3.2h</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Activity size={20} />
            </div>
          </div>
          <div className="text-xs text-green-600 mt-4 flex items-center">
            <div className="flex items-center justify-center p-1 bg-green-100 rounded-full mr-1.5">
              <ChevronRight size={12} className="transform rotate-90" />
            </div>
            <span>-15min vs. mês anterior</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Custo por Recuperação</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">R$ 0.12</h3>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="text-xs text-green-600 mt-4 flex items-center">
            <div className="flex items-center justify-center p-1 bg-green-100 rounded-full mr-1.5">
              <ChevronRight size={12} className="transform rotate-90" />
            </div>
            <span>-3% vs. mês anterior</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Desempenho por Número</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <Filter size={16} />
            </button>
          </div>
          <div className="h-64 rounded flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <span className="text-gray-400">Gráfico de desempenho por número WhatsApp</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Tempo para Conversão</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <Filter size={16} />
            </button>
          </div>
          <div className="h-64 rounded flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
            <span className="text-gray-400">Gráfico de tempo médio para conversão</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Desempenho por Mensagem</h3>
          <button className="flex items-center space-x-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-600">
            <Filter size={14} />
            <span>Filtrar</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensagem</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fluxo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enviadas</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respostas</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taxa de Resposta</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversões</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Mensagem Inicial</td>
                <td className="px-6 py-4 text-sm text-gray-500">Carrinho Abandonado</td>
                <td className="px-6 py-4 text-sm text-gray-500">3,245</td>
                <td className="px-6 py-4 text-sm text-gray-500">812</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">25.0%</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className="font-medium text-green-600">432</span> (13.3%)
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Follow-up 24h</td>
                <td className="px-6 py-4 text-sm text-gray-500">Carrinho Abandonado</td>
                <td className="px-6 py-4 text-sm text-gray-500">2,432</td>
                <td className="px-6 py-4 text-sm text-gray-500">321</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">13.2%</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className="font-medium text-green-600">187</span> (7.7%)
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Oferta de Desconto</td>
                <td className="px-6 py-4 text-sm text-gray-500">Follow-up 48h</td>
                <td className="px-6 py-4 text-sm text-gray-500">1,876</td>
                <td className="px-6 py-4 text-sm text-gray-500">412</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">22.0%</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className="font-medium text-green-600">245</span> (13.1%)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;