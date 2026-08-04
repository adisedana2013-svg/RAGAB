import React, { useState, useMemo } from 'react';
import { Search, Edit3, Trash2, Calendar, Bike, Car, Download, Filter, FileSpreadsheet } from 'lucide-react';
import { RaziaItem } from '../types';
import { calculateTotalDiperiksa, formatNumber, formatRupiah, formatTanggalIndo, NAMA_BULAN } from '../utils/formatters';

interface TableKegiatanProps {
  dataItems: RaziaItem[];
  onEditItem: (item: RaziaItem) => void;
  onDeleteItem: (id: string) => void;
  onNavigateToRekap: () => void;
}

export const TableKegiatan: React.FC<TableKegiatanProps> = ({
  dataItems,
  onEditItem,
  onDeleteItem,
  onNavigateToRekap,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all'); // 'all' or '01'..'12'
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedJenis, setSelectedJenis] = useState<string>('all'); // 'all', 'R2', 'R4'
  const [itemToDelete, setItemToDelete] = useState<RaziaItem | null>(null);

  // Extract available years from data
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    dataItems.forEach((item) => {
      if (item.tanggal) {
        years.add(item.tanggal.slice(0, 4));
      }
    });
    if (years.size === 0) years.add('2026');
    return Array.from(years).sort().reverse();
  }, [dataItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    return dataItems.filter((item) => {
      // Month filter
      if (selectedMonth !== 'all') {
        const m = item.tanggal ? item.tanggal.slice(5, 7) : '';
        if (m !== selectedMonth) return false;
      }
      // Year filter
      if (selectedYear !== 'all') {
        const y = item.tanggal ? item.tanggal.slice(0, 4) : '';
        if (y !== selectedYear) return false;
      }
      // Jenis filter
      if (selectedJenis !== 'all') {
        if (item.jenis !== selectedJenis) return false;
      }
      // Search term
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchesDate = (item.tanggal || '').toLowerCase().includes(term);
        const matchesLocation = (item.lokasi || '').toLowerCase().includes(term);
        const matchesNotes = (item.keterangan || '').toLowerCase().includes(term);
        if (!matchesDate && !matchesLocation && !matchesNotes) return false;
      }
      return true;
    });
  }, [dataItems, selectedMonth, selectedYear, selectedJenis, searchTerm]);

  // Calculate totals for filtered items
  const totals = useMemo(() => {
    let pajakHidupR2 = 0, pajakHidupR4 = 0;
    let pajakMatiR2 = 0, pajakMatiR4 = 0;
    let belumBalikR2 = 0, belumBalikR4 = 0;
    let luarProvR2 = 0, luarProvR4 = 0;
    let totalDiperiksaR2 = 0, totalDiperiksaR4 = 0;
    let totalUnitBayar = 0, totalNominalBayar = 0;
    let totalRealisasiUnit = 0, totalRealisasiRp = 0;

    filteredItems.forEach((item) => {
      const diperiksa = calculateTotalDiperiksa(item);
      if (item.jenis === 'R2') {
        pajakHidupR2 += item.pajakHidup || 0;
        pajakMatiR2 += item.pajakMati || 0;
        belumBalikR2 += item.belumBalikNama || 0;
        luarProvR2 += item.luarProvinsi || 0;
        totalDiperiksaR2 += diperiksa;
      } else {
        pajakHidupR4 += item.pajakHidup || 0;
        pajakMatiR4 += item.pajakMati || 0;
        belumBalikR4 += item.belumBalikNama || 0;
        luarProvR4 += item.luarProvinsi || 0;
        totalDiperiksaR4 += diperiksa;
      }
      totalUnitBayar += item.yangMembayarUnit || 0;
      totalNominalBayar += item.nominalBayar || 0;
      totalRealisasiUnit += item.realisasiSamsatUnit || 0;
      totalRealisasiRp += item.realisasiSamsatRp || 0;
    });

    return {
      pajakHidupR2, pajakHidupR4,
      pajakMatiR2, pajakMatiR4,
      belumBalikR2, belumBalikR4,
      luarProvR2, luarProvR4,
      totalDiperiksaR2, totalDiperiksaR4,
      totalUnitBayar, totalNominalBayar,
      totalRealisasiUnit, totalRealisasiRp,
      grandTotalDiperiksa: totalDiperiksaR2 + totalDiperiksaR4,
      grandTotalPenerimaan: totalNominalBayar + totalRealisasiRp,
    };
  }, [filteredItems]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden no-print">
      {/* Controls Header */}
      <div className="p-4 md:p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              <span>Tabel Laporan Kegiatan Razia Gabungan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {filteredItems.length} dari total {dataItems.length} entri data
            </p>
          </div>

          <button
            onClick={onNavigateToRekap}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-xl border border-blue-200 transition-all self-start md:self-auto cursor-pointer"
          >
            <span>Lihat Rekapitilasi Bulanan</span>
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari lokasi, tanggal, catatan..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Month Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full text-xs font-semibold bg-transparent border-none focus:outline-none text-slate-700"
            >
              <option value="all">Semua Bulan</option>
              {NAMA_BULAN.map((bulan, idx) => {
                const monthNum = String(idx + 1).padStart(2, '0');
                return (
                  <option key={monthNum} value={monthNum}>
                    {bulan}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-xs font-bold text-slate-400 shrink-0">Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full text-xs font-semibold bg-transparent border-none focus:outline-none text-slate-700"
            >
              <option value="all">Semua Tahun</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Jenis Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-xs font-bold text-slate-400 shrink-0">Jenis:</span>
            <select
              value={selectedJenis}
              onChange={(e) => setSelectedJenis(e.target.value)}
              className="w-full text-xs font-semibold bg-transparent border-none focus:outline-none text-slate-700"
            >
              <option value="all">Semua Jenis (R2 & R4)</option>
              <option value="R2">Khusus R2 (Motor)</option>
              <option value="R4">Khusus R4 (Mobil)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full border-collapse text-xs text-center min-w-[1100px]">
          <thead>
            <tr className="bg-slate-900 text-white font-bold tracking-wider">
              <th rowSpan={2} className="p-3 border border-slate-700 w-24">TANGGAL</th>
              <th rowSpan={2} className="p-3 border border-slate-700 w-16">JNS</th>
              <th rowSpan={2} className="p-3 border border-slate-700 text-left min-w-[140px]">LOKASI</th>
              <th colSpan={2} className="p-2 border border-slate-700 bg-emerald-950/80 text-emerald-300">PAJAK HIDUP</th>
              <th colSpan={2} className="p-2 border border-slate-700 bg-rose-950/80 text-rose-300">PAJAK MATI</th>
              <th colSpan={2} className="p-2 border border-slate-700 bg-amber-950/80 text-amber-300">BLM BALIK NAMA</th>
              <th colSpan={2} className="p-2 border border-slate-700 bg-purple-950/80 text-purple-300">LUAR PROVINSI</th>
              <th colSpan={2} className="p-2 border border-slate-700 bg-blue-950/80 text-blue-300">TOTAL DIPERIKSA</th>
              <th colSpan={2} className="p-2 border border-slate-700 bg-teal-950/80 text-teal-300">YANG MEMBAYAR</th>
              <th colSpan={2} className="p-2 border border-slate-700 bg-sky-950/80 text-sky-300">REALISASI SAMSAT</th>
              <th rowSpan={2} className="p-3 border border-slate-700 w-20">AKSI</th>
            </tr>
            <tr className="bg-slate-800 text-slate-200 font-bold text-[11px]">
              <th className="p-1.5 border border-slate-700 w-10">R2</th>
              <th className="p-1.5 border border-slate-700 w-10">R4</th>
              <th className="p-1.5 border border-slate-700 w-10">R2</th>
              <th className="p-1.5 border border-slate-700 w-10">R4</th>
              <th className="p-1.5 border border-slate-700 w-10">R2</th>
              <th className="p-1.5 border border-slate-700 w-10">R4</th>
              <th className="p-1.5 border border-slate-700 w-10">R2</th>
              <th className="p-1.5 border border-slate-700 w-10">R4</th>
              <th className="p-1.5 border border-slate-700 w-12">R2</th>
              <th className="p-1.5 border border-slate-700 w-12">R4</th>
              <th className="p-1.5 border border-slate-700 w-12">UNIT</th>
              <th className="p-1.5 border border-slate-700 w-24">NOMINAL</th>
              <th className="p-1.5 border border-slate-700 w-12">UNIT</th>
              <th className="p-1.5 border border-slate-700 w-24">NOMINAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={18} className="p-10 text-center text-slate-400 font-medium">
                  Belum ada data razia yang sesuai dengan filter filter ini.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const totalDiperiksa = calculateTotalDiperiksa(item);
                const isR2 = item.jenis === 'R2';

                return (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-2 border border-slate-200 font-semibold text-slate-900 whitespace-nowrap">
                      {item.tanggal}
                    </td>
                    <td className="p-2 border border-slate-200">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isR2
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        }`}
                      >
                        {isR2 ? <Bike className="w-3 h-3" /> : <Car className="w-3 h-3" />}
                        {item.jenis}
                      </span>
                    </td>
                    <td className="p-2 border border-slate-200 text-left font-medium text-slate-700 max-w-[180px] truncate" title={item.lokasi}>
                      {item.lokasi || '-'}
                    </td>

                    {/* Pajak Hidup */}
                    <td className="p-2 border border-slate-200 font-bold text-emerald-700">
                      {isR2 ? formatNumber(item.pajakHidup) : '-'}
                    </td>
                    <td className="p-2 border border-slate-200 font-bold text-emerald-700">
                      {!isR2 ? formatNumber(item.pajakHidup) : '-'}
                    </td>

                    {/* Pajak Mati */}
                    <td className="p-2 border border-slate-200 font-bold text-rose-700">
                      {isR2 ? formatNumber(item.pajakMati) : '-'}
                    </td>
                    <td className="p-2 border border-slate-200 font-bold text-rose-700">
                      {!isR2 ? formatNumber(item.pajakMati) : '-'}
                    </td>

                    {/* Belum Balik Nama */}
                    <td className="p-2 border border-slate-200 text-amber-800 font-semibold">
                      {isR2 ? formatNumber(item.belumBalikNama) : '-'}
                    </td>
                    <td className="p-2 border border-slate-200 text-amber-800 font-semibold">
                      {!isR2 ? formatNumber(item.belumBalikNama) : '-'}
                    </td>

                    {/* Luar Provinsi */}
                    <td className="p-2 border border-slate-200 text-purple-800 font-semibold">
                      {isR2 ? formatNumber(item.luarProvinsi) : '-'}
                    </td>
                    <td className="p-2 border border-slate-200 text-purple-800 font-semibold">
                      {!isR2 ? formatNumber(item.luarProvinsi) : '-'}
                    </td>

                    {/* Total Diperiksa */}
                    <td className="p-2 border border-slate-200 font-black bg-slate-50 text-blue-900">
                      {isR2 ? formatNumber(totalDiperiksa) : '-'}
                    </td>
                    <td className="p-2 border border-slate-200 font-black bg-slate-50 text-blue-900">
                      {!isR2 ? formatNumber(totalDiperiksa) : '-'}
                    </td>

                    {/* Bayar di tempat */}
                    <td className="p-2 border border-slate-200 font-bold text-slate-800">
                      {formatNumber(item.yangMembayarUnit)}
                    </td>
                    <td className="p-2 border border-slate-200 font-bold text-emerald-700 whitespace-nowrap">
                      {formatRupiah(item.nominalBayar)}
                    </td>

                    {/* Realisasi Samsat */}
                    <td className="p-2 border border-slate-200 font-bold text-slate-800">
                      {formatNumber(item.realisasiSamsatUnit)}
                    </td>
                    <td className="p-2 border border-slate-200 font-bold text-sky-700 whitespace-nowrap">
                      {formatRupiah(item.realisasiSamsatRp)}
                    </td>

                    {/* Aksi */}
                    <td className="p-2 border border-slate-200">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditItem(item)}
                          title="Edit Data"
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(item)}
                          title="Hapus Data"
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Totals Footer Row */}
          {filteredItems.length > 0 && (
            <tfoot>
              <tr className="bg-slate-200/90 text-slate-900 font-black text-xs border-t-2 border-slate-400">
                <td colSpan={3} className="p-3 border border-slate-300 text-right uppercase tracking-wider">
                  TOTAL KESELURUHAN:
                </td>

                <td className="p-2 border border-slate-300 text-emerald-900 bg-emerald-100/60">
                  {formatNumber(totals.pajakHidupR2)}
                </td>
                <td className="p-2 border border-slate-300 text-emerald-900 bg-emerald-100/60">
                  {formatNumber(totals.pajakHidupR4)}
                </td>

                <td className="p-2 border border-slate-300 text-rose-900 bg-rose-100/60">
                  {formatNumber(totals.pajakMatiR2)}
                </td>
                <td className="p-2 border border-slate-300 text-rose-900 bg-rose-100/60">
                  {formatNumber(totals.pajakMatiR4)}
                </td>

                <td className="p-2 border border-slate-300 text-amber-900 bg-amber-100/60">
                  {formatNumber(totals.belumBalikR2)}
                </td>
                <td className="p-2 border border-slate-300 text-amber-900 bg-amber-100/60">
                  {formatNumber(totals.belumBalikR4)}
                </td>

                <td className="p-2 border border-slate-300 text-purple-900 bg-purple-100/60">
                  {formatNumber(totals.luarProvR2)}
                </td>
                <td className="p-2 border border-slate-300 text-purple-900 bg-purple-100/60">
                  {formatNumber(totals.luarProvR4)}
                </td>

                <td className="p-2 border border-slate-300 text-blue-900 bg-blue-100/80">
                  {formatNumber(totals.totalDiperiksaR2)}
                </td>
                <td className="p-2 border border-slate-300 text-blue-900 bg-blue-100/80">
                  {formatNumber(totals.totalDiperiksaR4)}
                </td>

                <td className="p-2 border border-slate-300 text-slate-900">
                  {formatNumber(totals.totalUnitBayar)}
                </td>
                <td className="p-2 border border-slate-300 text-emerald-900 bg-emerald-100/80 font-bold whitespace-nowrap">
                  {formatRupiah(totals.totalNominalBayar)}
                </td>

                <td className="p-2 border border-slate-300 text-slate-900">
                  {formatNumber(totals.totalRealisasiUnit)}
                </td>
                <td className="p-2 border border-slate-300 text-sky-900 bg-sky-100/80 font-bold whitespace-nowrap">
                  {formatRupiah(totals.totalRealisasiRp)}
                </td>

                <td className="p-2 border border-slate-300"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Modal Konfirmasi Hapus Data */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Konfirmasi Hapus Data</h3>
                <p className="text-xs text-slate-500">Apakah Anda yakin ingin menghapus data ini?</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Tanggal:</span>
                <span className="font-bold text-slate-900">{formatTanggalIndo(itemToDelete.tanggal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Jenis Kendaraan:</span>
                <span className="font-bold text-slate-900">{itemToDelete.jenis === 'R2' ? 'Roda 2 (R2)' : 'Roda 4 (R4)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Lokasi Razia:</span>
                <span className="font-bold text-slate-900 text-right max-w-[200px] truncate" title={itemToDelete.lokasi}>
                  {itemToDelete.lokasi || '-'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tindakan ini akan menghapus data kegiatan razia secara permanen dari penyimpanan lokal.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteItem(itemToDelete.id);
                  setItemToDelete(null);
                }}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
