import React, { useState } from 'react';
import {
  MapPin,
  Users,
  Building2,
  HeartPulse,
  Baby,
  Activity,
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { KecamatanInfo, DesaDetailInfo } from '../types';
import { TEJAKULA_DESA_LIST } from '../data/bulelengData';
import { useAppTheme } from '../context/ThemeContext';

interface LamanKecamatanDetailProps {
  kecamatan: KecamatanInfo;
  onBackToMap: () => void;
  onSelectDesa?: (desa: DesaDetailInfo) => void;
  onNavigateToQA?: () => void;
}

export const LamanKecamatanDetail: React.FC<LamanKecamatanDetailProps> = ({
  kecamatan,
  onBackToMap,
  onSelectDesa,
  onNavigateToQA,
}) => {
  const { theme } = useAppTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'profil' | 'desa' | 'kegiatan'>('desa');
  const [selectedDesaCard, setSelectedDesaCard] = useState<DesaDetailInfo | null>(
    kecamatan.id === 'tejakula' ? TEJAKULA_DESA_LIST[0] : null
  );

  const desaList =
    kecamatan.id === 'tejakula'
      ? TEJAKULA_DESA_LIST
      : (kecamatan.desaList || []).map((desaName, idx) => ({
          id: `desa-${kecamatan.id}-${idx}`,
          name: desaName,
          kecamatanId: kecamatan.id,
          lat: kecamatan.lat + ((idx % 3) - 1) * 0.02,
          lng: kecamatan.lng + (Math.floor(idx / 3) - 1) * 0.02,
          population: Math.floor(kecamatan.population / (kecamatan.desaList?.length || 10)),
          posyanduCount: 4,
          stuntingPct: Number((kecamatan.stuntingRate || 6.2).toFixed(1)),
          statusBinaan: 'Desa Binaan PKBI',
          deskripsi: `Wilayah desa binaan PKBI di ${kecamatan.name} dengan layanan posyandu balita dan konseling keluarga sehat.`,
          polygonBoundary: [],
        }));

  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 transition-colors ${
        isLight ? 'text-slate-800' : 'text-white'
      }`}
    >
      {/* Top Navigation & Breadcrumbs */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 pb-4 border-b ${
          isLight ? 'border-slate-200' : 'border-blue-900/50'
        }`}
      >
        <button
          onClick={onBackToMap}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer border ${
            isLight
              ? 'bg-white hover:bg-slate-100 text-blue-700 border-slate-300'
              : 'bg-slate-900/90 hover:bg-blue-900/60 border-blue-800/60 text-blue-300 hover:text-white'
          }`}
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Peta Kabupaten</span>
        </button>

        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              isLight
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-blue-500/20 border border-blue-400/40 text-blue-300'
            }`}
          >
            <MapPin size={13} className={isLight ? 'text-blue-600' : 'text-blue-400'} />
            <span>Kecamatan {kecamatan.name.replace('Kecamatan ', '')}</span>
          </div>

          {onNavigateToQA && (
            <button
              onClick={onNavigateToQA}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow transition cursor-pointer"
            >
              <HelpCircle size={14} />
              <span>Tanya Nakes Wilayah Ini</span>
            </button>
          )}
        </div>
      </div>

      {/* Main District Hero Profile Banner */}
      <div
        className={`relative rounded-3xl border p-6 sm:p-8 shadow-xl overflow-hidden ${
          isLight
            ? 'bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border-blue-200'
            : 'bg-gradient-to-br from-slate-900 via-blue-950/80 to-slate-900 border-blue-800/60'
        }`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                isLight
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
              }`}
            >
              <Sparkles size={13} />
              Wilayah Kerja PKBI Kabupaten Buleleng
            </div>
            <h1
              className={`text-2xl sm:text-4xl font-extrabold tracking-tight font-serif ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {kecamatan.name}
            </h1>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              {kecamatan.deskripsi ||
                `Pusat monitoring dan pendampingan kesehatan reproduksi, pemantauan gizi balita bebas stunting, serta pembinaan keluarga berkualitas PKBI di ${kecamatan.name}.`}
            </p>
            <div
              className={`flex flex-wrap items-center gap-4 text-xs pt-1 ${
                isLight ? 'text-slate-600' : 'text-blue-200/90'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Building2 size={14} className="text-blue-600" />
                Ibu Kota: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{kecamatan.capital}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Layers size={14} className="text-blue-600" />
                Luas: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{kecamatan.areaKm2} km²</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-blue-600" />
                Penduduk: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{kecamatan.population.toLocaleString('id-ID')} jiwa</strong>
              </span>
            </div>
          </div>

          {/* Quick Stunting & Posyandu Badge */}
          <div className="flex flex-row sm:flex-col gap-3 shrink-0">
            <div
              className={`p-4 rounded-2xl border text-center sm:text-right ${
                isLight
                  ? 'bg-white border-blue-200 shadow-sm'
                  : 'bg-blue-900/40 border-blue-700/60 backdrop-blur'
              }`}
            >
              <span
                className={`text-[11px] uppercase tracking-wider block font-semibold ${
                  isLight ? 'text-blue-700' : 'text-blue-300'
                }`}
              >
                Prevalensi Stunting
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {kecamatan.stuntingRate || 5.2}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Target &lt; 5% Nasional</span>
            </div>

            <div
              className={`p-4 rounded-2xl border text-center sm:text-right ${
                isLight
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-slate-900/80 border-slate-700/60'
              }`}
            >
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">
                Balita Terpantau
              </span>
              <span
                className={`text-xl sm:text-2xl font-bold font-mono ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {(kecamatan.balitaTerpantau || 1420).toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-300 block mt-0.5">
                di Seluruh Posyandu
              </span>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div
          className={`flex items-center gap-2 mt-8 pt-6 border-t overflow-x-auto ${
            isLight ? 'border-slate-200' : 'border-blue-900/40'
          }`}
        >
          <button
            onClick={() => setActiveTab('desa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'desa'
                ? 'bg-blue-600 text-white shadow-md'
                : isLight
                ? 'bg-slate-100 text-slate-600 hover:text-slate-900'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <Building2 size={15} />
            <span>Daftar Desa ({desaList.length} Desa)</span>
          </button>
          <button
            onClick={() => setActiveTab('profil')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'profil'
                ? 'bg-blue-600 text-white shadow-md'
                : isLight
                ? 'bg-slate-100 text-slate-600 hover:text-slate-900'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={15} />
            <span>Fasilitas & Puskesmas Rujukan</span>
          </button>
          <button
            onClick={() => setActiveTab('kegiatan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'kegiatan'
                ? 'bg-blue-600 text-white shadow-md'
                : isLight
                ? 'bg-slate-100 text-slate-600 hover:text-slate-900'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <Calendar size={15} />
            <span>Program & Kegiatan ({kecamatan.activities.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DESA BREAKDOWN */}
      {activeTab === 'desa' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3
                className={`text-lg sm:text-xl font-bold font-serif flex items-center gap-2 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                <MapPin className="text-blue-600" size={20} />
                <span>Wilayah Desa & Desa Binaan di {kecamatan.name}</span>
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Daftar desa dengan layanan posyandu terpadu dan pembinaan keluarga PKBI.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {desaList.map((desa) => {
              const isSelected = selectedDesaCard?.name === desa.name;
              return (
                <div
                  key={desa.id}
                  onClick={() => {
                    setSelectedDesaCard(desa);
                    if (onSelectDesa) {
                      onSelectDesa(desa);
                    }
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                    isSelected
                      ? isLight
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400/40 shadow-md'
                        : 'bg-gradient-to-br from-blue-900/80 to-slate-900 border-blue-400 ring-2 ring-blue-500/40 shadow-xl'
                      : isLight
                      ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
                      : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 hover:border-blue-700/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                          isLight
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {desa.statusBinaan}
                      </span>
                      <h4
                        className={`text-base font-bold mt-1.5 font-serif ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {desa.name}
                      </h4>
                    </div>

                    <button
                      title="Lihat batas di peta"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectDesa) onSelectDesa(desa);
                      }}
                      className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-600 hover:text-white transition"
                    >
                      <Maximize2 size={14} />
                    </button>
                  </div>

                  <p
                    className={`text-xs line-clamp-2 leading-relaxed ${
                      isLight ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    {desa.deskripsi}
                  </p>

                  <div
                    className={`pt-2 border-t grid grid-cols-3 gap-2 text-center text-xs ${
                      isLight ? 'border-slate-200' : 'border-slate-800/80'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg ${
                        isLight ? 'bg-slate-50' : 'bg-slate-950/60'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 block">Penduduk</span>
                      <span
                        className={`font-bold text-[11px] ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {desa.population.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div
                      className={`p-1.5 rounded-lg ${
                        isLight ? 'bg-slate-50' : 'bg-slate-950/60'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 block">Posyandu</span>
                      <span className="font-bold text-blue-600 dark:text-blue-300 text-[11px]">
                        {desa.posyanduCount} Pos
                      </span>
                    </div>
                    <div
                      className={`p-1.5 rounded-lg ${
                        isLight ? 'bg-slate-50' : 'bg-slate-950/60'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 block">Stunting</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                        {desa.stuntingPct}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FASILITAS PUSKESMAS */}
      {activeTab === 'profil' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`p-6 rounded-3xl border shadow-sm ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-blue-900/60'
              }`}
            >
              <h4
                className={`text-base font-bold font-serif flex items-center gap-2 mb-4 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                <HeartPulse className="text-rose-500" size={18} />
                Puskesmas & Sentra Layanan PKBI
              </h4>
              <div className="space-y-3 text-xs">
                <div
                  className={`p-3.5 rounded-xl border ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <span className="font-bold text-blue-600 dark:text-blue-400 block text-sm">
                    Puskesmas {kecamatan.name} I
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Layanan: Konseling Catin, Skrining Anemia, PMT Balita, Imunisasi Rutin.
                  </p>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
                    <PhoneCall size={12} />
                    <span>Hotline: (0362) 21188 / 0812-3456-7890</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`p-6 rounded-3xl border shadow-sm ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-blue-900/60'
              }`}
            >
              <h4
                className={`text-base font-bold font-serif flex items-center gap-2 mb-4 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                <ShieldCheck className="text-blue-600" size={18} />
                Fokus Intervensi PKBI di {kecamatan.name}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    Pendampingan 1000 Hari Pertama Kehidupan (HPK) untuk ibu hamil & baduta.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    Skrining pranikah gratis bersama KUA / Kantor Urusan Agama & Disdukcapil.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    Edukasi kesehatan reproduksi remaja (Kespro) di SMA/SMK se-{kecamatan.name}.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DOKUMENTASI KEGIATAN KECAMATAN */}
      {activeTab === 'kegiatan' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kecamatan.activities.map((act) => (
              <div
                key={act.id}
                className={`rounded-2xl overflow-hidden border shadow-sm flex flex-col ${
                  isLight
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-900/90 border-blue-900/60'
                }`}
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={act.imageUrl}
                    alt={act.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-bold">
                    {act.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Calendar size={12} />
                      <span>
                        {act.hari}, {act.tanggal}
                      </span>
                    </div>
                    <h4
                      className={`text-base font-bold font-serif leading-snug ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {act.title}
                    </h4>
                    <p
                      className={`text-xs leading-relaxed ${
                        isLight ? 'text-slate-600' : 'text-slate-300'
                      }`}
                    >
                      {act.description}
                    </p>
                  </div>

                  <div
                    className={`pt-3 border-t flex items-center justify-between text-xs ${
                      isLight
                        ? 'border-slate-200 text-slate-500'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-blue-600" />
                      {act.location}
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-300">
                      {act.participants} Peserta
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
