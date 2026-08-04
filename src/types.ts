export type JenisKendaraan = 'R2' | 'R4';

export interface RaziaItem {
  id: string;
  tanggal: string; // YYYY-MM-DD
  jenis: JenisKendaraan;
  lokasi?: string;
  pajakHidup: number;
  pajakMati: number;
  belumBalikNama: number;
  luarProvinsi: number;
  yangMembayarUnit: number;
  nominalBayar: number; // Rp
  realisasiSamsatUnit: number;
  realisasiSamsatRp: number; // Rp
  keterangan?: string;
  createdAt?: string;
}

export interface AppSettings {
  namaInstansi: string;
  subTitle: string;
  namaKegiatan: string;
  kepalaInstansi: string;
  jabatanKepala: string;
  nipKepala: string;
  penanggungJawab: string;
  jabatanPenanggungJawab: string;
  nipPenanggungJawab: string;
  lokasiDefisit?: string;
  kotaTerbit: string;
}

export interface MonthlyTotals {
  pajakHidupR2: number;
  pajakHidupR4: number;
  pajakMatiR2: number;
  pajakMatiR4: number;
  belumBalikR2: number;
  belumBalikR4: number;
  luarProvinsiR2: number;
  luarProvinsiR4: number;
  totalDiperiksaR2: number;
  totalDiperiksaR4: number;
  totalUnitBayar: number;
  totalNominalBayar: number;
  totalRealisasiUnit: number;
  totalRealisasiRp: number;
  totalSemuaDiperiksa: number;
  totalSemuaPenerimaanRp: number;
}

export interface BackupDataFormat {
  version: string;
  exportedAt: string;
  appName: string;
  dataItems: RaziaItem[];
  settings: AppSettings;
}
