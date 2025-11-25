import React, { useState } from 'react';
import { Ticket } from '../types';
import { Search, Filter, Monitor, Wifi, Printer, AlertCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  onUpdateStatus: (id: string, status: Ticket['status']) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onUpdateStatus }) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter(t => {
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchesSearch = 
      t.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-red-100 text-red-700 border-red-200';
      case 'In Progress': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'Desktop': return <Monitor size={18} />;
      case 'Notebook': return <Monitor size={18} />;
      case 'Printer': return <Printer size={18} />;
      case 'Network': return <Wifi size={18} />;
      default: return <AlertCircle size={18} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">รายการแจ้งซ่อมทั้งหมด</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหา Ticket ID, ชื่อ..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <select
              className="w-full sm:w-48 pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none bg-white cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">สถานะทั้งหมด</option>
              <option value="Pending">รอดำเนินการ (Pending)</option>
              <option value="In Progress">กำลังซ่อม (In Progress)</option>
              <option value="Completed">เสร็จสิ้น (Completed)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-600 text-sm">ID / วันที่</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">ผู้แจ้ง / สาขา</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">อุปกรณ์</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">อาการ</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">สถานะ</th>
                <th className="p-4 font-semibold text-slate-600 text-sm text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    ไม่พบข้อมูลรายการแจ้งซ่อม
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 align-top">
                      <span className="font-mono text-blue-600 font-medium text-sm block">{ticket.id}</span>
                      <span className="text-xs text-slate-400 block mt-1">
                        {new Date(ticket.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-medium text-slate-800">{ticket.requesterName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{ticket.branch}</div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex items-center space-x-2 text-slate-700">
                        {getDeviceIcon(ticket.deviceType)}
                        <span className="text-sm">{ticket.deviceType}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 font-mono">{ticket.deviceId}</div>
                    </td>
                    <td className="p-4 align-top">
                      <p className="text-sm text-slate-700 line-clamp-2" title={ticket.issueDescription}>
                        {ticket.issueDescription}
                      </p>
                      {ticket.aiDiagnosis && (
                        <div className="mt-2 text-xs text-indigo-600 bg-indigo-50 p-1.5 rounded inline-block border border-indigo-100">
                          ✨ AI Suggestion Available
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      {ticket.priority === 'Critical' && (
                        <span className="block mt-1 text-xs text-red-600 font-bold text-center">Critical</span>
                      )}
                    </td>
                    <td className="p-4 align-top text-right">
                      {ticket.status !== 'Completed' && (
                        <div className="flex flex-col gap-2 items-end">
                          {ticket.status === 'Pending' && (
                            <button
                              onClick={() => onUpdateStatus(ticket.id, 'In Progress')}
                              className="text-xs bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-1 rounded border border-amber-200 transition-colors"
                            >
                              รับงาน
                            </button>
                          )}
                          {ticket.status === 'In Progress' && (
                            <button
                              onClick={() => onUpdateStatus(ticket.id, 'Completed')}
                              className="text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1 rounded border border-emerald-200 transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 size={12} />
                              ปิดงาน
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TicketList;