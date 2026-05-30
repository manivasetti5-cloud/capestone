import React from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

const mockUsers = [
  { id: 1, email: 'tech@innovate.in', businessName: 'Innovate Tech', plan: 'PRO', status: 'ACTIVE', requests: '145K', joined: '2024-01-15' },
  { id: 2, email: 'dev@agristart.com', businessName: 'AgriStart Solutions', plan: 'FREE', status: 'PENDING', requests: '0', joined: '2024-02-10' },
  { id: 3, email: 'data@research.ac.in', businessName: 'National Research', plan: 'PREMIUM', status: 'ACTIVE', requests: '42K', joined: '2023-11-05' },
  { id: 4, email: 'admin@logistics.com', businessName: 'Fast Logistics', plan: 'UNLIMITED', status: 'SUSPENDED', requests: '950K', joined: '2023-08-22' },
];

const AdminUsers = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage B2B customers, plans, and approvals</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600 uppercase tracking-wider">
                <th className="p-4 font-medium">Business / Email</th>
                <th className="p-4 font-medium">Plan Type</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Requests/Mo</th>
                <th className="p-4 font-medium">Joined Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{user.businessName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${user.plan === 'PRO' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                        user.plan === 'PREMIUM' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        user.plan === 'UNLIMITED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium
                      ${user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 
                        user.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                      {user.status === 'ACTIVE' && <CheckCircle size={14} />}
                      {user.status === 'PENDING' && <Clock size={14} />}
                      {user.status === 'SUSPENDED' && <XCircle size={14} />}
                      <span>{user.status}</span>
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{user.requests}</td>
                  <td className="p-4 text-sm text-gray-600">{user.joined}</td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit size={18} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors ml-1">
                      <Trash2 size={18} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors ml-1">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>Showing 1 to 4 of 4 entries</div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-gray-200 rounded bg-blue-50 text-blue-600 border-blue-200">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
