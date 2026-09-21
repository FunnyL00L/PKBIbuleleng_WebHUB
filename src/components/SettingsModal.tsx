import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Palette,
  Globe2,
  Sun,
  Moon,
  Check,
  Sparkles,
  Settings,
} from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';
import { AppTheme, AppLanguage } from '../types';

export const SettingsModal: React.FC = () => {
  const { theme, setTheme, language, setLanguage, isSettingsOpen, setIsSettingsOpen } =
    useAppTheme();

  if (!isSettingsOpen) return null;

  const isLight = theme === 'light';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSettingsOpen(false)}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Window: BOTTOM-SHEET di mobile (slide dari bawah), dialog terpusat di desktop */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          className={`relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl z-10 border transition-colors ${
            isLight
              ? 'bg-white text-slate-800 border-blue-200 shadow-blue-500/10'
              : 'bg-[#0a1228] text-white border-blue-900/80 shadow-black/60'
          }`}
        >
          {/* Drag handle (hanya mobile, penanda bottom-sheet) */}
          <div className="sm:hidden flex justify-center pt-0 pb-3 -mx-5">
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                  isLight
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-blue-600/30 text-blue-400 border border-blue-400/40'
                }`}
              >
                <Settings size={18} />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg font-serif">
                  {language === 'en'
                    ? 'Application Settings'
                    : language === 'ban'
                    ? 'Pengaturan Aplikasi'
                    : 'Pengaturan Portal PKBI'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'en'
                    ? 'Customize color theme & language'
                    : language === 'ban'
                    ? 'Nyetel tema warna lan basa'
                    : 'Pilih tema warna dan preferensi bahasa'}
                </p>
              </div>
            </div>

            <button
              id="btn-close-settings-modal"
              onClick={() => setIsSettingsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="py-5 space-y-6">
            {/* Setting 1: Theme Mode */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
                <Palette size={14} />
                <span>
                  {language === 'en'
                    ? 'Color Theme'
                    : language === 'ban'
                    ? 'Tema Warna'
                    : 'Tema Warna Tampilan'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Light Theme: Biru Putih Dominan Putih */}
                <button
                  id="btn-theme-light"
                  onClick={() => setTheme('light')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer relative flex flex-col gap-2 ${
                    isLight
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/30 text-slate-900 shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                      <Sun size={15} />
                    </div>
                    {isLight && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm">Biru & Putih</div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                      Dominan Putih (Default)
                    </div>
                  </div>
                </button>

                {/* Dark Theme: Mode Hitam Elegan */}
                <button
                  id="btn-theme-dark"
                  onClick={() => setTheme('dark')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer relative flex flex-col gap-2 ${
                    !isLight
                      ? 'border-blue-500 bg-blue-950/70 ring-2 ring-blue-400/40 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-7 h-7 rounded-xl bg-slate-900 text-cyan-300 flex items-center justify-center border border-slate-700">
                      <Moon size={15} />
                    </div>
                    {!isLight && (
                      <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm">Mode Hitam</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Gelap Elegan (Awal)
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Setting 2: Language Preference */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
                <Globe2 size={14} />
                <span>
                  {language === 'en'
                    ? 'Language'
                    : language === 'ban'
                    ? 'Basa Panuntun'
                    : 'Pilihan Bahasa'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'id', name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
                  { id: 'en', name: 'English', code: 'EN', flag: '🇬🇧' },
                  { id: 'ban', name: 'Basa Bali', code: 'BAN', flag: '🏝️' },
                ].map((l) => {
                  const isSelected = language === l.id;
                  return (
                    <button
                      key={l.id}
                      id={`btn-lang-${l.id}`}
                      onClick={() => setLanguage(l.id as AppLanguage)}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected
                          ? isLight
                            ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                            : 'border-blue-500 bg-blue-950/80 text-white ring-2 ring-blue-400/30 font-bold'
                          : isLight
                          ? 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xl">{l.flag}</span>
                      <span className="text-xs">{l.name}</span>
                      {isSelected && (
                        <span className="text-[9px] font-bold text-blue-600 dark:text-cyan-400">
                          Aktif
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Setting 3: Central Database & Export Shortcut */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Basis Data Terpadu (1 File JSON)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
                  ● Aktif (DataService)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                Seluruh chat, formulir, dan berkas file pengguna tersimpan dalam 1 file master JSON siap pakai untuk database backend Anda.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const json = localStorage.getItem('buleleng_master_database_v1') || '{}';
                    navigator.clipboard.writeText(json);
                    alert('Data JSON Master Database berhasil disalin ke clipboard!');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                >
                  <span>Salin JSON Data</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const json = localStorage.getItem('buleleng_master_database_v1') || '{}';
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `pkbi_database_${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Unduh .json</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer of modal */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Pengaturan tersimpan otomatis di browser
            </span>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer shadow-md"
            >
              Selesai
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
