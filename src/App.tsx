import React, { useState, useEffect } from 'react';
import { AppSettings, RaziaItem } from './types';
import {
  loadDataFromStorage,
  saveDataToStorage,
  loadSettingsFromStorage,
  saveSettingsToStorage,
  SAMPLE_DATA,
  exportBackupJSON,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { FormKegiatan } from './components/FormKegiatan';
import { TableKegiatan } from './components/TableKegiatan';
import { RekapBulanan } from './components/RekapBulanan';
import { CetakView } from './components/CetakView';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { PengaturanModal } from './components/PengaturanModal';

export default function App() {
  const [dataItems, setDataItems] = useState<RaziaItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(loadSettingsFromStorage());
  const [activeTab, setActiveTab] = useState<'kegiatan' | 'rekap' | 'cetak' | 'backup' | 'pengaturan'>('kegiatan');
  const [editingItem, setEditingItem] = useState<RaziaItem | null>(null);

  // Filters for printing when jumped from Rekap Bulanan
  const [printMonthFilter, setPrintMonthFilter] = useState<string>('all');
  const [printYearFilter, setPrintYearFilter] = useState<string>('2026');

  // Load initial data
  useEffect(() => {
    const items = loadDataFromStorage();
    setDataItems(items);
    setSettings(loadSettingsFromStorage());
  }, []);

  // Sync data to LocalStorage whenever dataItems change
  const handleUpdateDataItems = (newItems: RaziaItem[]) => {
    setDataItems(newItems);
    saveDataToStorage(newItems);
  };

  // Sync settings to LocalStorage
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettingsToStorage(newSettings);
  };

  // Form Save handler
  const handleSaveItem = (itemData: Omit<RaziaItem, 'id'>, id?: string) => {
    if (id) {
      // Edit existing
      const updated = dataItems.map((item) =>
        item.id === id ? { ...item, ...itemData } : item
      );
      handleUpdateDataItems(updated);
      setEditingItem(null);
    } else {
      // Create new
      const newRecord: RaziaItem = {
        ...itemData,
        id: 'ragab-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      const updated = [newRecord, ...dataItems];
      handleUpdateDataItems(updated);
    }
  };

  // Delete Item handler
  const handleDeleteItem = (id: string) => {
    const updated = dataItems.filter((item) => item.id !== id);
    handleUpdateDataItems(updated);
    if (editingItem?.id === id) {
      setEditingItem(null);
    }
  };

  // Start Edit
  const handleEditItem = (item: RaziaItem) => {
    setEditingItem(item);
    setActiveTab('kegiatan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump from Rekap Bulanan directly to Cetak Laporan
  const handleGoToCetakWithFilter = (month: string, year: string) => {
    setPrintMonthFilter(month);
    setPrintYearFilter(year);
    setActiveTab('cetak');
  };

  // Restore JSON handler
  const handleRestoreData = (
    restoredItems: RaziaItem[],
    restoredSettings?: AppSettings,
    mode: 'replace' | 'merge' = 'replace'
  ) => {
    if (mode === 'replace') {
      handleUpdateDataItems(restoredItems);
      if (restoredSettings) {
        handleUpdateSettings(restoredSettings);
      }
    } else {
      // Merge: Avoid duplicating identical IDs
      const existingMap = new Map<string, RaziaItem>();
      dataItems.forEach((item) => existingMap.set(item.id, item));
      restoredItems.forEach((item) => existingMap.set(item.id, item));
      const mergedList = Array.from(existingMap.values());
      handleUpdateDataItems(mergedList);
    }
  };

  // Reset to Demo Data
  const handleResetToDemo = () => {
    handleUpdateDataItems(SAMPLE_DATA);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans p-3 sm:p-5 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'kegiatan') setEditingItem(null);
          }}
          settings={settings}
          totalRecords={dataItems.length}
          onExportBackup={() => exportBackupJSON(dataItems, settings)}
          onQuickPrint={() => {
            setActiveTab('cetak');
          }}
        />

        {/* Tab 1: Input & Data Kegiatan */}
        {activeTab === 'kegiatan' && (
          <main className="space-y-6">
            <FormKegiatan
              onSaveItem={handleSaveItem}
              editingItem={editingItem}
              onCancelEdit={() => setEditingItem(null)}
              defaultLokasi={settings.lokasiDefisit}
            />

            <TableKegiatan
              dataItems={dataItems}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onNavigateToRekap={() => setActiveTab('rekap')}
            />
          </main>
        )}

        {/* Tab 2: Isi Rekap Bulanan */}
        {activeTab === 'rekap' && (
          <main>
            <RekapBulanan
              dataItems={dataItems}
              onGoToCetakWithFilter={handleGoToCetakWithFilter}
            />
          </main>
        )}

        {/* Tab 3: Cetak Format Resmi */}
        {activeTab === 'cetak' && (
          <main>
            <CetakView
              dataItems={dataItems}
              settings={settings}
              defaultMonth={printMonthFilter}
              defaultYear={printYearFilter}
            />
          </main>
        )}

        {/* Tab 4: Backup & Restore JSON */}
        {activeTab === 'backup' && (
          <main>
            <BackupRestoreModal
              dataItems={dataItems}
              settings={settings}
              onRestoreData={handleRestoreData}
              onResetToDemo={handleResetToDemo}
            />
          </main>
        )}

        {/* Tab 5: Pengaturan Kop & Pejabat */}
        {activeTab === 'pengaturan' && (
          <main>
            <PengaturanModal
              settings={settings}
              onSaveSettings={handleUpdateSettings}
            />
          </main>
        )}

        {/* Footer info */}
        <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 no-print">
          <p className="font-semibold text-slate-600">
            RAGAB - Aplikasi Rekapitulasi Kegiatan Razia Gabungan
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            UPTD Pelayanan Pajak dan Retribusi Daerah (PPRD) | Tersimpan secara lokal & Mendukung Backup/Restore JSON
          </p>
        </footer>
      </div>
    </div>
  );
}
