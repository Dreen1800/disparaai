import React from 'react';
import { BarChart2 } from 'lucide-react';

const DashboardView = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm">
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
            <option>Este mês</option>
            <option>Personalizado</option>
          </select>
          <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-200">
            Exportar
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Total de Mensagens</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">8,492</h3>
          <div className="text-xs text-green-600 mt-2 flex items-center">
            <span>+12% vs. período anterior</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Taxa de Recuperação</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">23.4%</h3>
          <div className="text-xs text-green-600 mt-2 flex items-center">
            <span>+3.2% vs. período anterior</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Receita Recuperada</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">R$ 42,581</h3>
          <div className="text-xs text-green-600 mt-2 flex items-center">
            <span>+18% vs. período anterior</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Respostas Recebidas</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">1,245</h3>
          <div className="text-xs text-red-600 mt-2 flex items-center">
            <span>-2% vs. período anterior</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Desempenho por Fluxo</h3>
          <div className="h-64 bg-gray-50 rounded border border-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Gráfico de desempenho por fluxo</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Taxa de Conversão Diária</h3>
          <div className="h-64 bg-gray-50 rounded border border-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Gráfico de taxa de conversão</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Últimas Recuperações</h3>
        
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fluxo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">João Silva</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Carrinho Abandonado</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 357,90</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Recuperado
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hoje, 14:32</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Maria Oliveira</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Follow-up 24h</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 129,00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Recuperado
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ontem, 19:45</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pedro Santos</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Carrinho Abandonado</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ 892,50</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Em andamento
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ontem, 15:12</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;   