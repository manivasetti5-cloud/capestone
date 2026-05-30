import React, { useState } from 'react';
import { Key, Copy, Trash2, RefreshCw, Eye, EyeOff } from 'lucide-react';

const mockKeys = [
  { id: '1', name: 'Production Server', key: 'ak_a1b2c3d4e5f67890abcdef12345678', created: '2024-01-01', lastUsed: '2024-01-16', status: 'Active' },
  { id: '2', name: 'Staging Environment', key: 'ak_f9e8d7c6b5a43210fedcba0987654321', created: '2024-01-10', lastUsed: '2024-01-15', status: 'Active' },
];

const B2BKeys = () => {
  const [showSecret, setShowSecret] = useState(false);
  const [newSecret, setNewSecret] = useState('');

  const handleCreateKey = () => {
    // Mock key creation
    setNewSecret('as_9876543210abcdef1234567890abcdef');
    setShowSecret(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-500">Manage your API keys for programmatic access</p>
        </div>
        <button 
          onClick={handleCreateKey}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Key size={18} />
          <span>Generate New Key</span>
        </button>
      </div>

      {showSecret && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-amber-800 mb-2">New API Key Generated!</h3>
          <p className="text-amber-700 mb-4">
            Please copy this secret key now. <strong className="font-bold">You will not be able to see it again!</strong>
          </p>
          <div className="flex items-center space-x-3 bg-white border border-amber-300 p-3 rounded-lg">
            <code className="text-slate-800 flex-1 font-mono">{newSecret}</code>
            <button className="text-blue-600 hover:text-blue-800 p-1">
              <Copy size={20} />
            </button>
          </div>
          <button 
            onClick={() => setShowSecret(false)}
            className="mt-4 text-sm font-medium text-amber-800 hover:text-amber-900"
          >
            I have saved it securely
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600 uppercase tracking-wider">
              <th className="p-4 font-medium">Key Name</th>
              <th className="p-4 font-medium">API Key</th>
              <th className="p-4 font-medium">Created</th>
              <th className="p-4 font-medium">Last Used</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockKeys.map(k => (
              <tr key={k.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{k.name}</td>
                <td className="p-4 text-sm font-mono text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span>{k.key.substring(0, 8)}...{k.key.substring(24)}</span>
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Copy size={14} />
                    </button>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{k.created}</td>
                <td className="p-4 text-sm text-gray-600">{k.lastUsed}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {k.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors" title="Regenerate Secret">
                    <RefreshCw size={18} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors ml-1" title="Revoke Key">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default B2BKeys;
