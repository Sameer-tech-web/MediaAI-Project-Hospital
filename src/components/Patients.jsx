import React, { useEffect, useMemo, useState } from 'react';
import { 
  Eye, 
  Search, 
  Star, 
  AlertCircle, 
  UserCheck, 
  ShieldAlert, 
  Activity, 
  RefreshCw,
  X,
  FileText
} from 'lucide-react';
import { apiRequest } from '../lib/api';

export default function Patients({ setActiveTab, setSelectedPatient }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [patientList, setPatientList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [quickViewPatient, setQuickViewPatient] = useState(null);

  const fetchPatients = async () => {
    const token = localStorage.getItem('mediai_token');

    if (!token) {
      setError('Authentication required. Please login again.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const data = await apiRequest('/patients');
      setPatientList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load patients.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const getPriorityLabel = (patient) => {
    if (patient.triageCategory === 'Emergency') {
      return 'Critical Priority';
    }
    if (patient.triageCategory === 'Urgent') {
      return 'Doctor Relative VIP';
    }
    return 'Standard';
  };

  const getStatusLabel = (patient) => {
    if (patient.triageCategory === 'Emergency') {
      return 'Critical Priority';
    }
    return patient.queueStatus || 'Waiting';
  };

  const getDoctorName = (patient) => {
    if (!patient.assignedDoctor) return 'Not assigned';
    if (typeof patient.assignedDoctor === 'object') {
      return patient.assignedDoctor.name || 'Not assigned';
    }
    return patient.assignedDoctor;
  };

  const filteredPatients = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return patientList.filter((patient) => {
      const patientName = patient.name?.toLowerCase() || '';
      const patientMrn = (patient.mrn || patient._id)?.toLowerCase() || '';
      const department = patient.department?.toLowerCase() || '';
      const doctorName = getDoctorName(patient).toLowerCase();

      const matchesSearch = 
        patientName.includes(query) ||
        patientMrn.includes(query) ||
        department.includes(query) ||
        doctorName.includes(query);

      let matchesTab = true;
      if (filterCategory === 'Emergency') {
        matchesTab = patient.triageCategory === 'Emergency';
      } else if (filterCategory === 'VIP') {
        matchesTab = patient.triageCategory === 'Urgent';
      } else if (filterCategory === 'Standard') {
        matchesTab = !patient.triageCategory || patient.triageCategory === 'Routine';
      }

      return matchesSearch && matchesTab;
    });
  }, [patientList, searchQuery, filterCategory]);

  const stats = useMemo(() => {
    const total = patientList.length;
    const critical = patientList.filter(p => p.triageCategory === 'Emergency').length;
    const vip = patientList.filter(p => p.triageCategory === 'Urgent').length;
    const activeAdmissions = patientList.filter(p => p.queueStatus === 'Admitted' || p.queueStatus === 'In Progress').length;
    return { total, critical, vip, activeAdmissions };
  }, [patientList]);

  const handleSelect = (patient) => {
    if (typeof setSelectedPatient === 'function') {
      setSelectedPatient(patient);
    }
    if (typeof setActiveTab === 'function') {
      setActiveTab('patient-profile');
    } else {
      setQuickViewPatient(patient);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans bg-slate-50/50 min-h-screen">
      
      {/* Header Panel */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Patients Directory & Health Records
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time API database for live ward admissions, triage priority, and patient charts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchPatients}
            title="Refresh Patient Data"
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab && setActiveTab('add-patient')}
            className="w-full sm:w-fit px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            + Admit Patient
          </button>
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Patients</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900">{stats.total}</span>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Critical Cases</span>
            <span className="text-xl sm:text-2xl font-black text-red-600">{stats.critical}</span>
          </div>
          <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Doctor VIPs</span>
            <span className="text-xl sm:text-2xl font-black text-amber-600">{stats.vip}</span>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Star className="w-5 h-5 fill-current" />
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Queue</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600">{stats.activeAdmissions}</span>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient ID, name, department, doctor..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Priority Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'All', label: 'All Cases' },
            { id: 'Emergency', label: 'Emergency' },
            { id: 'VIP', label: 'VIP Priority' },
            { id: 'Standard', label: 'Standard' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${
                filterCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-bold text-slate-700">Loading patients database...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center shadow-sm">
          <p className="text-sm font-bold text-red-700">{error}</p>
          <button
            type="button"
            onClick={fetchPatients}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Main Table / Mobile View */}
      {!isLoading && !error && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Patient ID / Name
                    </th>
                    <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Age / Gender
                    </th>
                    <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Department & Doctor
                    </th>
                    <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Priority Tag
                    </th>
                    <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-5 py-4 text-right text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium text-xs">
                  {filteredPatients.map((patient) => {
                    const priority = getPriorityLabel(patient);
                    const status = getStatusLabel(patient);

                    return (
                      <tr
                        key={patient._id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="font-bold text-sm text-slate-900">
                            {patient.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">
                            #{patient.mrn || patient._id}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-semibold text-slate-700">
                            {patient.age ? `${patient.age} Yrs` : 'N/A'} / {patient.gender || 'N/A'}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-800">
                            {patient.department || 'General Medicine'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                            {getDoctorName(patient)}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1 ${
                              priority.includes('VIP')
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : priority.includes('Priority')
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {priority.includes('VIP') && (
                              <Star className="w-3 h-3 fill-current" />
                            )}
                            {priority.includes('Priority') && !priority.includes('VIP') && (
                              <AlertCircle className="w-3 h-3" />
                            )}
                            {priority}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`px-3 py-1 rounded-xl text-[10px] font-bold inline-block ${
                              status === 'Critical Priority'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleSelect(patient)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl font-bold inline-flex items-center gap-1.5 text-xs transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Open Chart
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-4">
            {filteredPatients.map((patient) => {
              const priority = getPriorityLabel(patient);
              const status = getStatusLabel(patient);

              return (
                <div
                  key={patient._id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="min-w-0">
                      <h3 className="font-black text-sm text-slate-900 truncate">
                        {patient.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono font-semibold mt-0.5">
                        #{patient.mrn || patient._id}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                        status === 'Critical Priority'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                        Age / Gender
                      </span>
                      <span className="block font-bold text-slate-700 mt-0.5">
                        {patient.age ? `${patient.age} Yrs` : 'N/A'} / {patient.gender || 'N/A'}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                        Department
                      </span>
                      <span className="block font-bold text-slate-700 mt-0.5">
                        {patient.department || 'General Medicine'}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                        Doctor
                      </span>
                      <span className="block font-bold text-slate-700 mt-0.5">
                        {getDoctorName(patient)}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                        Priority Tag
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1 ${
                          priority.includes('VIP')
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : priority.includes('Priority')
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {priority.includes('VIP') && (
                          <Star className="w-3 h-3 fill-current" />
                        )}
                        {priority.includes('Priority') && !priority.includes('VIP') && (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {priority}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelect(patient)}
                    className="w-full mt-2 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition-colors border border-blue-200"
                  >
                    <Eye className="w-4 h-4" />
                    Open Patient Chart
                  </button>
                </div>
              );
            })}
          </div>

          {/* Empty Search Fallback */}
          {filteredPatients.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">No matching patients found</p>
              <p className="text-xs text-slate-400 mt-1">Try tweaking your search query or filter tags.</p>
            </div>
          )}
        </>
      )}

      {/* QUICK VIEW POPUP MODAL (Fallback View) */}
      {quickViewPatient && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">{quickViewPatient.name}</h3>
                <p className="text-xs text-slate-400 font-mono">#{quickViewPatient.mrn || quickViewPatient._id}</p>
              </div>
              <button onClick={() => setQuickViewPatient(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block">AGE / GENDER</span>
                <span className="font-bold text-slate-900">{quickViewPatient.age || 'N/A'} Yrs / {quickViewPatient.gender || 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block">DEPARTMENT</span>
                <span className="font-bold text-slate-900">{quickViewPatient.department || 'General Medicine'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                <span className="text-[10px] font-bold text-slate-400 block">ATTENDING DOCTOR</span>
                <span className="font-bold text-slate-900">{getDoctorName(quickViewPatient)}</span>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-3">
              <button
                onClick={() => setQuickViewPatient(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
