import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('flows');
  const [apiType, setApiType] = useState('official'); // Pode ser 'official', 'unofficial', 'evolution'
  const [showFlowEditor, setShowFlowEditor] = useState(false);
  
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'flows' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Fluxos de Recuperação</h2>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  onClick={() => setShowFlowEditor(true)}
                >
                  <span>Novo Fluxo</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {!showFlowEditor ? (
                <FlowsList />
              ) : (
                <FlowEditor onClose={() => setShowFlowEditor(false)} />
              )}
            </div>
          )}

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
                <OfficialApiConfig />
              ) : apiType === 'unofficial' ? (
                <UnofficialApiConfig />
              ) : apiType === 'evolution' ? (
                <EvolutionApiConfig />
              ) : null}
            </div>
          )}

          {activeTab === 'dashboard' && <DashboardView />}

          {activeTab === 'schedule' && <ScheduleView />}

          {activeTab === 'analytics' && <AnalyticsView />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;