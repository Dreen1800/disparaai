import React from 'react';
import { BarChart2 } from 'lucide-react';

const AnalyticsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Analytics</h2>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm">
            <option>Últimos 30 dias</option>
            <option>Este mês</option>
            <option>Último trimestre</option>
            <option>Personalizado</option>
          </select>
          <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-200">
            Exportar
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">ROI</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">18.3x</h3>
          <div className="text-xs text-green-600 mt-2 flex items-center">
            <span>Excelente</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Tempo Médio de Conversão</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">3.2h</h3>
          <div className="text-xs text-green-600 mt-2 flex items-center">
            <span>-15min vs. mês anterior</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Custo por Recuperação</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">R$ 0.12</h3>
          <div className="text-xs text-green-600 mt-2 flex items-center">
            <span>-3% vs. mês anterior</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Desempenho por Número</h3>
          <div className="h-64 bg-gray-50 rounded border border-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Gráfico de desempenho por número WhatsApp</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Tempo para Conversão</h3>
          <div className="h-64 bg-gray-50 rounded border border-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Gráfico de tempo médio para conversão</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Desempenho por Mensagem</h3>
        
        <div className="overflow-hidden">
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
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Mensagem Inicial</td>
                <td className="px-6 py-4 text-sm text-gray-500">Carrinho Abandonado</td>
                <td className="px-6 py-4 text-sm text-gray-500">3,245</td>
                <td className="px-6 py-4 text-sm text-gray-500">812</td>
                <td className="px-6 py-4 text-sm text-gray-500">25.0%</td>
                <td className="px-6 py-4 text-sm text-gray-500">432 (13.3%)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Follow-up 24h</td>
                <td className="px-6 py-4 text-sm text-gray-500">Carrinho Abandonado</td>
                <td className="px-6 py-4 text-sm text-gray-500">2,432</td>
                <td className="px-6 py-4 text-sm text-gray-500">321</td>
                <td className="px-6 py-4 text-sm text-gray-500">13.2%</td>
                <td className="px-6 py-4 text-sm text-gray-500">187 (7.7%)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Oferta de Desconto</td>
                <td className="px-6 py-4 text-sm text-gray-500">Follow-up 48h</td>
                <td className="px-6 py-4 text-sm text-gray-500">1,876</td>
                <td className="px-6 py-4 text-sm text-gray-500">412</td>
                <td className="px-6 py-4 text-sm text-gray-500">22.0%</td>
                <td className="px-6 py-4 text-sm text-gray-500">245 (13.1%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;