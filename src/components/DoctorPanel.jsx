import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { 
  Stethoscope, 
  Sparkles, 
  CheckCircle, 
  Plus, 
  X, 
  History, 
  Pill, 
  FlaskConical, 
  FileText,
  Search
} from 'lucide-react';

const MEDICINE_DATABASE = [
  { name: 'Amlodipine 5mg', formula: 'Amlodipine Besylate - Anti-hypertensive' },
  { name: 'Amlodipine 10mg', formula: 'Amlodipine Besylate - Anti-hypertensive' },
  { name: 'Paracetamol 500mg', formula: 'Acetaminophen - Antipyretic/Analgesic' },
  { name: 'Insulin Regular 10 IU', formula: 'Human Insulin - Anti-diabetic' },
  { name: 'Metformin 500mg', formula: 'Biguanide - Glucose Control' },
  { name: 'Omeprazole 20mg (Risek)', formula: 'PPI - Anti-Ulcerant / Acidity' },
  { name: 'Ibuprofen 400mg (Brufen)', formula: 'NSAID - Pain Relief' },
  { name: 'Cefixime 400mg', formula: 'Cephalosporin - Antibiotic' }
];

const CATEGORIZED_SYMPTOMS = {
  'General & Pain': ['Mild Headache', 'Severe Headache', 'Body Ache', 'Joint Pain'],
  'Cardiac & Vital': ['Chest Pain (Seene mein dard)', 'High BP Spike', 'High Blood Sugar', 'Shortness of Breath'],
  'Gastro & Renal': ['Acidity / Heartburn', 'Stomach Cramps', 'Nausea / Vomiting', 'Edema / Sojan (Haleema)']
};

const ALL_SUGGESTED_LAB_TESTS = [
  'CBC (Complete Blood Count)',
  'LFT (Liver Function Test)',
  'RFT (Renal Function Test)',
  'Fasting Blood Sugar (FBS)',
  'HbA1c (Glycated Hemoglobin)',
  'Chest X-Ray (PA View)',
  'ECG 12-Lead',
  'Urine Routine & Microscopy',
  'Lipid Profile (Cholesterol / Triglycerides)',
  'Thyroid Profile (T3, T4, TSH)',
  'Vitamin D3 (25-OH)',
  'Serum Electrolytes (Na+, K+, Cl-)',
  'Serum Creatinine',
  'Uric Acid Test',
  'CRP (C-Reactive Protein)',
  'ECHO (Echocardiogram)',
  'Ultrasound Abdomen & Pelvis',
  'CT Scan Brain Plain'
];

const ALL_SUGGESTED_SYMPTOMS = [
  'Dizziness / Ghabrahat',
  'Loss of Appetite (Bhook na lagna)',
  'Fatigue & Weakness',
  'Dry Cough (Sookhi Khansi)',
  'Fever with Chills',
  'Skin Rash / Itching',
  'Vertigo (Chakkar aana)',
  'Insomnia (Neend na aana)',
  'Numbness in Feet (Paon me sunn hona)',
  'Blurry Vision'
];

const COMMON_LAB_TESTS = [
  'CBC (Complete Blood Count)',
  'LFT (Liver Function Test)',
  'RFT (Renal Function Test)',
  'Fasting Blood Sugar (FBS)',
  'HbA1c',
  'Chest X-Ray (PA View)',
  'ECG 12-Lead',
  'Urine Routine'
];

export default function DoctorPanel() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [prescribedMeds, setPrescribedMeds] = useState([]);
  const [selectedLabTests, setSelectedLabTests] = useState([]);

  const [manualLabQuery, setManualLabQuery] = useState('');
  const [suggestedLabTests, setSuggestedLabTests] = useState([]);

  const [manualSymptomQuery, setManualSymptomQuery] = useState('');
  const [suggestedSymptomsList, setSuggestedSymptomsList] = useState([]);

  // Medicine Search & Configurator State
  const [medQuery, setMedQuery] = useState('');
  const [filteredMeds, setFilteredMeds] = useState([]);
  const [tempMedConfig, setTempMedConfig] = useState({
    name: '',
    dosage: '1-0-1',
    timing: 'After Meal',
    duration: '5 Days'
  });

  useEffect(() => {
    apiRequest('/patients')
      .then((data) => {
        setPatients(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, []);

  const handlePatientChange = (patientId) => {
    setSelectedPatient(patientId);
  };

  // Toggle Symptom Tags
  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // Manual Symptom Search & Add
  const handleSymptomInputChange = (e) => {
    const query = e.target.value;
    setManualSymptomQuery(query);

    if (query.trim().length > 0) {
      const matches = ALL_SUGGESTED_SYMPTOMS.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestedSymptomsList(matches);
    } else {
      setSuggestedSymptomsList([]);
    }
  };

  const addManualSymptom = (symptomToAdd) => {
    const finalSymptom = symptomToAdd || manualSymptomQuery.trim();
    if (!finalSymptom) return;

    if (!selectedSymptoms.includes(finalSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, finalSymptom]);
    }
    setManualSymptomQuery('');
    setSuggestedSymptomsList([]);
  };

  // Toggle Lab Test Tags
  const toggleLabTest = (test) => {
    if (selectedLabTests.includes(test)) {
      setSelectedLabTests(selectedLabTests.filter((t) => t !== test));
    } else {
      setSelectedLabTests([...selectedLabTests, test]);
    }
  };

  // Manual Lab Test Search & Add
  const handleLabInputChange = (e) => {
    const query = e.target.value;
    setManualLabQuery(query);

    if (query.trim().length > 0) {
      const matches = ALL_SUGGESTED_LAB_TESTS.filter((t) =>
        t.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestedLabTests(matches);
    } else {
      setSuggestedLabTests([]);
    }
  };

  const addManualLabTest = (testToAdd) => {
    const finalTest = testToAdd || manualLabQuery.trim();
    if (!finalTest) return;

    if (!selectedLabTests.includes(finalTest)) {
      setSelectedLabTests([...selectedLabTests, finalTest]);
    }
    setManualLabQuery('');
    setSuggestedLabTests([]);
  };

  // Search Medicines
  const handleMedQueryChange = (e) => {
    const query = e.target.value;
    setMedQuery(query);
    setTempMedConfig({ ...tempMedConfig, name: query });

    if (query.trim().length > 0) {
      const matches = MEDICINE_DATABASE.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.formula.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMeds(matches);
    } else {
      setFilteredMeds([]);
    }
  };

  // Add Medicine with Dosage & Schedule
  const addMedicineToPrescription = (medNameOverride) => {
    const finalName = medNameOverride || tempMedConfig.name;
    if (!finalName.trim()) return;

    const newMedItem = {
      id: Date.now(),
      name: finalName,
      dosage: tempMedConfig.dosage,
      timing: tempMedConfig.timing,
      duration: tempMedConfig.duration
    };

    setPrescribedMeds([...prescribedMeds, newMedItem]);
    setMedQuery('');
    setFilteredMeds([]);
    setTempMedConfig({ name: '', dosage: '1-0-1', timing: 'After Meal', duration: '5 Days' });
  };

  // Remove Individual Medicine
  const removeMedicine = (id) => {
    setPrescribedMeds(prescribedMeds.filter((m) => m.id !== id));
  };

  const handleRepeatPreviousRx = async () => {
    if (!selectedPatient) return;
    try {
      const prescriptions = await apiRequest(`/prescriptions/${selectedPatient}`);
      const last = Array.isArray(prescriptions) && prescriptions.length > 0 ? prescriptions[0] : null;
      if (last?.medications) {
        setPrescribedMeds(
          last.medications.map((m, i) => ({
            id: i + 1,
            name: m.name,
            dosage: m.dosage || '1-0-1',
            timing: m.timing || 'After Meal',
            duration: m.duration || '5 Days',
          }))
        );
      }
    } catch {
      // no previous prescription found
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      setSaveMessage('Please select a patient.');
      return;
    }
    setSaving(true);
    setSaveMessage('');
    try {
      const encounter = await apiRequest('/encounters', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedPatient,
          symptoms: selectedSymptoms,
          diagnosis,
          notes,
        }),
      });

      if (prescribedMeds.length > 0) {
        await apiRequest('/prescriptions', {
          method: 'POST',
          body: JSON.stringify({
            patientId: selectedPatient,
            encounterId: encounter._id,
            medications: prescribedMeds.map((m) => ({
              name: m.name,
              dosage: m.dosage,
              timing: m.timing,
              duration: m.duration,
            })),
          }),
        });
      }

      setSaveMessage('Clinical assessment saved successfully.');
      setSelectedSymptoms([]);
      setDiagnosis('');
      setNotes('');
      setPrescribedMeds([]);
      setSelectedLabTests([]);
    } catch (err) {
      setSaveMessage(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans bg-slate-50/50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            <span>Doctor Examination & Smart Prescription</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fast 1-click symptoms tagging, structured dosage builder & instant lab order panel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRepeatPreviousRx}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors cursor-pointer"
          >
            <History className="w-4 h-4" />
            <span>Repeat Past Rx</span>
          </button>
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wide">
              Smart Clinical Panel
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Patient Selection Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Select Patient (Auto-loads Previous History)
          </label>
          <select
            value={selectedPatient}
            onChange={(e) => handlePatientChange(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="">-- Select Patient --</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.mrn || p._id.slice(-4)})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Symptoms, Diagnosis & Medicine Builder */}
          <div className="lg:col-span-2 space-y-6">

            {/* Symptoms Tagging + Manual Add Section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Symptoms Assessment</span>
                <span className="text-[10px] text-slate-400 font-normal">Click chips or search to add</span>
              </h3>

              {/* Manual Symptom Autocomplete Input */}
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Type custom symptom (e.g., Vertigo, Dizziness, Cough)..."
                      value={manualSymptomQuery}
                      onChange={handleSymptomInputChange}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => addManualSymptom()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                {/* Symptom Auto-Suggest Dropdown */}
                {suggestedSymptomsList.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                    {suggestedSymptomsList.map((sym, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addManualSymptom(sym)}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 text-xs font-bold text-slate-700 border-b last:border-0 border-slate-100 flex items-center justify-between cursor-pointer"
                      >
                        <span>{sym}</span>
                        <span className="text-[10px] text-blue-600 font-black">+ Add Symptom</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Symptoms Dynamic Chips Display */}
              {selectedSymptoms.length > 0 && (
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/80">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-2">
                    Active Patient Symptoms
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom) => (
                      <span
                        key={symptom}
                        className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        {symptom}
                        <button
                          type="button"
                          onClick={() => toggleSymptom(symptom)}
                          className="hover:bg-blue-700 p-0.5 rounded-full cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Categorized Quick Chips */}
              {Object.entries(CATEGORIZED_SYMPTOMS).map(([category, symptoms]) => (
                <div key={category} className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{category}</span>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((symptom) => {
                      const isSelected = selectedSymptoms.includes(symptom);
                      return (
                        <button
                          key={symptom}
                          type="button"
                          onClick={() => toggleSymptom(symptom)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                          }`}
                        >
                          {isSelected ? <CheckCircle className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                          {symptom}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Diagnosis & Notes */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Diagnosis Remarks
                </label>
                <textarea
                  rows={2}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter clinical diagnosis..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Clinical Notes / Diet Advice
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter patient instructions..."
                />
              </div>
            </div>

            {/* Prescribe Medicine Controls */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                <span>Add Medicine (Search & Configurator)</span>
              </h3>

              {/* Formula / Brand Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type Brand or Generic Formula (e.g., Paracetamol, Amlodipine)..."
                  value={medQuery}
                  onChange={handleMedQueryChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />

                {/* Dropdown Suggestions */}
                {filteredMeds.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    {filteredMeds.map((med, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setTempMedConfig({ ...tempMedConfig, name: med.name });
                          setMedQuery(med.name);
                          setFilteredMeds([]);
                        }}
                        className="w-full p-3 hover:bg-blue-50 border-b last:border-0 border-slate-100 flex items-center justify-between text-left cursor-pointer"
                      >
                        <div>
                          <span className="text-xs font-black text-slate-900 block">{med.name}</span>
                          <span className="text-[10px] text-slate-500 block">{med.formula}</span>
                        </div>
                        <span className="text-xs font-bold text-blue-600">Select</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dosage, Timing & Duration Quick Selector */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Dosage buttons */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Dosage Frequency</span>
                    <div className="flex bg-white rounded-lg p-1 border border-slate-200">
                      {['1-0-1', '1-1-1', '1-0-0', '0-0-1'].map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setTempMedConfig({ ...tempMedConfig, dosage: freq })}
                          className={`flex-1 text-[10px] font-bold py-1 rounded transition-colors cursor-pointer ${
                            tempMedConfig.dosage === freq ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timing dropdown */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Timing</span>
                    <select
                      value={tempMedConfig.timing}
                      onChange={(e) => setTempMedConfig({ ...tempMedConfig, timing: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg p-2 cursor-pointer"
                    >
                      <option value="After Meal">Khane Ke Baad (After Meal)</option>
                      <option value="Before Meal">Khane Se Pehle (Before Meal)</option>
                      <option value="SOS">Zaroorat Par (SOS)</option>
                    </select>
                  </div>

                  {/* Duration dropdown */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Duration</span>
                    <select
                      value={tempMedConfig.duration}
                      onChange={(e) => setTempMedConfig({ ...tempMedConfig, duration: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg p-2 cursor-pointer"
                    >
                      <option value="3 Days">3 Days</option>
                      <option value="5 Days">5 Days</option>
                      <option value="7 Days">7 Days</option>
                      <option value="14 Days">14 Days</option>
                      <option value="30 Days">30 Days</option>
                    </select>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => addMedicineToPrescription()}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add to Active Prescription
                </button>
              </div>

            </div>

          </div>

          {/* Right Column: Live Prescription Summary & Lab Orders */}
          <div className="space-y-6">

            {/* Active Prescribed List */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" /> Active Medicines List
                </h3>
                <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {prescribedMeds.length} Items
                </span>
              </div>

              {prescribedMeds.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-medium">
                  No medicines added to this prescription yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {prescribedMeds.map((med) => (
                    <div key={med.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-black text-slate-900 block">{med.name}</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">
                            {med.dosage}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">{med.timing}</span>
                          <span className="text-[10px] text-slate-400 font-bold">• {med.duration}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedicine(med.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lab Investigations Panel with Manual Add & Auto-Suggestions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-purple-600" /> Order Lab Tests
              </h3>

              {/* Manual Lab Test Search/Add Input with Auto-Suggestions */}
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Type custom test (e.g., Vitamin D, Thyroid, Lipid Profile)..."
                      value={manualLabQuery}
                      onChange={handleLabInputChange}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => addManualLabTest()}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {/* Lab Auto-Suggest Dropdown List */}
                {suggestedLabTests.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-44 overflow-y-auto">
                    {suggestedLabTests.map((test, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addManualLabTest(test)}
                        className="w-full px-4 py-2 text-left hover:bg-purple-50 text-xs font-bold text-slate-700 border-b last:border-0 border-slate-100 flex items-center justify-between cursor-pointer"
                      >
                        <span>{test}</span>
                        <span className="text-[10px] text-purple-600 font-black">+ Order Test</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Lab Tests Chips */}
              {selectedLabTests.length > 0 && (
                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100/80">
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mb-2">
                    Ordered Lab Investigations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLabTests.map((test) => (
                      <span
                        key={test}
                        className="px-2.5 py-1 bg-purple-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs"
                      >
                        {test}
                        <button
                          type="button"
                          onClick={() => toggleLabTest(test)}
                          className="hover:bg-purple-700 p-0.5 rounded-full cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Common Lab Test Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Common Quick Orders</span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_LAB_TESTS.map((test) => {
                    const isSelected = selectedLabTests.includes(test);
                    return (
                      <button
                        key={test}
                        type="button"
                        onClick={() => toggleLabTest(test)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                        }`}
                      >
                        {isSelected ? <CheckCircle className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                        {test}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Save Button */}
            {saveMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold ${saveMessage.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {saveMessage}
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Clinical Assessment & Print'}
            </button>

          </div>

        </div>

      </form>
    </div>
  );
}
