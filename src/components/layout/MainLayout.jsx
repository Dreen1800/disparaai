// Atualização do MainLayout.jsx para usar o contexto de autenticação
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import DashboardView from '../dashboard/DashboardView';
import FlowsList from '../flows/FlowsList';
import FlowEditor from '../flows/FlowEditor';
import OfficialApiConfig from '../connections/OfficialApiConfig';
import UnofficialApiConfig from '../connections/UnofficialApiConfig';
import EvolutionApiConfig from '../connections/EvolutionApiConfig';
import ScheduleView from '../schedule/ScheduleView';
import AnalyticsView from '../analytics/AnalyticsView';

const MainLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [apiType, setApiType] = useState('official');
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && <DashboardView userId={user?.id} />}
          
          {activeTab === 'flows' && <FlowsList userId={user?.id} />}
          
          {activeTab === 'connections' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Conexões WhatsApp</h2>
                <div className="flex space-x-4">
                  <button 
                    className={`px-4 py-2 rounded-lg border ${apiType === 'official' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => setApiType('official')}
                  >
                    API Oficial
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg border ${apiType === 'unofficial' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => setApiType('unofficial')}
                  >
                    API Não Oficial
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg border ${apiType === 'evolution' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => setApiType('evolution')}
                  >
                    API Evolution
                  </button>
                </div>
              </div>

              {apiType === 'official' ? (
                <OfficialApiConfig userId={user?.id} />
              ) : apiType === 'unofficial' ? (
                <UnofficialApiConfig userId={user?.id} />
              ) : apiType === 'evolution' ? (
                <EvolutionApiConfig userId={user?.id} />
              ) : null}
            </div>
          )}

          {activeTab === 'schedule' && <ScheduleView userId={user?.id} />}

          {activeTab === 'analytics' && <AnalyticsView userId={user?.id} />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;