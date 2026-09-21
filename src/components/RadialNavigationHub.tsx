import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  TrendingDown,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Compass,
  X,
  Video,
  Settings,
} from 'lucide-react';
import { BulelengLogo } from './BulelengLogo';
import { ContentCategory } from '../types';
import { useAppTheme } from '../context/ThemeContext';

interface RadialNavigationHubProps {
  activeCategory: ContentCategory | null;
  onSelectCategory: (cat: ContentCategory) => void;
  isOverlay?: boolean;
  onCloseOverlay?: () => void;
}

interface NavItem {
  id: ContentCategory;
  number: string;
  title: string;
  subtitle: string;
  angle: number; // in degrees
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  badge: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'map',
    number: '01',
    title: 'PKBI Buleleng',
    subtitle: '9 Kecamatan & Foto Kegiatan Interaktif (Leaflet)',
    angle: 225, // Top-Left (-135 deg)
    icon: MapPin,
    color: 'from-sky-500 to-blue-600',
    badge: 'Leaflet API',
    description: 'Peta Bali interaktif & agenda foto kegiatan per kecamatan.',
  },
  {
    id: 'desa-binaan',
    number: '02',
    title: 'Desa Binaan Sari Mekar',
    subtitle: 'Top 7 Kegiatan Bergeser & Grafik Stunting Bulanan',
    angle: 315, // Top-Right (-45 deg)
    icon: TrendingDown,
    color: 'from-blue-600 to-indigo-700',
    badge: 'Desa Sari Mekar',
    description: 'Dokumentasi top 7 bergeser otomatis & grafik tren stunting.',
  },
  {
    id: 'pendaftaran-qa',
    number: '03',
    title: 'Chat BOT & Pendaftaran',
    subtitle: 'Chat BOT Anonim (Guest) & Pendaftaran Catin',
    angle: 45, // Bottom-Right (45 deg)
    icon: MessageSquare,
    color: 'from-cyan-500 to-blue-600',
    badge: 'Guest & Terpisah',
    description: 'Chat BOT konsultasi rahasia mode Guest serta formulir Skrining Catin.',
  },
  {
    id: 'edukasi-interaktif',
    number: '04',
    title: 'Edukasi IMS & Pranikah',
    subtitle: 'Penyakit Menular Seksual & Skrining Pranikah',
    angle: 135, // Bottom-Left (135 deg)
    icon: Video,
    color: 'from-indigo-500 to-blue-700',
    badge: 'Kesehatan Seksual',
    description: 'Edukasi klinis IMS, pencegahan, alur tes puskesmas & video dokumenter.',
  },
];

export const RadialNavigationHub: React.FC<RadialNavigationHubProps> = ({
  activeCategory,
  onSelectCategory,
  isOverlay = false,
  onCloseOverlay,
}) => {
  const { theme, toggleSettings, language } = useAppTheme();
  const isLight = theme === 'light';

  // Initially not expanded so user clicks the single logo first!
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<NavItem | null>(null);
  const [orbitRadius, setOrbitRadius] = useState<number>(145);
  const [centerLogoSize, setCenterLogoSize] = useState<number>(110);
  const [orbitButtonSize, setOrbitButtonSize] = useState<number>(86);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 390) {
        setOrbitRadius(116);
        setCenterLogoSize(72);
        setOrbitButtonSize(64);
        setIsMobile(true);
      } else if (w < 480) {
        setOrbitRadius(126);
        setCenterLogoSize(80);
        setOrbitButtonSize(68);
        setIsMobile(true);
      } else if (w < 640) {
        setOrbitRadius(136);
        setCenterLogoSize(88);
        setOrbitButtonSize(74);
        setIsMobile(true);
      } else if (w < 1024) {
        setOrbitRadius(170);
        setCenterLogoSize(100);
        setOrbitButtonSize(86);
        setIsMobile(false);
      } else {
        setOrbitRadius(190);
        setCenterLogoSize(110);
        setOrbitButtonSize(86);
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleItemClick = (cat: ContentCategory) => {
    onSelectCategory(cat);
    if (isOverlay && onCloseOverlay) {
      onCloseOverlay();
    }
  };

  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center overflow-hidden transition-colors ${
        isOverlay
          ? isLight
            ? 'fixed inset-0 z-50 bg-white/95 backdrop-blur-md p-4 text-slate-800'
            : 'fixed inset-0 z-50 bg-[#060c1c]/95 backdrop-blur-md p-4 text-white'
          : isLight
          ? 'min-h-screen pt-20 pb-28 px-4 bg-gradient-to-b from-blue-50 via-white to-slate-100 text-slate-800'
          : 'min-h-screen pt-20 pb-28 px-4 bg-gradient-to-b from-[#060c1c] via-[#091329] to-[#0c1833] text-white'
      }`}
    >
      {/* Top Right PKBI Settings Button (Klik Logo PKBI untuk Pengaturan Bahasa & Warna) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40 flex items-center gap-2">
        <button
          id="btn-top-right-settings-hub"
          onClick={toggleSettings}
          className={`flex items-center gap-2 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl border transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 ${
            isLight
              ? 'bg-white/90 border-blue-200 text-slate-800 hover:border-blue-400'
              : 'bg-slate-900/80 border-blue-900/60 text-white hover:border-blue-500'
          }`}
          title="Klik Logo PKBI untuk Pengaturan Tema Warna & Bahasa"
        >
          <BulelengLogo size={26} className="drop-shadow-xs" />
          <div className="text-left hidden sm:block">
            <div className="text-[10px] font-bold leading-none text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              PKBI
            </div>
            <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
              {language === 'en' ? 'Settings' : 'Pengaturan'}
            </div>
          </div>
          <Settings size={14} className="text-slate-400 hidden sm:block" />
        </button>

        {isOverlay && onCloseOverlay && (
          <button
            id="btn-close-radial-overlay"
            onClick={onCloseOverlay}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md cursor-pointer"
          >
            <X size={15} />
            <span>Tutup</span>
          </button>
        )}
      </div>

      {/* Decorative background aura */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className={`w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] rounded-full blur-3xl transition-all duration-700 ${
            isLight
              ? isExpanded
                ? 'bg-blue-200/40 scale-110'
                : 'bg-blue-100/30 scale-95'
              : isExpanded
              ? 'bg-gradient-to-tr from-blue-600/30 via-cyan-500/20 to-indigo-600/30 scale-110'
              : 'bg-blue-500/20 scale-95'
          }`}
        />
        {/* Subtle decorative concentric rings */}
        <div
          className={`absolute w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] rounded-full border border-dashed animate-[spin_120s_linear_infinite] ${
            isLight ? 'border-blue-300/40' : 'border-blue-500/20'
          }`}
        />
        <div
          className={`absolute w-[500px] h-[500px] sm:w-[580px] sm:h-[580px] rounded-full border border-dashed ${
            isLight ? 'border-blue-200/40' : 'border-blue-400/10'
          }`}
        />
      </div>

      {/* Top Banner Text - Kompak di mobile */}
      <div className="relative z-20 text-center max-w-2xl mb-4 sm:mb-10 px-4">
        <div
          className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3 ${
            isLight
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-blue-500/20 border border-blue-400/40 text-blue-300'
          }`}
        >
          <Sparkles size={12} className={isLight ? 'text-blue-600' : 'text-blue-400'} />
          PKBI Kabupaten Buleleng
        </div>
        <h1
          className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          PKBI
        </h1>
        <p
          className={`mt-1 text-[13px] sm:text-xl font-semibold tracking-wide ${
            isLight ? 'text-blue-700' : 'text-blue-200'
          }`}
        >
          Perkumpulan Keluarga Berencana Indonesia
        </p>
        <p
          className={`mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}
        >
          {isExpanded
            ? language === 'en'
              ? 'Pilih salah satu program di sekeliling untuk membuka layanan'
              : 'Pilih salah satu program di sekeliling untuk membuka layanan'
            : language === 'en'
            ? 'Ketuk tombol "Pilih Program" di tengah untuk memunculkan menu lingkaran'
            : 'Ketuk tombol "Pilih Program" di tengah untuk memunculkan menu lingkaran'}
        </p>
      </div>

      {/* Mobile focus overlay */}
      {activeCategory && (
        <div
          className="absolute inset-0 bg-white/30 backdrop-blur-[2px] z-10 pointer-events-none"
        />
      )}

      {/* Center Interactive Radial Hub Container */}
      <div
        className="relative z-20 flex items-center justify-center max-w-full overflow-visible"
        style={{
          width: orbitRadius * 2 + orbitButtonSize + 40,
          height: orbitRadius * 2 + orbitButtonSize + 40,
        }}
      >
        {/* Orbit Path Guideline SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ overflow: 'visible' }}
        >
          <circle
            cx="50%"
            cy="50%"
            r={orbitRadius}
            fill="none"
            stroke="currentColor"
            className={`transition-colors duration-500 ${
              isExpanded ? 'text-blue-400/40' : 'text-slate-600/30'
            }`}
            strokeWidth="1.5"
            strokeDasharray={isExpanded ? '4 6' : '2 4'}
          />

          {/* Connection beams to expanded items */}
          {isExpanded &&
            NAV_ITEMS.map((item) => {
              const rad = (item.angle * Math.PI) / 180;
              const x = 50 + (orbitRadius * Math.cos(rad) * 100) / (orbitRadius * 2 + orbitButtonSize + 40);
              const y = 50 + (orbitRadius * Math.sin(rad) * 100) / (orbitRadius * 2 + orbitButtonSize + 40);
              const isHovered = hoveredItem?.id === item.id;

              return (
                <line
                  key={`line-${item.id}`}
                  x1="50%"
                  y1="50%"
                  x2={`${x}%`}
                  y2={`${y}%`}
                  stroke={isHovered ? '#38bdf8' : 'rgba(56, 189, 248, 0.3)'}
                  strokeWidth={isHovered ? '2.5' : '1'}
                  strokeDasharray={isHovered ? 'none' : '3 3'}
                  className="transition-all duration-300"
                />
              );
            })}
        </svg>

        {/* Central Logo Button */}
        <div className="relative flex flex-col items-center">
          <motion.button
            id="btn-radial-center-logo"
            onClick={handleToggle}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className={`relative group rounded-full p-2 transition-all duration-300 cursor-pointer shadow-2xl focus:outline-none ${
              isExpanded
                ? 'bg-gradient-to-br from-blue-900 via-slate-900 to-blue-950 shadow-blue-500/30 ring-4 ring-blue-400'
                : 'bg-slate-900/95 hover:bg-slate-800 shadow-black/80 ring-2 ring-blue-400/60 animate-pulse'
            }`}
            aria-label="Buka Navigasi Lingkaran PKBI"
          >
            <BulelengLogo size={centerLogoSize} glow={isExpanded} />

            {/* Tap prompt indicator badge */}
            <span
              className={`absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full shadow-lg transition-all ${
                isExpanded
                  ? 'bg-blue-600 text-white border border-blue-400'
                  : 'bg-blue-600 text-white group-hover:bg-blue-500 animate-bounce'
              }`}
            >
              {isExpanded ? 'Tutup Menu' : 'Pilih Program'}
            </span>
          </motion.button>
        </div>

        {/* Orbiting Circular Nav Items (Logo Bulet di Sekelilingnya) */}
        <AnimatePresence>
          {isExpanded &&
            NAV_ITEMS.map((item) => {
              const rad = (item.angle * Math.PI) / 180;
              const targetX = Math.round(orbitRadius * Math.cos(rad));
              const targetY = Math.round(orbitRadius * Math.sin(rad));
              const Icon = item.icon;
              const isActive = activeCategory === item.id;
              const halfBtn = orbitButtonSize / 2;

              return (
                <motion.div
                  key={item.id}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
                  animate={{
                    x: targetX,
                    y: targetY,
                    opacity: 1,
                    scale: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                      delay: 0,
                    },
                  }}
                  exit={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0.2,
                    transition: { duration: 0.25 },
                  }}
                  className="absolute z-30 touch-manipulation"
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: -halfBtn,
                    marginTop: -halfBtn,
                  }}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.button
                    id={`btn-orbit-${item.id}`}
                    onClick={() => handleItemClick(item.id)}
                    whileTap={{ scale: 0.92 }}
                    className={`relative rounded-full flex flex-col items-center justify-center p-1.5 sm:p-2 text-white shadow-lg transition-all cursor-pointer group focus:outline-none ${
                      isActive
                        ? 'ring-4 ring-blue-300 ring-offset-2 ring-offset-slate-950'
                        : 'border border-blue-400/50'
                    }`}
                    style={{
                      width: orbitButtonSize,
                      height: orbitButtonSize,
                    }}
                    aria-label={item.title}
                  >
                    {/* Background gradient */}
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${item.color} opacity-95 transition-opacity`}
                    />

                    {/* Ring highlight */}
                    <div className="absolute inset-1 rounded-full border border-white/40 pointer-events-none" />

                    {/* Icon and Category Title */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <Icon className="text-white drop-shadow" size={orbitButtonSize < 72 ? 16 : 20} />
                      <span
                        className={`font-bold leading-tight line-clamp-2 max-w-[90%] ${
                          orbitButtonSize < 72 ? 'text-[7px]' : 'text-[9px] sm:text-[10px]'
                        }`}
                      >
                        {item.title.replace('Pusat ', '')}
                      </span>
                      {orbitButtonSize >= 72 && (
                        <span className="text-[9px] text-white/80 font-mono tracking-tighter mt-0.5">
                          {item.number}
                        </span>
                      )}
                    </div>

                    {/* Info card: hover di desktop, tap di mobile */}
                    <AnimatePresence>
                      {hoveredItem?.id === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className={`absolute z-40 w-52 sm:w-64 p-3 rounded-2xl bg-slate-900/95 text-white shadow-2xl border border-blue-500/70 backdrop-blur-md pointer-events-none ${
                            targetY > 0 ? '-top-28 sm:-top-36' : '-bottom-28 sm:-bottom-36'
                          } ${targetX > 0 ? '-left-16 sm:-left-20' : '-right-16 sm:-right-20'}`}
                        >
                          <div className="flex items-center gap-1.5 text-xs text-blue-300 font-bold mb-1">
                            <Compass size={13} />
                            <span>{item.badge}</span>
                          </div>
                          <div className="text-sm font-bold text-white mb-1 font-serif">{item.title}</div>
                          <div className="text-xs text-slate-300 leading-relaxed">
                            {item.description}
                          </div>
                          <div className="mt-2 text-[11px] text-blue-400 font-bold flex items-center gap-1">
                            <span>Buka Program</span>
                            <ArrowRight size={12} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      {/* Mobile helper: petunjuk akses cepat saat orbit aktif */}
      {isExpanded && isMobile && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative z-20 mt-4 text-center text-[11px] px-6 ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          Ketuk logo bulat program untuk membuka, atau gunakan tab bawah
        </motion.p>
      )}
    </div>
  );
};
