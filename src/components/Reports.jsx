import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  ShieldAlert,
  Calendar,
  DollarSign,
  UserX,
  Activity,
  Download,
  Building2,
  Lock,
  AlertTriangle
} from 'lucide-react';

export default function Reports() {
  const [dateFilter, setDateFilter] = useState('This Month');

  // Deauth & Security Logs (Mock Data)
  const [securityLogs, setSecurityLogs] = useState([
    {
      id: 'LOG-8801',
      user: 'Nurse Sarah',
      role: 'Staff Nurse',
      event: 'Session Terminated (Deauth)',
      reason: 'Idle Inactivity Timeout (30 mins)',
      ip: '192.168.1.42',
      time: '2026-09-01 10:15 AM',
      type: 'warning'
    },
    {
      id: 'LOG-8802',
      user: 'Dr. Usman',
      role: 'Doctor',
      event: 'Manual Logout',
      reason: 'Shift Ended',
      ip: '192.168.1.18',
      time: '2026-09-01 08:30 AM',
      type: 'info'
    },
    {
      id: 'LOG-8803',
      user: 'Admin_Super',
      role: 'System Admin',
      event: 'Revoked Access Token',
      reason: 'Forced Logout via Admin Panel',
      ip: '192.168.1.100',
      time: '2026-08-31 11:45 PM',
      type: 'danger'
    }
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto font-sans min-h-screen bg-slate-50">
      
      {/* Demo Mode Banner */}
      <div className="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <p className="text-xs font-bold text-amber-800">Demo Mode — Reports use sample data</p>
          <p className="text-[10px] text-amber-600">Financial and clinical figures shown here are illustrative and not sourced from live records.</p>
        </div>
      </div>

      {/* Top Header & Action Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-start sm:items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 shrink-0" />
            <span>Hospital Executive & Financial Reports</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Consolidated analytics for clinical operations, mortality metrics, and revenue billing.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl text-xs font-bold text-slate-700">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Custom Range">Custom Range</option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto justify-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Full Summary</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Monthly Clinical Summary */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center gap-3 pb-3 border-b border-slate-100">
            <h3 className="min-w-0 font-bold text-slate-900 text-sm flex items-center gap-2 leading-snug">
              <Activity className="w-4 h-4 text-blue-600 shrink-0" />
              Monthly Clinical Summary
            </h3>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
              {dateFilter}
            </span>
          </div>

          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-600">Total Admissions:</span>
              <span className="font-black text-slate-900">342</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-600">Discharged Recovered:</span>
              <span className="font-black text-emerald-600">310</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-600">Transferred Cases:</span>
              <span className="font-black text-amber-600">18</span>
            </div>

            {/* Added Mortality / Death Metric */}
            <div className="flex justify-between py-1.5 bg-rose-50/60 px-3 rounded-xl border border-rose-100">
              <span className="text-rose-800 font-bold flex items-center gap-1">
                <UserX className="w-3.5 h-3.5" /> Deceased / Mortality Cases:
              </span>
              <span className="font-black text-rose-600">14</span>
            </div>
          </div>
        </div>

        {/* Financial Revenue Ledger */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Financial Revenue Ledger
            </h3>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
              PKR Currency
            </span>
          </div>

          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-600">Gross Billing Invoiced:</span>
              <span className="font-black text-slate-900">PKR 12,450,000</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-600">Collected Payments:</span>
              <span className="font-black text-emerald-600">PKR 10,200,000</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-600">Outstanding Receivables:</span>
              <span className="font-black text-rose-600">PKR 2,250,000</span>
            </div>

            <div className="flex justify-between py-1.5 bg-slate-50 px-3 rounded-xl">
              <span className="text-slate-500">Collection Rate:</span>
              <span className="font-black text-blue-600">81.9%</span>
            </div>
          </div>
        </div>

        {/* Department Revenue Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 md:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              Department Breakdown
            </h3>
          </div>

          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-600">OPD OPD Consultations:</span>
              <span className="font-black text-slate-800">PKR 3,150,000</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-600">IPD Ward & ICU Stay:</span>
              <span className="font-black text-slate-800">PKR 5,800,000</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-600">Laboratory & Pathology:</span>
              <span className="font-black text-slate-800">PKR 1,900,000</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-600">Pharmacy & Medicines:</span>
              <span className="font-black text-slate-800">PKR 1,600,000</span>
            </div>
          </div>
        </div>

      </div>

      {/* SYSTEM SECURITY & DEAUTH LOGS TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>System Deauth & Security Access Audit Logs</span>
            </h3>
            <p className="text-xs text-slate-500">
              Monitors staff session revocations, idle timeouts, and access termination records.
            </p>
          </div>

          <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-3 py-1 rounded-full border border-rose-100 self-start sm:self-auto">
            Security Audit Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="p-3.5">Log ID</th>
                <th className="p-3.5">User & Role</th>
                <th className="p-3.5">Security Event</th>
                <th className="p-3.5">Reason / Trigger</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {securityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono text-slate-900 font-bold">{log.id}</td>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{log.user}</p>
                    <p className="text-[10px] text-slate-400">{log.role}</p>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 font-bold text-[10px] px-2.5 py-0.5 rounded-md ${
                        log.type === 'danger'
                          ? 'bg-rose-100 text-rose-800'
                          : log.type === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      {log.event}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700">{log.reason}</td>
                  <td className="p-3.5 font-mono text-slate-500">{log.ip}</td>
                  <td className="p-3.5 text-slate-500">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
