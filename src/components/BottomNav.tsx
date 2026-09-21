import React from 'react';
import { motion } from 'motion/react';
import { Home, MapPin, TrendingDown, MessageSquare, Video } from 'lucide-react';
import { ContentCategory } from '../types';
import { useAppTheme } from '../context/ThemeContext';

interface BottomNavProps {
  activeCategory: ContentCategory | null;
  onSelectCategory: (cat: ContentCategory) => void;
  onGoHome: () => void;
}

interface TabItem {
  key: 'home' | ContentCategory;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

const TABS: TabItem[] = [
  { key: 'home', label: 'Home', icon: Home, color: 'from-blue-500 to-blue-700' },
  { key: 'map', label: 'Peta', icon: MapPin, color: 'from-sky-500 to-blue-600' },
  { key: 'desa-binaan', label: 'Desa', icon: TrendingDown, color: 'from-blue-600 to-indigo-700' },
  { key: 'pendaftaran-qa', label: 'Chat BOT', icon: MessageSquare, color: 'from-cyan-500 to-blue-600' },
  { key: 'edukasi-interaktif', label: 'Edukasi', icon: Video, color: 'from-indigo-500 to-blue-700' },
];

/**
 * Bottom Navigation Bar ala aplikasi mobile native.
 * - Fixed di bawah, muncul di semua tampilan (home & konten)
 * - Safe-area aware (iPhone home indicator)
 * - 5 tab, ikon 24px + label 10px, lebar tab fleksibel
 * - Indikator pill aktif dengan animasi layoutId
 * - Desktop: disembunyikan (lg:hidden)
 */
export const BottomNav: React.FC<BottomNavProps> = ({
  activeCategory,
  onSelectCategory,
  onGoHome,
}) => {
  const { theme } = useAppTheme();
  const isLight = theme === 'light';

  const isActive = (key: TabItem['key']) =>
    key === 'home' ? activeCategory === null : activeCategory === key;

  return (
    <nav
      id="bottom-nav-bar"
      aria-label="Navigasi utama"
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-xl ${isLight ? 'bg-white/95 border-slate-200' : 'bg-[#070e22]/95 border-blue-900/50'}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto px-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.key);
          return (
            <button
              key={tab.key}
              id={`bottom-nav-${tab.key}`}
              onClick={() =>
                tab.key === 'home' ? onGoHome() : onSelectCategory(tab.key)
              }
              className="relative flex-1 flex flex-col items-center justify-center gap-0.5 pt-2 pb-1.5 min-h-[56px] min-w-[48px] cursor-pointer select-none active:scale-95 transition-transform"
              aria-current={active ? 'page' : undefined}
            >
              {/* Pill highlight di belakang ikon saat aktif */}
              {active && (
                <motion.span
                  layoutId="bottom-nav-pill"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  className={`absolute top-1 h-8 w-12 rounded-2xl bg-gradient-to-br ${tab.color} opacity-90 shadow-lg shadow-blue-500/30`}
                />
              )}

              <span
                className={`relative z-10 transition-colors ${active ? 'text-white' : isLight ? 'text-slate-500' : 'text-slate-400'}`}
              >
                <Icon size={22} />
              </span>

              <span
                className={`relative z-10 text-[10px] font-bold leading-none transition-colors ${
                  active
                    ? isLight ? 'text-blue-700' : 'text-blue-300'
                    : isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
