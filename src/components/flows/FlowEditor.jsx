// src/components/flows/FlowEditor.jsx
import React, { useState, useEffect } from 'react';
import { Clock, X, ChevronDown, Plus, ArrowRight } from 'lucide-react';
import { flowService } from '../../services/flowService';
import { useAuth } from '../../contexts/AuthContext';

const FlowEditor = ({ onClose, flow = null, onSave }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [flowName, setFlowName] = useState(flow?.name || 'Novo Fluxo de Recuperação');
  const [status, setStatus] = useState(flow?.status || 'draft');
  const [settings, setSettings] = useState(flow?.settings || {});
  const [steps, setSteps] = useState([]);
  
  // Extrair configurações do campo settings JSON
  const dailyLimit = settings?.daily_limit || 100;
  const startTime = settings?.start_time || '08:00';
  const endTime = settings?.end_time || '20:00';
  const apiType = settings?.api_type || 'auto';
  const priority = settings?.priority || false;
  
  // Função para atualizar settings
  const updateSettings = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Carregar mensagens do fluxo existente
  useEffect(() => {
    const loadFlowMessages = async () => {
      if (flow?.id) {
        try {
          setLoading(true);
          const messages = await flowService.getFlowMessages(flow.id);
          
          if (messages && messages.length > 0) {
            // Ordenar mensagens por sequence_order
            const sortedMessages = [...messages].sort((a, b) => a.sequence_order - b.sequence_order);
            setSteps(sortedMessages);
          } else {
            // Criar mensagens padrão para o fluxo
            setSteps([
              { 
                id: 'temp-1', 
                name: 'Mensagem Inicial', 
                delay_hours: 0, 
                sequence_order: 0,
                content: 'Olá {nome}, notamos que você deixou alguns itens no carrinho. Gostaria de finalizar sua compra?' 
              },
              { 
                id: 'temp-2', 
                name: 'Follow-up (24h)', 
                delay_hours: 24, 
                sequence_order: 1,
                content: 'Olá {nome}, ainda está interessado nos itens do seu carrinho? Podemos ajudar com alguma dúvida?' 
              }
            ]);
          }
        } catch (error) {
          console.error('Erro ao carregar mensagens do fluxo:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Novo fluxo: criar mensagens padrão
        setSteps([
          { 
            id: 'temp-1', 
            name: 'Mensagem Inicial', 
            delay_hours: 0, 
            sequence_order: 0,
            content: 'Olá {nome}, notamos que você deixou alguns itens no carrinho. Gostaria de finalizar sua compra?' 
          },
          { 
            id: 'temp-2', 
            name: 'Follow-up (24h)', 
            delay_hours: 24, 
            sequence_order: 1,
            content: 'Olá {nome}, ainda está interessado nos itens do seu carrinho? Podemos ajudar com alguma dúvida?' 
          }
        ]);
      }
    };
    
    loadFlowMessages();
  }, [flow]);
  
  const addStep = () => {
    setSteps([...steps, { 
      id: `temp-${Date.now()}`, 
      name: `Nova Mensagem`, 
      delay_hours: 24, 
      sequence_order: steps.length,
      content: 'Olá {nome}, gostaríamos de lembrar que seus itens ainda estão no carrinho.' 
    }]);
  };
  
  const removeStep = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    
    // Atualizar sequence_order das mensagens restantes
    const updatedSteps = newSteps.map((step, idx) => ({
      ...step,
      sequence_order: idx
    }));
    
    setSteps(updatedSteps);
  };
  
  const handleSave = async () => {
    if (!user) {
      alert('É necessário estar autenticado para salvar um fluxo');
      return;
    }
    
    try {
      setSaving(true);
      
      // Atualizar settings com os valores atuais
      const updatedSettings = {
        ...settings,
        daily_limit: parseInt(dailyLimit, 10),
        start_time: startTime,
        end_time: endTime,
        api_type: apiType,
        priority: priority
      };
      
      // Dados do fluxo
      const flowData = {
        name: flowName,
        status,
        settings: updatedSettings,
        user_id: user.id
      };
      
      let savedFlow;
      
      if (flow?.id) {
        // Atualizar fluxo existente
        savedFlow = await flowService.updateFlow(flow.id, flowData);
        
        // Atualizar mensagens existentes
        for (const step of steps) {
          const messageData = {
            name: step.name,
            content: step.content,
            delay_hours: parseInt(step.delay_hours, 10),
            sequence_order: step.sequence_order
          };
          
          if (step.id.toString().startsWith('temp-')) {
            // Nova mensagem
            await flowService.addFlowMessage(flow.id, messageData);
          } else {
            // Atualizar mensagem existente
            await flowService.updateFlowMessage(step.id, messageData);
          }
        }
      } else {
        // Criar novo fluxo
        savedFlow = await flowService.createFlow(flowData);
        
        // Adicionar todas as mensagens
        const messages = steps.map(step => ({
          name: step.name,
          content: step.content,
          delay_hours: parseInt(step.delay_hours, 10),
          sequence_order: step.sequence_order
        }));
        
        await flowService.addFlowMessages(savedFlow.id, messages);
      }
      
      // Buscar fluxo completo com mensagens
      const completeFlow = await flowService.getFlowById(savedFlow.id);
      
      // Notificar o componente pai
      if (onSave) {
        onSave(completeFlow);
      } else {
        // Fechar o editor
        onClose();
      }
      
    } catch (error) {
      console.error('Erro ao salvar fluxo:', error);
      alert('Ocorreu um erro ao salvar o fluxo. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="ml-3 text-gray-500">Carregando fluxo...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
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
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
            onClick={onClose}
            disabled={saving}
          >
            <X size={16} className="mr-2" />
            <span>Cancelar</span>
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <span>Salvar Fluxo</span>
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
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
            <div key={step.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 bg-white shadow-sm hover:shadow transition-all">
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
                        value={step.delay_hours} 
                        className="w-12 ml-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-center" 
                        onChange={(e) => {
                          const newSteps = [...steps];
                          newSteps[index].delay_hours = parseInt(e.target.value) || 0;
                          setSteps(newSteps);
                        }}
                      />
                      <span className="ml-1">horas</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                    onClick={() => removeStep(index)}
                  >
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
                <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md cursor-pointer hover:bg-blue-100">
                  {'{nome}'}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md cursor-pointer hover:bg-blue-100">
                  {'{produto}'}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md cursor-pointer hover:bg-blue-100">
                  {'{valor}'}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md cursor-pointer hover:bg-blue-100">
                  {'{link_carrinho}'}
                </span>
              </div>
            </div>
          ))}
          
          <button 
            className="w-full border border-dashed border-gray-300 rounded-xl p-4 text-blue-600 hover:bg-blue-50 hover:border-blue-300 flex items-center justify-center font-medium"
            onClick={addStep}
          >
            <Plus size={18} className="mr-2" />
            <span>Adicionar nova mensagem</span>
          </button>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Configurações Avançadas</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-3">Limites de Envio</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Limite diário</p>
                      <p className="text-xs text-gray-500">Mensagens enviadas por dia</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" 
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg" 
                        value={dailyLimit}
                        onChange={e => updateSettings('daily_limit', parseInt(e.target.value))}
                      />
                      <span className="text-gray-500">msg/dia</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Horário de envio</p>
                      <p className="text-xs text-gray-500">Período para envio</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="time" 
                        className="px-3 py-2 border border-gray-300 rounded-lg" 
                        value={startTime}
                        onChange={e => updateSettings('start_time', e.target.value)}
                      />
                      <span className="text-gray-500">às</span>
                      <input 
                        type="time" 
                        className="px-3 py-2 border border-gray-300 rounded-lg" 
                        value={endTime}
                        onChange={e => updateSettings('end_time', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-3">Configurações da API</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-1">API a utilizar</p>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      value={apiType}
                      onChange={e => updateSettings('api_type', e.target.value)}
                    >
                      <option value="official">API Oficial</option>
                      <option value="unofficial">API Não Oficial</option>
                      <option value="evolution">API Evolution</option>
                      <option value="auto">Auto (Baseado em disponibilidade)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="priority" 
                      className="h-4 w-4 text-blue-600 rounded border-gray-300" 
                      checked={priority}
                      onChange={e => updateSettings('priority', e.target.checked)}
                    />
                    <label htmlFor="priority" className="ml-2 text-sm text-gray-700">
                      Alta prioridade
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4">
                    <span className="text-sm text-gray-700">Status:</span>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="status-active" 
                          name="status" 
                          className="h-4 w-4 text-blue-600 border-gray-300" 
                          value="active"
                          checked={status === 'active'} 
                          onChange={() => setStatus('active')}
                        />
                        <label htmlFor="status-active" className="ml-2 text-sm text-gray-700">
                          Ativo
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="status-paused" 
                          name="status" 
                          className="h-4 w-4 text-blue-600 border-gray-300" 
                          value="paused"
                          checked={status === 'paused'} 
                          onChange={() => setStatus('paused')}
                        />
                        <label htmlFor="status-paused" className="ml-2 text-sm text-gray-700">
                          Pausado
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="status-draft" 
                          name="status" 
                          className="h-4 w-4 text-blue-600 border-gray-300" 
                          value="draft"
                          checked={status === 'draft'} 
                          onChange={() => setStatus('draft')}
                        />
                        <label htmlFor="status-draft" className="ml-2 text-sm text-gray-700">
                          Rascunho
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowEditor;