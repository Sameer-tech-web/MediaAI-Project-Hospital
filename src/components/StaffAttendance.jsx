import React, { useEffect, useRef, useState } from 'react';
import {
  Users,
  Fingerprint,
  Lock,
  Building,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  CalendarCheck,
  UserX,
  UserPlus,
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';

function DutyStatusBadge({ status }) {
  if (status === 'Present') {
    return (
      <span className="bg-emerald-100 text-emerald-800 font-black text-[10px] px-2.5 py-1 rounded-full border border-emerald-300">
        ON DUTY
      </span>
    );
  }

  if (status === 'Shift Completed') {
    return (
      <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2.5 py-1 rounded-full">
        COMPLETED
      </span>
    );
  }

  return (
    <span className="bg-slate-100 text-slate-500 font-bold text-[10px] px-2.5 py-1 rounded-full">
      OFF DAY
    </span>
  );
}

export default function StaffAttendance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [wardFilter, setWardFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addStaffButtonRef = useRef(null);
  const modalCloseButtonRef = useRef(null);

  useEffect(() => {
    if (!isModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
        window.requestAnimationFrame(() => addStaffButtonRef.current?.focus());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    modalCloseButtonRef.current?.focus();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const closeStaffModal = () => {
    setIsModalOpen(false);
    window.requestAnimationFrame(() => addStaffButtonRef.current?.focus());
  };

  // Pure Staff Duty & Biometric Logs Data
  const [staffData, setStaffData] = useState([
    {
      id: "DOC-101",
      name: "Dr. Sarah Connor",
      gender: "Female",
      role: "Doctor",
      designation: "ICU Specialist",
      assignedWard: "ICU Ward Bed 01-10",
      shift: "Morning (08:00 AM - 04:00 PM)",
      clockIn: "08:00 AM",
      clockOut: "--:--",
      dutyHours: "6.5 hrs (Active)",
      status: "Present",
      timingStatus: "On Time",
      daysPresent: 22,
      daysAbsent: 1,
      offDays: 3,
      deviceSource: "Biometric Scanner #BIO-ICU-01"
    },
    {
      id: "NRS-204",
      name: "Ms. Jessica",
      gender: "Female",
      role: "Nurse",
      designation: "Ward Supervisor",
      assignedWard: "General Ward-A",
      shift: "Morning (08:00 AM - 04:00 PM)",
      clockIn: "07:45 AM",
      clockOut: "--:--",
      dutyHours: "6.75 hrs (Active)",
      status: "Present",
      timingStatus: "On Time",
      daysPresent: 24,
      daysAbsent: 0,
      offDays: 2,
      deviceSource: "Biometric Scanner #BIO-WARD-01"
    },
    {
      id: "NRS-205",
      name: "Mr. John Robert",
      gender: "Male",
      role: "Nurse",
      designation: "Staff Nurse",
      assignedWard: "General Ward-B",
      shift: "Morning (08:00 AM - 04:00 PM)",
      clockIn: "08:00 AM",
      clockOut: "--:--",
      dutyHours: "6.5 hrs (Active)",
      status: "Present",
      timingStatus: "On Time",
      daysPresent: 20,
      daysAbsent: 1,
      offDays: 4,
      deviceSource: "Biometric Scanner #BIO-WARD-02"
    },
    {
      id: "DOC-108",
      name: "Dr. Chen",
      gender: "Male",
      role: "Doctor",
      designation: "General Physician",
      assignedWard: "OPD Consultation Rm 4",
      shift: "Morning (08:00 AM - 04:00 PM)",
      clockIn: "08:35 AM",
      clockOut: "--:--",
      dutyHours: "6.0 hrs (Active)",
      status: "Present",
      timingStatus: "Late (35m)",
      daysPresent: 19,
      daysAbsent: 2,
      offDays: 5,
      deviceSource: "Biometric Scanner #BIO-OPD-02"
    },
    {
      id: "NRS-209",
      name: "Nurse Maria",
      gender: "Female",
      role: "Nurse",
      designation: "Emergency Care Nurse",
      assignedWard: "Emergency Ward",
      shift: "Night Shift (12:00 AM - 08:00 AM)",
      clockIn: "12:00 AM",
      clockOut: "08:00 AM",
      dutyHours: "8.0 hrs",
      status: "Shift Completed",
      timingStatus: "On Time",
      daysPresent: 21,
      daysAbsent: 1,
      offDays: 4,
      deviceSource: "Biometric Scanner #BIO-EMG-01"
    },
    {
      id: "DOC-112",
      name: "Dr. Lisa Ray",
      gender: "Female",
      role: "Doctor",
      designation: "Surgeon",
      assignedWard: "Operation Theater 2",
      shift: "Evening (04:00 PM - 12:00 AM)",
      clockIn: "--:--",
      clockOut: "--:--",
      dutyHours: "0 hrs",
      status: "Absent / Rostered Off",
      timingStatus: "Scheduled Off",
      daysPresent: 17,
      daysAbsent: 0,
      offDays: 9,
      deviceSource: "System Roster Off"
    }
  ]);

  // Form State for Adding New Staff
  const [newStaff, setNewStaff] = useState({
    title: 'Dr.',
    name: '',
    gender: 'Male',
    role: 'Doctor',
    designation: '',
    assignedWard: '',
    shift: 'Morning (08:00 AM - 04:00 PM)'
  });

  // Role change handler to set smart title defaults
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    let defaultTitle = 'Dr.';
    if (selectedRole === 'Nurse') {
      defaultTitle = newStaff.gender === 'Female' ? 'Ms.' : 'Mr.';
    }
    setNewStaff({
      ...newStaff,
      role: selectedRole,
      title: defaultTitle
    });
  };

  // Gender change handler
  const handleGenderChange = (e) => {
    const selectedGender = e.target.value;
    let updatedTitle = newStaff.title;

    if (newStaff.role === 'Nurse') {
      updatedTitle = selectedGender === 'Female' ? 'Ms.' : 'Mr.';
    }

    setNewStaff({
      ...newStaff,
      gender: selectedGender,
      title: updatedTitle
    });
  };

  // Handler: Add New Staff Member
  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.designation.trim()) return;

    const prefix = newStaff.role === 'Doctor' ? 'DOC' : 'NRS';
    const randomId = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;

    const fullName = `${newStaff.title} ${newStaff.name.trim()}`;

    const createdMember = {
      id: randomId,
      name: fullName,
      gender: newStaff.gender,
      role: newStaff.role,
      designation: newStaff.designation,
      assignedWard: newStaff.assignedWard || 'General Ward',
      shift: newStaff.shift,
      clockIn: '--:--',
      clockOut: '--:--',
      dutyHours: '0 hrs',
      status: 'Absent / Rostered Off',
      timingStatus: 'Scheduled Off',
      daysPresent: 0,
      daysAbsent: 0,
      offDays: 0,
      deviceSource: 'Biometric Scanner Pending'
    };

    setStaffData([createdMember, ...staffData]);
    closeStaffModal();
    setNewStaff({
      title: 'Dr.',
      name: '',
      gender: 'Male',
      role: 'Doctor',
      designation: '',
      assignedWard: '',
      shift: 'Morning (08:00 AM - 04:00 PM)'
    });
  };

  // Handler: Remove/Delete Staff Member
  const handleRemoveStaff = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} (${id}) from the staff roster?`)) {
      setStaffData(staffData.filter((item) => item.id !== id));
    }
  };

  // Safe Filtering Logic
  const filteredStaff = staffData.filter(staff => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (staff.name && staff.name.toLowerCase().includes(term)) ||
      (staff.id && staff.id.toLowerCase().includes(term)) ||
      (staff.assignedWard && staff.assignedWard.toLowerCase().includes(term));
      
    const matchesRole = roleFilter === 'All' || staff.role === roleFilter;
    const matchesWard = wardFilter === 'All' || (staff.assignedWard && staff.assignedWard.includes(wardFilter));
    
    return matchesSearch && matchesRole && matchesWard;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto font-sans bg-slate-50 min-h-screen">
      
      {/* Demo Mode Banner */}
      <div className="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <p className="text-xs font-bold text-amber-800">Demo Mode — Attendance data is not persisted</p>
          <p className="text-[10px] text-amber-600">Staff roster and attendance shown here are for demonstration purposes only.</p>
        </div>
      </div>

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-200 pb-5">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-start sm:items-center gap-2">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 shrink-0" />
            <span>Staff Attendance & Ward Allocation Roster</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Exclusively tracking staff presence, duty wards, working hours, and physical biometric logs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          {/* Biometric Hardened Protection Badge */}
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl">
            <Fingerprint className="w-6 h-6 text-emerald-600 animate-pulse shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-emerald-900">Biometric Terminal Active</span>
                <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold">
                Manual punches blocked. Biometric Scanner Required.
              </p>
            </div>
          </div>

          {/* Add Staff Button */}
          <button
            ref={addStaffButtonRef}
            onClick={() => setIsModalOpen(true)}
            disabled
            title="Not available in demo mode"
            className="w-full sm:w-auto justify-center px-4 py-2.5 bg-slate-300 text-slate-500 font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Staff</span>
          </button>
        </div>
      </div>

      {/* Staff KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Staff Roster</span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{staffData.length} Members</div>
          <p className="text-[11px] text-slate-400 font-semibold">Doctors, Nurses & Shift Staff</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Present & On Duty</span>
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {staffData.filter(s => s.status === 'Present').length} Staff
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">Verified via Biometric Gates</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Late Arrivals</span>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {staffData.filter(s => s.timingStatus && s.timingStatus.includes('Late')).length} Staff
          </div>
          <p className="text-[11px] text-slate-400 font-semibold">Arrived after shift start time</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Scheduled Off / Absent</span>
            <UserX className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-700">
            {staffData.filter(s => s.status && s.status.includes('Absent')).length} Staff
          </div>
          <p className="text-[11px] text-slate-400 font-semibold">Off duty or on approved leave</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search Staff Name, ID, or Assigned Ward..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto md:justify-end">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs font-bold text-slate-600">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="flex-1 md:flex-none bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="All">All Staff Roles</option>
              <option value="Doctor">Doctors</option>
              <option value="Nurse">Nurses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dedicated Staff Table */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Assigned Ward / Duty Area</th>
                <th className="p-4">Shift Schedule</th>
                <th className="p-4">Biometric Login</th>
                <th className="p-4">Biometric Logout</th>
                <th className="p-4">Total Hours</th>
                <th className="p-4">Monthly History</th>
                <th className="p-4">Device Verification</th>
                <th className="p-4 text-center">Duty Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-sm">{staff.name}</span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                        staff.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {staff.gender}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{staff.id} • {staff.designation}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Building className="w-3.5 h-3.5 text-indigo-600" />
                      {staff.assignedWard}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-600">{staff.shift}</td>
                  <td className="p-4 font-bold text-emerald-600">
                    {staff.clockIn !== '--:--' ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {staff.clockIn}
                      </span>
                    ) : (
                      <span className="text-slate-400">--:--</span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    {staff.clockOut !== '--:--' ? staff.clockOut : <span className="text-amber-600 text-[11px]">Active Shift</span>}
                  </td>
                  <td className="p-4 font-bold text-slate-800 font-mono">{staff.dutyHours}</td>
                  <td className="p-4">
                    <div className="text-[11px]">
                      <span className="text-emerald-700 font-bold">{staff.daysPresent} Days Attended</span>
                      <div className="text-slate-400 font-normal">{staff.daysAbsent} Absent • {staff.offDays} Off</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-900 text-[10px] font-bold px-2.5 py-1 rounded-md border border-indigo-100">
                      <Fingerprint className="w-3.5 h-3.5 text-indigo-600" />
                      {staff.deviceSource}
                    </span>
                  </td>
                  <td className="p-4 text-center"><DutyStatusBadge status={staff.status} /></td>
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveStaff(staff.id, staff.name)}
                      title="Remove Staff Member"
                      aria-label={`Remove ${staff.name}`}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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

      <div className="md:hidden space-y-4">
        {filteredStaff.map((staff) => (
          <article key={staff.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h3 className="font-bold text-slate-900">{staff.name}</h3>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                    staff.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {staff.gender}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono break-words">{staff.id} • {staff.designation}</p>
              </div>
              <DutyStatusBadge status={staff.status} />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
              <div className="col-span-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Duty area</span>
                <span className="inline-flex max-w-full items-center gap-1.5 font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg break-words">
                  <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  {staff.assignedWard}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Clock in</span>
                <span className="font-bold text-emerald-600">{staff.clockIn}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Clock out</span>
                <span className="font-bold text-slate-800">{staff.clockOut === '--:--' ? 'Active shift' : staff.clockOut}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Duty hours</span>
                <span className="font-bold text-slate-800 font-mono">{staff.dutyHours}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Attendance</span>
                <span className="font-bold text-emerald-700">{staff.daysPresent} days</span>
                <span className="text-slate-400 block">{staff.daysAbsent} absent • {staff.offDays} off</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Shift</span>
                <span className="font-medium text-slate-600">{staff.shift}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Device verification</span>
                <span className="inline-flex max-w-full items-center gap-1.5 bg-indigo-50 text-indigo-900 text-[10px] font-bold px-2.5 py-1 rounded-md border border-indigo-100 break-words">
                  <Fingerprint className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  {staff.deviceSource}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveStaff(staff.id, staff.name)}
              className="w-full min-h-10 text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Remove Staff Member
            </button>
          </article>
        ))}
      </div>

      {/* ================= ADD NEW STAFF MODAL ================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-start sm:items-center justify-center overflow-y-auto p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeStaffModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-staff-title"
            className="my-auto max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white rounded-3xl p-4 sm:p-6 w-full max-w-md shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              ref={modalCloseButtonRef}
              type="button"
              onClick={closeStaffModal}
              aria-label="Close add staff dialog"
              className="absolute top-4 sm:top-5 right-4 sm:right-5 text-slate-400 hover:text-slate-600 p-2 bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-1 pr-10">
              <UserPlus className="w-5 h-5 text-indigo-600 shrink-0" />
              <h3 id="add-staff-title" className="text-lg font-black text-slate-900">Add New Staff Member</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Enroll new hospital personnel to roster and biometric tracking.
            </p>

            <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-left">
              
              {/* Role & Gender Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Role *
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={handleRoleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="Doctor">Doctor</option>
                    <option value="Nurse">Nurse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Gender *
                  </label>
                  <select
                    value={newStaff.gender}
                    onChange={handleGenderChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Title Prefix + Name Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Full Name *
                </label>
                <div className="flex gap-2">
                  <select
                    value={newStaff.title}
                    onChange={(e) => setNewStaff({ ...newStaff, title: e.target.value })}
                    className="w-24 shrink-0 px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="Dr.">Dr.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Nurse">Nurse</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jessica or John Doe"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    className="min-w-0 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Designation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ward Supervisor / ICU Nurse / Specialist"
                  value={newStaff.designation}
                  onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Ward */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Assigned Ward / Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. General Ward-A"
                  value={newStaff.assignedWard}
                  onChange={(e) => setNewStaff({ ...newStaff, assignedWard: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Shift */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Shift Schedule
                </label>
                <select
                  value={newStaff.shift}
                  onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="Morning (08:00 AM - 04:00 PM)">Morning (08:00 AM - 04:00 PM)</option>
                  <option value="Evening (04:00 PM - 12:00 AM)">Evening (04:00 PM - 12:00 AM)</option>
                  <option value="Night Shift (12:00 AM - 08:00 AM)">Night Shift (12:00 AM - 08:00 AM)</option>
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={closeStaffModal}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Save & Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
