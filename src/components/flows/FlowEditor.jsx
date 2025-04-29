import React, { useState } from 'react';
import { Clock, X, ChevronDown } from 'lucide-react';

const FlowEditor = ({ onClose }) => {
  const [flowName, setFlowName] = useState('Novo Fluxo de Recuperação');
  const [steps, setSteps] = useState([
    { id: 1, name: 'Mensagem Inicial', delay: 0, content: 'Olá {nome}, notamos que você deixou alguns itens no carrinho. Gostaria de finalizar sua compra?' },
    { id: 2, name: 'Follow-up (24h)', delay: 24, content: 'Olá {nome}, ainda está interessado nos itens do seu carrinho? Podemos ajudar com alguma dúvida?' }
  ]);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input 
            type="text" 
            value={flowName} 
            onChange={(e) => setFlowName(e.target.value)}
            className="text-xl font-semibold text-gray-800 border-b-2 border-transparent focus:border-blue-500 focus:outline-none py-1"
          />
        </div>
        <div className="flex space-x-3">
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Salvar Fluxo
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium text-gray-700">Mensagens do Fluxo</h3>
          <span className="text-sm text-gray-500">Defina a sequência de mensagens e os intervalos</span>
        </div>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="h-12 w-0.5 bg-gray-200 my-1"></div>
                    )}
                  </div>
                  <div>
                    <input 
                      type="text" 
                      value={step.name} 
                      className="font-medium text-gray-800 border-b border-transparent focus:border-blue-500 focus:outline-none" 
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[index].name = e.target.value;
                        setSteps(newSteps);
                      }}
                    />
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock size={14} className="mr-1" />
                      <span>Enviar após:</span>
                      <input 
                        type="number" 
                        value={step.delay} 
                        className="w-12 ml-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-center" 
                        onChange={(e) => {
                          const newSteps = [...steps];
                          newSteps[index].delay = parseInt(e.target.value) || 0;
                          setSteps(newSteps);
                        }}
                      />
                      <span className="ml-1">horas</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <textarea 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-700 text-sm" 
                  rows="3"
                  value={step.content}
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[index].content = e.target.value;
                    setSteps(newSteps);
                  }}
                ></textarea>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  {'{nome}'}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  {'{produto}'}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  {'{valor}'}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  {'{link_carrinho}'}
                </span>
              </div>
            </div>
          ))}
          
          <button className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:bg-gray-50 hover:border-gray-400 flex items-center justify-center">
            <span className="mr-2">Adicionar mensagem</span>
            <ChevronDown size={16} />
          </button>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Configurações Avançadas</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-700">Limite de mensagens diárias</h4>
                <p className="text-sm text-gray-500">Defina quantas mensagens deste fluxo podem ser enviadas por dia</p>
              </div>
              <div className="flex items-center space-x-2">
                <input type="number" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" defaultValue="100" />
                <span className="text-gray-500">mensagens/dia</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-700">Horário de envio</h4>
                <p className="text-sm text-gray-500">Defina em quais horários as mensagens podem ser enviadas</p>
              </div>
              <div className="flex items-center space-x-2">
                <input type="time" className="px-3 py-2 border border-gray-300 rounded-lg" defaultValue="08:00" />
                <span className="text-gray-500">até</span>
                <input type="time" className="px-3 py-2 border border-gray-300 rounded-lg" defaultValue="20:00" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-700">API a utilizar</h4>
                <p className="text-sm text-gray-500">Escolha qual API do WhatsApp deve ser utilizada para este fluxo</p>
              </div>
              <div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white">
                  <option value="official">API Oficial</option>
                  <option value="unofficial">API Não Oficial</option>
                  <option value="auto">Auto (Baseado em disponibilidade)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowEditor;