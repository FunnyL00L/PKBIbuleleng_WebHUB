import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  Video,
  Play,
  Pause,
  BookOpen,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  Activity,
  Stethoscope,
  Send,
  User,
  Clock,
  ShieldCheck,
  Paperclip,
  FileText,
  Trash2,
} from 'lucide-react';
import {
  getEdukasiPenyakitList,
  getVideoEdukasiList,
  getNakesChats,
  clearNakesChats,
  addUploadedFile,
  subscribeData,
  getNakesList,
  getChatProtokol,
  getTopikCepatForNakes,
  kirimPesanTanyaNakes,
} from '../services/dataService';
import { PenyakitSeksualEdu, VideoEdukasi, NakesChatMessage, UserUploadedFile, NakesProfile } from '../types';
import { useAppTheme } from '../context/ThemeContext';

export const EdukasiInteraktifSection: React.FC = () => {
  const { theme } = useAppTheme();
  const isLight = theme === 'light';

  const diseases = getEdukasiPenyakitList();
  const videos = getVideoEdukasiList();

  const [activeSubTab, setActiveSubTab] = useState<'penyakit' | 'video' | 'tanya-nakes'>('penyakit');
  const [selectedDisease, setSelectedDisease] = useState<PenyakitSeksualEdu>(diseases[0]);
  const [selectedVideo, setSelectedVideo] = useState<VideoEdukasi>(videos[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // State for Tanya Nakes (synchronized with centralized DataService)
  const nakesList = getNakesList();
  const [selectedNakesId, setSelectedNakesId] = useState<string>(nakesList[0]?.id || 'dr-edy');
  const [nakesQuestion, setNakesQuestion] = useState('');
  const [nakesConsultationHistory, setNakesConsultationHistory] = useState<NakesChatMessage[]>(() =>
    getNakesChats()
  );

  const [attachedFileForNakes, setAttachedFileForNakes] = useState<{
    fileName: string;
    fileSize: string;
    fileType: string;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeData((updatedData) => {
      setNakesConsultationHistory(updatedData.tanyaNakesChats);
    });
    return unsubscribe;
  }, []);

  // Selected Nakes Profile & Protocol from DataService
  const selectedNakes: NakesProfile =
    nakesList.find((n) => n.id === selectedNakesId) || nakesList[0];
  const activeProtokol = getChatProtokol(selectedNakesId);
  const quickTopics = getTopikCepatForNakes(selectedNakesId);

  const handleSendNakesQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nakesQuestion.trim() && !attachedFileForNakes) return;

    let attachedFileObj: UserUploadedFile | undefined = undefined;
    if (attachedFileForNakes) {
      attachedFileObj = addUploadedFile({
        fileName: attachedFileForNakes.fileName,
        fileSize: attachedFileForNakes.fileSize,
        fileType: attachedFileForNakes.fileType,
        category: 'konsultasi_medis',
        uploaderName: 'Pasien / Warga',
        description: `Lampiran hasil tes/dokumen ke ${selectedNakes?.nama || 'Nakes PKBI'}`,
      });
    }

    const textToSend = nakesQuestion;
    setNakesQuestion('');
    setAttachedFileForNakes(null);

    // Call centralized dataService (chat_protokol handles responses automatically)
    kirimPesanTanyaNakes({
      nakesId: selectedNakesId,
      text: textToSend,
      attachedFile: attachedFileObj,
      senderName: 'Warga / Pasien Buleleng',
    });
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors ${
        isLight ? 'text-slate-800' : 'text-white'
      }`}
    >
      {/* Top Banner */}
      <div
        className={`pb-6 border-b flex flex-col md:flex-row md:items-end justify-between gap-4 ${
          isLight ? 'border-slate-200' : 'border-blue-900/60'
        }`}
      >
        <div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 border ${
              isLight
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-blue-500/20 border-blue-400/40 text-blue-300'
            }`}
          >
            <HeartPulse size={13} className="text-rose-500" />
            Pusat Edukasi Kesehatan Seksual & Tanya Nakes PKBI
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Edukasi Penyakit Menular Seksual (IMS) & Tanya Nakes
          </h2>
          <p
            className={`mt-1 text-xs sm:text-sm max-w-2xl leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            Kenali ragam infeksi menular seksual, gejala klinis, dan konsultasikan keluhan medis
            reproduksi Anda secara langsung kepada Dokter & Bidan PKBI Kabupaten Buleleng.
          </p>
        </div>

        {/* Tab Controls */}
        <div
          className={`flex items-center gap-2 p-1.5 rounded-2xl border flex-wrap ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/90 border-blue-900/60'
          }`}
        >
          <button
            id="tab-edukasi-penyakit"
            onClick={() => setActiveSubTab('penyakit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'penyakit'
                ? 'bg-blue-600 text-white shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert size={15} />
            <span>Katalog IMS & Gejala</span>
          </button>

          <button
            id="tab-edukasi-video"
            onClick={() => setActiveSubTab('video')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'video'
                ? 'bg-blue-600 text-white shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video size={15} />
            <span>Video Pembelajaran</span>
          </button>

          <button
            id="tab-edukasi-tanya-nakes"
            onClick={() => setActiveSubTab('tanya-nakes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'tanya-nakes'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md ring-2 ring-emerald-400/50'
                : 'text-emerald-500 hover:text-emerald-700'
            }`}
          >
            <Stethoscope size={15} />
            <span>Tanya Nakes PKBI ({nakesConsultationHistory.length})</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: KATALOG PENYAKIT MENULAR SEKSUAL (IMS) */}
      {activeSubTab === 'penyakit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Disease List Sidebar */}
          <div
            className={`lg:col-span-4 rounded-3xl border p-5 shadow-xl space-y-3 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-blue-900/70'
            }`}
          >
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldAlert size={14} className="text-rose-500" />
              <span>Daftar Penyakit Seksual (IMS)</span>
            </h4>

            {diseases.map((ims) => {
              const isSelected = selectedDisease.id === ims.id;
              return (
                <div
                  key={ims.id}
                  onClick={() => setSelectedDisease(ims)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? isLight
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                        : 'bg-blue-950/80 border-blue-400 ring-2 ring-blue-500/40 shadow-lg'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-500 border border-rose-500/30">
                      Tingkat: {ims.tingkatBahaya}
                    </span>
                    <span className="text-slate-400 font-mono">{ims.kategori}</span>
                  </div>
                  <h5 className="font-bold text-sm">{ims.namaPenyakit}</h5>
                  <p className="text-[11px] text-slate-400 italic mb-2">{ims.singkatan}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {ims.penyebab}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Disease Detail Panel */}
          <div
            className={`lg:col-span-8 rounded-3xl border p-6 sm:p-8 shadow-2xl space-y-6 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-blue-900/70'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Detail Klinis Penyakit
                </span>
                <h3 className="text-2xl font-bold font-serif">{selectedDisease.namaPenyakit}</h3>
                <p className="text-xs text-slate-400 italic">{selectedDisease.singkatan} • {selectedDisease.kategori}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  <span>Bahaya: {selectedDisease.tingkatBahaya}</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Penyebab:</strong> {selectedDisease.penyebab}
            </p>

            {/* Gejala Pria vs Gejala Wanita */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-rose-50/50 border-rose-200' : 'bg-rose-950/30 border-rose-800/40'
                }`}
              >
                <h5 className="font-bold text-xs text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  <span>Gejala Klinis Pria:</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {selectedDisease.gejalaPria.map((g, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-rose-50/50 border-rose-200' : 'bg-rose-950/30 border-rose-800/40'
                }`}
              >
                <h5 className="font-bold text-xs text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  <span>Gejala Klinis Wanita:</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {selectedDisease.gejalaWanita.map((g, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pencegahan & Skrining Pranikah */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-950/30 border-emerald-800/40'
                }`}
              >
                <h5 className="font-bold text-xs text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Metode Pencegahan:</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {selectedDisease.metodePencegahan.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-blue-50 border-blue-200' : 'bg-blue-950/30 border-blue-800/50'
                }`}
              >
                <h5 className="font-bold text-xs text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>Skrining Pranikah di Puskesmas:</span>
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedDisease.skriningPranikah}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  <strong>Pengobatan:</strong> {selectedDisease.pengobatan}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: VIDEO PEMBELAJARAN */}
      {activeSubTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Video Player */}
          <div
            className={`lg:col-span-8 rounded-3xl border p-6 shadow-2xl space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-blue-900/70'
            }`}
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-slate-800">
              <img
                src={selectedVideo.imageUrl}
                alt={selectedVideo.title}
                className="w-full h-full object-cover opacity-70"
              />
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl transition transform hover:scale-105 cursor-pointer"
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 text-white text-[11px] font-mono">
                {selectedVideo.durasi}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Narasumber: {selectedVideo.narasumber} • {selectedVideo.kategori}
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-serif mt-0.5">
                {selectedVideo.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">
                {selectedVideo.deskripsi}
              </p>
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div
            className={`lg:col-span-4 rounded-3xl border p-5 shadow-xl space-y-3 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-blue-900/70'
            }`}
          >
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Video size={14} className="text-blue-500" />
              <span>Daftar Video Edukasi PKBI</span>
            </h4>

            {videos.map((vid) => {
              const isSelected = selectedVideo.id === vid.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => {
                    setSelectedVideo(vid);
                    setIsPlaying(false);
                  }}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex gap-3 ${
                    isSelected
                      ? isLight
                        ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20'
                        : 'bg-blue-950/80 border-blue-400 ring-2 ring-blue-500/40'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-black shrink-0 relative">
                    <img src={vid.imageUrl} alt={vid.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] text-white font-mono">
                      {vid.durasi}
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <h5 className="text-xs font-bold truncate">{vid.title}</h5>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{vid.narasumber}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: TANYA NAKES (CHAT DOKTER / BIDAN DENGAN DATA TERPUSAT) */}
      {activeSubTab === 'tanya-nakes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Nakes Profile & Selector (DIMUAT OTOMATIS DARI DATASERVICE MASTER) */}
          <div
            className={`lg:col-span-4 rounded-3xl border p-5 shadow-xl space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-blue-900/70'
            }`}
          >
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope size={14} className="text-emerald-500" />
                <span>Pilih Tenaga Kesehatan (Master Data):</span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Profil nakes dan aturan komunikasi dikelola di <code>dataService.ts</code> melalui{' '}
                <code>chat_protokol</code>.
              </p>
            </div>

            <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
              {nakesList.map((nakes) => {
                const isSelected = nakes.id === selectedNakesId;
                return (
                  <button
                    key={nakes.id}
                    type="button"
                    onClick={() => setSelectedNakesId(nakes.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? isLight
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-500/40'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0 mt-0.5">
                      {nakes.avatarIcon || '👨‍⚕️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="text-xs font-bold truncate">{nakes.nama}</h5>
                        {nakes.statusOnline && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
                        )}
                      </div>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                        {nakes.jabatan}
                      </p>
                      <span className="text-[9px] text-slate-400 block truncate">
                        {nakes.spesialisasi}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5 opacity-80">
                        🕒 {nakes.jadwalLayanan}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Topic Prompts (DIMUAT DARI chat_protokol target nakes) */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">
                  Topik Protokol ({selectedNakes.panggilan}):
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-medium">
                  {quickTopics.length} Topik Cepat
                </span>
              </div>
              <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                {quickTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => setNakesQuestion(topic)}
                    className={`text-left text-[11px] p-2 rounded-xl border transition cursor-pointer ${
                      isLight
                        ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800/80'
                    }`}
                  >
                    💬 {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <button
                onClick={() => clearNakesChats()}
                className="text-[11px] text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={12} />
                <span>Bersihkan Riwayat</span>
              </button>
              <span className="text-[10px] text-slate-400">
                SIP: {selectedNakes.nomorSip}
              </span>
            </div>
          </div>

          {/* Active Interactive Consultation Room */}
          <div
            className={`lg:col-span-8 rounded-3xl border p-6 shadow-2xl flex flex-col h-[600px] ${
              isLight
                ? 'bg-white border-emerald-300'
                : 'bg-slate-900/90 border-emerald-500/50'
            }`}
          >
            {/* Header */}
            <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg text-lg">
                  {selectedNakes.avatarIcon || '🩺'}
                </div>
                <div>
                  <h4 className="text-sm font-bold">
                    Konsultasi Tanya Nakes PKBI Kabupaten Buleleng
                  </h4>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ● Terhubung dengan <strong>{selectedNakes.nama}</strong> ({selectedNakes.jabatan})
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 font-semibold">
                🔒 {activeProtokol?.badgeKerahasiaan || 'Rahasia Medis Terjamin'}
              </span>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1">
              {nakesConsultationHistory.length === 0 ? (
                <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl">
                    👨‍⚕️
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Ruang Konsultasi Dokter PKBI ({selectedNakes?.nama || 'dr. Edy Sukarma'})
                  </p>
                  <p className="text-[11px] max-w-sm text-slate-400 leading-relaxed">
                    Riwayat percakapan bersih. Silakan ketik pertanyaan Anda di kolom bawah atau pilih salah satu topik tanya cepat di samping.
                  </p>
                </div>
              ) : (
                nakesConsultationHistory.map((msg) => {
                  const isNakes = msg.sender === 'nakes';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isNakes ? 'items-start' : 'items-end'} space-y-1`}
                    >
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-1">
                        <span className="font-bold">{msg.name}</span>
                        {msg.role && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-600/10 text-emerald-600 border border-emerald-500/30 font-semibold">
                            {msg.role}
                          </span>
                        )}
                        <span>•</span>
                        <span>{msg.time}</span>
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                          isNakes
                            ? isLight
                              ? 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none'
                              : 'bg-slate-950 text-slate-100 border border-emerald-500/30 rounded-tl-none shadow-md'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-lg'
                        }`}
                      >
                        <p>{msg.text}</p>
                        {msg.attachedFile && (
                          <div className="p-2 rounded-xl bg-black/20 text-white text-xs flex items-center justify-between gap-2 border border-white/20">
                            <div className="flex items-center gap-2 truncate">
                              <FileText size={15} />
                              <span className="truncate font-semibold">
                                {msg.attachedFile.fileName}
                              </span>
                            </div>
                            <span className="text-[10px] opacity-80 shrink-0">
                              {msg.attachedFile.fileSize}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Attached file status */}
            {attachedFileForNakes && (
              <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Paperclip size={13} />
                  <span>
                    Lampiran: <strong>{attachedFileForNakes.fileName}</strong> (
                    {attachedFileForNakes.fileSize})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedFileForNakes(null)}
                  className="text-rose-500 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
              </div>
            )}

            {/* Input Form with Attachment */}
            <form
              onSubmit={handleSendNakesQuestion}
              className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() =>
                  setAttachedFileForNakes({
                    fileName: 'Hasil_Pemeriksaan_Laboratorium.pdf',
                    fileSize: '512 KB',
                    fileType: 'application/pdf',
                  })
                }
                title="Lampirkan Dokumen Hasil Lab"
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  attachedFileForNakes
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : isLight
                    ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Paperclip size={15} />
                <span className="hidden sm:inline">Lampirkan Berkas</span>
              </button>

              <input
                id="input-nakes-question"
                type="text"
                value={nakesQuestion}
                onChange={(e) => setNakesQuestion(e.target.value)}
                placeholder={`Tanyakan keluhan medis kepada ${selectedNakes.panggilan || selectedNakes.nama}...`}
                className={`flex-1 rounded-xl px-4 py-2.5 text-xs border focus:outline-none transition ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600 focus:bg-white'
                    : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500'
                }`}
              />
              <button
                id="btn-send-nakes-question"
                type="submit"
                disabled={!nakesQuestion.trim() && !attachedFileForNakes}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
              >
                <span>Kirim</span>
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
