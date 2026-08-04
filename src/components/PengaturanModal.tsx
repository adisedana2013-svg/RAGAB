import React, { useState } from 'react';
import { Settings, Save, Building, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AppSettings } from '../types';

interface PengaturanProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
}

export const PengaturanModal: React.FC<PengaturanProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 no-print">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Pengaturan Instansi & Pejabat Penandatangan
            </h2>
            <p className="text-xs text-slate-500">
              Konfigurasi Kop Surat, Nama Instansi, dan Tanda Tangan Laporan Resmi Cetak.
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs md:text-sm font-bold shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Pengaturan Kop Surat dan Pejabat berhasil diperbarui & tersimpan!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Instansi Header Info */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Kop Surat & Judul Laporan Resmi</span>
          </h3>

          <div className="grid grid-cols-1 gap-4 text-xs font-semibold text-slate-700">
            <div>
              <label className="block mb-1 font-bold text-slate-800">1. Nama Pemerintah / Instansi Atasan</label>
              <input
                type="text"
                value={formData.namaInstansi}
                onChange={(e) => setFormData({ ...formData, namaInstansi: e.target.value })}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-800">2. Sub-Header / UPTD PPRD (Multi-Baris)</label>
              <textarea
                rows={3}
                value={formData.subTitle}
                onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-800">3. Judul Kegiatan Laporan</label>
              <input
                type="text"
                value={formData.namaKegiatan}
                onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold text-slate-800">4. Kota Terbit Laporan</label>
                <input
                  type="text"
                  value={formData.kotaTerbit}
                  onChange={(e) => setFormData({ ...formData, kotaTerbit: e.target.value })}
                  placeholder="Contoh: Bangli"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pejabat Penandatangan */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Pejabat Penandatangan Laporan</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Pejabat 1: Kepala UPTD */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-blue-900 border-b border-slate-200 pb-2">
                1. Kepala UPTD PPRD (Sisi Kanan)
              </h4>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={formData.kepalaInstansi}
                  onChange={(e) => setFormData({ ...formData, kepalaInstansi: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan Resmi</label>
                <input
                  type="text"
                  value={formData.jabatanKepala}
                  onChange={(e) => setFormData({ ...formData, jabatanKepala: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">NIP</label>
                <input
                  type="text"
                  value={formData.nipKepala}
                  onChange={(e) => setFormData({ ...formData, nipKepala: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            {/* Pejabat 2: Penanggung Jawab Tim Razia */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-blue-900 border-b border-slate-200 pb-2">
                2. Ketua Tim Razia Gabungan (Sisi Kiri)
              </h4>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={formData.penanggungJawab}
                  onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan / Peran</label>
                <input
                  type="text"
                  value={formData.jabatanPenanggungJawab}
                  onChange={(e) =>
                    setFormData({ ...formData, jabatanPenanggungJawab: e.target.value })
                  }
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">NIP</label>
                <input
                  type="text"
                  value={formData.nipPenanggungJawab}
                  onChange={(e) => setFormData({ ...formData, nipPenanggungJawab: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4.5 h-4.5" />
            <span>Simpan Pengaturan Instansi</span>
          </button>
        </div>
      </form>
    </div>
  );
};
