export const formatRupiah = (num: number): string => {
  if (!num || isNaN(num) || num === 0) return 'Rp 0';
  return 'Rp ' + num.toLocaleString('id-ID');
};

export const formatNumber = (num: number): string => {
  if (!num || isNaN(num)) return '0';
  return num.toLocaleString('id-ID');
};

export const NAMA_BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const formatTanggalIndo = (dateStr: string): string => {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  
  if (monthIdx >= 0 && monthIdx < 12) {
    return `${day} ${NAMA_BULAN[monthIdx]} ${year}`;
  }
  return dateStr;
};

export const getMonthName = (monthNum: number): string => {
  if (monthNum >= 1 && monthNum <= 12) {
    return NAMA_BULAN[monthNum - 1];
  }
  return '';
};

export const calculateTotalDiperiksa = (item: {
  pajakHidup: number;
  pajakMati: number;
  belumBalikNama: number;
  luarProvinsi: number;
}): number => {
  return (
    (item.pajakHidup || 0) +
    (item.pajakMati || 0) +
    (item.belumBalikNama || 0) +
    (item.luarProvinsi || 0)
  );
};
