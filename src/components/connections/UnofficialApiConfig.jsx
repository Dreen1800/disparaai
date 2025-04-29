import React from 'react';
import { Phone } from 'lucide-react';

const UnofficialApiConfig = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center pb-4 border-b border-gray-200">
        <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
          <Phone size={24} />
        </div>
        <div>
          <h3 className="font-medium text-lg text-gray-800">WhatsApp API Não Oficial</h3>
          <p className="text-sm text-gray-500">Implementação alternativa da API WhatsApp (Baileys)</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-gray-700">Status da Conexão</h4>
            <div className="flex items-center mt-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm text-yellow-600">Aguardando autenticação</span>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">Conectar</button>
        </div>
        
        <div className="flex justify-center py-6 border rounded-lg border-gray-200 mt-4">
          <div className="text-center">
            <p className="text-gray-700 mb-4">Escaneie o QR Code para conectar ao WhatsApp</p>
            <div className="w-48 h-48 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-500 text-sm">QR Code não disponível</span>
            </div>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Use o aplicativo WhatsApp no seu celular para escanear o código e conectar esta instância.
            </p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-700 mb-3">Dispositivos Conectados</h4>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center hover:border-blue-300">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  <Phone size={20} className="text-gray-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-800">Principal (+55 11 98765-4321)</h5>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span>Desconectado há 2 dias</span>
                  </div>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Reconectar</button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center hover:border-blue-300">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  <Phone size={20} className="text-gray-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-800">Atendimento (+55 11 91234-5678)</h5>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Conectado - 423 msgs restantes hoje</span>
                  </div>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-800">Desconectar</button>
            </div>
          </div>
          
          <div className="mt-3 flex justify-end">
            <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 font-medium text-sm">
              + Adicionar Novo Dispositivo
            </button>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-700 mb-3">Configurações de Proteção</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Limite de mensagens por hora</p>
                <p className="text-xs text-gray-500">Protege contra bloqueios do WhatsApp</p>
              </div>
              <div className="flex items-center space-x-2">
                <input type="number" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" defaultValue="20" />
                <span className="text-gray-500">msg/hora</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Intervalo entre mensagens</p>
                <p className="text-xs text-gray-500">Tempo de espera entre mensagens</p>
              </div>
              <div className="flex items-center space-x-2">
                <input type="number" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" defaultValue="12" />
                <span className="text-gray-500">segundos</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="rotacao" className="h-4 w-4 text-blue-600 rounded border-gray-300" defaultChecked />
              <label htmlFor="rotacao" className="ml-2 text-sm text-gray-700">
                Habilitar rotação automática de números
              </label>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="antiblock" className="h-4 w-4 text-blue-600 rounded border-gray-300" defaultChecked />
              <label htmlFor="antiblock" className="ml-2 text-sm text-gray-700">
                Habilitar proteções anti-bloqueio
              </label>
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

export default UnofficialApiConfig;