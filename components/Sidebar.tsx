import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Printer, GraduationCap, FileQuestion, LogOut } from 'lucide-react';

interface SidebarProps {
    examinerName: string;
    onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ examinerName, onLogout }) => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-emerald-600 text-white'
        : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 hidden md:flex flex-col no-print z-10">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">Al-Ghozali</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 pl-10">Sistem Ujian Lisan</p>
      </div>

      <nav className="p-4 space-y-1 flex-1">
        <NavLink to="/" className={navClass}>
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>
        <NavLink to="/students" className={navClass}>
          <Users className="w-5 h-5" />
          Data Santri
        </NavLink>
        <NavLink to="/questions" className={navClass}>
          <FileQuestion className="w-5 h-5" />
          Bank Soal
        </NavLink>
        <NavLink to="/grading" className={navClass}>
          <BookOpen className="w-5 h-5" />
          Penilaian
        </NavLink>
        <NavLink to="/export" className={navClass}>
          <Printer className="w-5 h-5" />
          Cetak Laporan
        </NavLink>
      </nav>
      
      <div className="p-6 border-t border-gray-100">
        <div className="bg-emerald-50 p-4 rounded-lg mb-3">
          <p className="text-xs font-semibold text-emerald-800 uppercase">Status Penguji</p>
          <p className="text-sm text-emerald-600 mt-1 font-bold truncate" title={examinerName}>{examinerName}</p>
          <p className="text-xs text-emerald-500">Kelas 5D</p>
        </div>
        <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors py-2"
        >
            <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
    </aside>
  );
};