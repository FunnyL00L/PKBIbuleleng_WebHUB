import React, { useState } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  Layers,
  Heart,
  ChevronRight,
  ExternalLink,
  Award,
  Clock,
  Play,
  Pause,
} from 'lucide-react';
import {
  HIGHLIGHT_WILAYAH_SCROLL,
  PROGRAM_KABUPATEN_BULELENG,
  ProgramKabupatenInfo,
  ProgramHighlightItem,
} from '../data/programBulelengData';
import { useAppTheme } from '../context/ThemeContext';

interface ProgramTerlaksanaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKecamatan: (kecamatanId: string) => void;
}

export const ProgramTerlaksanaDrawer: React.FC<ProgramTerlaksanaDrawerProps> = ({
  isOpen,
  onClose,
  onSelectKecamatan,
}) => {
  const { theme } = useAppTheme();
  const isLight = theme === 'light';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProgramDetail, setSelectedProgramDetail] = useState<ProgramKabupatenInfo | null>(null);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  if (!isOpen) return null;

  // Filter program di Kab Buleleng
  const filteredPrograms = PROGRAM_KABUPATEN_BULELENG.filter((prog) => {
    const matchesCategory = selectedCategory === 'all' || prog.kategori === selectedCategory;
    const matchesSearch =
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.wilayahCakupan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Duplikat array agar continuous loop seamless
  const marqueeItems = [...HIGHLIGHT_WILAYAH_SCROLL, ...HIGHLIGHT_WILAYAH_SCROLL];

  const handleCardClick = (item: ProgramHighlightItem) => {
    onSelectKecamatan(item.kecamatanId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <aside
        aria-label="Panel Program Terlaksana Kabupaten Buleleng"
        className={`relative z-10 w-full max-w-2xl sm:max-w-3xl h-full shadow-2xl flex flex-col transition-all overflow-hidden animate-in slide-in-from-right duration-300 ${
          isLight
            ? 'bg-slate-50 border-l border-slate-200 text-slate-800'
            : 'bg-[#091124] border-l border-slate-800 text-white'
        }`}
      >
        {/* =========================================================================
            DRAWER HEADER
            ========================================================================= */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-[#0b162f] border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Award size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-serif leading-tight">
                  Program Terlaksana & Jadwal Wilayah
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Kab. Buleleng
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Dokumentasi program nyata, rekap jadwal & highlight kegiatan 9 kecamatan
              </p>
            </div>
          </div>

          <button
            id="btn-close-program-drawer"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-slate-500 transition cursor-pointer"
            title="Tutup Menu Program"
          >
            <X size={18} />
          </button>
        </div>

        {/* =========================================================================
            DRAWER BODY (Scrollable)
            ========================================================================= */}
        <div className="flex-1 overflow-y-auto space-y-6 pb-8">
          {/* =========================================================================
              BAGIAN 1: JADWAL & FOTO WILAYAH HIGHLIGHT (SCROLL SECARA TERUS MENERUS)
              ========================================================================= */}
          <div className="pt-4 space-y-2">
            <div className="px-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Highlight Jadwal & Dokumentasi Foto Wilayah
                </span>
              </div>

              <button
                onClick={() => setIsMarqueePaused(!isMarqueePaused)}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 transition"
                title={isMarqueePaused ? 'Lanjutkan Auto-Scroll' : 'Jeda Auto-Scroll'}
              >
                {isMarqueePaused ? (
                  <>
                    <Play size={12} className="text-emerald-500" />
                    <span>Lanjutkan Scroll</span>
                  </>
                ) : (
                  <>
                    <Pause size={12} className="text-amber-500" />
                    <span>Jeda Scroll</span>
                  </>
                )}
              </button>
            </div>

            <p className="px-5 text-[11px] text-slate-500 dark:text-slate-400">
              Galeri foto kegiatan bergulir terus menerus. Arahkan kursor atau sentuh untuk menjeda, atau klik untuk langsung menyorot wilayah di peta:
            </p>

            {/* MARQUEE CONTAINER (CONTINUOUS HORIZONTAL SCROLL) */}
            <div className="relative w-full overflow-hidden py-2 bg-slate-900/5 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
              {/* Fade gradients at edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 dark:from-[#091124] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 dark:from-[#091124] to-transparent z-10 pointer-events-none" />

              <div
                className="animate-marquee-continuous gap-3.5 px-4"
                style={{ animationPlayState: isMarqueePaused ? 'paused' : 'running' }}
              >
                {marqueeItems.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    onClick={() => handleCardClick(item)}
                    className={`w-64 sm:w-72 shrink-0 rounded-xl overflow-hidden border shadow-md transition-all transform hover:-translate-y-1 hover:shadow-xl cursor-pointer select-none ${
                      isLight
                        ? 'bg-white border-slate-200 hover:border-blue-400'
                        : 'bg-[#0f1d3d] border-slate-700/80 hover:border-blue-500'
                    }`}
                  >
                    {/* Image Header with Badge */}
                    <div className="relative h-32 w-full overflow-hidden bg-slate-800">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* District Tag */}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600/90 text-white backdrop-blur-sm shadow flex items-center gap-1">
                        <MapPin size={10} />
                        <span>{item.wilayahNama}</span>
                      </span>

                      {/* Status Tag */}
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500 text-white shadow">
                        ✓ {item.status}
                      </span>

                      {/* Schedule Badge */}
                      <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-medium flex items-center gap-1 drop-shadow">
                        <Calendar size={11} className="text-amber-400 shrink-0" />
                        <span className="truncate">{item.hariTanggal}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold font-serif line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-1">
                          <Users size={11} className="text-blue-500" />
                          <span>{item.participants} Warga</span>
                        </span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 group">
                          <span>Lihat Peta</span>
                          <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* =========================================================================
              BAGIAN 2: SHOW PROGRAM DI KABUPATEN BULELENG
              ========================================================================= */}
          <div className="px-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold font-serif flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
                  <span>Showcase Program Nyata di Kab. Buleleng</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Daftar program strategis PKBI Buleleng yang telah sukses dilaksanakan
                </p>
              </div>

              {/* Counter Stats Summary */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {PROGRAM_KABUPATEN_BULELENG.length} Program Unggulan
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  3.500+ Penerima Manfaat
                </span>
              </div>
            </div>

            {/* Search and Category Filter */}
            <div className="space-y-2">
              <div
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm border transition ${
                  isLight
                    ? 'bg-white border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'
                    : 'bg-slate-800/80 border-slate-700 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-900/40'
                }`}
              >
                <Search size={15} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari program (contoh: stunting, catin, posyandu, tejakula)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-xs sm:text-sm placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
                {[
                  { id: 'all', label: 'Semua Program' },
                  { id: 'stunting', label: 'Stunting & Balita' },
                  { id: 'catin', label: 'Calon Pengantin (Catin)' },
                  { id: 'pangan', label: 'Ketahanan Pangan' },
                  { id: 'kespro', label: 'Kespro & IMS' },
                  { id: 'remaja', label: 'Remaja & GenRe' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-full font-medium transition cursor-pointer ${
                      selectedCategory === tab.id
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : isLight
                        ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Executed Programs */}
            <div className="space-y-3.5 pt-1">
              {filteredPrograms.map((prog) => (
                <div
                  key={prog.id}
                  id={`card-prog-${prog.id}`}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-sm hover:shadow-md ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-blue-300'
                      : 'bg-[#0f1a36] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Thumbnail Image */}
                    <div className="relative w-full sm:w-44 h-36 shrink-0 rounded-xl overflow-hidden bg-slate-800">
                      <img
                        src={prog.imageUrl}
                        alt={prog.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-600 text-white shadow">
                        ✓ {prog.statusPelaksanaan}
                      </span>
                    </div>

                    {/* Program Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {prog.kategoriLabel}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock size={11} />
                          <span>{prog.periode}</span>
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold font-serif leading-snug">
                        {prog.title}
                      </h4>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin size={13} className="text-red-500 shrink-0" />
                        <span className="truncate">{prog.wilayahCakupan}</span>
                      </div>

                      {/* Highlight Box Capaian Utama */}
                      <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-0.5">
                          Capaian Nyata Program:
                        </span>
                        <p className="font-semibold text-slate-800 dark:text-slate-100 leading-normal">
                          {prog.capaianUtama}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                        {prog.deskripsi}
                      </p>

                      {/* Indikator Checklist Sukses */}
                      <div className="space-y-1 pt-1">
                        {prog.indikatorSukses.slice(0, 2).map((ind, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span>{ind}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            if (prog.kecamatanTargetIds.length > 0) {
                              onSelectKecamatan(prog.kecamatanTargetIds[0]);
                              onClose();
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                        >
                          <MapPin size={13} />
                          <span>Sorot Lokasi di Peta</span>
                          <ArrowRight size={13} />
                        </button>

                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-auto">
                          Penerima Manfaat: <strong>{prog.totalPenerimaManfaat}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPrograms.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs sm:text-sm">
                  Tidak ada program yang sesuai dengan pencarian "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
