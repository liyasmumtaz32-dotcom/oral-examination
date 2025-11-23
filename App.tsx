import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { StudentList } from './pages/StudentList';
import { Grading } from './pages/Grading';
import { ExportView } from './pages/ExportView';
import { QuestionBank } from './pages/QuestionBank';
import { INITIAL_STUDENTS } from './constants';
import { Student } from './types';
import { GraduationCap, ArrowRight, Calendar } from 'lucide-react';

function App() {
  // Central State Management
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  
  // Auth & Config State
  const [examinerName, setExaminerName] = useState<string>('');
  const [examDate, setExamDate] = useState<string>(''); // Format YYYY-MM-DD
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Temp state for login form
  const [tempName, setTempName] = useState('');
  const [tempDate, setTempDate] = useState('');

  // Check local storage on load
  useEffect(() => {
    const savedName = localStorage.getItem('examinerName');
    const savedDate = localStorage.getItem('examDate');
    
    if (savedName) {
        setExaminerName(savedName);
        if (savedDate) setExamDate(savedDate);
        setIsLoggedIn(true);
    } else {
        // Set default date to today for the login form
        setTempDate(new Date().toISOString().split('T')[0]);
    }
  }, []);

  // Sync examiner name to ALL students data upon login
  // This ensures "Ust. Fulan" is replaced by the real logged-in user in all documents
  useEffect(() => {
    if (isLoggedIn && examinerName) {
        setStudents(prev => prev.map(s => ({
            ...s,
            examiner: examinerName
        })));
    }
  }, [isLoggedIn, examinerName]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
        const name = tempName.trim();
        setExaminerName(name);
        setExamDate(tempDate);
        setIsLoggedIn(true);
        localStorage.setItem('examinerName', name);
        localStorage.setItem('examDate', tempDate);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setExaminerName('');
    setTempName('');
    localStorage.removeItem('examinerName');
    // We keep the date in localStorage as convenience, or remove it:
    // localStorage.removeItem('examDate'); 
  };

  if (!isLoggedIn) {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-emerald-600 p-8 text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                          <GraduationCap className="w-10 h-10 text-white" />
                      </div>
                      <h1 className="text-2xl font-bold text-white mb-2">Sistem Ujian Lisan</h1>
                      <p className="text-emerald-100">Al-Ghozali Modern Islamic Boarding School</p>
                  </div>
                  <div className="p-8">
                      <form onSubmit={handleLogin} className="space-y-6">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Masukkan Nama Penguji
                              </label>
                              <input 
                                  type="text" 
                                  required
                                  placeholder="Contoh: Ust. Abdullah"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                                  value={tempName}
                                  onChange={(e) => setTempName(e.target.value)}
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Tanggal Ujian
                              </label>
                              <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <input 
                                      type="date" 
                                      required
                                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                                      value={tempDate}
                                      onChange={(e) => setTempDate(e.target.value)}
                                  />
                              </div>
                          </div>
                          <button 
                              type="submit" 
                              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2 group"
                          >
                              Masuk Aplikasi <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                      </form>
                      <p className="mt-6 text-center text-xs text-gray-400">
                          &copy; 2025 IT Division - PM Al Ghozali
                      </p>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50">
        <Sidebar examinerName={examinerName} onLogout={handleLogout} />
        
        {/* Main Content Area */}
        <main className="transition-all duration-300 md:ml-64 p-4 md:p-8 min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard students={students} />} />
            <Route path="/students" element={<StudentList students={students} setStudents={setStudents} currentExaminer={examinerName} />} />
            <Route path="/questions" element={<QuestionBank />} />
            <Route path="/grading" element={<Grading students={students} setStudents={setStudents} examinerName={examinerName} />} />
            <Route path="/export" element={<ExportView students={students} currentExaminer={examinerName} examDate={examDate} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;