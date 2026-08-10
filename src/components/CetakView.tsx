import React, { useState, useMemo } from 'react';
import { Printer, Calendar, FileText, CheckCircle, ShieldCheck, Download } from 'lucide-react';
import { AppSettings, RaziaItem } from '../types';
import {
  calculateTotalDiperiksa,
  formatNumber,
  formatRupiah,
  formatTanggalIndo,
  NAMA_BULAN,
} from '../utils/formatters';

interface CetakViewProps {
  dataItems: RaziaItem[];
  settings: AppSettings;
  defaultMonth?: string;
  defaultYear?: string;
}

export const CetakView: React.FC<CetakViewProps> = ({
  dataItems,
  settings,
  defaultMonth = 'all',
  defaultYear = '2026',
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);
  const [selectedYear, setSelectedYear] = useState<string>(defaultYear);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [showDetailTable, setShowDetailTable] = useState<boolean>(true);

  // Extract available years
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
      if (!item.tanggal) return false;
      const [y, m] = item.tanggal.split('-');
      if (selectedYear !== 'all' && y !== selectedYear) return false;
      if (selectedMonth !== 'all' && m !== selectedMonth) return false;
      return true;
    });
  }, [dataItems, selectedMonth, selectedYear]);

  // Calculations for report
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

  // Totals for Lampiran Rincian Harian
  const lampiranTotals = useMemo(() => {
    let totalHidup = 0, totalMati = 0, totalBBN = 0, totalLuar = 0, totalDiperiksa = 0;
    let totalBayarUnit = 0, totalBayarRp = 0;
    let totalSamsatUnit = 0, totalSamsatRp = 0;

    filteredItems.forEach((item) => {
      const diperiksa = calculateTotalDiperiksa(item);
      totalHidup += item.pajakHidup || 0;
      totalMati += item.pajakMati || 0;
      totalBBN += item.belumBalikNama || 0;
      totalLuar += item.luarProvinsi || 0;
      totalDiperiksa += diperiksa;
      totalBayarUnit += item.yangMembayarUnit || 0;
      totalBayarRp += item.nominalBayar || 0;
      totalSamsatUnit += item.realisasiSamsatUnit || 0;
      totalSamsatRp += item.realisasiSamsatRp || 0;
    });

    return {
      totalHidup,
      totalMati,
      totalBBN,
      totalLuar,
      totalDiperiksa,
      totalBayarUnit,
      totalBayarRp,
      totalSamsatUnit,
      totalSamsatRp,
      totalPenerimaanUnit: totalBayarUnit + totalSamsatUnit,
      totalPenerimaanRp: totalBayarRp + totalSamsatRp,
    };
  }, [filteredItems]);

  const handlePrint = () => {
    window.print();
  };

  const getPeriodeText = () => {
    if (selectedMonth === 'all') {
      return `TAHUN ${selectedYear === 'all' ? '2026' : selectedYear}`;
    }
    const mIndex = parseInt(selectedMonth, 10) - 1;
    const monthName = NAMA_BULAN[mIndex] || '';
    return `BULAN ${monthName.toUpperCase()} ${selectedYear}`;
  };

  const getTodayFormatted = () => {
    const today = new Date();
    const day = today.getDate();
    const month = NAMA_BULAN[today.getMonth()];
    const year = today.getFullYear();
    return `${settings.kotaTerbit || 'Bangli'}, ${day} ${month} ${year}`;
  };

  return (
    <div className="space-y-6">
      {/* Printable Control Bar (Hidden when printing) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-600" />
            <span>Format Cetak Laporan Resmi</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan tombol cetak di bawah ini untuk mengunduh PDF atau mencetak laporan resmi UPTD PPRD.
          </p>
        </div>

        {/* Options */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Periode:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none"
            >
              <option value="all">Semua Bulan</option>
              {NAMA_BULAN.map((m, idx) => {
                const code = String(idx + 1).padStart(2, '0');
                return (
                  <option key={code} value={code}>
                    {m}
                  </option>
                );
              })}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none ml-1"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showDetailTable}
              onChange={(e) => setShowDetailTable(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Lampirkan Rincian Harian</span>
          </label>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Printer className="w-4.5 h-4.5" />
            <span>Cetak / Download PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 md:p-12 text-slate-900 print-document font-sans">
        {/* KOP SURAT */}
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center">
          <h3 className="text-base md:text-lg font-black uppercase tracking-wider text-slate-900">
            {settings.namaInstansi || 'PEMERINTAH PROVINSI BALI'}
          </h3>
          <h4 className="text-xs md:text-sm font-extrabold whitespace-pre-line text-slate-800 mt-1">
            {settings.subTitle ||
              'BADAN PENGELOLAAN KEUANGAN DAN PENDAPATAN DAERAH\nUPTD PELAYANAN PAJAK DAN RETRIBUSI DAERAH (PPRD) DI KABUPATEN BANGLI'}
          </h4>
          <p className="text-[11px] text-slate-600 italic mt-1">
            Alamat: Jl. Brigjen Ngurah Rai No. 34 Bangli | Telp. (0366) 91045
          </p>
        </div>

        {/* REPORT TITLE */}
        <div className="text-center mb-6">
          <h2 className="text-base md:text-lg font-extrabold underline uppercase tracking-wide text-slate-900">
            {settings.namaKegiatan || 'LAPORAN REKAPITULASI RAZIA GABUNGAN PENERTIBAN PAJAK KENDARAAN BERMOTOR'}
          </h2>
          <p className="text-xs font-bold text-slate-700 mt-1">
            PERIODE: {getPeriodeText()}
          </p>
        </div>

        {/* MAIN REKAP TABLE FOR OFFICIAL PRINT */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse border border-slate-900 text-xs text-center">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold">
                <th rowSpan={2} className="border border-slate-900 p-2.5 w-10">NO</th>
                <th rowSpan={2} className="border border-slate-900 p-2.5 text-left">URAIAN HASIL PEMERIKSAAN</th>
                <th colSpan={2} className="border border-slate-900 p-1.5">JENIS KENDARAAN</th>
                <th rowSpan={2} className="border border-slate-900 p-2.5 w-32 bg-slate-300">JUMLAH TOTAL</th>
              </tr>
              <tr className="bg-slate-100 text-slate-900 font-bold">
                <th className="border border-slate-900 p-1.5 w-28">R2 (MOTOR)</th>
                <th className="border border-slate-900 p-1.5 w-28">R4 (MOBIL)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-900 p-2 font-bold">1</td>
                <td className="border border-slate-900 p-2 text-left font-semibold">Pajak Hidup</td>
                <td className="border border-slate-900 p-2">{formatNumber(totals.pajakHidupR2)} Unit</td>
                <td className="border border-slate-900 p-2">{formatNumber(totals.pajakHidupR4)} Unit</td>
                <td className="border border-slate-900 p-2 font-bold bg-slate-50">{formatNumber(totals.pajakHidupR2 + totals.pajakHidupR4)} Unit</td>
              </tr>

              <tr>
                <td className="border border-slate-900 p-2 font-bold">2</td>
                <td className="border border-slate-900 p-2 text-left font-semibold">Pajak Mati (Terjaring)</td>
                <td className="border border-slate-900 p-2">{formatNumber(totals.pajakMatiR2)} Unit</td>
                <td className="border border-slate-900 p-2">{formatNumber(totals.pajakMatiR4)} Unit</td>
                <td className="border border-slate-900 p-2 font-bold bg-slate-50">{formatNumber(totals.pajakMatiR2 + totals.pajakMatiR4)} Unit</td>
              </tr>

              <tr>
                <td className="border border-slate-900 p-2 font-bold">3</td>
                <td className="border border-slate-900 p-2 text-left font-semibold">Belum Balik Nama (BBN)</td>
                <td className="border border-slate-900 p-2">{formatNumber(totals.belumBalikR2)} Unit</td>
                <td className="border border-slate-900 p-2">{formatNumber(totals.belumBalikR4)} Unit</td>
                <td className="border border-slate-900 p-2 font-bold bg-slate-50">{formatNumber(totals.belumBalikR2 + totals.belumBalikR4)} Unit</td>
              </tr>

              <tr>
                <td className="border border-slate-900 p-2 font-bold">4</td>
                <td className="border border-slate-900 p-2 text-left font-semibold">Plat Luar Provinsi</td>
                <td className="border border-slate-900 p-2">{formatNumber(totals.luarProvR2)} Unit</td>
                <td className="border border-slate-900 p-2">{formatNumber(totals.luarProvR4)} Unit</td>
                <td className="border border-slate-900 p-2 font-bold bg-slate-50">{formatNumber(totals.luarProvR2 + totals.luarProvR4)} Unit</td>
              </tr>

              <tr className="bg-slate-200 font-extrabold text-slate-950">
                <td colSpan={2} className="border border-slate-900 p-2.5 text-right uppercase">
                  TOTAL KENDARAAN DIPERIKSA:
                </td>
                <td className="border border-slate-900 p-2.5">{formatNumber(totals.totalDiperiksaR2)} Unit</td>
                <td className="border border-slate-900 p-2.5">{formatNumber(totals.totalDiperiksaR4)} Unit</td>
                <td className="border border-slate-900 p-2.5 bg-slate-300 font-black">{formatNumber(totals.grandTotalDiperiksa)} Unit</td>
              </tr>

              {/* REALISASI PENERIMAAN */}
              <tr className="border-t-2 border-slate-900">
                <td className="border border-slate-900 p-2 font-bold">5</td>
                <td className="border border-slate-900 p-2 text-left font-bold">Yang Membayar Di Tempat</td>
                <td colSpan={2} className="border border-slate-900 p-2 text-center font-semibold">
                  {formatNumber(totals.totalUnitBayar)} Unit
                </td>
                <td className="border border-slate-900 p-2 font-bold">{formatRupiah(totals.totalNominalBayar)}</td>
              </tr>

              <tr>
                <td className="border border-slate-900 p-2 font-bold">6</td>
                <td className="border border-slate-900 p-2 text-left font-bold">Realisasi Melalui Kantor Samsat</td>
                <td colSpan={2} className="border border-slate-900 p-2 text-center font-semibold">
                  {formatNumber(totals.totalRealisasiUnit)} Unit
                </td>
                <td className="border border-slate-900 p-2 font-bold">{formatRupiah(totals.totalRealisasiRp)}</td>
              </tr>

              <tr className="bg-slate-900 text-white font-extrabold text-xs">
                <td colSpan={2} className="border border-slate-900 p-3 text-right uppercase">
                  TOTAL PENERIMAAN KESELURUHAN (RP):
                </td>
                <td colSpan={2} className="border border-slate-900 p-3 text-center text-slate-200">
                  {totals.totalUnitBayar + totals.totalRealisasiUnit} Unit Membayar
                </td>
                <td className="border border-slate-900 p-3 bg-slate-800 text-white font-black text-sm">
                  {formatRupiah(totals.grandTotalPenerimaan)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* OPTIONAL DETAILED DAILY TABLE */}
        {showDetailTable && filteredItems.length > 0 && (
          <div className="mb-8 page-break-before">
            <h4 className="text-xs font-bold uppercase underline mb-2">Lampiran: Rincian Data Razia Harian</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-900 text-[10px] text-center">
                <thead>
                  <tr className="bg-slate-200 text-slate-900 font-bold">
                    <th rowSpan={2} className="border border-slate-900 p-1 w-6">NO</th>
                    <th rowSpan={2} className="border border-slate-900 p-1 w-16">TGL</th>
                    <th rowSpan={2} className="border border-slate-900 p-1 w-8">JNS</th>
                    <th rowSpan={2} className="border border-slate-900 p-1 text-left">LOKASI POS RAZIA</th>
                    <th colSpan={4} className="border border-slate-900 p-1">HASIL PEMERIKSAAN (UNIT)</th>
                    <th rowSpan={2} className="border border-slate-900 p-1 font-black bg-slate-300 w-12">TOTAL DIPERIKSA</th>
                    <th colSpan={2} className="border border-slate-900 p-1 bg-emerald-100">BAYAR DI TEMPAT</th>
                    <th colSpan={2} className="border border-slate-900 p-1 bg-sky-100">REALISASI SAMSAT</th>
                    <th colSpan={2} className="border border-slate-900 p-1 bg-slate-300">TOTAL PENERIMAAN</th>
                  </tr>
                  <tr className="bg-slate-100 text-slate-900 font-bold">
                    <th className="border border-slate-900 p-1 w-8">HIDUP</th>
                    <th className="border border-slate-900 p-1 w-8">MATI</th>
                    <th className="border border-slate-900 p-1 w-8">BBN</th>
                    <th className="border border-slate-900 p-1 w-8">LUAR</th>
                    <th className="border border-slate-900 p-1 w-8">UNIT</th>
                    <th className="border border-slate-900 p-1 w-20">NOMINAL (RP)</th>
                    <th className="border border-slate-900 p-1 w-8">UNIT</th>
                    <th className="border border-slate-900 p-1 w-20">NOMINAL (RP)</th>
                    <th className="border border-slate-900 p-1 w-8 bg-slate-200">UNIT</th>
                    <th className="border border-slate-900 p-1 w-24 bg-slate-200">TOTAL BAYAR (RP)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, idx) => {
                    const diperiksa = calculateTotalDiperiksa(item);
                    const totalPenerimaanItem = (item.nominalBayar || 0) + (item.realisasiSamsatRp || 0);
                    const totalUnitItem = (item.yangMembayarUnit || 0) + (item.realisasiSamsatUnit || 0);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="border border-slate-900 p-1 font-semibold">{idx + 1}</td>
                        <td className="border border-slate-900 p-1 whitespace-nowrap">{item.tanggal}</td>
                        <td className="border border-slate-900 p-1 font-bold">{item.jenis}</td>
                        <td className="border border-slate-900 p-1 text-left">{item.lokasi || '-'}</td>
                        <td className="border border-slate-900 p-1">{formatNumber(item.pajakHidup)}</td>
                        <td className="border border-slate-900 p-1 font-bold">{formatNumber(item.pajakMati)}</td>
                        <td className="border border-slate-900 p-1">{formatNumber(item.belumBalikNama)}</td>
                        <td className="border border-slate-900 p-1">{formatNumber(item.luarProvinsi)}</td>
                        <td className="border border-slate-900 p-1 font-black bg-slate-50">{formatNumber(diperiksa)}</td>
                        <td className="border border-slate-900 p-1">{formatNumber(item.yangMembayarUnit)}</td>
                        <td className="border border-slate-900 p-1 font-semibold text-right">{formatRupiah(item.nominalBayar)}</td>
                        <td className="border border-slate-900 p-1">{formatNumber(item.realisasiSamsatUnit)}</td>
                        <td className="border border-slate-900 p-1 font-semibold text-right">{formatRupiah(item.realisasiSamsatRp)}</td>
                        <td className="border border-slate-900 p-1 font-bold bg-slate-50">{formatNumber(totalUnitItem)}</td>
                        <td className="border border-slate-900 p-1 font-black bg-slate-100 text-right">{formatRupiah(totalPenerimaanItem)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-200 text-slate-950 font-extrabold text-[10px]">
                    <td colSpan={4} className="border border-slate-900 p-1.5 text-right uppercase">
                      JUMLAH TOTAL:
                    </td>
                    <td className="border border-slate-900 p-1">{formatNumber(lampiranTotals.totalHidup)}</td>
                    <td className="border border-slate-900 p-1">{formatNumber(lampiranTotals.totalMati)}</td>
                    <td className="border border-slate-900 p-1">{formatNumber(lampiranTotals.totalBBN)}</td>
                    <td className="border border-slate-900 p-1">{formatNumber(lampiranTotals.totalLuar)}</td>
                    <td className="border border-slate-900 p-1 bg-slate-300 font-black">{formatNumber(lampiranTotals.totalDiperiksa)}</td>
                    <td className="border border-slate-900 p-1">{formatNumber(lampiranTotals.totalBayarUnit)}</td>
                    <td className="border border-slate-900 p-1 text-right">{formatRupiah(lampiranTotals.totalBayarRp)}</td>
                    <td className="border border-slate-900 p-1">{formatNumber(lampiranTotals.totalSamsatUnit)}</td>
                    <td className="border border-slate-900 p-1 text-right">{formatRupiah(lampiranTotals.totalSamsatRp)}</td>
                    <td className="border border-slate-900 p-1 bg-slate-300">{formatNumber(lampiranTotals.totalPenerimaanUnit)}</td>
                    <td className="border border-slate-900 p-1 bg-slate-300 font-black text-right">{formatRupiah(lampiranTotals.totalPenerimaanRp)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* NOTES / CATATAN LAPANGAN */}
        <div className="text-xs text-slate-800 mb-8 p-3 border border-slate-300 rounded bg-slate-50/50">
          <p className="font-bold mb-1">Catatan Pelaksanaan Operasi:</p>
          <ol className="list-decimal pl-4 space-y-1 text-[11px]">
            <li>Operasi Razia Gabungan dilaksanakan bersama unsur Kepolisian, Dinas Perhubungan, dan PT. Jasa Raharja.</li>
            <li>Wajib Pajak yang menunggak diberikan pilihan pembayaran langsung di lokasi razia melalui Mobil Samsat Keliling atau surat pernyataan ke kantor Samsat.</li>
            <li>Dokumen ini dicetak otomatis dari Aplikasi Rekapitulasi Razia Gabungan (RAGAB).</li>
          </ol>
        </div>

        {/* SIGNATURE BLOCK */}
        <div className="grid grid-cols-2 gap-8 text-xs font-semibold text-slate-900 pt-4 mt-8 break-inside-avoid">
          {/* Left Signee: Katim Razia */}
          <div className="text-center space-y-1">
            <p>Mengetahui / Penanggung Jawab Tim,</p>
            <p className="font-bold">{settings.jabatanPenanggungJawab || 'Ketua Tim Razia Gabungan'}</p>
            <div className="h-20"></div>
            <p className="font-black underline text-sm uppercase">{settings.penanggungJawab || 'I Wayan Karsa, S.Sos.'}</p>
            <p className="text-[11px] text-slate-700">NIP. {settings.nipPenanggungJawab || '-'}</p>
          </div>

          {/* Right Signee: Kepala UPTD PPRD */}
          <div className="text-center space-y-1">
            <p>{getTodayFormatted()}</p>
            <p className="font-bold">{settings.jabatanKepala || 'Kepala UPTD PPRD Provinsi Bali di Kab. Bangli'}</p>
            <div className="h-20"></div>
            <p className="font-black underline text-sm uppercase">{settings.kepalaInstansi || 'I Made Sudiarta, S.H., M.H.'}</p>
            <p className="text-[11px] text-slate-700">NIP. {settings.nipKepala || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
