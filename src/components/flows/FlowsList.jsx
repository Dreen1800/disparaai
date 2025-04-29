import React from 'react';

const FlowsList = () => {
  const flows = [
    { id: 1, name: 'Carrinho Abandonado - Primeira Compra', status: 'active', messages: 3, conversions: '24%' },
    { id: 2, name: 'Carrinho Abandonado - Cliente Fidelizado', status: 'active', messages: 2, conversions: '38%' },
    { id: 3, name: 'Retorno após 30 dias', status: 'paused', messages: 4, conversions: '12%' },
    { id: 4, name: 'Upsell Produto Complementar', status: 'draft', messages: 2, conversions: '0%' }
  ];
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Fluxo</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensagens</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taxa de Conversão</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {flows.map((flow) => (
            <tr key={flow.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{flow.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  flow.status === 'active' ? 'bg-green-100 text-green-800' : 
                  flow.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {flow.status === 'active' ? 'Ativo' : 
                   flow.status === 'paused' ? 'Pausado' : 'Rascunho'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{flow.messages}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{flow.conversions}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                <button className="text-gray-600 hover:text-gray-900">Duplicar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlowsList;