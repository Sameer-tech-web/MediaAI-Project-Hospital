import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  Check,
  Copy,
  FileText,
  Mic,
  Pill,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { apiRequest } from '../lib/api';

const CLINICAL_ROLES = new Set(['admin', 'doctor', 'nurse']);
const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function AIAssistant() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPatientsLoading, setIsPatientsLoading] = useState(true);
  const [patientError, setPatientError] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello. I can provide clinical decision support from the selected patient record. Please verify all recommendations against your local protocols and clinical judgment.',
      time: timeNow(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatError, setChatError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const token = localStorage.getItem('mediai_token');
    let user;
    try {
      user = JSON.parse(localStorage.getItem('mediai_user') || 'null');
    } catch {
      user = null;
    }

    if (!token) {
      setPatientError('Authentication required. Please login again.');
      setIsPatientsLoading(false);
      return;
    }

    if (!CLINICAL_ROLES.has(user?.role)) {
      setPatientError('MediAI is available only to administrators, doctors, and nurses.');
      setIsPatientsLoading(false);
      return;
    }

    const loadPatients = async () => {
      try {
        const data = await apiRequest('/patients');
        if (!Array.isArray(data)) throw new Error('Unable to load patients');
        setPatients(data);
        setSelectedPatient(data[0] || null);
      } catch (error) {
        setPatientError(error.message || 'Unable to load patients');
      } finally {
        setIsPatientsLoading(false);
      }
    };

    loadPatients();
  }, []);

  const handleQuickPrompt = (promptText) => {
    setInput(promptText);
  };

  const handleSend = async (event) => {
    event.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || !selectedPatient || isTyping) return;

    setMessages((prev) => [...prev, { sender: 'user', text: userMessage, time: timeNow() }]);
    setInput('');
    setChatError('');
    setIsTyping(true);

    try {
      const data = await apiRequest('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage,
          patientId: selectedPatient._id,
        }),
      });

      if (typeof data.reply !== 'string' || !data.reply.trim()) {
        throw new Error('Unable to get an AI response');
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: data.reply.trim(), time: timeNow() }]);
    } catch (error) {
      setChatError(error.message || 'Unable to get an AI response');
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setChatError('Unable to copy the response');
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const searchTerm = patientSearch.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(searchTerm) ||
      patient.mrn?.toLowerCase().includes(searchTerm)
    );
  });

  const patientLabel = selectedPatient
    ? `${selectedPatient.name} (${selectedPatient.mrn || 'No MRN'})`
    : isPatientsLoading
      ? 'Loading patient directory...'
      : 'No patient selected';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-6xl mx-auto font-sans min-h-screen bg-slate-50">
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-start sm:items-center gap-2">
            <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 shrink-0" />
            <span>MediAI Clinical Intelligence Copilot</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Clinical decision support. Verify all recommendations with clinical judgment and local protocols.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-2xl">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">
            Gemini Clinical Support
          </span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Active Patient Context</span>
            <p className="text-xs font-black text-slate-800">
              {patientLabel}
              {selectedPatient && (
                <span className="text-slate-500 font-semibold"> {selectedPatient.gender}, {selectedPatient.age} yrs</span>
              )}
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Switch patient by name/MRN..."
              value={patientSearch}
              disabled={isPatientsLoading || isTyping || patients.length === 0}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(event) => {
                setPatientSearch(event.target.value);
                setIsSearchOpen(true);
              }}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {isSearchOpen && !isPatientsLoading && patients.length > 0 && (
            <div className="absolute right-0 top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto divide-y divide-slate-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <button
                    key={patient._id}
                    type="button"
                    disabled={isTyping}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setPatientSearch('');
                      setIsSearchOpen(false);
                    }}
                    className="w-full p-2.5 text-left hover:bg-blue-50 disabled:cursor-not-allowed text-xs transition-colors"
                  >
                    <p className="font-bold text-slate-800">{patient.name} ({patient.mrn || 'No MRN'})</p>
                    <p className="text-[10px] text-slate-400">{patient.triageCategory || 'Routine'} triage</p>
                  </button>
                ))
              ) : (
                <p className="p-2.5 text-xs text-slate-500">No matching patients</p>
              )}
            </div>
          )}
        </div>
      </div>

      {patientError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {patientError}
        </p>
      )}
      {!isPatientsLoading && !patientError && patients.length === 0 && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700">
          No patients are available for clinical context.
        </p>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 h-[55dvh] min-h-[260px] max-h-[520px] overflow-y-auto space-y-4 shadow-sm">
        {messages.map((message, index) => (
          <div
            key={`${message.time}-${index}`}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-md lg:max-w-xl break-words whitespace-pre-wrap p-4 rounded-2xl text-xs font-semibold leading-relaxed relative group ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none'
              }`}
            >
              <p>{message.text}</p>
              <div className="flex justify-between items-center mt-2 text-[9px] opacity-70 border-t border-slate-200/20 pt-1">
                <span>{message.time}</span>
                {message.sender === 'ai' && (
                  <button
                    type="button"
                    onClick={() => handleCopy(message.text, index)}
                    className="hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedIndex === index ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>MediAI is analyzing the selected clinical context...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {chatError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {chatError}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!selectedPatient || isTyping}
          onClick={() => handleQuickPrompt('Check Amlodipine dosage considerations for the active patient.')}
          className="w-full sm:w-auto justify-center px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-blue-50 hover:border-blue-300 disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-1.5 transition-all"
        >
          <Pill className="w-3.5 h-3.5 text-blue-600" />
          Dosage Check
        </button>
        <button
          type="button"
          disabled={!selectedPatient || isTyping}
          onClick={() => handleQuickPrompt('Check potential interactions with Metformin for the active patient.')}
          className="w-full sm:w-auto justify-center px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-amber-50 hover:border-amber-300 disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-1.5 transition-all"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          Drug Interactions
        </button>
        <button
          type="button"
          disabled={!selectedPatient || isTyping}
          onClick={() => handleQuickPrompt("Summarize the active patient's current medical status.")}
          className="w-full sm:w-auto justify-center px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-purple-50 hover:border-purple-300 disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-1.5 transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-purple-600" />
          Summarize Patient Status
        </button>
      </div>

      <form onSubmit={handleSend} className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative w-full flex-1">
          <input
            type="text"
            maxLength={4000}
            placeholder={selectedPatient ? `Ask MediAI about ${selectedPatient.name}...` : 'Select a patient to begin'}
            value={input}
            disabled={!selectedPatient || isTyping}
            onChange={(event) => setInput(event.target.value)}
            className="w-full pl-4 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="button"
            title="Voice command is not available"
            disabled
            className="absolute right-3 top-3.5 text-slate-400 cursor-not-allowed"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
        <button
          type="submit"
          disabled={!selectedPatient || !input.trim() || isTyping}
          className="w-full sm:w-auto justify-center px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
