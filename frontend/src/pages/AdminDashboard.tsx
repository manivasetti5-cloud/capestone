import React, { useEffect, useState } from 'react';
import { Users, Activity, Settings, Database, CheckCircle } from 'lucide-react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [stats, setStats] = useState<any>({
    totalVillages: 0,
    totalUsers: 0,
    todaysRequests: 0,
    avgResponseTime: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Mock token for admin
  const mockToken = 'mock_admin_jwt_token';

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${mockToken}` }
      });
      if (res.data.success) {
        setStats(res.data.stats);
        setChartData(res.data.chartData);
      }
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${mockToken}` }
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleApproveUser = async (id: string) => {
    try {
      await axios.put(`${API_URL}/admin/users/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${mockToken}` }
      });
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Failed to approve user', err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-indigo-800">Admin Panel</div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('analytics')} className={`flex items-center w-full p-3 rounded hover:bg-indigo-800 ${activeTab === 'analytics' ? 'bg-indigo-800' : ''}`}>
            <Activity className="mr-3 h-5 w-5" /> Analytics
          </button>
          <button onClick={() => setActiveTab('users')} className={`flex items-center w-full p-3 rounded hover:bg-indigo-800 ${activeTab === 'users' ? 'bg-indigo-800' : ''}`}>
            <Users className="mr-3 h-5 w-5" /> Users
          </button>
          <button onClick={() => setActiveTab('data')} className={`flex items-center w-full p-3 rounded hover:bg-indigo-800 ${activeTab === 'data' ? 'bg-indigo-800' : ''}`}>
            <Database className="mr-3 h-5 w-5" /> Data Browser
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center w-full p-3 rounded hover:bg-indigo-800 ${activeTab === 'settings' ? 'bg-indigo-800' : ''}`}>
            <Settings className="mr-3 h-5 w-5" /> Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">{activeTab}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">admin@villageapi.com</span>
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm">Total Villages</div>
                <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalVillages.toLocaleString()}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm">Total Users</div>
                <div className="text-3xl font-bold text-gray-800 mt-2">{stats.totalUsers.toLocaleString()}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm">Today's API Requests</div>
                <div className="text-3xl font-bold text-indigo-600 mt-2">{stats.todaysRequests.toLocaleString()}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm">Avg Response Time</div>
                <div className="text-3xl font-bold text-green-500 mt-2">{stats.avgResponseTime}ms</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
              <h3 className="text-lg font-semibold mb-4">Top States by Village Count</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="villages" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="p-4 font-medium">Business Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Plan</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="p-4">{u.businessName}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.planType === 'PRO' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                        {u.planType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.status === 'PENDING_APPROVAL' ? (
                        <button onClick={() => handleApproveUser(u.id)} className="flex items-center text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </button>
                      ) : (
                        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Manage</button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
