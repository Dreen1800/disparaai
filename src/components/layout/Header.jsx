// Substitua o conteúdo do arquivo Header.jsx por:
import React from 'react';
import { Settings, MessageCircle, Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-blue-600 text-white p-1.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Disparar<span className="text-blue-600 font-bold">Pro</span></h1>
        </div>
        <div className="flex items-center space-x-5">
          <button className="text-gray-500 hover:text-gray-700 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <Settings size={20} />
          </button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;