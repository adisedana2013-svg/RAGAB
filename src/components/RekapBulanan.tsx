import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Coins,
  TrendingUp,
  Car,
  Bike,
  Printer,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { RaziaItem } from '../types';
import {
  calculateTotalDiperiksa,
  formatNumber,
  formatRupiah,
  NAMA_BULAN,
} from '../utils/formatters';

interface RekapBulananProps {
  dataItems: RaziaItem[];
  onGoToCetakWithFilter: (month: string, year: string) => void;
}

export const RekapBulanan: React.FC<RekapBulananProps> = ({
  dataItems,
  onGoToCetakWithFilter,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('05'); // Default May (Mei)
  const [selectedYear, setSelectedYear] = useState<string>('2026');

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

  // Filter items for chosen month & year
  const monthlyItems = useMemo(() => {
    return dataItems.filter((item) => {
      if (!item.tanggal) return false;
      const [y, m] = item.tanggal.split('-');
      if (selectedYear !== 'all' && y !== selectedYear) return false;
      if (selectedMonth !== 'all' && m !== selectedMonth) return false;
      return true;
    });
  }, [dataItems, selectedMonth, selectedYear]);

  // Calculations
  const stats = useMemo(() => {
    let countData = monthlyItems.length;
    let totalPajakHidupR2 = 0, totalPajakHidupR4 = 0;
    let totalPajakMatiR2 = 0, totalPajakMatiR4 = 0;
    let totalBelumBalikR2 = 0, totalBelumBalikR4 = 0;
    let totalLuarProvR2 = 0, totalLuarProvR4 = 0;
    let totalDiperiksaR2 = 0, totalDiperiksaR4 = 0;
    let totalBayarUnit = 0, totalBayarRp = 0;
    let totalSamsatUnit = 0, totalSamsatRp = 0;

    monthlyItems.forEach((item) => {
      const diperiksa = calculateTotalDiperiksa(item);
      if (item.jenis === 'R2') {
        totalPajakHidupR2 += item.pajakHidup || 0;
        totalPajakMatiR2 += item.pajakMati || 0;
        totalBelumBalikR2 += item.belumBalikNama || 0;
        totalLuarProvR2 += item.luarProvinsi || 0;
        totalDiperiksaR2 += diperiksa;
      } else {
        totalPajakHidupR4 += item.pajakHidup || 0;
        totalPajakMatiR4 += item.pajakMati || 0;
        totalBelumBalikR4 += item.belumBalikNama || 0;
        totalLuarProvR4 += item.luarProvinsi || 0;
        totalDiperiksaR4 += diperiksa;
      }
      totalBayarUnit += item.yangMembayarUnit || 0;
      totalBayarRp += item.nominalBayar || 0;
      totalSamsatUnit += item.realisasiSamsatUnit || 0;
      totalSamsatRp += item.realisasiSamsatRp || 0;
    });

    const totalSemuaHidup = totalPajakHidupR2 + totalPajakHidupR4;
    const totalSemuaMati = totalPajakMatiR2 + totalPajakMatiR4;
    const totalSemuaBlmBalik = totalBelumBalikR2 + totalBelumBalikR4;
    const totalSemuaLuarProv = totalLuarProvR2 + totalLuarProvR4;
    const grandTotalDiperiksa = totalDiperiksaR2 + totalDiperiksaR4;
    const totalSemuaPenerimaan = totalBayarRp + totalSamsatRp;
    const totalUnitBayarGabungan = totalBayarUnit + totalSamsatUnit;

    const complianceRate = grandTotalDiperiksa > 0
      ? ((totalSemuaHidup / grandTotalDiperiksa) * 100).toFixed(1)
      : '0';

    const avgPenerimaanPerUnit = totalBayarUnit > 0
      ? Math.round(totalBayarRp / totalBayarUnit)
      : 0;

    return {
      countData,
      totalPajakHidupR2,
      totalPajakHidupR4,
      totalPajakMatiR2,
      totalPajakMatiR4,
      totalBelumBalikR2,
      totalBelumBalikR4,
      totalLuarProvR2,
      totalLuarProvR4,
      totalDiperiksaR2,
      totalDiperiksaR4,
      totalBayarUnit,
      totalBayarRp,
      totalSamsatUnit,
      totalSamsatRp,
      totalSemuaHidup,
      totalSemuaMati,
      totalSemuaBlmBalik,
      totalSemuaLuarProv,
      grandTotalDiperiksa,
      totalSemuaPenerimaan,
      totalUnitBayarGabungan,
      complianceRate,
      avgPenerimaanPerUnit,
    };
  }, [monthlyItems]);

  // Data for Charts
  const chartR2R4Data = [
    {
      name: 'R2 (Motor)',
      Diperiksa: stats.totalDiperiksaR2,
      'Pajak Hidup': stats.totalPajakHidupR2,
      'Pajak Mati': stats.totalPajakMatiR2,
      'Bayar Rp (Juta)': Number((stats.totalBayarRp / 1000000).toFixed(2)),
    },
    {
      name: 'R4 (Mobil)',
      Diperiksa: stats.totalDiperiksaR4,
      'Pajak Hidup': stats.totalPajakHidupR4,
      'Pajak Mati': stats.totalPajakMatiR4,
      'Bayar Rp (Juta)': Number((stats.totalBayarRp / 1000000).toFixed(2)),
    },
  ];

  const pieTaxBreakdownData = [
    { name: 'Pajak Hidup', value: stats.totalSemuaHidup, color: '#10b981' },
    { name: 'Pajak Mati', value: stats.totalSemuaMati, color: '#f43f5e' },
    { name: 'Belum Balik Nama', value: stats.totalSemuaBlmBalik, color: '#f59e0b' },
    { name: 'Luar Provinsi', value: stats.totalSemuaLuarProv, color: '#8b5cf6' },
  ].filter((d) => d.value > 0);

  const getMonthLabel = () => {
    if (selectedMonth === 'all') return 'Seluruh Bulan';
    const monthNum = parseInt(selectedMonth, 10);
    return NAMA_BULAN[monthNum - 1] || 'Bulan';
  };

  return (
    <div className="space-y-6 no-print">
      {/* Filter Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              Rekapitulasi Bulanan Razia Gabungan
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Laporan agregasi kegiatan razia periode:{' '}
            <strong className="text-blue-700 font-bold">
              {getMonthLabel()} {selectedYear}
            </strong>
          </p>
        </div>

        {/* Month / Year Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
            <Calendar className="w-4 h-4 text-blue-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold text-xs text-slate-800 focus:outline-none"
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
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
            <span className="text-xs font-bold text-slate-500">Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent font-bold text-xs text-slate-800 focus:outline-none"
            >
              <option value="all">Semua Tahun</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onGoToCetakWithFilter(selectedMonth, selectedYear)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap Ini</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Diperiksa */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Diperiksa
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatNumber(stats.grandTotalDiperiksa)} <span className="text-xs font-semibold text-slate-500">Unit</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>
              R2: <strong>{formatNumber(stats.totalDiperiksaR2)}</strong>
            </span>
            <span>
              R4: <strong>{formatNumber(stats.totalDiperiksaR4)}</strong>
            </span>
          </div>
        </div>

        {/* Pajak Hidup / Kepatuhan */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tingkat Kepatuhan
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {stats.complianceRate}%
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {formatNumber(stats.totalSemuaHidup)} dari {formatNumber(stats.grandTotalDiperiksa)} kendaraan pajak hidup
          </p>
        </div>

        {/* Pajak Mati / Pelanggaran */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pajak Mati (Terjaring)
            </span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">
            {formatNumber(stats.totalSemuaMati)} <span className="text-xs font-semibold text-slate-500">Unit</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {formatNumber(stats.totalSemuaBlmBalik)} BBN & {formatNumber(stats.totalSemuaLuarProv)} Luar Provinsi
          </p>
        </div>

        {/* Total Penerimaan Rp */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Total Realisasi Penerimaan
            </span>
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-emerald-400">
            {formatRupiah(stats.totalSemuaPenerimaan)}
          </div>
          <p className="mt-2 text-[11px] text-slate-300">
            Bayar Tempat: {formatRupiah(stats.totalBayarRp)} ({stats.totalBayarUnit} unit)
          </p>
        </div>
      </div>

      {/* Main Comparative Table Matrix */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-5 bg-blue-600 rounded-full"></span>
          Tabel Rekapitulasi R2 & R4 ({getMonthLabel()} {selectedYear})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-center">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="p-3 border border-slate-700 text-left">KATEGORI PEMERIKSAAN</th>
                <th className="p-3 border border-slate-700 bg-blue-900/80 w-28">R2 (MOTOR)</th>
                <th className="p-3 border border-slate-700 bg-indigo-900/80 w-28">R4 (MOBIL)</th>
                <th className="p-3 border border-slate-700 bg-slate-800 w-32">TOTAL GABUNGAN</th>
                <th className="p-3 border border-slate-700 text-left">PERSENTASE / KETERANGAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2.5 border border-slate-200 font-bold text-left text-emerald-800 bg-emerald-50/30">
                  1. Pajak Hidup
                </td>
                <td className="p-2.5 border border-slate-200 font-bold text-emerald-700">
                  {formatNumber(stats.totalPajakHidupR2)}
                </td>
                <td className="p-2.5 border border-slate-200 font-bold text-emerald-700">
                  {formatNumber(stats.totalPajakHidupR4)}
                </td>
                <td className="p-2.5 border border-slate-200 font-extrabold text-emerald-900 bg-emerald-100/50">
                  {formatNumber(stats.totalSemuaHidup)}
                </td>
                <td className="p-2.5 border border-slate-200 text-left text-slate-600">
                  {stats.grandTotalDiperiksa > 0
                    ? `${((stats.totalSemuaHidup / stats.grandTotalDiperiksa) * 100).toFixed(1)}% dari total diperiksa`
                    : '0%'}
                </td>
              </tr>

              <tr>
                <td className="p-2.5 border border-slate-200 font-bold text-left text-rose-800 bg-rose-50/30">
                  2. Pajak Mati
                </td>
                <td className="p-2.5 border border-slate-200 font-bold text-rose-700">
                  {formatNumber(stats.totalPajakMatiR2)}
                </td>
                <td className="p-2.5 border border-slate-200 font-bold text-rose-700">
                  {formatNumber(stats.totalPajakMatiR4)}
                </td>
                <td className="p-2.5 border border-slate-200 font-extrabold text-rose-900 bg-rose-100/50">
                  {formatNumber(stats.totalSemuaMati)}
                </td>
                <td className="p-2.5 border border-slate-200 text-left text-slate-600">
                  {stats.grandTotalDiperiksa > 0
                    ? `${((stats.totalSemuaMati / stats.grandTotalDiperiksa) * 100).toFixed(1)}% terjaring razia`
                    : '0%'}
                </td>
              </tr>

              <tr>
                <td className="p-2.5 border border-slate-200 font-bold text-left text-amber-800 bg-amber-50/30">
                  3. Belum Balik Nama
                </td>
                <td className="p-2.5 border border-slate-200 font-semibold text-amber-800">
                  {formatNumber(stats.totalBelumBalikR2)}
                </td>
                <td className="p-2.5 border border-slate-200 font-semibold text-amber-800">
                  {formatNumber(stats.totalBelumBalikR4)}
                </td>
                <td className="p-2.5 border border-slate-200 font-bold text-amber-900 bg-amber-100/50">
                  {formatNumber(stats.totalSemuaBlmBalik)}
                </td>
                <td className="p-2.5 border border-slate-200 text-left text-slate-600">
                  Himbauan BBNKB secara berkala
                </td>
              </tr>

              <tr>
                <td className="p-2.5 border border-slate-200 font-bold text-left text-purple-800 bg-purple-50/30">
                  4. Luar Provinsi
                </td>
                <td className="p-2.5 border border-slate-200 font-semibold text-purple-800">
                  {formatNumber(stats.totalLuarProvR2)}
                </td>
                <td className="p-2.5 border border-slate-200 font-semibold text-purple-800">
                  {formatNumber(stats.totalLuarProvR4)}
                </td>
                <td className="p-2.5 border border-slate-200 font-bold text-purple-900 bg-purple-100/50">
                  {formatNumber(stats.totalSemuaLuarProv)}
                </td>
                <td className="p-2.5 border border-slate-200 text-left text-slate-600">
                  Kendaraan plat luar daerah
                </td>
              </tr>

              <tr className="bg-blue-50/60 font-black text-blue-950">
                <td className="p-2.5 border border-slate-200 text-left">
                  TOTAL KENDARAAN DIPERIKSA
                </td>
                <td className="p-2.5 border border-slate-200">{formatNumber(stats.totalDiperiksaR2)}</td>
                <td className="p-2.5 border border-slate-200">{formatNumber(stats.totalDiperiksaR4)}</td>
                <td className="p-2.5 border border-slate-200 bg-blue-200/60 font-extrabold text-sm">
                  {formatNumber(stats.grandTotalDiperiksa)} Unit
                </td>
                <td className="p-2.5 border border-slate-200 text-left text-slate-700">
                  Akumulasi total unit yang diperiksa
                </td>
              </tr>

              {/* Penerimaan */}
              <tr className="bg-emerald-50/40">
                <td className="p-2.5 border border-slate-200 font-bold text-left text-emerald-900">
                  5. Pembayaran Di Tempat (Unit / Rp)
                </td>
                <td colSpan={2} className="p-2.5 border border-slate-200 font-bold text-emerald-800">
                  {formatNumber(stats.totalBayarUnit)} Unit
                </td>
                <td className="p-2.5 border border-slate-200 font-black text-emerald-900 bg-emerald-100/80">
                  {formatRupiah(stats.totalBayarRp)}
                </td>
                <td className="p-2.5 border border-slate-200 text-left text-slate-600">
                  Pembayaran langsung saat razia
                </td>
              </tr>

              <tr className="bg-sky-50/40">
                <td className="p-2.5 border border-slate-200 font-bold text-left text-sky-900">
                  6. Realisasi via Kantor Samsat (Unit / Rp)
                </td>
                <td colSpan={2} className="p-2.5 border border-slate-200 font-bold text-sky-800">
                  {formatNumber(stats.totalSamsatUnit)} Unit
                </td>
                <td className="p-2.5 border border-slate-200 font-black text-sky-900 bg-sky-100/80">
                  {formatRupiah(stats.totalSamsatRp)}
                </td>
                <td className="p-2.5 border border-slate-200 text-left text-slate-600">
                  Pembayaran susulan di kantor Samsat
                </td>
              </tr>

              <tr className="bg-slate-900 text-white font-black text-sm">
                <td className="p-3 border border-slate-700 text-left">
                  TOTAL PENERIMAAN KESELURUHAN (RP)
                </td>
                <td colSpan={2} className="p-3 border border-slate-700 text-slate-200 font-semibold text-xs">
                  {stats.totalUnitBayarGabungan} Total Unit Membayar
                </td>
                <td className="p-3 border border-slate-700 bg-emerald-600 text-white text-base">
                  {formatRupiah(stats.totalSemuaPenerimaan)}
                </td>
                <td className="p-3 border border-slate-700 text-left text-slate-300 font-normal text-xs">
                  Bayar Tempat + Realisasi Samsat
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: R2 vs R4 Bar Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Grafik Perbandingan R2 vs R4</span>
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartR2R4Data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    if (name === 'Bayar Rp (Juta)') return [`Rp ${value} Juta`, name];
                    return [`${value} Unit`, name];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="Diperiksa" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="left" dataKey="Pajak Hidup" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="left" dataKey="Pajak Mati" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Tax Status Breakdown Pie Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-indigo-600" />
            <span>Proporsi Status Pajak Kendaraan</span>
          </h4>
          {pieTaxBreakdownData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs font-medium">
              Tidak ada data statistik untuk periode ini.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieTaxBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                    }
                  >
                    {pieTaxBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val} Unit`, 'Jumlah']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
