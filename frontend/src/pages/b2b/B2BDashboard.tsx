import React from 'react';
import { Activity, Clock, Shield, Key } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const mockUsageData = [
  { name: 'Jan 10', requests: 1200 },
  { name: 'Jan 11', requests: 1900 },
  { name: 'Jan 12', requests: 3000 },
  { name: 'Jan 13', requests: 2100 },
  { name: 'Jan 14', requests: 4500 },
  { name: 'Jan 15', requests: 3800 },
  { name: 'Jan 16', requests: 4900 },
];

const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm mt-2 text-gray-500">{subtext}</p>
      </div>
      <div className={`p-4 rounded-full ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
    </div>
  </div>
);

const B2BDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Innovate Tech</h1>
        <p className="text-gray-500">Here's your API usage overview for today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today's Requests" value="4,900" subtext="5,000 Daily Limit" icon={Activity} color="bg-blue-500" />
        <StatCard title="This Month" value="45,230" subtext="Reset on Feb 1" icon={Database} color="bg-emerald-500" />
        <StatCard title="Avg Response" value="38ms" subtext="Last 24 hours" icon={Clock} color="bg-purple-500" />
        <StatCard title="Active Keys" value="2" subtext="Max 5 allowed" icon={Key} color="bg-amber-500" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">API Usage (Last 7 Days)</h3>
          <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockUsageData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Quick dummy icon
const Database = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;

export default B2BDashboard;
