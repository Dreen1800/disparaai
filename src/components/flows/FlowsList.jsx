// src/components/flows/FlowsList.jsx
import React, { useState, useEffect } from 'react';
import { Clock, X, ChevronDown, Send, Plus, Edit, Copy, MoreHorizontal, ChevronRight, ArrowRight } from 'lucide-react';
import { flowService } from '../../services/flowService';
import { useAuth } from '../../contexts/AuthContext';
import FlowEditor from './FlowEditor';

const FlowsView = () => {
  const [showFlowEditor, setShowFlowEditor] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();
  
  // Buscar fluxos no Supabase
  useEffect(() => {
    const fetchFlows = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        let data;
        
        if (activeTab === 'all') {
          data = await flowService.getAllFlows(user.id);
        } else {
          data = await flowService.getFlowsByStatus(user.id, activeTab);
        }
        
        setFlows(data);
      } catch (error) {
        console.error('Erro ao buscar fluxos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlows();
  }, [user, activeTab]);

  // Adicionar novo fluxo ou editar existente
  const handleAddOrEditFlow = (flow = null) => {
    setSelectedFlow(flow);
    setShowFlowEditor(true);
  };
  
  // Função para duplicar fluxo
  const handleDuplicateFlow = async (flow) => {
    try {
      setLoading(true);
      
      const duplicatedFlow = await flowService.duplicateFlow(flow.id);
      
      // Atualizar a lista de fluxos
      setFlows(current => [...current, duplicatedFlow]);
      
    } catch (error) {
      console.error('Erro ao duplicar fluxo:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Função para atualizar status do fluxo
  const handleStatusChange = async (flowId, newStatus) => {
    try {
      setLoading(true);
      
      const updatedFlow = await flowService.updateFlowStatus(flowId, newStatus);
      
      // Atualizar a lista de fluxos
      setFlows(current => 
        current.map(flow => flow.id === flowId ? { ...flow, status: newStatus } : flow)
      );
      
    } catch (error) {
      console.error('Erro ao atualizar status do fluxo:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Função para excluir fluxo
  const handleDeleteFlow = async (flowId) => {
    if (!confirm('Tem certeza que deseja excluir este fluxo?')) return;
    
    try {
      setLoading(true);
      
      await flowService.deleteFlow(flowId);
      
      // Remover da lista de fluxos
      setFlows(current => current.filter(flow => flow.id !== flowId));
      
    } catch (error) {
      console.error('Erro ao excluir fluxo:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Quando um fluxo é salvo no editor
  const handleFlowSaved = (savedFlow) => {
    // Atualizar a lista de fluxos
    setFlows(current => {
      const index = current.findIndex(flow => flow.id === savedFlow.id);
      
      if (index >= 0) {
        // Fluxo existente foi atualizado
        const newFlows = [...current];
        newFlows[index] = savedFlow;
        return newFlows;
      } else {
        // Novo fluxo foi criado
        return [...current, savedFlow];
      }
    });
    
    // Fechar o editor
    setShowFlowEditor(false);
    setSelectedFlow(null);
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
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('all')}
            >
              Todos os Fluxos
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('active')}
            >
              Ativos
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'paused' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('paused')}
            >
              Pausados
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'draft' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('draft')}
            >
              Rascunhos
            </button>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-500">Carregando fluxos...</p>
            </div>
          ) : flows.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum fluxo encontrado</h3>
              <p className="text-gray-500 mb-4">Você ainda não criou nenhum fluxo de recuperação.</p>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
                onClick={() => handleAddOrEditFlow()}
              >
                <Plus size={18} className="mr-2" />
                <span>Criar Primeiro Fluxo</span>
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Fluxo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensagens</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
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
                      <div className="relative inline-block">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          flow.status === 'active' ? 'bg-green-100 text-green-800' : 
                          flow.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {flow.status === 'active' ? 'Ativo' : 
                           flow.status === 'paused' ? 'Pausado' : 'Rascunho'}
                        </span>
                        <div className="hidden group-hover:block absolute z-10 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                          {flow.status !== 'active' && (
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => handleStatusChange(flow.id, 'active')}
                            >
                              Ativar
                            </button>
                          )}
                          {flow.status !== 'paused' && (
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => handleStatusChange(flow.id, 'paused')}
                            >
                              Pausar
                            </button>
                          )}
                          {flow.status !== 'draft' && (
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => handleStatusChange(flow.id, 'draft')}
                            >
                              Tornar Rascunho
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        <div className="bg-blue-50 text-blue-600 rounded-md px-2 py-1">
                          {/* Vamos buscar o número de mensagens quando editar */}
                          {'-'} 
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(flow.created_at).toLocaleDateString('pt-BR')}
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
                        <button 
                          className="text-red-600 hover:text-red-900 flex items-center"
                          onClick={() => handleDeleteFlow(flow.id)}
                        >
                          <X size={16} className="mr-1" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{flows.length}</span> fluxos
              </span>
            </div>
            {flows.length > 10 && (
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50">
                  <span>Ver todos</span>
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <FlowEditor 
          onClose={() => setShowFlowEditor(false)} 
          flow={selectedFlow} 
          onSave={handleFlowSaved}
        />
      )}
    </div>
  );
};

export default FlowsView;