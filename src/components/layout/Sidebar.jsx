// Substitua o conteúdo do arquivo Sidebar.jsx por:
import React from 'react';
import { Activity, Send, Phone, Calendar, BarChart2 } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-white shadow-sm">
      <nav className="p-4">
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-4">Principal</p>
          <ul className="space-y-1">
            <li>
              <button 
                className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center space-x-3 ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <Activity size={18} />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center space-x-3 ${activeTab === 'flows' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('flows')}
              >
                <Send size={18} />
                <span>Fluxos de Mensagens</span>
              </button>
            </li>
          </ul>
        </div>
        
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-4">Configurações</p>
          <ul className="space-y-1">
            <li>
              <button 
                className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center space-x-3 ${activeTab === 'connections' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('connections')}
              >
                <Phone size={18} />
                <span>Conexões WhatsApp</span>
              </button>
            </li>
            <li>
              <button 
                className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center space-x-3 ${activeTab === 'schedule' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('schedule')}
              >
                <Calendar size={18} />
                <span>Agendamentos</span>
              </button>
            </li>
            <li>
              <button 
                className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center space-x-3 ${activeTab === 'analytics' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart2 size={18} />
                <span>Analytics</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;