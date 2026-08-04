import React, { useState } from 'react';
import {
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertCircle,
  FileJson,
  RotateCcw,
  ShieldCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import { AppSettings, BackupDataFormat, RaziaItem } from '../types';
import { exportBackupJSON, validateBackupJSON } from '../utils/storage';
import { formatNumber, formatRupiah } from '../utils/formatters';

interface BackupRestoreProps {
  dataItems: RaziaItem[];
  settings: AppSettings;
  onRestoreData: (newItems: RaziaItem[], newSettings?: AppSettings, mode?: 'replace' | 'merge') => void;
  onResetToDemo: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreProps> = ({
  dataItems,
  settings,
  onRestoreData,
  onResetToDemo,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewContent, setPreviewContent] = useState<BackupDataFormat | null>(null);
  const [restoreMode, setRestoreMode] = useState<'replace' | 'merge'>('replace');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const handleExport = () => {
    exportBackupJSON(dataItems, settings);
    setSuccessMessage(`Berhasil mengunduh berkas Backup JSON dengan ${dataItems.length} data kegiatan.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json')) {
      setErrorMessage('Berkas yang dipilih harus berformat .json!');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        const validation = validateBackupJSON(parsed);
        if (!validation.valid) {
          setErrorMessage(validation.error || 'Struktur JSON tidak sesuai.');
          setPreviewContent(null);
          return;
        }

        setPreviewContent(parsed as BackupDataFormat);
      } catch (err) {
        setErrorMessage('Gagal membaca berkas JSON. Format berkas rusak atau tidak valid.');
        setPreviewContent(null);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = () => {
    if (!previewContent || !previewContent.dataItems) {
      setErrorMessage('Tidak ada data valid yang siap dipulihkan.');
      return;
    }

    onRestoreData(previewContent.dataItems, previewContent.settings, restoreMode);
    
    const count = previewContent.dataItems.length;
    const modeText = restoreMode === 'replace' ? 'mengganti seluruh data' : 'menggabungkan data';
    setSuccessMessage(`Berhasil ${modeText}! ${count} data kegiatan berhasil dipulihkan.`);
    
    // Reset file selection
    setSelectedFile(null);
    setPreviewContent(null);

    setTimeout(() => setSuccessMessage(null), 6000);
  };

  return (
    <div className="space-y-6 no-print">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              Backup & Restore Data JSON
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Amankan seluruh data kegiatan razia dan pengaturan instansi ke dalam file berkas `.json` mandiri.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Status Sistem: <strong>{dataItems.length} Data Tersimpan</strong></span>
        </div>
      </div>

      {/* Success / Error Banners */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs md:text-sm font-bold shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl flex items-center gap-3 text-xs md:text-sm font-bold shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid: Backup vs Restore */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BACKUP SECTION */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">1. Backup Data JSON</h3>
                <p className="text-xs text-slate-500">Unduh data saat ini ke komputer anda</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Ekspor seluruh data hasil pemeriksaan kendaraan R2/R4, rekapitulasi, dan konfigurasi pejabat ke dalam berkas <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">.json</code>. Digunakan untuk arsip bulanan atau pindah ke perangkat lain.
            </p>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 mb-6 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Jumlah Rekaman Data:</span>
                <strong className="text-slate-900">{dataItems.length} Data Kegiatan</strong>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Total Unit Diperiksa:</span>
                <strong className="text-slate-900">
                  {formatNumber(
                    dataItems.reduce(
                      (acc, item) =>
                        acc +
                        (item.pajakHidup + item.pajakMati + item.belumBalikNama + item.luarProvinsi),
                      0
                    )
                  )}{' '}
                  Unit
                </strong>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Total Realisasi Penerimaan:</span>
                <strong className="text-emerald-700 font-bold">
                  {formatRupiah(
                    dataItems.reduce(
                      (acc, item) => acc + (item.nominalBayar + item.realisasiSamsatRp),
                      0
                    )
                  )}
                </strong>
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4.5 h-4.5" />
            <span>Unduh Berkas Backup (.JSON)</span>
          </button>
        </div>

        {/* RESTORE SECTION */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">2. Restore Data JSON</h3>
                <p className="text-xs text-slate-500">Pulihkan data dari berkas JSON lama</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Unggah berkas <code className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">.json</code> backup untuk memulihkan data kegiatan razia sebelumnya.
            </p>

            {/* File Input Box */}
            <div className="mb-4">
              <label className="block w-full border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition-all bg-slate-50 hover:bg-emerald-50/30">
                <FileJson className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-700 block">
                  {selectedFile ? selectedFile.name : 'Klik untuk Pilih Berkas JSON Backup'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Mendukung format file BACKUP_RAGAB_*.json
                </span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preview & Options */}
            {previewContent && (
              <div className="bg-emerald-50/70 rounded-xl p-4 border border-emerald-200 mb-4 space-y-3 text-xs">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Berkas Valid: {previewContent.dataItems?.length || 0} Data Ditemukan</span>
                </div>
                <div className="text-slate-600 text-[11px] space-y-1">
                  <p>Tanggal Ekspor: {previewContent.exportedAt ? new Date(previewContent.exportedAt).toLocaleString('id-ID') : '-'}</p>
                  <p>Nama Aplikasi: {previewContent.appName || 'RAGAB'}</p>
                </div>

                <div className="pt-2 border-t border-emerald-200">
                  <label className="block text-[11px] font-bold text-slate-800 mb-1">
                    Pilih Metode Pemulihan:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRestoreMode('replace')}
                      className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold border transition-all ${
                        restoreMode === 'replace'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      🔄 Ganti Semua Data (Replace)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRestoreMode('merge')}
                      className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold border transition-all ${
                        restoreMode === 'merge'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      ➕ Gabungkan Data (Merge)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleExecuteRestore}
            disabled={!previewContent}
            className={`w-full flex items-center justify-center gap-2 py-3 px-5 font-extrabold text-sm rounded-xl transition-all ${
              previewContent
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Upload className="w-4.5 h-4.5" />
            <span>Eksekusi Restore JSON Sekarang</span>
          </button>
        </div>
      </div>

      {/* Danger Zone / Reset Demo */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Reset Data Contoh (Demo)</h4>
            <p className="text-xs text-slate-500">
              Inisialisasi ulang aplikasi dengan data contoh kegiatan razia Mei & Agustus 2026.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Muat Ulang Data Contoh</span>
        </button>
      </div>

      {/* Modal Konfirmasi Reset Demo */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Reset Data Contoh</h3>
                <p className="text-xs text-slate-500">Inisialisasi ulang data contoh (demo)</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin mereset seluruh data kembali ke data contoh bawaan? Seluruh data yang dibuat baru akan digantikan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetToDemo();
                  setShowResetConfirm(false);
                  setSuccessMessage('Data berhasil di-reset kembali ke sampel data contoh.');
                  setTimeout(() => setSuccessMessage(null), 4000);
                }}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-600/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ya, Reset Data Contoh</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
