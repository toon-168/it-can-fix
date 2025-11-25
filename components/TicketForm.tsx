import React, { useState } from 'react';
import { Ticket, BRANCHES, DEVICE_TYPES, PRIORITIES } from '../types';
import { Save, Sparkles, Loader2 } from 'lucide-react';
import { diagnoseIssue } from '../services/geminiService';

interface TicketFormProps {
  onAddTicket: (ticket: Ticket) => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onAddTicket }) => {
  const [loadingAi, setLoadingAi] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Ticket>>({
    requesterName: '',
    branch: BRANCHES[0],
    deviceId: '',
    deviceType: 'Desktop',
    issueDescription: '',
    priority: 'Medium',
    status: 'Pending',
    aiDiagnosis: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAiDiagnose = async () => {
    if (!formData.issueDescription) return;
    
    setLoadingAi(true);
    try {
      const diagnosis = await diagnoseIssue(formData.deviceType || 'Unknown', formData.issueDescription);
      setFormData(prev => ({ ...prev, aiDiagnosis: diagnosis }));
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: Ticket = {
      id: `REQ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`,
      ...formData as Ticket,
      createdAt: new Date().toISOString()
    };
    onAddTicket(newTicket);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">
          <Save size={24} />
        </span>
        แจ้งซ่อมอุปกรณ์ใหม่
      </h2>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
        
        {/* User Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">ชื่อผู้แจ้ง</label>
            <input
              type="text"
              name="requesterName"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="เช่น สมชาย ใจดี"
              value={formData.requesterName}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">สังกัด (การไฟฟ้า)</label>
            <select
              name="branch"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.branch}
              onChange={handleChange}
            >
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* Device Info Section */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">รหัสทรัพย์สิน/อุปกรณ์ (Device ID)</label>
            <input
              type="text"
              name="deviceId"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="เช่น PC-HQ-001"
              value={formData.deviceId}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">ประเภทอุปกรณ์</label>
            <select
              name="deviceType"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.deviceType}
              onChange={handleChange}
            >
              {DEVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Issue Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">รายละเอียดปัญหา</label>
          <div className="relative">
            <textarea
              name="issueDescription"
              required
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="อธิบายอาการเสียที่พบ..."
              value={formData.issueDescription}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={handleAiDiagnose}
              disabled={loadingAi || !formData.issueDescription}
              className="absolute bottom-3 right-3 flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingAi ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
              <span>วิเคราะห์ด้วย AI</span>
            </button>
          </div>
        </div>

        {/* AI Result Section */}
        {formData.aiDiagnosis && (
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg animate-fade-in">
            <h4 className="flex items-center text-indigo-800 font-semibold text-sm mb-2">
              <Sparkles className="mr-2" size={16} />
              ผลการวิเคราะห์เบื้องต้น (AI Diagnosis)
            </h4>
            <p className="text-slate-700 text-sm whitespace-pre-line">{formData.aiDiagnosis}</p>
          </div>
        )}

        {/* Priority */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">ความเร่งด่วน</label>
          <div className="flex space-x-4">
            {PRIORITIES.map(p => (
              <label key={p} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={formData.priority === p}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className={`ml-2 text-sm ${
                  p === 'Critical' ? 'text-red-600 font-bold' : 'text-slate-700'
                }`}>{p}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center"
          >
            <Save className="mr-2" size={18} />
            บันทึกการแจ้งซ่อม
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;