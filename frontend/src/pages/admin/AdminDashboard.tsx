import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Users, Activity, Clock, Database } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const mockData = {
  requestsTrend: [
    { name: 'Mon', requests: 4000 },
    { name: 'Tue', requests: 3000 },
    { name: 'Wed', requests: 2000 },
    { name: 'Thu', requests: 2780 },
    { name: 'Fri', requests: 1890 },
    { name: 'Sat', requests: 2390 },
    { name: 'Sun', requests: 3490 },
  ],
  userDistribution: [
    { name: 'Free', value: 400 },
    { name: 'Premium', value: 300 },
    { name: 'Pro', value: 300 },
    { name: 'Unlimited', value: 200 },
  ],
  stateDistribution: [
    { name: 'Maharashtra', count: 43000 },
    { name: 'Uttar Pradesh', count: 97000 },
    { name: 'Madhya Pradesh', count: 54000 },
    { name: 'Odisha', count: 51000 },
    { name: 'Bihar', count: 45000 },
  ]
};

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className={`text-sm mt-2 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {change} from last month
        </p>
      </div>
      <div className={`p-4 rounded-full ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="text-gray-500">Monitor API usage and platform health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Villages" value="649,481" change="+0.0%" icon={Database} color="bg-blue-500" />
        <StatCard title="Active Users" value="1,245" change="+12.5%" icon={Users} color="bg-emerald-500" />
        <StatCard title="Today's Requests" value="845,291" change="+5.2%" icon={Activity} color="bg-purple-500" />
        <StatCard title="Avg Response Time" value="42ms" change="-1.5%" icon={Clock} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">API Requests Trend (Last 7 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.requestsTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Area type="monotone" dataKey="requests" stroke="#3b82f6" fill="#93c5fd" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">User Distribution by Plan</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockData.userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Top 5 States by Village Count</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.stateDistribution} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
