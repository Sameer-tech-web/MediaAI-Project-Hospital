import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Database,
  Bell,
  Sun,
  Moon,
  Monitor,
  Building2,
  Lock,
  Save,
  Check,
  AlertTriangle
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('governance');
  const [saved, setSaved] = useState(false);

  // Theme State
  const [themeMode, setThemeMode] = useState('light'); // 'light' | 'dark' | 'system'

  // Settings Toggles State
  const [hipaaCompliance, setHipaaCompliance] = useState(true);
  const [publicApi, setPublicApi] = useState(true);
  const [clinicalAlerts, setClinicalAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('15');

  // Hospital Info State
  const [hospitalName, setHospitalName] = useState('MediAI Central Hospital');
  const [helpline, setHelpline] = useState('+92 (051) 111-222-333');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto font-sans min-h-screen bg-slate-50">
      
      {/* Demo Mode Banner */}
      <div className="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <p className="text-xs font-bold text-amber-800">Demo Mode — Settings are not persisted</p>
          <p className="text-[10px] text-amber-600">Changes made here are for demonstration purposes only and will reset on page reload.</p>
        </div>
      </div>

      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-start sm:items-center gap-2">
            <SettingsIcon className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700 shrink-0" />
            <span>System Settings & Governance</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage security protocols, theme preferences, and system defaults.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled
          title="Not available in demo mode"
          className="w-full sm:w-auto justify-center px-5 py-2.5 bg-slate-300 text-slate-500 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-not-allowed"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Settings Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('governance')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'governance'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4" /> Governance & Controls
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'appearance'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sun className="w-4 h-4" /> UI Theme Preference
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" /> Hospital Details
        </button>
      </div>

      {/* TAB 1: Governance & Interactive Toggles */}
      {activeTab === 'governance' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-6">
          <div className="divide-y divide-slate-100">
            
            {/* HIPAA Compliance */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    HIPAA Compliance & Immutable Audit Logging
                  </h3>
                  <p className="text-xs text-slate-500">
                    Prevents deletion of medical entries; enforces strikethrough correction.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex shrink-0 items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hipaaCompliance}
                  onChange={(e) => setHipaaCompliance(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Patient Portal API Access */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <Database className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Public Patient Portal API Access
                  </h3>
                  <p className="text-xs text-slate-500">
                    Allows read-only access via Patient ID & CNIC authentication.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex shrink-0 items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={publicApi}
                  onChange={(e) => setPublicApi(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Notifications */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <Bell className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Clinical Alert Notifications
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enables real-time push notifications for critical patient alerts and system events.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex shrink-0 items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={clinicalAlerts}
                  onChange={(e) => setClinicalAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Session Auto Logout Control */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <Lock className="w-5 h-5 text-rose-600 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Session Auto-Deauth Timeout
                  </h3>
                  <p className="text-xs text-slate-500">
                    Automatically terminates idle doctor/staff login sessions.
                  </p>
                </div>
              </div>

              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="shrink-0 bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="5">5 Minutes</option>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
              </select>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: Theme Preference */}
      {activeTab === 'appearance' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-black text-slate-900">System Color Theme</h3>
            <p className="text-xs text-slate-500">Select visual display mode for EMR dashboard screens.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Light Mode */}
            <div
              onClick={() => setThemeMode('light')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                themeMode === 'light'
                  ? 'border-blue-600 bg-blue-50/40'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between pb-3">
                <Sun className={`w-5 h-5 ${themeMode === 'light' ? 'text-blue-600' : 'text-slate-500'}`} />
                <input type="radio" checked={themeMode === 'light'} readOnly className="accent-blue-600" />
              </div>
              <p className="font-bold text-xs text-slate-900">Light Mode</p>
              <p className="text-[10px] text-slate-400 mt-0.5">High clarity UI for daytime operations.</p>
            </div>

            {/* Dark Mode */}
            <div
              onClick={() => setThemeMode('dark')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                themeMode === 'dark'
                  ? 'border-blue-600 bg-blue-50/40'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between pb-3">
                <Moon className={`w-5 h-5 ${themeMode === 'dark' ? 'text-blue-600' : 'text-slate-500'}`} />
                <input type="radio" checked={themeMode === 'dark'} readOnly className="accent-blue-600" />
              </div>
              <p className="font-bold text-xs text-slate-900">Dark Mode</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Reduces eye strain for night shifts.</p>
            </div>

            {/* System Sync */}
            <div
              onClick={() => setThemeMode('system')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                themeMode === 'system'
                  ? 'border-blue-600 bg-blue-50/40'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between pb-3">
                <Monitor className={`w-5 h-5 ${themeMode === 'system' ? 'text-blue-600' : 'text-slate-500'}`} />
                <input type="radio" checked={themeMode === 'system'} readOnly className="accent-blue-600" />
              </div>
              <p className="font-bold text-xs text-slate-900">System Preference</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Syncs with OS theme automatically.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Hospital Profile Info */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-900">Hospital Information</h3>
            <p className="text-xs text-slate-500">Details printed on official patient invoices and lab reports.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 mb-1">Hospital Title</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Helpline Contact Number</label>
              <input
                type="text"
                value={helpline}
                onChange={(e) => setHelpline(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
