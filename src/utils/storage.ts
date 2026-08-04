import { AppSettings, BackupDataFormat, RaziaItem } from '../types';

export const STORAGE_KEY_DATA = 'ragab_data_v2';
export const STORAGE_KEY_SETTINGS = 'ragab_settings_v2';

export const DEFAULT_SETTINGS: AppSettings = {
  namaInstansi: 'PEMERINTAH PROVINSI BALI',
  subTitle: 'BADAN PENGELOLAAN KEUANGAN DAN PENDAPATAN DAERAH\nUPTD PELAYANAN PAJAK DAN RETRIBUSI DAERAH (PPRD) DI KABUPATEN BANGLI',
  namaKegiatan: 'LAPORAN REKAPITULASI KEGIATAN RAZIA GABUNGAN PENERTIBAN PAJAK KENDARAAN BERMOTOR',
  kepalaInstansi: 'I Made Sudiarta, S.H., M.H.',
  jabatanKepala: 'Kepala UPTD PPRD Provinsi Bali di Kab. Bangli',
  nipKepala: '19750812 199803 1 004',
  penanggungJawab: 'I Wayan Karsa, S.Sos.',
  jabatanPenanggungJawab: 'Ketua Tim Razia Gabungan',
  nipPenanggungJawab: '19800415 200501 1 008',
  lokasiDefisit: 'Kabupaten Bangli',
  kotaTerbit: 'Bangli',
};

export const SAMPLE_DATA: RaziaItem[] = [
  {
    id: 'ragab-101',
    tanggal: '2026-05-12',
    jenis: 'R2',
    lokasi: 'Pos Razia Simpang Alun-Alun Bangli',
    pajakHidup: 250,
    pajakMati: 9,
    belumBalikNama: 0,
    luarProvinsi: 0,
    yangMembayarUnit: 5,
    nominalBayar: 2250000,
    realisasiSamsatUnit: 4,
    realisasiSamsatRp: 1800000,
    keterangan: 'Operasi Gabungan bersama Satlantas & Jasa Raharja',
    createdAt: '2026-05-12T08:30:00Z',
  },
  {
    id: 'ragab-102',
    tanggal: '2026-05-12',
    jenis: 'R4',
    lokasi: 'Pos Razia Simpang Alun-Alun Bangli',
    pajakHidup: 30,
    pajakMati: 2,
    belumBalikNama: 1,
    luarProvinsi: 0,
    yangMembayarUnit: 1,
    nominalBayar: 1100000,
    realisasiSamsatUnit: 1,
    realisasiSamsatRp: 1100000,
    keterangan: 'Pemeriksaan rutin kendaraan roda empat',
    createdAt: '2026-05-12T09:15:00Z',
  },
  {
    id: 'ragab-103',
    tanggal: '2026-05-20',
    jenis: 'R2',
    lokasi: 'Jalan Raya Kintamani - Kayuambua',
    pajakHidup: 180,
    pajakMati: 14,
    belumBalikNama: 3,
    luarProvinsi: 2,
    yangMembayarUnit: 8,
    nominalBayar: 3600000,
    realisasiSamsatUnit: 6,
    realisasiSamsatRp: 2900000,
    keterangan: 'Penertiban pajak kendaraan bermotor R2',
    createdAt: '2026-05-20T08:00:00Z',
  },
  {
    id: 'ragab-104',
    tanggal: '2026-05-20',
    jenis: 'R4',
    lokasi: 'Jalan Raya Kintamani - Kayuambua',
    pajakHidup: 45,
    pajakMati: 5,
    belumBalikNama: 2,
    luarProvinsi: 1,
    yangMembayarUnit: 3,
    nominalBayar: 3750000,
    realisasiSamsatUnit: 2,
    realisasiSamsatRp: 2500000,
    keterangan: 'Pemeriksaan kendaraan angkutan & pribadi',
    createdAt: '2026-05-20T09:30:00Z',
  },
  {
    id: 'ragab-105',
    tanggal: '2026-08-03',
    jenis: 'R2',
    lokasi: 'Depan Terminal Loka Crana Bangli',
    pajakHidup: 210,
    pajakMati: 12,
    belumBalikNama: 4,
    luarProvinsi: 1,
    yangMembayarUnit: 7,
    nominalBayar: 3150000,
    realisasiSamsatUnit: 5,
    realisasiSamsatRp: 2250000,
    keterangan: 'Razia Gabungan Awal Agustus',
    createdAt: '2026-08-03T08:15:00Z',
  },
  {
    id: 'ragab-106',
    tanggal: '2026-08-03',
    jenis: 'R4',
    lokasi: 'Depan Terminal Loka Crana Bangli',
    pajakHidup: 52,
    pajakMati: 4,
    belumBalikNama: 2,
    luarProvinsi: 3,
    yangMembayarUnit: 2,
    nominalBayar: 2800000,
    realisasiSamsatUnit: 2,
    realisasiSamsatRp: 2800000,
    keterangan: 'Pemeriksaan R4 Agustus',
    createdAt: '2026-08-03T09:45:00Z',
  },
];

export function loadDataFromStorage(): RaziaItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DATA);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(SAMPLE_DATA));
      return SAMPLE_DATA;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading data from localStorage:', err);
    return SAMPLE_DATA;
  }
}

export function saveDataToStorage(items: RaziaItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving data to localStorage:', err);
  }
}

export function loadSettingsFromStorage(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error loading settings from localStorage:', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettingsToStorage(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings to localStorage:', err);
  }
}

export function exportBackupJSON(dataItems: RaziaItem[], settings: AppSettings): void {
  const backupObj: BackupDataFormat = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    appName: 'RAGAB - Razia Gabungan App',
    dataItems,
    settings,
  };

  const jsonString = JSON.stringify(backupObj, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const link = document.createElement('a');
  link.href = url;
  link.download = `BACKUP_RAGAB_${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function validateBackupJSON(parsed: any): { valid: boolean; error?: string } {
  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, error: 'Format JSON tidak valid atau berkas kosong.' };
  }
  if (!Array.isArray(parsed.dataItems)) {
    return { valid: false, error: 'Berkas JSON tidak memiliki array dataItems yang valid.' };
  }
  return { valid: true };
}
