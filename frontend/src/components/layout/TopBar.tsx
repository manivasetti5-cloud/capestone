import React from 'react';
import { Bell, Search, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
        <Search className="text-gray-400 mr-2" size={20} />
        <input 
          type="text" 
          placeholder="Search something..." 
          className="bg-transparent border-none outline-none w-full text-sm text-gray-700"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell size={24} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-gray-300"></div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
