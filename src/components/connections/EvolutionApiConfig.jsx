import React, { useState, useEffect } from 'react';
import { Server, QrCode, MessageCircle, Copy, Check, Database, RefreshCcw, AlertTriangle } from 'lucide-react';
import evolutionApiService from '../../services/evolutionApiService';
import EvolutionInstanceDetail from './EvolutionInstanceDetail';

const EvolutionApiConfig = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('connection');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected
  const [instances, setInstances] = useState([
    { id: 1, name: 'recovery-primary', status: 'connected' },
    { id: 2, name: 'recovery-secondary', status: 'qrcode' }
  ]);
  const [selectedInstance, setSelectedInstance] = useState(null);

  // Mock API key for demonstration
  const apiKey = "evolution_api_key_123456";

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = async () => {
    setLoading(true);
    setConnectionStatus('connecting');
    
    try {
      // Tentar conectar com a Evolution API
      const response = await evolutionApiService.checkConnection();
      
      if (response && response.status === 200) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Erro ao conectar com a Evolution API:', error);
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar instâncias ao montar o componente
  useEffect(() => {
    // Em uma implementação real, buscaríamos as instâncias da API
    // Exemplo: evolutionApiService.getAllInstances().then(data => setInstances(data));
  }, []);
  
  // Função para gerenciar uma instância
  const handleManageInstance = (instance) => {
    setSelectedInstance(instance.name);
  };
  
  // Função para criar uma nova instância
  const handleCreateInstance = () => {
    // Em uma implementação real, abriríamos um modal com o form de criação
    alert('Funcionalidade de criação de instância será implementada em breve.');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {selectedInstance ? (
        <EvolutionInstanceDetail 
          instanceName={selectedInstance} 
          onClose={() => setSelectedInstance(null)} 
        />
      ) : (
        <>
          <div className="flex items-center pb-4 border-b border-gray-200">
            <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
              <Server size={24} />
            </div>
            <div>
              <h3 className="font-medium text-lg text-gray-800">Evolution API (WhatsApp)</h3>
              <p className="text-sm text-gray-500">API open-source para integração com WhatsApp</p>
            </div>
          </div>
          
          <div className="border-b border-gray-200 pb-4">
            <div className="flex space-x-4 mb-6">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'connection' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveTab('connection')}
              >
                Conexão
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'instances' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveTab('instances')}
              >
                Instâncias
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'webhooks' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveTab('webhooks')}
              >
                Webhooks
              </button>
            </div>


        {activeTab === 'connection' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL do Servidor</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" 
                placeholder="Ex: https://seu-servidor-evolution.com" 
                defaultValue="https://api.evolution-whatsapp.com"
              />
              <p className="mt-1 text-xs text-gray-500">URL base da sua instalação da Evolution API</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <div className="flex">
                <input 
                  type="password" 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-purple-500 focus:border-purple-500" 
                  defaultValue={apiKey}
                  onChange={(e) => {
                    // Atualização da API key em tempo real poderia ser implementada aqui
                  }}
                />
                <button 
                  className="bg-gray-100 px-3 py-2 border border-gray-300 border-l-0 rounded-r-lg text-gray-600 hover:bg-gray-200 flex items-center"
                  onClick={handleCopyApiKey}
                >
                  {!copied ? <Copy size={16} className="mr-1" /> : <Check size={16} className="mr-1" />}
                  {!copied ? "Copiar" : "Copiado!"}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Chave de autenticação configurada no servidor</p>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start">
              <AlertTriangle size={18} className="text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-700">
                  Você deve ter uma instalação da Evolution API em um servidor para utilizar esta funcionalidade.
                  <a href="https://doc.evolution-api.com/v2/en/get-started/introduction" target="_blank" rel="noopener noreferrer" className="text-purple-600 ml-1 hover:underline">
                    Saiba mais na documentação oficial.
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                className={`px-4 py-2 rounded-lg text-white font-medium flex items-center ${
                  connectionStatus === 'connected' ? 'bg-green-600 hover:bg-green-700' : 
                  connectionStatus === 'connecting' ? 'bg-yellow-600 hover:bg-yellow-700' : 
                  'bg-purple-600 hover:bg-purple-700'
                }`}
                onClick={handleConnect}
                disabled={loading}
              >
                {loading ? (
                  <RefreshCcw size={18} className="mr-2 animate-spin" />
                ) : connectionStatus === 'connected' ? (
                  <Check size={18} className="mr-2" />
                ) : (
                  <Database size={18} className="mr-2" />
                )}
                {connectionStatus === 'connected' ? 'Conectado' : 
                 connectionStatus === 'connecting' ? 'Conectando...' : 'Testar Conexão'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'instances' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Instâncias Ativas</h4>
              <button 
                className="bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-100"
                onClick={handleCreateInstance}
              >
                + Nova Instância
              </button>
            </div>
            
            <div className="space-y-3">
              {instances.map((instance) => (
                <div key={instance.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      instance.status === 'connected' ? 'bg-green-100' : 
                      instance.status === 'qrcode' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {instance.status === 'connected' ? (
                        <MessageCircle size={20} className="text-green-600" />
                      ) : instance.status === 'qrcode' ? (
                        <QrCode size={20} className="text-yellow-600" />
                      ) : (
                        <AlertTriangle size={20} className="text-red-600" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">{instance.name}</h5>
                      <div className="flex items-center text-sm">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          instance.status === 'connected' ? 'bg-green-500' : 
                          instance.status === 'qrcode' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className={`${
                          instance.status === 'connected' ? 'text-green-600' : 
                          instance.status === 'qrcode' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {instance.status === 'connected' ? 'Conectado' : 
                           instance.status === 'qrcode' ? 'Aguardando QR Code' : 'Desconectado'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="text-purple-600 hover:text-purple-800"
                      onClick={() => handleManageInstance(instance)}
                    >
                      Gerenciar
                    </button>
                    {instance.status === 'connected' && (
                      <button className="text-red-600 hover:text-red-800">Desconectar</button>
                    )}
                  </div>
                </div>
              ))}
              
              {instances.length === 0 && (
                <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">Nenhuma instância encontrada</p>
                  <button 
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    onClick={handleCreateInstance}
                  >
                    Criar Nova Instância
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'webhooks' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL do Webhook</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" 
                placeholder="https://seu-site.com/api/webhook" 
                defaultValue="https://dispararpro.com/api/evolution-webhook"
              />
              <p className="mt-1 text-xs text-gray-500">URL que receberá eventos da Evolution API</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eventos para monitorar</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center">
                  <input type="checkbox" id="qrcode_updated" className="h-4 w-4 text-purple-600 rounded border-gray-300" defaultChecked />
                  <label htmlFor="qrcode_updated" className="ml-2 text-sm text-gray-700">QRCODE_UPDATED</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="messages_upsert" className="h-4 w-4 text-purple-600 rounded border-gray-300" defaultChecked />
                  <label htmlFor="messages_upsert" className="ml-2 text-sm text-gray-700">MESSAGES_UPSERT</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="messages_update" className="h-4 w-4 text-purple-600 rounded border-gray-300" defaultChecked />
                  <label htmlFor="messages_update" className="ml-2 text-sm text-gray-700">MESSAGES_UPDATE</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="send_message" className="h-4 w-4 text-purple-600 rounded border-gray-300" defaultChecked />
                  <label htmlFor="send_message" className="ml-2 text-sm text-gray-700">SEND_MESSAGE</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="connection_update" className="h-4 w-4 text-purple-600 rounded border-gray-300" defaultChecked />
                  <label htmlFor="connection_update" className="ml-2 text-sm text-gray-700">CONNECTION_UPDATE</label>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                className="text-sm text-purple-600 font-medium flex items-center"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? "Ocultar opções avançadas" : "Mostrar opções avançadas"}
              </button>
            </div>

            {showAdvanced && (
              <div className="pt-2 space-y-4 border-t border-gray-100">
                <div className="flex items-center">
                  <input type="checkbox" id="webhook_by_events" className="h-4 w-4 text-purple-600 rounded border-gray-300" />
                  <label htmlFor="webhook_by_events" className="ml-2 text-sm text-gray-700">
                    Separar eventos em URLs diferentes
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input type="checkbox" id="webhook_base64" className="h-4 w-4 text-purple-600 rounded border-gray-300" />
                  <label htmlFor="webhook_base64" className="ml-2 text-sm text-gray-700">
                    Receber mídia em Base64
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h4 className="font-medium text-gray-700 mb-3">Configurações de Limites</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Limite de mensagens por minuto</p>
              <p className="text-xs text-gray-500">Protege contra bloqueios do WhatsApp</p>
            </div>
            <div className="flex items-center space-x-2">
              <input type="number" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" defaultValue="20" />
              <span className="text-gray-500">msg/min</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Intervalo entre mensagens</p>
              <p className="text-xs text-gray-500">Tempo mínimo entre mensagens</p>
            </div>
            <div className="flex items-center space-x-2">
              <input type="number" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" defaultValue="3" />
              <span className="text-gray-500">segundos</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="rotacao" className="h-4 w-4 text-purple-600 rounded border-gray-300" defaultChecked />
            <label htmlFor="rotacao" className="ml-2 text-sm text-gray-700">
              Habilitar rotação automática de instâncias
            </label>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="retry_failed" className="h-4 w-4 text-purple-600 rounded border-gray-300" defaultChecked />
            <label htmlFor="retry_failed" className="ml-2 text-sm text-gray-700">
              Tentar novamente mensagens com falha
            </label>
          </div>
        </div>
      </div>
      
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Salvar Configurações
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EvolutionApiConfig;