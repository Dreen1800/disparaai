import React from 'react';
import { Database } from 'lucide-react';

const OfficialApiConfig = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center pb-4 border-b border-gray-200">
        <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mr-4">
          <Database size={24} />
        </div>
        <div>
          <h3 className="font-medium text-lg text-gray-800">WhatsApp Business Cloud API</h3>
          <p className="text-sm text-gray-500">API oficial da Meta para envio de mensagens WhatsApp</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-gray-700">Status da API</h4>
            <div className="flex items-center mt-1">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-green-600">Conectado e funcionando</span>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Verificar status</button>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-700 mb-3">Credenciais da API</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number ID</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Ex: 1234567890" 
                defaultValue="1029384756"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
              <div className="flex">
                <input 
                  type="password" 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500" 
                  defaultValue="EAAHRz7c6ZA0kBADHvUFY..."
                />
                <button className="bg-gray-100 px-3 py-2 border border-gray-300 border-l-0 rounded-r-lg text-gray-600 hover:bg-gray-200">
                  Mostrar
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Account ID</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Ex: 1234567890" 
                defaultValue="9876543210"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-700 mb-3">Templates Aprovados</h4>
          
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Template</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">carrinho_abandonado</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Aprovado
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Visualizar</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">follow_up_desconto</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Aprovado
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Visualizar</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">confirmacao_compra</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Em análise
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Visualizar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-3 flex justify-end">
            <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 font-medium text-sm">
              + Adicionar Novo Template
            </button>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-700 mb-3">Configurações de Limites</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Mensagens diárias por número</p>
                <p className="text-xs text-gray-500">Limite máximo de mensagens enviadas por cada número</p>
              </div>
              <div className="flex items-center space-x-2">
                <input type="number" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" defaultValue="1000" />
                <span className="text-gray-500">msg/dia</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Intervalo entre mensagens</p>
                <p className="text-xs text-gray-500">Tempo mínimo entre mensagens para o mesmo contato</p>
              </div>
              <div className="flex items-center space-x-2">
                <input type="number" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" defaultValue="6" />
                <span className="text-gray-500">horas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};

export default OfficialApiConfig;