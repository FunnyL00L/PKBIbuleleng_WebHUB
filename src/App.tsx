import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ContentCategory } from './types';
import { Header } from './components/Header';
import { RadialNavigationHub } from './components/RadialNavigationHub';
import { MapKecamatan } from './components/MapKecamatan';
import { DesaBinaanSection } from './components/DesaBinaanSection';
import { PendaftaranDanQASection } from './components/PendaftaranDanQASection';
import { EdukasiInteraktifSection } from './components/EdukasiInteraktifSection';
import { SettingsModal } from './components/SettingsModal';
import { useAppTheme } from './context/ThemeContext';

const PKBI_LOGO_IMG =
  'https://res.cloudinary.com/diuclq0nb/image/upload/v1788677533/Screenshot_20260906-145038_ug9vvz.png';

// URL Path Routing helper functions
const getCategoryFromPath = (path: string): ContentCategory | null => {
  const clean = path.toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/map' || clean.startsWith('/map')) return 'map';
  if (clean === '/edukasi' || clean.startsWith('/edukasi')) return 'edukasi-interaktif';
  if (clean === '/desa' || clean === '/desa-binaan' || clean.startsWith('/desa')) return 'desa-binaan';
  if (
    clean === '/qa' ||
    clean === '/qna' ||
    clean === '/pendaftaran' ||
    clean === '/pendaftaran-qa' ||
    clean.startsWith('/qa')
  ) {
    return 'pendaftaran-qa';
  }
  return null;
};

const getPathFromCategory = (cat: ContentCategory | null): string => {
  switch (cat) {
    case 'map':
      return '/map';
    case 'edukasi-interaktif':
      return '/edukasi';
    case 'desa-binaan':
      return '/desa-binaan';
    case 'pendaftaran-qa':
      return '/qa';
    default:
      return '/';
  }
};

export default function App() {
  // Initially read current URL path so /map or /edukasi works directly
  const [activeCategory, setActiveCategory] = useState<ContentCategory | null>(() => {
    if (typeof window !== 'undefined') {
      return getCategoryFromPath(window.location.pathname);
    }
    return null;
  });

  // Synchronize browser history and popstate events
  useEffect(() => {
    const handlePopState = () => {
      const categoryFromUrl = getCategoryFromPath(window.location.pathname);
      setActiveCategory(categoryFromUrl);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectCategory = (cat: ContentCategory) => {
    setActiveCategory(cat);
    const targetPath = getPathFromCategory(cat);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMainMenu = () => {
    setActiveCategory(null);
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { theme } = useAppTheme();
  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen font-sans flex flex-col selection:bg-blue-600 selection:text-white relative transition-colors ${
        isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#060c1c] text-white'
      }`}
    >
      {/* 1. INITIAL HERO STATE: When site first runs without category */}
      {!activeCategory && (
        <main className="flex-1 flex flex-col justify-center">
          <RadialNavigationHub
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />
        </main>
      )}

      {/* 2. STANDALONE CONTENT VIEW: When a category is active */}
      {activeCategory && (
        <>
          <Header
            activeCategory={activeCategory}
            onBackToMainMenu={handleBackToMainMenu}
          />

          <main className="flex-1 pb-16">
            <AnimatePresence mode="wait">
              {activeCategory === 'map' && (
                <motion.div
                  key="cat-map"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <MapKecamatan
                    onNavigateToProgram={() => {
                      handleSelectCategory('pendaftaran-qa');
                    }}
                  />
                </motion.div>
              )}

              {activeCategory === 'desa-binaan' && (
                <motion.div
                  key="cat-desa"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <DesaBinaanSection />
                </motion.div>
              )}

              {activeCategory === 'pendaftaran-qa' && (
                <motion.div
                  key="cat-pendaftaran"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <PendaftaranDanQASection />
                </motion.div>
              )}

              {activeCategory === 'edukasi-interaktif' && (
                <motion.div
                  key="cat-edukasi"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <EdukasiInteraktifSection />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </>
      )}

      {/* Settings Modal (Triggered by PKBI Logo in Header or Top-Right Radial Hub) */}
      <SettingsModal />

      {/* PLAIN MINIMAL FOOTER (Polos, logo PKBI, tanpa alamat/kata pemerintahan) */}
      <footer
        className={`py-8 px-4 text-center transition-colors ${
          isLight
            ? 'bg-white text-slate-500 border-t border-slate-200 shadow-sm'
            : 'bg-[#030712] text-slate-400 border-t border-blue-900/30'
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={PKBI_LOGO_IMG}
              alt="Logo PKBI Kabupaten Buleleng"
              referrerPolicy="no-referrer"
              className="w-11 h-11 object-contain rounded-full drop-shadow-md"
            />
            <div className="text-left">
              <h4
                className={`text-sm sm:text-base font-bold font-serif tracking-wide ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                PKBI Kabupaten Buleleng
              </h4>
              <p
                className={`text-xs ${
                  isLight ? 'text-blue-600' : 'text-blue-300'
                }`}
              >
                Perkumpulan Keluarga Berencana Indonesia
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} PKBI (Perkumpulan Keluarga Berencana Indonesia) Kabupaten Buleleng. Hak Cipta Dilindungi.
          </p>

          {activeCategory && (
            <button
              onClick={handleBackToMainMenu}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline transition font-semibold cursor-pointer pt-1"
            >
              ← Kembali ke Halaman Utama (Pilih Program)
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
