import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle } from 'lucide-react';
import { apiRequest } from '../lib/api';

export default function AddPatient({ setActiveTab }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    cnic: '',
    phone: '',
    dept: 'Cardiology',
    doctor: '',
    vipTag: 'Standard Patient',
    symptoms: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await apiRequest('/users/doctors');
        setDoctors(Array.isArray(data) ? data : []);
      } catch {
        setDoctors([]);
      }
    };
    loadDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const token = localStorage.getItem('mediai_token');
    if (!token) {
      alert('Your session has expired. Please login again.');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const data = await apiRequest('/patients', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name.trim(),
          age: Number(formData.age),
          gender: formData.gender,
          cnic: formData.cnic.trim(),
          contact: formData.phone.trim() || formData.cnic.trim(),
          department: formData.dept,
          assignedDoctor: formData.doctor || null,
          triageCategory:
            formData.vipTag === 'Critical Priority'
              ? 'Emergency'
              : formData.vipTag === 'Doctor Relative VIP'
              ? 'Urgent'
              : 'Routine',
          symptoms: formData.symptoms.trim() || 'Not specified',
          bedNumber: null,
        }),
      });

      setSuccessMessage(
        `Patient admitted successfully! MRN: ${data.mrn || data._id || 'N/A'}`
      );

      setFormData({
        name: '',
        age: '',
        gender: 'Male',
        cnic: '',
        phone: '',
        dept: 'Cardiology',
        doctor: '',
        vipTag: 'Standard Patient',
        symptoms: '',
      });

      if (typeof setActiveTab === 'function') {
        setTimeout(() => setActiveTab('patients'), 1500);
      }
    } catch (error) {
      alert(error.message || 'Unable to admit patient.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 font-sans">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 shrink-0" />
          <span>New Patient Admission</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Register new hospital patient and assign priority status.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-700">
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="patient-name" className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase mb-2">
              Full Name *
            </label>
            <input
              id="patient-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>

          <div>
            <label htmlFor="patient-age" className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase mb-2">
              Age & Gender *
            </label>
            <div className="flex flex-col xs:flex-row sm:flex-row gap-2">
              <input
                id="patient-age"
                name="age"
                type="number"
                min="0"
                max="150"
                required
                inputMode="numeric"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="w-full sm:w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
              <select
                id="patient-gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full sm:w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="patient-cnic" className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase mb-2">
              CNIC / ID Number *
            </label>
            <input
              id="patient-cnic"
              name="cnic"
              type="text"
              required
              inputMode="numeric"
              autoComplete="off"
              placeholder="42101-XXXXXXX-X"
              value={formData.cnic}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>

          <div>
            <label htmlFor="patient-phone" className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase mb-2">
              Phone Number
            </label>
            <input
              id="patient-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="03XX-XXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="patient-dept" className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase mb-2">
              Department
            </label>
            <select
              id="patient-dept"
              name="dept"
              value={formData.dept}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            >
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="ICU Critical">ICU Critical</option>
            </select>
          </div>

          <div>
            <label htmlFor="patient-doctor" className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase mb-2">
              Assigned Doctor
            </label>
            <select
              id="patient-doctor"
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="patient-symptoms" className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase mb-2">
            Symptoms / Reason for Visit
          </label>
          <textarea
            id="patient-symptoms"
            name="symptoms"
            rows={3}
            placeholder="Describe the patient's presenting symptoms..."
            value={formData.symptoms}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-none"
          />
        </div>

        <div>
          <label htmlFor="patient-priority" className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase mb-2">
            Priority Flag
          </label>
          <select
            id="patient-priority"
            name="vipTag"
            value={formData.vipTag}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          >
            <option value="Standard Patient">Standard Patient</option>
            <option value="Doctor Relative VIP">Doctor Relative / Staff VIP</option>
            <option value="Critical Priority">Critical Priority</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          {isSubmitting ? 'Saving Admission...' : 'Save & Complete Admission'}
        </button>
      </form>
    </div>
  );
}
