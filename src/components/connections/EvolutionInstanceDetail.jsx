import React, { useState, useEffect } from 'react';
import { MessageCircle, AlertTriangle, RefreshCw, CheckCircle, XCircle, QrCode } from 'lucide-react';
import evolutionApiService from '../../services/evolutionApiService';

const EvolutionInstanceDetail = ({ instanceName, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instanceData, setInstanceData] = useState(null);
  const [connectionState, setConnectionState] = useState('DISCONNECTED');
  const [qrCode, setQrCode] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);

  // Função para buscar informações da instância
  const fetchInstanceInfo = async () => {
    setLoading(true);
    try {
      // Aqui implementaríamos a busca real das informações da instância
      // const state = await evolutionApiService.getConnectionState(instanceName);
      
      // Dados de exemplo para simulação
      const state = {
        state: Math.random() > 0.5 ? 'CONNECTED' : 'DISCONNECTED',
        statusReason: 200
      };
      
      setConnectionState(state.state);
      
      // Simular carregamento de dados da instância
      setInstanceData({
        name: instanceName,
        createdAt: new Date().toISOString(),
        messagesCount: Math.floor(Math.random() * 10000),
        lastActivity: new Date().toISOString()
      });
    } catch (err) {
      console.error('Erro ao buscar informações da instância:', err);
      setError('Não foi possível carregar os dados da instância. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para gerar novo QR Code
  const generateQrCode = async () => {
    setShowQrCode(true);
    try {
      // Aqui implementaríamos a geração real do QR Code
      // const qrCodeData = await evolutionApiService.getQRCode(instanceName);
      
      // URL de exemplo para simular um QR Code
      setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WhatsAppConnect');
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
      setError('Não foi possível gerar o QR Code. Tente novamente.');
    }
  };

  // Carregar dados da instância ao montar o componente
  useEffect(() => {
    fetchInstanceInfo();
  }, [instanceName]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
            <MessageCircle size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-lg text-gray-800">Instância: {instanceName}</h3>
            <div className="flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                connectionState === 'CONNECTED' ? 'bg-green-500' : 
                connectionState === 'CONNECTING' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className={`${
                connectionState === 'CONNECTED' ? 'text-green-600' : 
                connectionState === 'CONNECTING' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {connectionState === 'CONNECTED' ? 'Conectado' : 
                 connectionState === 'CONNECTING' ? 'Conectando...' : 'Desconectado'}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Voltar
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <RefreshCw size={24} className="text-purple-600 animate-spin" />
          <span className="ml-2 text-gray-600">Carregando informações...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg flex items-start">
          <AlertTriangle size={20} className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-red-800">{error}</p>
            <button 
              onClick={fetchInstanceInfo} 
              className="mt-2 text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Informações da instância */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Criada em</p>
              <p className="font-medium text-gray-800">
                {new Date(instanceData.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Mensagens enviadas</p>
              <p className="font-medium text-gray-800">{instanceData.messagesCount.toLocaleString()}</p>
            </div>
          </div>

          {/* Controles da conexão */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-medium text-gray-700 mb-3">Controle de Conexão</h4>
            
            {connectionState === 'CONNECTED' ? (
              <div className="flex space-x-4">
                <button className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                  <CheckCircle size={18} className="mr-2" />
                  <span>Conectado</span>
                </button>
                <button className="flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                  <XCircle size={18} className="mr-2" />
                  <span>Desconectar</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button 
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    onClick={generateQrCode}
                  >
                    <QrCode size={18} className="mr-2" />
                    <span>Gerar QR Code</span>
                  </button>
                </div>
                
                {showQrCode && qrCode && (
                  <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg">
                    <p className="mb-4 text-gray-600 text-center">
                      Escaneie o QR Code abaixo usando o WhatsApp no seu celular
                    </p>
                    <img 
                      src={qrCode} 
                      alt="QR Code para conexão WhatsApp" 
                      className="w-48 h-48 mb-2"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      O QR Code expira em 30 segundos
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Estatísticas */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-medium text-gray-700 mb-3">Estatísticas</h4>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Última atividade</span>
                <span className="text-gray-800">
                  {new Date(instanceData.lastActivity).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Taxa de sucesso</span>
                <span className="text-green-600 font-medium">98.2%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Limite diário</span>
                <span className="text-gray-800">1,000 mensagens</span>
              </div>
            </div>
          </div>
          
          {/* Avançado */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-medium text-gray-700 mb-3">Operações Avançadas</h4>
            
            <div className="flex space-x-3">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                Reiniciar Instância
              </button>
              <button className="px-3 py-1.5 text-sm border border-red-300 rounded-lg hover:bg-red-50 text-red-600">
                Excluir Instância
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvolutionInstanceDetail;