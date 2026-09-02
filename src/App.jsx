import React, { useEffect, useRef, useState } from 'react';
import { apiRequest } from './lib/api';

import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import AddPatient from './components/AddPatient';
import PatientProfile from './components/PatientProfile';
import DoctorPanel from './components/DoctorPanel';
import NursePanel from './components/NursePanel';
import StaffAttendance from './components/StaffAttendance';
import Laboratory from './components/Laboratory';
import AIAssistant from './components/AIAssistant';
import Reports from './components/Reports';
import Settings from './components/Settings';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('mediai_token'));
  const [userRole, setUserRole] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('mediai_user'));
      return stored?.role || 'Doctor';
    } catch {
      return 'Doctor';
    }
  });
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('mediai_user'));
      return stored?.role === 'patient' ? 'patient-profile' : 'dashboard';
    } catch {
      return 'dashboard';
    }
  });
  const [selectedPatient, setSelectedPatient] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('mediai_user'));
      if (stored?.role === 'patient' && stored?.patient) {
        return stored.patient;
      }
    } catch {}
    return null;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('mediai_token');
    if (!token) return;

    apiRequest('/auth/me')
      .then((data) => {
        if (data?.user?.role) {
          setUserRole(data.user.role);
        }
      })
      .catch(() => {
        localStorage.removeItem('mediai_token');
        localStorage.removeItem('mediai_user');
        setIsLoggedIn(false);
      });
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleBreakpointChange = (event) => {
      if (event.matches) {
        setIsSidebarOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleBreakpointChange);

    return () => mediaQuery.removeEventListener('change', handleBreakpointChange);
  }, []);

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const handleOpenPatientPortal = (patientData) => {
    setUserRole('patient');
    setSelectedPatient(patientData);
    setIsLoggedIn(true);
    setActiveTab('patient-profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('mediai_token');
    localStorage.removeItem('mediai_user');
    setIsLoggedIn(false);
    setActiveTab('dashboard');
    setSelectedPatient(null);
    setUserRole('Doctor');
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  // Agar user logged in nahi hai, to pehle Login Screen show ho gi
  if (!isLoggedIn) {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onOpenPatientPortal={handleOpenPatientPortal}
      />
    );
  }

  const isPatient = userRole === 'patient';

  const renderContent = () => {
    if (isPatient) {
      return (
        <PatientProfile
          patient={selectedPatient}
          setActiveTab={setActiveTab}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;

      case 'patients':
        return (
          <Patients
            setActiveTab={setActiveTab}
            setSelectedPatient={setSelectedPatient}
          />
        );

      case 'add-patient':
        return <AddPatient setActiveTab={setActiveTab} />;

      case 'patient-profile':
        return (
          <PatientProfile
            patient={selectedPatient}
            setActiveTab={setActiveTab}
          />
        );

      case 'doctor':
        return <DoctorPanel />;

      case 'nurse':
        return <NursePanel />;

      case 'attendance':
      case 'staff-attendance':
        return <StaffAttendance />;

      case 'laboratory':
        return <Laboratory />;

      case 'ai-assistant':
        return <AIAssistant />;

      case 'reports':
        return <Reports />;

      case 'settings':
        return <Settings />;

      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen h-[100dvh] bg-slate-100 font-sans overflow-hidden">
      {!isPatient && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
      )}

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Navbar
          userRole={userRole}
          onLogout={handleLogout}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          isSidebarOpen={isSidebarOpen}
          menuButtonRef={menuButtonRef}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
