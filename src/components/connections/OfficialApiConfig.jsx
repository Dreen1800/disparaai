// src/components/connections/OfficialApiConfig.jsx
import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, Check } from 'lucide-react';
import { connectionService } from '../../services/connectionService';
import { useAuth } from '../../contexts/AuthContext';

const OfficialApiConfig = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connection, setConnection] = useState(null);
  const [formData, setFormData] = useState({
    name: 'WhatsApp Business API',
    phoneNumberId: '',
    accessToken: '',
    businessAccountId: '',
    dailyLimit: 1000,
    messageInterval: 6 // em horas
  });
  
  // Buscar conexão existente
  useEffect(() => {
    const fetchConnection = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Buscar conexões do tipo 'official'
        const connections = await connectionService.getConnectionsByType(user.id, 'official');
        
        if (connections && connections.length > 0) {
          const conn = connections[0];
          setConnection(conn);
          
          // Preencher o formulário com os dados salvos
          if (conn.credentials) {
            setFormData({
              name: conn.name,
              phoneNumberId: conn.credentials.phoneNumberId || '',
              accessToken: conn.credentials.accessToken || '',
              businessAccountId: conn.credentials.businessAccountId || '',
              dailyLimit: conn.settings?.dailyLimit || 1000,
              messageInterval: conn.settings?.messageInterval || 6
            });
          }
        }
      } catch (error) {
        console.error('Erro ao buscar conexão:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConnection();
  }, [user]);
  
  // Atualizar campo do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Testar conexão
  const handleTestConnection = async () => {
    // Implementar teste real da conexão
    alert('Funcionalidade de teste será implementada em breve.');
  };
  
  // Salvar configurações
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setSaving(true);
      
      // Preparar dados para salvar
      const connectionData = {
        user_id: user.id,
        name: formData.name,
        type: 'official',
        status: connection?.status || 'disconnected',
        credentials: {
          phoneNumberId: formData.phoneNumberId,
          accessToken: formData.accessToken,
          businessAccountId: formData.businessAccountId
        },
        settings: {
          dailyLimit: parseInt(formData.dailyLimit) || 1000,
          messageInterval: parseInt(formData.messageInterval) || 6
        }
      };
      
      let savedConnection;
      
      if (connection) {
        // Atualizar conexão existente
        savedConnection = await connectionService.updateConnection(connection.id, connectionData);
      } else {
        // Criar nova conexão
        savedConnection = await connectionService.createConnection(connectionData);
      }
      
      setConnection(savedConnection);
      alert('Configurações salvas com sucesso!');
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Ocorreu um erro ao salvar as configurações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="ml-3 text-gray-500">Carregando...</p>
      </div>
    );
  }
  
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
              <div className={`w-3 h-3 rounded-full ${connection?.status === 'connected' ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
              <span className="text-sm text-gray-600">
                {connection?.status === 'connected' ? 'Conectado e funcionando' : 'Configuração pendente'}
              </span>
            </div>
          </div>
          <button 
            onClick={handleTestConnection}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Verificar status
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-700 mb-3">Credenciais da API</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Conexão</label>
                <input 
                  type="text" 
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number ID</label>
                <input 
                  type="text" 
                  name="phoneNumberId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Ex: 1234567890" 
                  value={formData.phoneNumberId}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                <div className="flex">
                  <input 
                    type="password" 
                    name="accessToken"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500" 
                    value={formData.accessToken}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button"
                    className="bg-gray-100 px-3 py-2 border border-gray-300 border-l-0 rounded-r-lg text-gray-600 hover:bg-gray-200"
                  >
                    Mostrar
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Account ID</label>
                <input 
                  type="text" 
                  name="businessAccountId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Ex: 1234567890" 
                  value={formData.businessAccountId}
                  onChange={handleChange}
                  required
                />
              </div>
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
                  <input 
                    type="number" 
                    name="dailyLimit"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg" 
                    value={formData.dailyLimit}
                    onChange={handleChange}
                    min="1"
                  />
                  <span className="text-gray-500">msg/dia</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Intervalo entre mensagens</p>
                  <p className="text-xs text-gray-500">Tempo mínimo entre mensagens para o mesmo contato</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="number" 
                    name="messageInterval"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg" 
                    value={formData.messageInterval}
                    onChange={handleChange}
                    min="1"
                  />
                  <span className="text-gray-500">horas</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              disabled={saving}
            >
              {saving ? (
                <>
                  <RefreshCw size={18} className="mr-2 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Check size={18} className="mr-2" />
                  <span>Salvar Configurações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfficialApiConfig;