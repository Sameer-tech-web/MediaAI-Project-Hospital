import React, { useRef, useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import {
  FlaskConical,
  Upload,
  CheckCircle,
  FileText,
  X,
  Search,
  UserCheck,
  Download,
  Trash2,
  Calendar,
  Clock
} from 'lucide-react';

export default function Laboratory() {
  const fileInputRef = useRef(null);
  const [patients, setPatients] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    apiRequest('/patients')
      .then((data) => setPatients(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Search & Patient Selection States
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Form States
  const [testCategory, setTestCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // History Table State
  const [uploadedReports, setUploadedReports] = useState([
    {
      id: 'LAB-901',
      patientId: '#1042',
      patientName: 'John Doe',
      category: 'Complete Blood Count (CBC)',
      fileName: 'CBC_Report_John_Doe.pdf',
      fileSize: '1.2 MB',
      uploadDate: '2026-09-01',
      status: 'Verified & Certified'
    }
  ]);

  // Search Filter Logic
  const filteredPatients = patients.filter(
    (p) =>
      (p.mrn || '').toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
      (p._id || '').toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
      (p.phone || '').includes(patientSearchTerm)
  );

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a PDF, PNG, or JPG file.');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be 10MB or less.');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedPatient) {
      setUploadMessage('Please select a valid patient first.');
      return;
    }
    if (!testCategory.trim()) {
      setUploadMessage('Please enter the test category first.');
      return;
    }
    if (!selectedFile) {
      setUploadMessage('Please select a laboratory report first.');
      return;
    }

    setUploading(true);
    setUploadMessage('');

    const formData = new FormData();
    formData.append('patientId', selectedPatient._id);
    formData.append('testCategory', testCategory.trim());
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('mediai_token');
      const API_URL = import.meta.env.VITE_API_URL || window.location.origin + '/api';
      const response = await fetch(`${API_URL}/lab/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (response.status === 401) {
        localStorage.removeItem('mediai_token');
        localStorage.removeItem('mediai_user');
        window.location.reload();
        throw new Error('Session expired.');
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');

      const newReport = {
        id: data._id,
        patientId: selectedPatient.mrn || selectedPatient._id.slice(-4),
        patientName: selectedPatient.name,
        category: testCategory.trim(),
        fileName: selectedFile.name,
        fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Verified & Certified'
      };

      setUploadedReports([newReport, ...uploadedReports]);
      setUploadMessage('Lab report uploaded successfully.');
      setTestCategory('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setUploadMessage(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this certified report?')) return;
    try {
      await apiRequest(`/lab/report/${reportId}`, { method: 'DELETE' });
      setUploadedReports(uploadedReports.filter((r) => r.id !== reportId));
    } catch (err) {
      setUploadMessage(err.message || 'Failed to delete report.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto font-sans bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-start sm:items-center gap-2">
            <FlaskConical className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 shrink-0" />
            <span>Pathology Diagnostic Laboratory Portal</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Search patients instantly and attach certified clinical laboratory reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            {/* FAST PATIENT SEARCH BAR */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Fast Patient Search (Search ID, Name, or Mobile) *
              </label>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type ID (e.g. #1042), Name, or Mobile Number..."
                  value={patientSearchTerm}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setPatientSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* Patient Autocomplete Dropdown */}
              {isDropdownOpen && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <div
                        key={patient._id}
                        onClick={() => {
                          setSelectedPatient(patient);
                          setPatientSearchTerm(`${patient.name} (${patient.mrn || patient._id.slice(-4)})`);
                          setIsDropdownOpen(false);
                        }}
                        className="p-3 hover:bg-purple-50 cursor-pointer flex justify-between items-center transition-all"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {patient.name} <span className="text-purple-600">({patient.mrn || patient._id.slice(-4)})</span>
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {patient.gender || '—'}, {patient.age || '—'} yrs • {patient.phone || '—'}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          Select
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matching patient found in hospital database.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Patient Confirmation Card */}
            {selectedPatient && (
              <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black text-xs">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                      Target Patient Confirmed
                    </span>
                    <p className="text-xs font-black text-slate-900">
                      {selectedPatient.name} <span className="text-purple-600">({selectedPatient.mrn || selectedPatient._id.slice(-4)})</span>
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {selectedPatient.gender || '—'}, {selectedPatient.age || '—'} Yrs • {selectedPatient.phone || '—'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Test Category */}
            <div>
              <label
                htmlFor="test-category"
                className="block text-xs font-bold text-slate-700 uppercase mb-2"
              >
                Test Category / Clinical Diagnostic *
              </label>

              <input
                id="test-category"
                type="text"
                value={testCategory}
                onChange={(e) => setTestCategory(e.target.value)}
                placeholder="e.g. Complete Blood Count (CBC) / Lipid Profile / Liver Function Test"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 p-8 rounded-2xl text-center space-y-2 bg-slate-50/50 hover:bg-purple-50 hover:border-purple-300 cursor-pointer transition-all"
            >
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />

              <span className="text-xs font-bold text-slate-700 block">
                Drag & Drop PDF Report or Click to Upload
              </span>

              <span className="text-[10px] text-slate-400 block">
                Supported formats: PDF, PNG, JPG (Max 10MB)
              </span>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Selected File Box */}
            {selectedFile && (
              <div className="flex items-center justify-between gap-3 p-4 bg-purple-50 border border-purple-100 rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {selectedFile.name}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeSelectedFile}
                  className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                  aria-label="Remove selected file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Message */}
            {uploadMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold ${uploadMessage.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {uploadMessage}
              </div>
            )}

            {/* Upload Button */}
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload Certified Lab Report'}
            </button>
          </div>
        </div>

        {/* Right Column: Lab Info Card */}
        <div className="space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Pathology Guidelines
            </h3>
            <ul className="text-xs text-slate-600 space-y-2.5 list-disc pl-4 font-medium">
              <li>Always verify Patient ID against physical slip before attaching report.</li>
              <li>Only upload certified PDFs signed by Pathologist.</li>
              <li>Reports are instantly mapped to patient electronic health record (EHR).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* UPLOADED LAB REPORTS HISTORY TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">Recently Attached Reports</h3>
            <p className="text-xs text-slate-500">Live verified laboratory test results in the system.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="p-4">Report ID</th>
                <th className="p-4">Patient Details</th>
                <th className="p-4">Test Category</th>
                <th className="p-4">File Name & Size</th>
                <th className="p-4">Upload Date</th>
                <th className="p-4">Certification</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {uploadedReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900">{report.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{report.patientName}</p>
                    <p className="text-[10px] text-purple-600 font-mono">{report.patientId}</p>
                  </td>
                  <td className="p-4 text-slate-800">{report.category}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 font-bold text-slate-700">
                      <FileText className="w-3.5 h-3.5 text-purple-600" />
                      {report.fileName}
                    </span>
                    <span className="text-[10px] text-slate-400">{report.fileSize}</span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {report.uploadDate}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-1 rounded-full border border-emerald-200">
                      {report.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      title="Delete Report"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
