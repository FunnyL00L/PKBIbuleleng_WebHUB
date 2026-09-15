import React, { useState, useRef } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Calendar,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Info,
  X,
  Layers,
  HeartHandshake,
  CheckCircle2,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  DESA_SARI_MEKAR_PROFILE,
  STUNTING_BULAN_DATA,
  DOKUMENTASI_KEGIATAN_LIST,
} from '../data/bulelengData';
import { BeritaKegiatanDetail } from '../types';
import { useAppTheme } from '../context/ThemeContext';

// Extended data for curved upward trend graph (Grafik Lengkung Peningkatan Gizi)
const PENINGKATAN_GIZI_DATA = [
  { bulan: 'Jan', persenCapaianGizi: 32.4, balitaPulih: 24, prevalensiStuntingPct: 17.6 },
  { bulan: 'Feb', persenCapaianGizi: 38.0, balitaPulih: 30, prevalensiStuntingPct: 16.8 },
  { bulan: 'Mar', persenCapaianGizi: 46.5, balitaPulih: 38, prevalensiStuntingPct: 15.4 },
  { bulan: 'Apr', persenCapaianGizi: 54.0, balitaPulih: 45, prevalensiStuntingPct: 14.2 },
  { bulan: 'Mei', persenCapaianGizi: 62.8, balitaPulih: 52, prevalensiStuntingPct: 13.0 },
  { bulan: 'Jun', persenCapaianGizi: 69.5, balitaPulih: 60, prevalensiStuntingPct: 11.9 },
  { bulan: 'Jul', persenCapaianGizi: 75.0, balitaPulih: 66, prevalensiStuntingPct: 10.8 },
  { bulan: 'Agu', persenCapaianGizi: 81.2, balitaPulih: 72, prevalensiStuntingPct: 9.8 },
  { bulan: 'Sep', persenCapaianGizi: 86.4, balitaPulih: 77, prevalensiStuntingPct: 8.9 },
  { bulan: 'Okt', persenCapaianGizi: 90.5, balitaPulih: 81, prevalensiStuntingPct: 8.0 },
  { bulan: 'Nov', persenCapaianGizi: 93.2, balitaPulih: 85, prevalensiStuntingPct: 7.2 },
  { bulan: 'Des', persenCapaianGizi: 95.8, balitaPulih: 88, prevalensiStuntingPct: 6.7 },
];

export const DesaBinaanSection: React.FC = () => {
  const { theme, language } = useAppTheme();
  const isLight = theme === 'light';

  // Top 7 latest activities for manual navigation (NO AUTO-SLIDE)
  const top7Activities = DOKUMENTASI_KEGIATAN_LIST.slice(0, 7);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [selectedBerita, setSelectedBerita] = useState<BeritaKegiatanDetail | null>(null);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState<boolean>(false);

  // Active chart view mode: 'peningkatan' (curved upward trend) vs 'penurunan' (stunting drop)
  const [chartMode, setChartMode] = useState<'peningkatan' | 'penurunan'>('peningkatan');

  // Swipe gesture handling for mobile / touch devices
  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 45; // Minimum px distance to trigger swipe

    if (diff > minSwipeDistance) {
      // Swiped Left -> Next
      handleNextSlide();
    } else if (diff < -minSwipeDistance) {
      // Swiped Right -> Prev
      handlePrevSlide();
    }
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % top7Activities.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + top7Activities.length) % top7Activities.length);
  };

  const currentItem = top7Activities[currentSlideIndex];

  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 transition-colors ${
        isLight ? 'text-slate-800' : 'text-white'
      }`}
    >
      {/* 1. Header Banner & Profile Desa Sari Mekar */}
      <div
        className={`pb-6 border-b ${
          isLight ? 'border-slate-200' : 'border-blue-900/60'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 ${
                isLight
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
              }`}
            >
              <Sparkles size={13} className={isLight ? 'text-blue-600' : 'text-blue-400'} />
              Desa Binaan Utama Kabupaten Buleleng
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {DESA_SARI_MEKAR_PROFILE.name} ({DESA_SARI_MEKAR_PROFILE.kecamatanName})
            </h2>
            <p
              className={`mt-1 text-xs sm:text-sm max-w-2xl leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              Pusat percontohan penanganan stunting terpadu, program keluarga asuh, dan posyandu integrasi layanan primer Kabupaten Buleleng, Bali.
            </p>
          </div>

          {/* Quick Metrics of Sari Mekar */}
          <div
            className={`grid grid-cols-3 gap-2.5 p-3 rounded-2xl border ${
              isLight
                ? 'bg-white border-slate-200 shadow-sm'
                : 'bg-slate-900/90 border-blue-900/60'
            }`}
          >
            <div className="text-center px-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">Prevalensi Akhir</div>
              <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                6.7%
              </div>
              <div className="text-[10px] text-slate-400">Turun dr 17.6%</div>
            </div>
            <div
              className={`text-center px-3 border-x ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}
            >
              <div className="text-xs text-slate-500 dark:text-slate-400">Balita Terpantau</div>
              <div
                className={`text-lg sm:text-xl font-bold font-mono ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                284
              </div>
              <div className="text-[10px] text-slate-400">KMS Rutin 100%</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">Orang Tua Asuh</div>
              <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-cyan-400 font-mono">
                35
              </div>
              <div className="text-[10px] text-slate-400">Mitra Aktif</div>
            </div>
          </div>
        </div>

        {/* Posyandu Binaan Chips */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Jaringan Posyandu:
          </span>
          {DESA_SARI_MEKAR_PROFILE.posyanduList.map((pos, idx) => (
            <span
              key={idx}
              className={`text-[11px] px-2.5 py-1 rounded-full border ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-700'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              {pos}
            </span>
          ))}
        </div>
      </div>

      {/* 2. DOKUMENTASI KEGIATAN (CARD DIGESER DENGAN SWIPE ATAU TOMBOL NEXT/PREV DI KANAN-KIRI) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3
              className={`text-lg sm:text-xl font-bold font-serif ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Dokumentasi Kegiatan Terkini (Top 7 Kegiatan)
            </h3>
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                isLight
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-blue-600/30 text-blue-300 border border-blue-400/40'
              }`}
            >
              Geser Manual ({currentSlideIndex + 1}/7)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-more-documentation"
              onClick={() => setIsMoreModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Layers size={14} />
              <span>Semua Arsip Berita</span>
            </button>
          </div>
        </div>

        {/* Carousel Container with prominent Prev & Next buttons on Left and Right + Swipe Support */}
        <div className="relative group">
          {/* Left Arrow Button for Computer */}
          <button
            id="btn-card-prev-left"
            onClick={handlePrevSlide}
            className={`absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${
              isLight
                ? 'bg-white text-slate-800 border-slate-300 hover:bg-blue-600 hover:text-white shadow-blue-500/10'
                : 'bg-slate-900/95 text-white border-blue-500/70 hover:bg-blue-600 shadow-black/80'
            }`}
            title="Geser ke Kegiatan Sebelumnya (Prev)"
            aria-label="Kegiatan Sebelumnya"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>

          {/* Right Arrow Button for Computer */}
          <button
            id="btn-card-next-right"
            onClick={handleNextSlide}
            className={`absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${
              isLight
                ? 'bg-white text-slate-800 border-slate-300 hover:bg-blue-600 hover:text-white shadow-blue-500/10'
                : 'bg-slate-900/95 text-white border-blue-500/70 hover:bg-blue-600 shadow-black/80'
            }`}
            title="Geser ke Kegiatan Selanjutnya (Next)"
            aria-label="Kegiatan Selanjutnya"
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>

          {/* Card Surface: Supports Touch Swipe on Mobile */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`rounded-3xl border-2 p-6 sm:p-8 shadow-xl transition-all select-none overflow-hidden ${
              isLight
                ? 'bg-white border-blue-200 shadow-blue-500/5'
                : 'bg-slate-900/90 border-blue-900/70 shadow-2xl'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Photo View */}
              <div className="lg:col-span-6 relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                <img
                  src={currentItem.imageUrl}
                  alt={currentItem.title}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
                  {currentItem.kategori}
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                  <span className="font-semibold flex items-center gap-1.5 drop-shadow">
                    <Calendar size={13} className="text-amber-300" />
                    {currentItem.hari.toUpperCase()}, {currentItem.tanggal}
                  </span>
                  <span className="font-mono text-cyan-200 drop-shadow">
                    {currentItem.waktu}
                  </span>
                </div>
              </div>

              {/* Information View */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      isLight
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-blue-900/50 text-blue-300 border border-blue-500/40'
                    }`}
                  >
                    Top {currentSlideIndex + 1} dari 7 Terpilih
                  </span>
                  <span className="text-xs text-slate-400">
                    Geser (swipe) atau klik tombol panah
                  </span>
                </div>

                <h4
                  className={`text-xl sm:text-2xl font-bold font-serif leading-tight ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {currentItem.title}
                </h4>

                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  {currentItem.ringkasan}
                </p>

                {/* Location and Attendee Pill */}
                <div
                  className={`flex items-center justify-between p-3 rounded-2xl border text-xs ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-700'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin size={14} className="text-rose-500 shrink-0" />
                    <span className="truncate">{currentItem.lokasi}</span>
                  </div>
                  <div
                    className={`font-bold flex items-center gap-1.5 shrink-0 ${
                      isLight ? 'text-blue-700' : 'text-cyan-400'
                    }`}
                  >
                    <Users size={14} />
                    <span>{currentItem.pesertaCount} Orang</span>
                  </div>
                </div>

                {/* Action button to view detailed news */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    id={`btn-baca-berita-${currentItem.id}`}
                    onClick={() => setSelectedBerita(currentItem)}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Baca Berita Lengkap</span>
                    <BookOpen size={14} />
                  </button>

                  <div className="flex items-center gap-1">
                    {top7Activities.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${
                          idx === currentSlideIndex
                            ? 'w-6 bg-blue-600'
                            : isLight
                            ? 'w-2 bg-slate-200 hover:bg-slate-300'
                            : 'w-2 bg-slate-700 hover:bg-slate-600'
                        }`}
                        title={`Buka Kegiatan ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. GRAFIK LENGKUNG & PENINGKATAN GIZI DESA SARI MEKAR */}
      {/* "garfik itu harsuanay berupa peningkatan atau grafik lengkung bisa kao buat" */}
      <div
        className={`rounded-3xl border-2 p-6 sm:p-8 shadow-xl space-y-6 ${
          isLight
            ? 'bg-white border-blue-200 shadow-blue-500/5'
            : 'bg-slate-900/90 border-blue-900/70 shadow-2xl'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-blue-700' : 'text-blue-400'
              }`}
            >
              {chartMode === 'peningkatan' ? (
                <TrendingUp size={16} className="text-emerald-500" />
              ) : (
                <TrendingDown size={16} className="text-blue-500" />
              )}
              <span>Grafik Kurva Lengkung Evaluasi Program PKBI</span>
            </div>
            <h3
              className={`text-xl sm:text-2xl font-bold font-serif mt-1 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {chartMode === 'peningkatan'
                ? 'Grafik Lengkung: Peningkatan Capaian Gizi & Pemulihan Balita Sehat'
                : 'Grafik Lengkung: Evaluasi Penurunan Prevalensi Stunting Bulanan'}
            </h3>
            <p
              className={`text-xs sm:text-sm mt-1 ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              {chartMode === 'peningkatan'
                ? 'Kurva lengkung naik menunjukkan peningkatan status gizi balita penerima PMT dari 32.4% hingga 95.8% (88 balita pulih).'
                : 'Kurva lengkung turun mencatat penurunan angka stunting dari 17.6% menjadi 6.7%, jauh melampaui target nasional (14.0%).'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div
            className={`flex items-center gap-1.5 p-1.5 rounded-2xl border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <button
              id="btn-chart-mode-peningkatan"
              onClick={() => setChartMode('peningkatan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                chartMode === 'peningkatan'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp size={14} />
              <span>Peningkatan Gizi (Naik)</span>
            </button>
            <button
              id="btn-chart-mode-penurunan"
              onClick={() => setChartMode('penurunan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                chartMode === 'penurunan'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingDown size={14} />
              <span>Penurunan Stunting</span>
            </button>
          </div>
        </div>

        {/* Recharts Curved Chart Container (type="natural" / "monotone" curved spline) */}
        <div className="w-full h-80 sm:h-96 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'peningkatan' ? (
              <AreaChart
                data={PENINGKATAN_GIZI_DATA}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorGizi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isLight ? '#e2e8f0' : '#1e293b'}
                />
                <XAxis
                  dataKey="bulan"
                  stroke={isLight ? '#64748b' : '#94a3b8'}
                  tick={{ fontSize: 12, fill: isLight ? '#475569' : '#94a3b8' }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                  stroke={isLight ? '#64748b' : '#94a3b8'}
                  tick={{ fontSize: 12, fill: isLight ? '#475569' : '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLight ? '#ffffff' : '#0f172a',
                    borderColor: '#22c55e',
                    borderRadius: '16px',
                    color: isLight ? '#0f172a' : '#ffffff',
                    fontSize: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                  }}
                  formatter={(value: any, name: any) => {
                    if (name === 'persenCapaianGizi')
                      return [`${value}%`, 'Tingkat Capaian Gizi'];
                    if (name === 'balitaPulih')
                      return [`${value} Balita`, 'Balita Berat Badan Normal'];
                    return [value, name];
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(val) => {
                    if (val === 'persenCapaianGizi')
                      return 'Kurva Peningkatan Gizi Balita Sari Mekar (%)';
                    return val;
                  }}
                />
                {/* 80% Success target line */}
                <ReferenceLine
                  y={80}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'Target Keberhasilan (80%)',
                    fill: '#10b981',
                    fontSize: 11,
                    position: 'insideTopLeft',
                  }}
                />
                {/* Smooth Curved Spline for Upward Trend */}
                <Area
                  type="natural"
                  dataKey="persenCapaianGizi"
                  name="persenCapaianGizi"
                  stroke="#16a34a"
                  strokeWidth={3.5}
                  fillOpacity={1}
                  fill="url(#colorGizi)"
                  dot={{ r: 5, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, stroke: '#22c55e', strokeWidth: 3 }}
                />
              </AreaChart>
            ) : (
              <AreaChart
                data={PENINGKATAN_GIZI_DATA}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorStunting" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isLight ? '#e2e8f0' : '#1e293b'}
                />
                <XAxis
                  dataKey="bulan"
                  stroke={isLight ? '#64748b' : '#94a3b8'}
                  tick={{ fontSize: 12, fill: isLight ? '#475569' : '#94a3b8' }}
                />
                <YAxis
                  domain={[0, 22]}
                  tickFormatter={(val) => `${val}%`}
                  stroke={isLight ? '#64748b' : '#94a3b8'}
                  tick={{ fontSize: 12, fill: isLight ? '#475569' : '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLight ? '#ffffff' : '#0f172a',
                    borderColor: '#38bdf8',
                    borderRadius: '16px',
                    color: isLight ? '#0f172a' : '#ffffff',
                    fontSize: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                  }}
                  formatter={(value: any, name: any) => {
                    if (name === 'prevalensiStuntingPct')
                      return [`${value}%`, 'Prevalensi Stunting'];
                    return [value, name];
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(val) => {
                    if (val === 'prevalensiStuntingPct')
                      return 'Kurva Penurunan Prevalensi Stunting (%)';
                    return val;
                  }}
                />
                {/* National Target Threshold Line at 14% */}
                <ReferenceLine
                  y={14}
                  stroke="#f43f5e"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: 'Target Nasional (14%)',
                    fill: '#f43f5e',
                    fontSize: 11,
                    position: 'insideTopRight',
                  }}
                />
                {/* Smooth Curved Spline for Downward Trend */}
                <Area
                  type="natural"
                  dataKey="prevalensiStuntingPct"
                  name="prevalensiStuntingPct"
                  stroke="#0284c7"
                  strokeWidth={3.5}
                  fillOpacity={1}
                  fill="url(#colorStunting)"
                  dot={{ r: 5, fill: '#0284c7', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, stroke: '#38bdf8', strokeWidth: 3 }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Bottom Achievement Highlights */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}
        >
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <CheckCircle2 className="text-emerald-500 mt-1 shrink-0" size={18} />
            <div>
              <div
                className={`font-bold text-xs ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                95.8% Capaian Pemulihan Gizi
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                88 balita mencapai kurva pertumbuhan KMS hijau optimal berkat PMT telur rutin.
              </div>
            </div>
          </div>
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <HeartHandshake className="text-blue-500 mt-1 shrink-0" size={18} />
            <div>
              <div
                className={`font-bold text-xs ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                35 Orang Tua Asuh Terdaftar
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Mendampingi pemenuhan nutrisi dan biaya penimbangan balita secara berkesinambungan.
              </div>
            </div>
          </div>
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}
          >
            <Award className="text-amber-500 mt-1 shrink-0" size={18} />
            <div>
              <div
                className={`font-bold text-xs ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                100% Catin Ter-skrining
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Seluruh calon pengantin di Desa Sari Mekar menjalani skrining kesehatan dan anemia pranikah.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL "MORE" DOKUMENTASI (Semua Dokumentasi Kegiatan) */}
      {isMoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div
            className={`border-2 rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl ${
              isLight
                ? 'bg-white border-blue-200 text-slate-800'
                : 'bg-slate-900 border-blue-900/80 text-white'
            }`}
          >
            <div
              className={`p-5 sm:p-6 border-b flex items-center justify-between ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}
            >
              <div>
                <h3
                  className={`text-lg sm:text-xl font-bold font-serif ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Semua Arsip Dokumentasi Kegiatan Desa Binaan & Buleleng
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Menampilkan seluruh agenda kegiatan yang terdokumentasi lengkap
                </p>
              </div>
              <button
                id="btn-close-more-modal"
                onClick={() => setIsMoreModalOpen(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DOKUMENTASI_KEGIATAN_LIST.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedBerita(doc);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 hover:border-blue-500 shadow-sm'
                        : 'bg-slate-950 border-slate-800 hover:border-blue-500'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        <img
                          src={doc.imageUrl}
                          alt={doc.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold">
                          {doc.kategori}
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                        <Calendar size={12} />
                        <span>
                          {doc.hari.toUpperCase()}, {doc.tanggal}
                        </span>
                      </div>
                      <h4
                        className={`text-sm font-bold group-hover:text-blue-600 transition-colors ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {doc.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {doc.ringkasan}
                      </p>
                    </div>

                    <div
                      className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] text-slate-500 ${
                        isLight ? 'border-slate-200' : 'border-slate-800'
                      }`}
                    >
                      <span className="truncate max-w-[170px]">{doc.lokasi}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5">
                        Baca <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL DETAIL BERITA (Single News Full Article) */}
      {selectedBerita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div
            className={`border-2 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl space-y-5 ${
              isLight
                ? 'bg-white border-blue-200 text-slate-800'
                : 'bg-slate-900 border-blue-900/80 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                {selectedBerita.kategori}
              </span>
              <button
                id="btn-close-berita-modal"
                onClick={() => setSelectedBerita(null)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <h3
                className={`text-xl sm:text-2xl font-bold font-serif ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {selectedBerita.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-amber-500" />
                  {selectedBerita.hari}, {selectedBerita.tanggal} ({selectedBerita.waktu})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-rose-500" />
                  {selectedBerita.lokasi}
                </span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800 shadow-md">
              <img
                src={selectedBerita.imageUrl}
                alt={selectedBerita.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                isLight
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-blue-950/40 border-blue-900/60 text-blue-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <Info size={14} />
                <span>Ringkasan Eksekutif:</span>
              </div>
              <p>{selectedBerita.ringkasan}</p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>{selectedBerita.isiBeritaLengkap}</p>
            </div>

            <div
              className={`pt-4 border-t flex items-center justify-between ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}
            >
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Penyelenggara: <b>{selectedBerita.narasumber}</b>
              </div>
              <button
                onClick={() => setSelectedBerita(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-md"
              >
                Tutup Berita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
