import React from 'react';
import {
  ArrowLeft,
  User,
  HeartPulse,
  Stethoscope,
  FileText,
  Activity,
  AlertTriangle,
  CalendarDays,
} from 'lucide-react';

export default function PatientProfile({ patient, setActiveTab }) {
  if (!patient) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto font-sans">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />

          <h2 className="text-lg font-black text-slate-900">
            No Patient Selected
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Please select a patient from the Patients Directory.
          </p>

          <button
            type="button"
            onClick={() => setActiveTab('patients')}
            className="mt-5 px-5 py-2.5 bg-medBlue hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  const triageMap = {
    Emergency: 'Critical Priority',
    Urgent: 'Warning',
    Routine: 'Stable',
  };

  const status = patient.status
    || triageMap[patient.triageCategory]
    || patient.queueStatus
    || 'Stable';

  const isCritical = status === 'Critical Priority';
  const dept = patient.department || patient.dept || '—';
  const doctorName = patient.assignedDoctor?.name
    || patient.assignedDoctor
    || patient.doctor
    || 'Not Assigned';
  const patientId = patient.mrn || patient._id || patient.id || '—';
  const priorityLabel = patient.triageCategory || 'Standard';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => setActiveTab('patients')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-medBlue transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Patients Directory
      </button>

      {/* Patient Header */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 text-medBlue flex items-center justify-center shrink-0">
              <User className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 break-words">
                  {patient.name}
                </h2>

                <span
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                    isCritical
                      ? 'bg-red-100 text-red-700'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {status}
                </span>
              </div>

              <p className="text-xs text-slate-400 font-bold mt-1">
                Patient ID: {patientId}
              </p>

              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                {patient.age} Years • {patient.gender} • {dept}
              </p>
            </div>
          </div>

          <div
            className={`px-4 py-3 rounded-xl border text-xs font-extrabold flex items-center gap-2 ${
              priorityLabel === 'Emergency'
                ? 'bg-red-50 border-red-200 text-red-700'
                : priorityLabel === 'Urgent'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            {isCritical ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Activity className="w-4 h-4" />
            )}

            {priorityLabel} Patient
          </div>
        </div>
      </div>

      {/* Patient Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
          <h3 className="font-black text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-medBlue" />
            Patient Information
          </h3>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <span className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                Patient ID
              </span>
              <span className="block text-xs font-bold text-slate-800 mt-1">
                {patientId}
              </span>
            </div>

            <div>
              <span className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                Age
              </span>
              <span className="block text-xs font-bold text-slate-800 mt-1">
                {patient.age} Years
              </span>
            </div>

            <div>
              <span className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                Gender
              </span>
              <span className="block text-xs font-bold text-slate-800 mt-1">
                {patient.gender}
              </span>
            </div>

            <div>
              <span className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                Department
              </span>
              <span className="block text-xs font-bold text-slate-800 mt-1">
                {dept}
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Doctor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
          <h3 className="font-black text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            Assigned Doctor
          </h3>

          <div className="mt-4">
            <span className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
              Attending Physician
            </span>

            <span className="block text-base font-black text-slate-900 mt-1">
              {doctorName}
            </span>

            <span className="block text-xs text-slate-500 mt-2">
              {dept} Department
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="font-black text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
          <HeartPulse className="w-4 h-4 text-red-500" />
          Clinical Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
              Admission Status
            </span>

            <span className="block text-xs font-black text-slate-900 mt-1">
              {status}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
              Current Department
            </span>

            <span className="block text-xs font-black text-slate-900 mt-1">
              {dept}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
              Priority
            </span>

            <span className="block text-xs font-black text-slate-900 mt-1">
              {priorityLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Medical Record Placeholder */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="font-black text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
          <FileText className="w-4 h-4 text-medBlue" />
          Medical Record
        </h3>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <CalendarDays className="w-5 h-5 text-slate-400 mb-2" />

            <p className="text-xs font-bold text-slate-700">
              Admission Record
            </p>

            <p className="text-[10px] text-slate-400 mt-1">
              Detailed admission history will appear here.
            </p>
          </div>

          <div className="p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <Activity className="w-5 h-5 text-slate-400 mb-2" />

            <p className="text-xs font-bold text-slate-700">
              Clinical Timeline
            </p>

            <p className="text-[10px] text-slate-400 mt-1">
              Vitals, diagnosis, prescriptions and laboratory records will
              appear here.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white">
        <h3 className="font-black text-sm">
          Clinical Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <button
            type="button"
            onClick={() => setActiveTab('doctor')}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors"
          >
            <Stethoscope className="w-5 h-5 mb-2 text-blue-400" />

            <span className="block text-xs font-bold">
              Doctor Examination
            </span>

            <span className="block text-[10px] text-slate-400 mt-1">
              Open clinical assessment
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('nurse')}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors"
          >
            <HeartPulse className="w-5 h-5 mb-2 text-red-400" />

            <span className="block text-xs font-bold">
              Nurse Station
            </span>

            <span className="block text-[10px] text-slate-400 mt-1">
              Record patient vitals
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('laboratory')}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors"
          >
            <FileText className="w-5 h-5 mb-2 text-purple-400" />

            <span className="block text-xs font-bold">
              Laboratory
            </span>

            <span className="block text-[10px] text-slate-400 mt-1">
              View or attach lab reports
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
