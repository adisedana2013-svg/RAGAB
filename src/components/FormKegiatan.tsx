import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, Undo2, Calculator, MapPin, Calendar, Car, Bike, Info } from 'lucide-react';
import { JenisKendaraan, RaziaItem } from '../types';
import { calculateTotalDiperiksa, formatNumber, formatRupiah } from '../utils/formatters';

interface FormKegiatanProps {
  onSaveItem: (item: Omit<RaziaItem, 'id'>, id?: string) => void;
  editingItem: RaziaItem | null;
  onCancelEdit: () => void;
  defaultLokasi?: string;
}

export const FormKegiatan: React.FC<FormKegiatanProps> = ({
  onSaveItem,
  editingItem,
  onCancelEdit,
  defaultLokasi = '',
}) => {
  const getTodayString = () => new Date().toISOString().slice(0, 10);

  const [tanggal, setTanggal] = useState<string>(getTodayString());
  const [jenis, setJenis] = useState<JenisKendaraan>('R2');
  const [lokasi, setLokasi] = useState<string>(defaultLokasi || 'Pos Razia UPTD PPRD Bangli');
  const [pajakHidup, setPajakHidup] = useState<number>(0);
  const [pajakMati, setPajakMati] = useState<number>(0);
  const [belumBalikNama, setBelumBalikNama] = useState<number>(0);
  const [luarProvinsi, setLuarProvinsi] = useState<number>(0);
  const [yangMembayarUnit, setYangMembayarUnit] = useState<number>(0);
  const [nominalBayar, setNominalBayar] = useState<number>(0);
  const [realisasiSamsatUnit, setRealisasiSamsatUnit] = useState<number>(0);
  const [realisasiSamsatRp, setRealisasiSamsatRp] = useState<number>(0);
  const [keterangan, setKeterangan] = useState<string>('');

  useEffect(() => {
    if (editingItem) {
      setTanggal(editingItem.tanggal || getTodayString());
      setJenis(editingItem.jenis || 'R2');
      setLokasi(editingItem.lokasi || '');
      setPajakHidup(editingItem.pajakHidup || 0);
      setPajakMati(editingItem.pajakMati || 0);
      setBelumBalikNama(editingItem.belumBalikNama || 0);
      setLuarProvinsi(editingItem.luarProvinsi || 0);
      setYangMembayarUnit(editingItem.yangMembayarUnit || 0);
      setNominalBayar(editingItem.nominalBayar || 0);
      setRealisasiSamsatUnit(editingItem.realisasiSamsatUnit || 0);
      setRealisasiSamsatRp(editingItem.realisasiSamsatRp || 0);
      setKeterangan(editingItem.keterangan || '');
    } else {
      resetForm();
    }
  }, [editingItem]);

  const resetForm = () => {
    setTanggal(getTodayString());
    setJenis('R2');
    setLokasi(defaultLokasi || 'Pos Razia Simpang Alun-Alun');
    setPajakHidup(0);
    setPajakMati(0);
    setBelumBalikNama(0);
    setLuarProvinsi(0);
    setYangMembayarUnit(0);
    setNominalBayar(0);
    setRealisasiSamsatUnit(0);
    setRealisasiSamsatRp(0);
    setKeterangan('');
  };

  const totalDiperiksa = calculateTotalDiperiksa({
    pajakHidup,
    pajakMati,
    belumBalikNama,
    luarProvinsi,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggal) {
      alert('Pilih tanggal kegiatan razia terlebih dahulu!');
      return;
    }

    onSaveItem(
      {
        tanggal,
        jenis,
        lokasi,
        pajakHidup: Math.max(0, Number(pajakHidup) || 0),
        pajakMati: Math.max(0, Number(pajakMati) || 0),
        belumBalikNama: Math.max(0, Number(belumBalikNama) || 0),
        luarProvinsi: Math.max(0, Number(luarProvinsi) || 0),
        yangMembayarUnit: Math.max(0, Number(yangMembayarUnit) || 0),
        nominalBayar: Math.max(0, Number(nominalBayar) || 0),
        realisasiSamsatUnit: Math.max(0, Number(realisasiSamsatUnit) || 0),
        realisasiSamsatRp: Math.max(0, Number(realisasiSamsatRp) || 0),
        keterangan,
      },
      editingItem?.id
    );

    if (!editingItem) {
      resetForm();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 mb-6 no-print">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
            {editingItem ? <Save className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900">
              {editingItem ? `Edit Data Razia (ID: ${editingItem.id})` : 'Form Input Kegiatan Razia Baru'}
            </h2>
            <p className="text-xs text-slate-500">
              Isi parameter hasil pemeriksaan kendaraan R2/R4 sesuai berita acara lapangan.
            </p>
          </div>
        </div>
        {editingItem && (
          <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200">
            Mode Edit
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Tanggal Kegiatan *
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jenis Kendaraan *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setJenis('R2')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  jenis === 'R2'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>R2 (Sepeda Motor)</span>
              </button>
              <button
                type="button"
                onClick={() => setJenis('R4')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  jenis === 'R4'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>R4 (Mobil/Roda 4+)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Lokasi Pos Kegiatan
            </label>
            <input
              type="text"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Contoh: Simpang Alun-alun Bangli"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Row 2: Status Pajak Items (4 Items) */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-blue-600" />
            <span>Hasil Pemeriksaan Fisik Status Pajak (Unit)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-emerald-800 uppercase mb-1">
                Pajak Hidup (Unit)
              </label>
              <input
                type="number"
                min="0"
                value={pajakHidup}
                onChange={(e) => setPajakHidup(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-white border border-emerald-300 text-emerald-900 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-rose-800 uppercase mb-1">
                Pajak Mati (Unit)
              </label>
              <input
                type="number"
                min="0"
                value={pajakMati}
                onChange={(e) => setPajakMati(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-white border border-rose-300 text-rose-900 rounded-xl text-sm font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-800 uppercase mb-1">
                Blm Balik Nama (Unit)
              </label>
              <input
                type="number"
                min="0"
                value={belumBalikNama}
                onChange={(e) => setBelumBalikNama(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-white border border-amber-300 text-amber-900 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-purple-800 uppercase mb-1">
                Luar Provinsi (Unit)
              </label>
              <input
                type="number"
                min="0"
                value={luarProvinsi}
                onChange={(e) => setLuarProvinsi(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-white border border-purple-300 text-purple-900 rounded-xl text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Auto-calc display */}
          <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-lg">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Info className="w-4 h-4 text-blue-600" />
              Formula Auto: Total Diperiksa = Hidup + Mati + Blm Balik Nama + Luar Prov
            </span>
            <div className="text-slate-900 text-sm">
              Total Diperiksa:{' '}
              <span className="text-blue-700 font-extrabold text-base bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                {formatNumber(totalDiperiksa)} Unit ({jenis})
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Pembayaran & Samsat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bayar di Tempat */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80">
            <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2.5">
              💰 Yang Membayar Di Tempat
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Jumlah (Unit)</label>
                <input
                  type="number"
                  min="0"
                  value={yangMembayarUnit}
                  onChange={(e) => setYangMembayarUnit(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={nominalBayar}
                  onChange={(e) => setNominalBayar(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500"
                />
                <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                  {formatRupiah(nominalBayar)}
                </div>
              </div>
            </div>
          </div>

          {/* Realisasi Samsat */}
          <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-200/80">
            <div className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-2.5">
              🏦 Realisasi Melalui Kantor Samsat
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Jumlah (Unit)</label>
                <input
                  type="number"
                  min="0"
                  value={realisasiSamsatUnit}
                  onChange={(e) => setRealisasiSamsatUnit(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-white border border-sky-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={realisasiSamsatRp}
                  onChange={(e) => setRealisasiSamsatRp(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-white border border-sky-300 rounded-xl text-sm font-bold text-sky-800 focus:ring-2 focus:ring-sky-500"
                />
                <div className="text-[10px] text-sky-700 font-semibold mt-1">
                  {formatRupiah(realisasiSamsatRp)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Keterangan */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Keterangan / Catatan Lapangan (Opsional)
          </label>
          <input
            type="text"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="Catatan khusus, e.g. Didampingi Kepolisian & Dinas Perhubungan"
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{editingItem ? 'Simpan Perubahan' : 'Simpan Data Razia'}</span>
          </button>

          {editingItem ? (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
              <span>Batal Edit</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Reset Form</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
