import React, { useState, useEffect } from 'react';
import { Key, BookOpen, Activity, User, Plus, Copy } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function B2BPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [keys, setKeys] = useState<any[]>([]);
  const [usageData, setUsageData] = useState<any[]>([]);
  const [todayUsage, setTodayUsage] = useState(0);
  const [planLimit, setPlanLimit] = useState(50000);
  const [newKey, setNewKey] = useState<any>(null);

  // Since we don't have a proper login page in this setup yet, we mock a token for demo purposes.
  // In a real scenario, this comes from localStorage after login.
  const mockToken = 'mock_jwt_token'; 

  useEffect(() => {
    fetchKeys();
    fetchUsage();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await axios.get(`${API_URL}/b2b/keys`, {
        headers: { Authorization: `Bearer ${mockToken}` }
      });
      if (res.data.success) {
        setKeys(res.data.keys);
      }
    } catch (err) {
      console.error('Failed to fetch keys', err);
    }
  };

  const fetchUsage = async () => {
    try {
      const res = await axios.get(`${API_URL}/b2b/usage`, {
        headers: { Authorization: `Bearer ${mockToken}` }
      });
      if (res.data.success) {
        setUsageData(res.data.chartData);
        setTodayUsage(res.data.todayUsage);
      }
    } catch (err) {
      console.error('Failed to fetch usage', err);
    }
  };

  const handleGenerateKey = async () => {
    try {
      const res = await axios.post(`${API_URL}/b2b/keys`, { name: 'New API Key' }, {
        headers: { Authorization: `Bearer ${mockToken}` }
      });
      if (res.data.success) {
        setNewKey({ key: res.data.apiKey, secret: res.data.apiSecret });
        fetchKeys();
      }
    } catch (err) {
      console.error('Failed to generate key', err);
    }
  };

  const handleRevokeKey = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/b2b/keys/${id}`, {
        headers: { Authorization: `Bearer ${mockToken}` }
      });
      fetchKeys();
    } catch (err) {
      console.error('Failed to revoke key', err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 text-xl font-bold text-indigo-600">Developer Portal</div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center w-full p-3 rounded-lg font-medium ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Activity className="mr-3 h-5 w-5" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('keys')} className={`flex items-center w-full p-3 rounded-lg font-medium ${activeTab === 'keys' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Key className="mr-3 h-5 w-5" /> API Keys
          </button>
          <button onClick={() => setActiveTab('docs')} className={`flex items-center w-full p-3 rounded-lg font-medium ${activeTab === 'docs' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <BookOpen className="mr-3 h-5 w-5" /> Documentation
          </button>
          <button onClick={() => setActiveTab('account')} className={`flex items-center w-full p-3 rounded-lg font-medium ${activeTab === 'account' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <User className="mr-3 h-5 w-5" /> Account
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 max-w-5xl">
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, Acme Corp</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="text-gray-500 font-medium">Plan Status</div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">PREMIUM</span>
                </div>
                <div className="mt-2 text-sm text-gray-500">{planLimit.toLocaleString()} requests/day</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="text-gray-500 font-medium">Today's Usage</div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">{todayUsage.toLocaleString()}</span>
                  <span className="text-gray-500">/ {Math.floor(planLimit/1000)}k</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(todayUsage/planLimit)*100}%` }}></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="text-gray-500 font-medium">Avg Latency</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">45ms</div>
                <div className="mt-2 text-sm text-green-500 font-medium">System operational</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-96 mt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Usage History (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="requests" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'keys' && (
          <div className="max-w-5xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">API Keys</h1>
              <button onClick={handleGenerateKey} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                <Plus className="w-5 h-5 mr-2" /> Generate New Key
              </button>
            </div>

            {newKey && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-yellow-800 font-bold mb-2">Please copy your new API Secret now. You won't be able to see it again!</h3>
                <p className="font-mono text-sm bg-white p-2 rounded border">{newKey.secret}</p>
              </div>
            )}
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600">Name</th>
                    <th className="p-4 font-semibold text-gray-600">Key Prefix</th>
                    <th className="p-4 font-semibold text-gray-600">Created</th>
                    <th className="p-4 font-semibold text-gray-600">Status</th>
                    <th className="p-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {keys.map((k) => (
                    <tr key={k.id}>
                      <td className="p-4 font-medium text-gray-900">{k.name}</td>
                      <td className="p-4 font-mono text-sm text-gray-600">{k.key}</td>
                      <td className="p-4 text-gray-600">{new Date(k.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${k.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {k.status}
                        </span>
                      </td>
                      <td className="p-4 flex space-x-3">
                        <button className="text-gray-500 hover:text-indigo-600"><Copy className="w-4 h-4" /></button>
                        {k.status === 'ACTIVE' && (
                          <button onClick={() => handleRevokeKey(k.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Revoke</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {keys.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500">No API keys found. Generate one to get started!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
