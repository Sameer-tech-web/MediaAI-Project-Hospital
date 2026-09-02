import React, { useState, useEffect } from 'react';
import { Users, Stethoscope, Clock, Activity, ArrowUpRight, Bed, AlertTriangle, HeartPulse } from 'lucide-react';
import { apiRequest } from '../lib/api';

export default function Dashboard({ setActiveTab }) {
  const [stats, setStats] = useState([
    { label: 'Total Patients', value: '—', change: '', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Doctors', value: '—', change: '', icon: Stethoscope, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Critical Patients', value: '—', change: '', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Lab Reports Pending', value: '—', change: '', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]);

  useEffect(() => {
    apiRequest('/dashboard/stats')
      .then((data) => {
        setStats([
          { label: 'Total Patients', value: data.totalPatients ?? 0, change: `+${data.todayPatients ?? 0} today`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Doctors', value: data.doctorsAvailable ?? 0, change: 'Online', icon: Stethoscope, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Critical Patients', value: data.criticalPatients ?? 0, change: `${data.criticalVitalsToday ?? 0} vitals alerts`, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Waiting / Admitted', value: `${data.waitingPatients ?? 0} / ${data.admittedPatients ?? 0}`, change: 'Queue', icon: Bed, color: 'text-amber-600', bg: 'bg-amber-50' },
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Hospital Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Real-time overview of hospital operations</p>
        </div>
        <button
          onClick={() => setActiveTab('add-patient')}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
        >
          + Register New Patient
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block">{stat.label}</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{stat.value}</span>
                <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">{stat.change}</span>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions / Status */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('patients')}
            className="p-4 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl text-left transition-all group"
          >
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 flex items-center justify-between">
              Patients Directory <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className="p-4 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl text-left transition-all group"
          >
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 flex items-center justify-between">
              Staff Attendance <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </button>
          <button
            onClick={() => setActiveTab('laboratory')}
            className="p-4 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl text-left transition-all group"
          >
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 flex items-center justify-between">
              Laboratory <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </button>
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className="p-4 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl text-left transition-all group"
          >
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 flex items-center justify-between">
              MediAI Assistant <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
