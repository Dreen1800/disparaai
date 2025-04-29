import React from 'react';
import { Calendar, Clock, MessageCircle, Filter } from 'lucide-react';

const ScheduleView = () => {
  // Sample scheduled messages data
  const scheduledMessages = [
    { 
      id: 1, 
      flow: 'Carrinho Abandonado - Primeira Compra', 
      recipient: 'Cliente #4526', 
      scheduledFor: new Date(2025, 3, 28, 14, 30), 
      status: 'pending' 
    },
    { 
      id: 2, 
      flow: 'Carrinho Abandonado - Primeira Compra', 
      recipient: 'Cliente #4527', 
      scheduledFor: new Date(2025, 3, 28, 15, 0), 
      status: 'pending' 
    },
    { 
      id: 3, 
      flow: 'Carrinho Abandonado - Cliente Fidelizado', 
      recipient: 'Cliente #4520', 
      scheduledFor: new Date(2025, 3, 28, 16, 0), 
      status: 'pending' 
    },
    { 
      id: 4, 
      flow: 'Retorno após 30 dias', 
      recipient: 'Cliente #4215', 
      scheduledFor: new Date(2025, 3, 28, 10, 0), 
      status: 'sent' 
    },
    { 
      id: 5, 
      flow: 'Carrinho Abandonado - Primeira Compra', 
      recipient: 'Cliente #4485', 
      scheduledFor: new Date(2025, 3, 28, 11, 30), 
      status: 'sent' 
    }
  ];
  
  // Format date function
  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date function
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Agendamentos</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar agendamentos..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
            <Filter size={16} />
            <span>Filtrar</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button className="px-6 py-3 font-medium text-blue-600 border-b-2 border-blue-600">
            Agendados
          </button>
          <button className="px-6 py-3 font-medium text-gray-500 hover:text-gray-700">
            Enviados
          </button>
          <button className="px-6 py-3 font-medium text-gray-500 hover:text-gray-700">
            Falhas
          </button>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fluxo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destinatário
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horário
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scheduledMessages.map((message) => (
              <tr key={message.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {message.flow}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {message.recipient}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    {formatDate(message.scheduledFor)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-2 text-gray-400" />
                    {formatTime(message.scheduledFor)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    message.status === 'sent' ? 'bg-green-100 text-green-800' : 
                    message.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {message.status === 'sent' ? 'Enviado' : 
                     message.status === 'pending' ? 'Agendado' : 'Falha'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                  <button className="text-gray-600 hover:text-gray-900">Cancelar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Mostrando <span className="font-medium">1</span> a <span className="font-medium">5</span> de <span className="font-medium">12</span> resultados
            </span>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50">
              Anterior
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50">
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;