import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Map, FileText, Database, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col transition-all duration-300">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Village API
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {isAdmin ? (
          <>
            <NavItem to="/admin" icon={<LayoutDashboard size={20} />} label="Analytics" />
            <NavItem to="/admin/users" icon={<Users size={20} />} label="User Management" />
            <NavItem to="/admin/access" icon={<Shield size={20} />} label="State Access" />
            <NavItem to="/admin/villages" icon={<Database size={20} />} label="Village Master" />
            <NavItem to="/admin/logs" icon={<FileText size={20} />} label="API Logs" />
          </>
        ) : (
          <>
            <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
            <NavItem to="/dashboard/keys" icon={<Shield size={20} />} label="API Keys" />
            <NavItem to="/dashboard/docs" icon={<FileText size={20} />} label="Documentation" />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.email || 'User'}</p>
            <p className="text-xs text-slate-400">{user?.planType || 'Free Plan'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`
    }
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default Sidebar;
