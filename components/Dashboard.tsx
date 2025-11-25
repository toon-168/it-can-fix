import React from 'react';
import { Ticket } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react';

interface DashboardProps {
  tickets: Ticket[];
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

const Dashboard: React.FC<DashboardProps> = ({ tickets }) => {
  // Calculate Stats
  const total = tickets.length;
  const pending = tickets.filter(t => t.status === 'Pending').length;
  const inProgress = tickets.filter(t => t.status === 'In Progress').length;
  const completed = tickets.filter(t => t.status === 'Completed').length;

  // Prepare Data for Charts
  const statusData = [
    { name: 'รอดำเนินการ', value: pending, color: '#ef4444' },
    { name: 'กำลังซ่อม', value: inProgress, color: '#f59e0b' },
    { name: 'เสร็จสิ้น', value: completed, color: '#10b981' },
  ];

  // Group by Device Type
  const deviceTypeCount = tickets.reduce((acc, curr) => {
    acc[curr.deviceType] = (acc[curr.deviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deviceData = Object.keys(deviceTypeCount).map(key => ({
    name: key,
    count: deviceTypeCount[key]
  }));

  const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${bg}`}>
        <Icon className={color} size={24} />
      </div>
      <div>
        <p className="text-slate-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">ภาพรวมระบบแจ้งซ่อม (Dashboard)</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="งานทั้งหมด" value={total} icon={Activity} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="รอดำเนินการ" value={pending} icon={AlertTriangle} color="text-red-600" bg="bg-red-50" />
        <StatCard title="กำลังดำเนินการ" value={inProgress} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
        <StatCard title="เสร็จสิ้นแล้ว" value={completed} icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">สถานะการซ่อม</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Type Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">แยกตามประเภทอุปกรณ์</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;