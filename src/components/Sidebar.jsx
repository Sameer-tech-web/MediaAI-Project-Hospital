import React, { useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Stethoscope,
  Clock,
  FlaskConical,
  Bot,
  BarChart3,
  Settings,
  X,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients Directory', icon: Users },
  { id: 'doctor', label: 'Doctor Panel', icon: Stethoscope },
  { id: 'nurse', label: 'Nurse Station & I/O', icon: UserCheck },
  { id: 'attendance', label: 'Staff Attendance & Rosters', icon: Clock },
  { id: 'laboratory', label: 'Laboratory', icon: FlaskConical },
  { id: 'ai-assistant', label: 'MediAI Assistant', icon: Bot },
  { id: 'reports', label: 'Reports & Financials', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function SidebarContent({ activeTab, setActiveTab, onClose, closeButtonRef, onLogout }) {
  const handleNavigation = (tabId) => {
    setActiveTab(tabId);
    onClose?.();
  };

  return (
    <>
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/30">
            M
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-extrabold text-base tracking-wide text-white leading-none">MediAI Hub</h1>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">ENTERPRISE EMR</span>
          </div>
          {onClose && (
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="lg:hidden -mr-2 p-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
        </div>

        <nav className="p-3 space-y-1.5 mt-2" aria-label="Main navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 translate-x-1'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800/60">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM ONLINE
          </span>
          <span>• HIPAA ACTIVE</span>
        </div>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-600/20 border border-slate-800 hover:border-red-600/40 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        )}
      </div>
    </>
  );
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, isOpen, onClose }) {
  const closeButtonRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = drawerRef.current?.querySelectorAll('button');
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <aside className="hidden lg:flex w-64 bg-[#0a0f1d] text-white flex-col justify-between shrink-0 font-sans border-r border-slate-800">
        <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      </aside>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
          />
          <aside
            ref={drawerRef}
            id="app-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col justify-between overflow-y-auto overscroll-contain bg-[#0a0f1d] text-white font-sans border-r border-slate-800 shadow-xl lg:hidden"
          >
            <SidebarContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onClose={onClose}
              closeButtonRef={closeButtonRef}
              onLogout={onLogout}
            />
          </aside>
        </>
      )}
    </>
  );
}
