import { useState } from 'react';
import { LayoutDashboard, PlusCircle, List, Activity, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { Ticket, User } from './types';
import Dashboard from './components/Dashboard';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import Login from './components/Login';

// Mock data for initial state
const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'REQ-20231001-001',
    requesterName: 'สมชาย ใจดี',
    branch: 'กฟภ. สำนักงานใหญ่',
    deviceId: 'PC-HQ-0045',
    deviceType: 'Desktop',
    issueDescription: 'เครื่องเปิดไม่ติด มีเสียงบี๊บยาว 3 ครั้ง',
    status: 'Pending',
    priority: 'High',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    aiDiagnosis: 'เป็นไปได้ว่ามีความผิดปกติที่ RAM (Memory Error) แนะนำให้ถอด RAM ออกมาทำความสะอาดหน้าสัมผัสแล้วใส่กลับเข้าไปใหม่'
  },
  {
    id: 'REQ-20231001-002',
    requesterName: 'วิไลวรรณ รักงาน',
    branch: 'กฟภ. สาขาบางเขน',
    deviceId: 'PRT-BK-0012',
    deviceType: 'Printer',
    issueDescription: 'ปริ้นไม่ออก กระดาษติดบ่อย',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: 'REQ-20231002-003',
    requesterName: 'กิตติ กล้าหาญ',
    branch: 'กฟภ. สาขารังสิต',
    deviceId: 'NB-RS-0089',
    deviceType: 'Notebook',
    issueDescription: 'เชื่อมต่อ WiFi ไม่ได้',
    status: 'Completed',
    priority: 'Low',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  }
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'list'>('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // When user logs in, set the default view based on role
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'user') {
      setCurrentView('create');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsMobileMenuOpen(false);
  };

  const addTicket = (newTicket: Ticket) => {
    setTickets(prev => [newTicket, ...prev]);
    // If Admin adds a ticket, maybe go to list. If User adds, stay or show success.
    // For now, let's go to list for Admin, stay for User (or maybe show list if they could see it)
    if (user?.role === 'admin') {
      setCurrentView('list');
    } else {
      alert("บันทึกการแจ้งซ่อมเรียบร้อยแล้ว เจ้าหน้าที่จะดำเนินการตรวจสอบโดยเร็วที่สุด");
      // Optionally reset form or just stay there
    }
  };

  const updateTicketStatus = (id: string, newStatus: Ticket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const NavItem = ({ view, icon: Icon, label }: { view: 'dashboard' | 'create' | 'list', icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  // If not logged in, show Login screen
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full shadow-sm z-10">
        <div className="p-6 flex items-center space-x-2 border-b border-slate-100">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">IT Support</h1>
            <p className="text-xs text-slate-500">ระบบแจ้งซ่อมคอมพิวเตอร์</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {user.role === 'admin' && (
            <NavItem view="dashboard" icon={LayoutDashboard} label="ภาพรวม (Dashboard)" />
          )}
          <NavItem view="create" icon={PlusCircle} label="แจ้งซ่อมใหม่" />
          {user.role === 'admin' && (
            <NavItem view="list" icon={List} label="รายการแจ้งซ่อม" />
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200 mb-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${user.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'}`}>
              <UserIcon size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-700 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
          >
            <LogOut size={16} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Overlay */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-20">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-md">
              <Activity className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg text-slate-800">IT Support</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg border-b border-slate-200 z-30 animate-fade-in-down">
            <nav className="p-4 space-y-2">
              <div className="pb-4 mb-2 border-b border-slate-100 flex items-center space-x-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${user.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'}`}>
                    <UserIcon size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
              </div>

              {user.role === 'admin' && (
                <NavItem view="dashboard" icon={LayoutDashboard} label="ภาพรวม" />
              )}
              <NavItem view="create" icon={PlusCircle} label="แจ้งซ่อมใหม่" />
              {user.role === 'admin' && (
                <NavItem view="list" icon={List} label="รายการแจ้งซ่อม" />
              )}
              
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 mt-2"
              >
                <LogOut size={20} />
                <span className="font-medium">ออกจากระบบ</span>
              </button>
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto h-full">
            {/* View Logic: Force 'create' if user is not admin and tries to see other views (edge case protection) */}
            {user.role === 'user' && currentView !== 'create' ? (
               <TicketForm onAddTicket={addTicket} />
            ) : (
              <>
                {currentView === 'dashboard' && <Dashboard tickets={tickets} />}
                {currentView === 'create' && <TicketForm onAddTicket={addTicket} />}
                {currentView === 'list' && <TicketList tickets={tickets} onUpdateStatus={updateTicketStatus} />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}