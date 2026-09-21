import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  Video,
  Play,
  Pause,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  X,
} from 'lucide-react';
import { QAChatSection } from './QAChatSection';
import {
  getEdukasiPenyakitList,
  getVideoEdukasiList,
} from '../services/dataService';
import { PenyakitSeksualEdu, VideoEdukasi } from '../types';
import { useAppTheme } from '../context/ThemeContext';

export const EdukasiInteraktifSection: React.FC = () => {
  const { theme } = useAppTheme();
  const isLight = theme === 'light';

  const diseases = getEdukasiPenyakitList();
  const videos = getVideoEdukasiList();

  const [activeSubTab, setActiveSubTab] = useState<'penyakit' | 'video'>('penyakit');
  const [selectedDisease, setSelectedDisease] = useState<PenyakitSeksualEdu>(diseases[0]);
  const [selectedVideo, setSelectedVideo] = useState<VideoEdukasi>(videos[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Floating Chat Anonim (mode bubble — hilang saat chat dibuka, aktif kembali saat chat ditutup):
  // - Mode mobile : pojok KANAN BAWAH (di atas BottomNav)
  // - Mode desktop: pojok KANAN ATAS
  const [isFloatingQAOpen, setIsFloatingQAOpen] = useState<boolean>(false);

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
            Pusat Edukasi Kesehatan Seksual Reproduksi PKBI
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Edukasi Penyakit Menular Seksual (IMS) & Kesehatan Reproduksi
          </h2>
          <p
            className={`mt-1 text-xs sm:text-sm max-w-2xl leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            Kenali ragam infeksi menular seksual, gejala klinis, pencegahan, serta skrining
            pranikah di Puskesmas. Untuk konsultasi pribadi, gunakan Chat Anonim PKBI di pojok layar.
          </p>
        </div>

        {/* Tab Controls: scroll horizontal mulus di mobile (bukan wrap yang memakan ruang) */}
        <div
          className={`flex items-center gap-2 p-1.5 rounded-2xl border overflow-x-auto no-scrollbar max-w-full ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/90 border-blue-900/60'
          }`}
        >
          <button
            id="tab-edukasi-penyakit"
            onClick={() => setActiveSubTab('penyakit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
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
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
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


      {/* ================================================================== */}
      {/* FLOATING CHAT ANONIM — gelembung menghilang saat chat dibuka &      */}
      {/* muncul kembali saat chat ditutup.                                   */}
      {/* ================================================================== */}
      {!isFloatingQAOpen && (
        <button
          id="btn-float-qa-edukasi"
          onClick={() => setIsFloatingQAOpen(true)}
          aria-label="Buka Chat"
          title="Chat Anonim — Konsultasi Cepat & Rahasia"
          className="fixed z-50 bottom-24 right-4 lg:bottom-auto lg:top-24 lg:right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all cursor-pointer bg-gradient-to-br from-blue-600 to-emerald-500 hover:scale-110"
        >
          <span
            className="absolute inset-0 rounded-full bg-emerald-400/50 animate-ping"
            aria-hidden="true"
          />
          <MessageCircle size={24} className="relative" />
        </button>
      )}

      {/* Panel Chat (fullscreen di HP, floating di desktop) */}
      {isFloatingQAOpen && (
        <QAChatSection onClose={() => setIsFloatingQAOpen(false)} />
      )}
    </div>
  );
};
