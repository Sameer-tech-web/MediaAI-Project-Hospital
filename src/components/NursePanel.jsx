import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import {
  Syringe,
  RefreshCw,
  HeartPulse,
  Activity,
  Pill,
  CheckCircle2,
  PlusCircle,
  Clock,
  UserCheck,
} from 'lucide-react';

export default function NursePanel() {
  const [patients, setPatients] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [nurseData, setNurseData] = useState({
    patient: '',
    bp: '',
    pulse: '',
    sugar: '',
    spo2: '',
    temperature: '',
    respiratoryRate: '',
    urineOutput: 'Normal Voiding',
    urineVolume: '450',
    stoolStatus: 'Normal Formed',
    edemaLevel: 'None',
  });

  useEffect(() => {
    apiRequest('/patients')
      .then((data) => setPatients(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // 2. Doctor Prescribed Medications State
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'med-1',
      name: 'Tab. Amlodipine 10mg',
      instruction: '1 tablet after breakfast (High BP)',
      doses: [
        { slot: 'Morning', status: 'Given', time: '09:15 AM' },
        { slot: 'Evening', status: 'Pending', time: null },
      ],
    },
    {
      id: 'med-2',
      name: 'Inj. Insulin (Regular) 10 IU',
      instruction: 'Subcutaneous before meals (High Sugar)',
      doses: [
        { slot: 'Morning', status: 'Given', time: '08:30 AM' },
        { slot: 'Afternoon', status: 'Pending', time: null },
        { slot: 'Night', status: 'Pending', time: null },
      ],
    },
    {
      id: 'med-3',
      name: 'Tab. Paracetamol 500mg',
      instruction: 'SOS / Every 8 hours for pain/fever',
      doses: [
        { slot: 'Dose 1', status: 'Given', time: '11:00 AM' },
        { slot: 'Dose 2', status: 'Pending', time: null },
      ],
    },
  ]);

  // 3. Nurse Custom Interventions & Unscheduled Meds State
  const [customActionTitle, setCustomActionTitle] = useState('');
  const [customActionNotes, setCustomActionNotes] = useState('');
  const [loggedInterventions, setLoggedInterventions] = useState([
    {
      id: 1,
      title: 'Oxygen Support Given',
      notes: 'Started O2 @ 2L/min via nasal cannula due to high BP & mild dyspnea.',
      time: '10:45 AM',
      nurse: 'Nurse On-Duty',
    },
    {
      id: 2,
      title: 'Wound Dressing Changed',
      notes: 'Cleaned with Betadine, sterile dressing applied on left leg.',
      time: '01:20 PM',
      nurse: 'Nurse On-Duty',
    },
  ]);

  // Handle Vitals input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNurseData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Mark prescribed medicine dose as Given
  const handleAdministerDose = (medId, doseIndex) => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setPrescriptions((prev) =>
      prev.map((med) => {
        if (med.id === medId) {
          const updatedDoses = [...med.doses];
          updatedDoses[doseIndex] = {
            ...updatedDoses[doseIndex],
            status: 'Given',
            time: currentTime,
          };
          return { ...med, doses: updatedDoses };
        }
        return med;
      })
    );
  };

  // Add custom nurse action / SOS intervention
  const handleAddCustomIntervention = (e) => {
    e.preventDefault();
    if (!customActionTitle.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newEntry = {
      id: Date.now(),
      title: customActionTitle,
      notes: customActionNotes || 'No additional notes',
      time: currentTime,
      nurse: 'Nurse On-Duty',
    };

    setLoggedInterventions([newEntry, ...loggedInterventions]);
    setCustomActionTitle('');
    setCustomActionNotes('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!nurseData.patient) {
      setSaveMessage('Please select a patient.');
      return;
    }
    const bpParts = nurseData.bp.split('/');
    if (bpParts.length !== 2) {
      setSaveMessage('Blood pressure must be in systolic/diastolic format (e.g. 120/80).');
      return;
    }
    setSaving(true);
    setSaveMessage('');
    try {
      await apiRequest('/vitals', {
        method: 'POST',
        body: JSON.stringify({
          patientId: nurseData.patient,
          heartRate: Number(nurseData.pulse) || 0,
          systolic: Number(bpParts[0]) || 0,
          diastolic: Number(bpParts[1]) || 0,
          spo2: Number(nurseData.spo2) || 98,
          temperature: Number(nurseData.temperature) || 37,
          respiratoryRate: Number(nurseData.respiratoryRate) || 16,
        }),
      });
      setSaveMessage('Vitals recorded successfully.');
    } catch (err) {
      setSaveMessage(err.message || 'Failed to record vitals.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-medWhite min-h-full max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-start sm:items-center gap-2">
            <Syringe className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
            <span>Nurse Station & Clinical Intake/Output Telemetry</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Log periodic vitals, manage doctor-prescribed meds, and add custom nursing care logs.
          </p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Patient Selection */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <label
            htmlFor="patient"
            className="block text-xs font-bold text-slate-700 uppercase mb-2"
          >
            Select Patient
          </label>
          <select
            id="patient"
            name="patient"
            value={nurseData.patient}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">-- Select Patient --</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.mrn || p._id.slice(-4)})
              </option>
            ))}
          </select>
        </div>

        {/* Standard Vitals */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-600" />
            <span>Standard Vitals Telemetry</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Blood Pressure */}
            <div>
              <label htmlFor="bp" className="block text-xs font-bold text-slate-700 mb-1">
                Blood Pressure (mmHg)
              </label>
              <input
                id="bp"
                type="text"
                name="bp"
                value={nurseData.bp}
                onChange={handleChange}
                placeholder="e.g. 120/80"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Pulse */}
            <div>
              <label htmlFor="pulse" className="block text-xs font-bold text-slate-700 mb-1">
                Pulse / Heart Rate (bpm)
              </label>
              <input
                id="pulse"
                type="text"
                name="pulse"
                value={nurseData.pulse}
                onChange={handleChange}
                placeholder="e.g. 72"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* SpO2 */}
            <div>
              <label htmlFor="spo2" className="block text-xs font-bold text-slate-700 mb-1">
                SpO2 (%)
              </label>
              <input
                id="spo2"
                type="text"
                name="spo2"
                value={nurseData.spo2}
                onChange={handleChange}
                placeholder="e.g. 98"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Temperature */}
            <div>
              <label htmlFor="temperature" className="block text-xs font-bold text-slate-700 mb-1">
                Temperature (°F)
              </label>
              <input
                id="temperature"
                type="text"
                name="temperature"
                value={nurseData.temperature}
                onChange={handleChange}
                placeholder="e.g. 98.6"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Respiratory Rate */}
            <div>
              <label htmlFor="respiratoryRate" className="block text-xs font-bold text-slate-700 mb-1">
                Respiratory Rate (breaths/min)
              </label>
              <input
                id="respiratoryRate"
                type="text"
                name="respiratoryRate"
                value={nurseData.respiratoryRate}
                onChange={handleChange}
                placeholder="e.g. 16"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Blood Sugar */}
            <div>
              <label htmlFor="sugar" className="block text-xs font-bold text-slate-700 mb-1">
                Blood Sugar (mg/dL)
              </label>
              <input
                id="sugar"
                type="text"
                name="sugar"
                value={nurseData.sugar}
                onChange={handleChange}
                placeholder="e.g. 110"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>
        </div>

        {/* Fluid Elimination */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>Fluid Elimination & Biological Excretion Check</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Urinary Status */}
            <div>
              <label htmlFor="urineOutput" className="block text-xs font-bold text-slate-700 mb-1">
                Urinary Status (Susu Output)
              </label>
              <select
                id="urineOutput"
                name="urineOutput"
                value={nurseData.urineOutput}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Normal Voiding">Normal Voiding</option>
                <option value="Reduced Output">Reduced Output (Oliguria)</option>
                <option value="Foley Catheter Inserted">Foley Catheter Inserted</option>
                <option value="Retention / Unable">Urinary Retention</option>
              </select>
            </div>

            {/* Urine Volume */}
            <div>
              <label htmlFor="urineVolume" className="block text-xs font-bold text-slate-700 mb-1">
                Urine Volume (mL / shift)
              </label>
              <input
                id="urineVolume"
                type="text"
                name="urineVolume"
                value={nurseData.urineVolume}
                onChange={handleChange}
                placeholder="e.g. 450"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Stool Status */}
            <div>
              <label htmlFor="stoolStatus" className="block text-xs font-bold text-slate-700 mb-1">
                Bowel Elimination (Stool / Tatti Output)
              </label>
              <select
                id="stoolStatus"
                name="stoolStatus"
                value={nurseData.stoolStatus}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Normal Formed">Normal Formed Stool</option>
                <option value="Loose / Diarrhea">Loose Stool / Diarrhea</option>
                <option value="Constipated">Constipated (No stool today)</option>
              </select>
            </div>

            {/* Edema */}
            <div>
              <label htmlFor="edemaLevel" className="block text-xs font-bold text-slate-700 mb-1">
                Edema Level (Sojan / Haleema Check)
              </label>
              <select
                id="edemaLevel"
                name="edemaLevel"
                value={nurseData.edemaLevel}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="None">No Edema (Normal)</option>
                <option value="Mild (+1 Feet)">Mild (+1 Feet / Ankle)</option>
                <option value="Moderate (+2 Legs)">Moderate (+2 Legs)</option>
                <option value="Severe (+4 Generalized)">Severe (+4 Generalized / Facial)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Update Telemetry Button */}
        <div className="flex flex-col items-end gap-2">
          {saveMessage && (
            <div className={`w-full p-3 rounded-xl text-xs font-bold ${saveMessage.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {saveMessage}
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-sm rounded-xl shadow-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            {saving ? 'Recording...' : 'Update Telemetry Records'}
          </button>
        </div>
      </form>

      {/* --- SECTION: DOCTOR PRESCRIBED MEDICATIONS CHECKLIST --- */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-indigo-600" />
            <span>Doctor Prescribed Medication Administration Record (MAR)</span>
          </h3>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Doctor Sync Active
          </span>
        </div>

        <div className="space-y-3">
          {prescriptions.map((med) => (
            <div
              key={med.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{med.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{med.instruction}</p>
              </div>

              {/* Dose Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {med.doses.map((dose, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAdministerDose(med.id, idx)}
                    disabled={dose.status === 'Given'}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      dose.status === 'Given'
                        ? 'bg-emerald-100 text-emerald-800 cursor-default border border-emerald-300'
                        : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-300 hover:border-emerald-500 shadow-2xs cursor-pointer'
                    }`}
                  >
                    {dose.status === 'Given' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{dose.slot}: Given ({dose.time})</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Give {dose.slot} Dose</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION: NURSE CUSTOM INTERVENTIONS & EXTRA MEDS LOG --- */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" />
            <span>Nurse Side Custom Interventions & Unscheduled Care</span>
          </h3>
          <span className="text-xs text-slate-500">Visible on Doctor Panel</span>
        </div>

        {/* Input Form for Custom Action */}
        <form onSubmit={handleAddCustomIntervention} className="space-y-3 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Action / Intervention Title
              </label>
              <input
                type="text"
                placeholder="e.g., Nebulization Given, IV Line Changed, SOS Injection..."
                value={customActionTitle}
                onChange={(e) => setCustomActionTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nurse Remarks / Reason
              </label>
              <input
                type="text"
                placeholder="e.g., Patient complained of breathlessness / Fever spiked..."
                value={customActionNotes}
                onChange={(e) => setCustomActionNotes(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Log Custom Intervention
            </button>
          </div>
        </form>

        {/* Display List of Logged Nurse Interventions */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Shift Care Log & Audit Trail
          </h4>

          {loggedInterventions.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                  <span className="text-[10px] bg-purple-100 text-purple-700 font-extrabold px-2 py-0.5 rounded-full">
                    Nurse Entry
                  </span>
                </div>
                <p className="text-xs text-slate-600">{item.notes}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="block text-xs font-bold text-slate-700">{item.time}</span>
                <span className="text-[10px] text-slate-400 font-medium">{item.nurse}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
