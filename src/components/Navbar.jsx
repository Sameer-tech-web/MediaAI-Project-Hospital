import React from 'react';
import { Bell, LogOut, Menu, Search, ShieldCheck } from 'lucide-react';

export default function Navbar({ userRole, onLogout, onOpenSidebar, isSidebarOpen, menuButtonRef }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-4 shrink-0 font-sans">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation menu"
        aria-controls="app-sidebar"
        aria-expanded={isSidebarOpen}
        className="lg:hidden -ml-1 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-700 shrink-0 transition-colors"
      >
        <Menu className="w-5 h-5" aria-hidden="true" />
      </button>

      <div className="flex min-w-0 flex-1 items-center max-w-md">
        <div className="relative w-full">
          <Search
            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />

          <input
            type="search"
            placeholder="Search Patient ID, CNIC, or Doctor..."
            aria-label="Search patients, CNIC, or doctors"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medBlue/20 focus:border-medBlue transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 ml-auto shrink-0">
        <button
          type="button"
          aria-label="Notifications"
          className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 relative transition-colors"
        >
          <Bell className="w-4 h-4" aria-hidden="true" />

          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"
            aria-hidden="true"
          />
        </button>

        <div
          className="hidden sm:block h-8 w-px bg-slate-200"
          aria-hidden="true"
        />

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="w-9 h-9 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            {userRole ? userRole.charAt(0).toUpperCase() : 'A'}
          </div>

          <div className="hidden sm:block min-w-0">
            <span className="text-xs font-black text-slate-900 block truncate max-w-32">
              {userRole || 'Admin Staff'}
            </span>

            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 shrink-0" aria-hidden="true" />
              Authenticated
            </span>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              aria-label="Logout"
              className="p-2.5 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-xl border border-slate-200 text-slate-600 transition-colors"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
