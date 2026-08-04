import React from 'react';
import {
  FileText,
  BarChart3,
  Printer,
  Database,
  Settings,
  ShieldAlert,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-react';
import { AppSettings } from '../types';

interface NavbarProps {
  activeTab: 'kegiatan' | 'rekap' | 'cetak' | 'backup' | 'pengaturan';
  setActiveTab: (tab: 'kegiatan' | 'rekap' | 'cetak' | 'backup' | 'pengaturan') => void;
  settings: AppSettings;
  totalRecords: number;
  onExportBackup: () => void;
  onQuickPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  totalRecords,
  onExportBackup,
  onQuickPrint,
}) => {
  return (
    <header className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 md:p-5 mb-6 no-print transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Brand Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 via-sky-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                RAGAB <span className="text-blue-700 font-extrabold text-lg md:text-xl">UPTD PPRD</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {totalRecords} Data
              </span>
            </div>
            <p className="text-xs md:text-sm font-medium text-slate-500 line-clamp-1">
              {settings.namaKegiatan || 'Aplikasi Rekapitulasi Razia Gabungan Penertiban Pajak Kendaraan'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onQuickPrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs md:text-sm shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
          <button
            onClick={onExportBackup}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs md:text-sm shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Backup JSON</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 mt-5 pt-4 border-t border-slate-100 overflow-x-auto scrollbar-none pb-0.5">
        <button
          onClick={() => setActiveTab('kegiatan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'kegiatan'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Input & Data Kegiatan</span>
        </button>

        <button
          onClick={() => setActiveTab('rekap')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'rekap'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Isi Rekap Bulanan</span>
        </button>

        <button
          onClick={() => setActiveTab('cetak')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'cetak'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Format Resmi</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'backup'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Backup & Restore JSON</span>
        </button>

        <button
          onClick={() => setActiveTab('pengaturan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'pengaturan'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan Kop & Pejabat</span>
        </button>
      </div>
    </header>
  );
};
