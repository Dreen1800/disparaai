import React from 'react';
import { Settings, MessageCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">CartRecover Pro</h1>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <Settings size={20} />
          </button>
          <div className="relative">
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            <MessageCircle size={20} className="text-gray-500 hover:text-gray-700" />
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;