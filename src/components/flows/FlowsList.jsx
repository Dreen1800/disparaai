// src/components/flows/FlowsList.jsx
import React, { useState, useEffect } from 'react';
import { Clock, X, ChevronDown, Send, Plus, Edit, Copy, MoreHorizontal, ChevronRight, ArrowRight } from 'lucide-react';

// Importe o cliente do Supabase - COMENTE esta linha se ainda não configurou o Supabase
// import { supabase } from '../../lib/supabase';

const FlowsView = () => {
  const [showFlowEditor, setShowFlowEditor] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState(null);
  
  // MANTENHA este array de dados de exemplo enquanto estiver implementando o Supabase
  // Depois você pode substituir por dados do banco
  const flows = [
    { id: 1, name: 'Carrinho Abandonado - Primeira Compra', status: 'active', messages: 3, conversions: '24%' },
    { id: 2, name: 'Carrinho Abandonado - Cliente Fidelizado', status: 'active', messages: 2, conversions: '38%' },
    { id: 3, name: 'Retorno após 30 dias', status: 'paused', messages: 4, conversions: '12%' },
    { id: 4, name: 'Upsell Produto Complementar', status: 'draft', messages: 2, conversions: '0%' }
  ];

  // Mais tarde você pode descomentar este useEffect para buscar dados do Supabase
  /*
  useEffect(() => {
    const fetchFlows = async () => {
      try {
        // Verificar se o Supabase está configurado
        if (typeof supabase === 'undefined') {
          console.log('Supabase não está configurado ainda');
          return;
        }
        
        const { data, error } = await supabase
          .from('recovery_flows')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Erro ao buscar fluxos:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // Atualizar o estado com os dados do Supabase quando estiver pronto
          // setFlows(data);
          console.log('Dados do Supabase:', data);
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      }
    };
    
    fetchFlows();
  }, []);
  */

  // Adicionar novo fluxo ou editar existente
  const handleAddOrEditFlow = (flow = null) => {
    setSelectedFlow(flow);
    setShowFlowEditor(true);
  };
  
  // Função para duplicar fluxo (a ser implementada com Supabase)
  const handleDuplicateFlow = (flow) => {
    console.log('Duplicando fluxo:', flow);
    // Aqui você implementará a duplicação com Supabase no futuro
  };
  
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fluxos de Recuperação</h2>
          <p className="text-gray-500 mt-1">Gerencie suas sequências automatizadas de mensagens</p>
        </div>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => handleAddOrEditFlow()}
        >
          <Plus size={18} className="mr-2" />
          <span>Novo Fluxo</span>
        </button>
      </div>

      {!showFlowEditor ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100 px-6 py-3">
            <button className="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600">
              Todos os Fluxos
            </button>
            <button className="px-4 py-2 font-medium text-gray-500 hover:text-gray-700">
              Ativos
            </button>
            <button className="px-4 py-2 font-medium text-gray-500 hover:text-gray-700">
              Pausados
            </button>
            <button className="px-4 py-2 font-medium text-gray-500 hover:text-gray-700">
              Rascunhos
            </button>
          </div>
          
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
            <tbody className="bg-white divide-y divide-gray-100">
              {flows.map((flow) => (
                <tr key={flow.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-blue-50 text-blue-600 mr-3">
                        <Send size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{flow.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      flow.status === 'active' ? 'bg-green-100 text-green-800' : 
                      flow.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {flow.status === 'active' ? 'Ativo' : 
                       flow.status === 'paused' ? 'Pausado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <div className="bg-blue-50 text-blue-600 rounded-md px-2 py-1">
                        {flow.messages}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{flow.conversions}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                        onClick={() => handleAddOrEditFlow(flow)}
                      >
                        <Edit size={16} className="mr-1" />
                        <span>Editar</span>
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-900 flex items-center"
                        onClick={() => handleDuplicateFlow(flow)}
                      >
                        <Copy size={16} className="mr-1" />
                        <span>Duplicar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{flows.length}</span> fluxos
              </span>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 flex items-center">
                <span>Ver todos</span>
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <FlowEditor onClose={() => setShowFlowEditor(false)} flow={selectedFlow} />
      )}
    </div>
  );
};

const FlowEditor = ({ onClose, flow = null }) => {
  const [flowName, setFlowName] = useState(flow ? flow.name : 'Novo Fluxo de Recuperação');
  const [steps, setSteps] = useState([
    { id: 1, name: 'Mensagem Inicial', delay: 0, content: 'Olá {nome}, notamos que você deixou alguns itens no carrinho. Gostaria de finalizar sua compra?' },
    { id: 2, name: 'Follow-up (24h)', delay: 24, content: 'Olá {nome}, ainda está interessado nos itens do seu carrinho? Podemos ajudar com alguma dúvida?' }
  ]);
  
  const addStep = () => {
    const newId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;
    setSteps([...steps, { 
      id: newId, 
      name: `Nova Mensagem`, 
      delay: 24, 
      content: 'Olá {nome}, gostaríamos de lembrar que seus itens ainda estão no carrinho.' 
    }]);
  };
  
  const removeStep = (id) => {
    setSteps(steps.filter(step => step.id !== id));
  };
  
  // Função para salvar fluxo (a ser implementada com Supabase)
  const handleSave = () => {
    console.log('Salvando fluxo:', {
      name: flowName,
      steps: steps
    });
    
    // Aqui você implementará a gravação com Supabase no futuro
    // Por enquanto apenas fecha o editor
    onClose();
  };
  
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
          >
            <X size={16} className="mr-2" />
            <span>Cancelar</span>
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            onClick={handleSave}
          >
            <span>Salvar Fluxo</span>
            <ArrowRight size={16} className="ml-2" />
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
                  <button 
                    className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                    onClick={() => removeStep(step.id)}
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
                      <input type="number" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" defaultValue="100" />
                      <span className="text-gray-500">msg/dia</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Horário de envio</p>
                      <p className="text-xs text-gray-500">Período para envio</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="time" className="px-3 py-2 border border-gray-300 rounded-lg" defaultValue="08:00" />
                      <span className="text-gray-500">às</span>
                      <input type="time" className="px-3 py-2 border border-gray-300 rounded-lg" defaultValue="20:00" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-3">Configurações da API</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-1">API a utilizar</p>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                      <option value="official">API Oficial</option>
                      <option value="unofficial">API Não Oficial</option>
                      <option value="auto">Auto (Baseado em disponibilidade)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input type="checkbox" id="priority" className="h-4 w-4 text-blue-600 rounded border-gray-300" defaultChecked />
                    <label htmlFor="priority" className="ml-2 text-sm text-gray-700">
                      Alta prioridade
                    </label>
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

export default FlowsView;