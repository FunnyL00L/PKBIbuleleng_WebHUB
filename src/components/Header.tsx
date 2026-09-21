import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { BulelengLogo } from './BulelengLogo';
import { ContentCategory } from '../types';
import { useAppTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeCategory: ContentCategory;
  onBackToMainMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onBackToMainMenu,
}) => {
  const { theme, toggleSettings, language } = useAppTheme();
  const isLight = theme === 'light';

  const getCategoryMeta = () => {
    switch (activeCategory) {
      case 'map':
        return {
          title: language === 'en' ? 'Map of 9 Districts of Buleleng' : 'Peta Wilayah 9 Kecamatan Kabupaten Buleleng',
          shortTitle: language === 'en' ? 'Peta 9 Kecamatan' : 'Peta 9 Kecamatan',
          badge: '',
        };
      case 'desa-binaan':
        return {
          title: language === 'en' ? 'Foster Village Sari Mekar & Stunting Progress' : 'Desa Binaan Sari Mekar: Top 7 Kegiatan & Evaluasi Stunting',
          shortTitle: language === 'en' ? 'Desa Sari Mekar' : 'Desa Sari Mekar',
          badge: 'Desa Binaan PKBI',
        };
      case 'pendaftaran-qa':
        return {
          title: language === 'en' ? 'Confidential Chat BOT (Guest Mode) & Registration Forms' : 'Laman Chat BOT Rahasia (User Guest) & Formulir Pendaftaran',
          shortTitle: language === 'en' ? 'Chat BOT & Pendaftaran' : 'Chat BOT & Pendaftaran',
          badge: 'Chat BOT & Pendaftaran Catin',
        };
      case 'edukasi-interaktif':
        return {
          title: language === 'en' ? 'STI Education, Ask Healthcare Workers & Reproductive Health' : 'Pusat Edukasi IMS, Tanya Nakes & Kesehatan Reproduksi',
          shortTitle: language === 'en' ? 'Edukasi IMS' : 'Edukasi IMS',
          badge: 'Edukasi Klinis & Tanya Nakes',
        };
    }
  };

  const meta = getCategoryMeta();

  return (
    <header
      className={`sticky top-0 z-40 transition-colors shadow-sm ${
        isLight
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800'
          : 'bg-[#070e22]/95 backdrop-blur-md border-b border-blue-900/60 text-white shadow-xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20">
          {/* Back Button to Main Menu - Kompak di mobile (ikon + label pendek) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              id="btn-back-to-main-menu"
              onClick={onBackToMainMenu}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer group shrink-0 ${
                isLight
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  : 'bg-blue-900/60 hover:bg-blue-800 border border-blue-500/50 text-white shadow-md'
              }`}
              title="Kembali ke Menu Utama (Pilih Program)"
              aria-label="Kembali ke Menu Utama"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Kembali</span>
            </button>

            {/* Judul halaman aktif: truncate agar tidak menabrak logo di layar sempit */}
            <h1
              className={`min-w-0 truncate text-xs sm:text-sm font-bold font-serif ${
                isLight ? 'text-slate-700' : 'text-slate-200'
              }`}
              title={meta.title}
            >
              <span className="sm:hidden">{meta.shortTitle}</span>
              <span className="hidden sm:inline">{meta.title}</span>
            </h1>
          </div>

          {/* Active Section Branding & PKBI Logo Trigger for Settings */}
          <div className="flex items-center gap-2 sm:gap-3 text-right shrink-0">
            <div className="hidden md:block">
              <div className="flex items-center justify-end gap-2">
                {meta.badge ? (
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                      isLight
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                    }`}
                  >
                    {meta.badge}
                  </span>
                ) : null}
                <span
                  className={`text-sm font-bold font-serif ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  PKBI Kabupaten Buleleng
                </span>
              </div>
              <p
                className={`text-[11px] ${
                  isLight ? 'text-blue-600' : 'text-blue-300'
                }`}
              >
                Perkumpulan Keluarga Berencana Indonesia
              </p>
            </div>

            {/* Clickable PKBI Logo opens Settings Modal */}
            <button
              id="btn-pkbi-logo-settings"
              onClick={toggleSettings}
              className="relative group p-1 rounded-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer focus:outline-none"
              title="Klik Logo PKBI untuk Pengaturan Tema & Bahasa"
              aria-label="Pengaturan Tema dan Bahasa"
            >
              <BulelengLogo size={36} className="drop-shadow-md" />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center border border-white shadow">
                <Settings size={10} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
