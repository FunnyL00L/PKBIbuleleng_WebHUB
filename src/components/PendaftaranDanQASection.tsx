import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  FileCheck2,
  Sparkles,
  HeartHandshake,
  UserCheck,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Copy,
  Database,
  UploadCloud,
  FilePlus,
  RefreshCw,
  Check,
  Stethoscope,
} from 'lucide-react';
import {
  GuestUserProfile,
  PendaftaranCatinSubmission,
  PendaftaranKeluargaAsuhSubmission,
  AppDatabaseSchema,
} from '../types';
import {
  getData,
  subscribeData,
  getPendaftaranCatinList,
  submitPendaftaranCatin,
  getPendaftaranKeluargaAsuhList,
  submitPendaftaranKeluargaAsuh,
  getUploadedFiles,
  addUploadedFile,
  deleteUploadedFile,
  exportDatabaseJSON,
  importDatabaseJSON,
  resetDatabaseToDefault,
  getChatProtokol,
  getNakesList,
} from '../services/dataService';
import { useAppTheme } from '../context/ThemeContext';
import { QAChatSection } from './QAChatSection';

export const PendaftaranDanQASection: React.FC = () => {
  const { theme } = useAppTheme();
  const isLight = theme === 'light';

  // Master Database Snapshot from Data Service
  const [dbState, setDbState] = useState<AppDatabaseSchema>(() => getData());

  useEffect(() => {
    const unsubscribe = subscribeData((updatedData) => {
      setDbState(updatedData);
    });
    return unsubscribe;
  }, []);

  // Main view tab: 'qa' | 'pendaftaran' | 'database'
  const [activeMainTab, setActiveMainTab] = useState<'qa' | 'pendaftaran' | 'database'>('qa');

  // Guest User Profile State
  const [guestProfile, setGuestProfile] = useState<GuestUserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('buleleng_guest_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    const randomId = Math.floor(1000 + Math.random() * 9000);
    return {
      guestId: `GUEST-${randomId}`,
      alias: `Tamu Anonim #${randomId}`,
      joinedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      saveHistoryLocally: true,
    };
  });

  const [copiedJSON, setCopiedJSON] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  // Registration states
  const [regType, setRegType] = useState<'catin' | 'keluarga-asuh'>('catin');
  const [catinForm, setCatinForm] = useState({
    namaPria: '',
    nikPria: '',
    usiaPria: '',
    namaWanita: '',
    nikWanita: '',
    usiaWanita: '',
    noHp: '',
    kecamatan: 'Buleleng',
    desa: 'Desa Sari Mekar',
    rencanaTanggalNikah: '',
    puskesmasRujukan: 'Puskesmas Buleleng I',
  });

  const [asuhForm, setAsuhForm] = useState({
    namaLengkap: '',
    nik: '',
    pekerjaan: '',
    noHp: '',
    email: '',
    alamatDomisili: '',
    paketBantuan: 'Paket Gizi Balita (PMT)' as const,
    komitmenBulan: 6,
    alasanBergabung: '',
  });

  const [registeredCatinResult, setRegisteredCatinResult] = useState<PendaftaranCatinSubmission | null>(null);
  const [registeredAsuhResult, setRegisteredAsuhResult] = useState<PendaftaranKeluargaAsuhSubmission | null>(null);

  // Impor / Unggah File JSON Master Database (diproses oleh importDatabaseJSON di dataService)
  const handleImportJSONFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const ok = importDatabaseJSON(String(reader.result));
      setImportStatus(
        ok
          ? { ok: true, msg: `Basis data berhasil dimuat dari file "${file.name}".` }
          : {
              ok: false,
              msg: 'Gagal memuat: file JSON tidak valid atau strukturnya tidak dikenali.',
            }
      );
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.onerror = () => {
      setImportStatus({ ok: false, msg: 'Gagal membaca file. Silakan coba lagi.' });
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Registration Submissions via DataService
  const handleSubmitCatin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catinForm.namaPria || !catinForm.namaWanita || !catinForm.noHp) return;

    const result = submitPendaftaranCatin({
      namaPria: catinForm.namaPria,
      nikPria: catinForm.nikPria || '510801xxxxxxxxxx',
      usiaPria: Number(catinForm.usiaPria) || 25,
      namaWanita: catinForm.namaWanita,
      nikWanita: catinForm.nikWanita || '510801xxxxxxxxxx',
      usiaWanita: Number(catinForm.usiaWanita) || 24,
      noHp: catinForm.noHp,
      kecamatan: catinForm.kecamatan,
      desa: catinForm.desa,
      rencanaTanggalNikah: catinForm.rencanaTanggalNikah || '2025-06-15',
      puskesmasRujukan: catinForm.puskesmasRujukan,
    });

    setRegisteredCatinResult(result);
  };

  const handleSubmitAsuh = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asuhForm.namaLengkap || !asuhForm.noHp) return;

    const result = submitPendaftaranKeluargaAsuh({
      namaLengkap: asuhForm.namaLengkap,
      nik: asuhForm.nik || '510801xxxxxxxxxx',
      pekerjaan: asuhForm.pekerjaan || 'Wiraswasta / ASN',
      noHp: asuhForm.noHp,
      email: asuhForm.email || '-',
      alamatDomisili: asuhForm.alamatDomisili || 'Singaraja, Buleleng',
      kecamatan: 'Buleleng',
      desa: 'Sari Mekar',
      paketBantuan: asuhForm.paketBantuan,
      komitmenBulan: asuhForm.komitmenBulan,
      desaSasaran: 'Desa Sari Mekar',
      alasanBergabung: asuhForm.alasanBergabung || 'Ingin berkontribusi nyata menuntaskan stunting.',
    });

    setRegisteredAsuhResult(result);
  };

  const handleCopyJSON = () => {
    const json = exportDatabaseJSON();
    navigator.clipboard.writeText(json);
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  const handleDownloadJSON = () => {
    const json = exportDatabaseJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pkbi_buleleng_database_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors ${
        isLight ? 'text-slate-800' : 'text-white'
      }`}
    >
      {/* 1. Header Banner & Main Mode Switcher */}
      <div
        className={`pb-6 border-b flex flex-col md:flex-row md:items-end justify-between gap-4 ${
          isLight ? 'border-slate-200' : 'border-blue-900/60'
        }`}
      >
        <div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border ${
              isLight
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-blue-500/20 border-blue-400/40 text-blue-300'
            }`}
          >
            <Sparkles size={13} className={isLight ? 'text-blue-600' : 'text-blue-400'} />
            Sistem Data Terpadu & Terpisah (Clean Architecture)
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Laman Q&A, Pendaftaran & Basis Data Terpadu
          </h2>
          <p
            className={`mt-1 text-xs sm:text-sm max-w-2xl leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            Data dan tampilan antarmuka terpisah secara independen untuk meminimalisir bug. Seluruh
            interaksi chat, berkas file, dan formulir pendaftaran terkumpul dalam 1 basis data master
            yang siap dihubungkan ke database Anda.
          </p>
        </div>

        {/* Main Section Switcher: Q&A vs Pendaftaran vs Database - Scroll horizontal mulus di mobile */}
        <div
          className={`flex items-center gap-1.5 p-1.5 rounded-2xl border overflow-x-auto no-scrollbar max-w-full ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/90 border-blue-900/60'
          }`}
        >
          <button
            id="tab-btn-qa"
            onClick={() => setActiveMainTab('qa')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeMainTab === 'qa'
                ? 'bg-blue-600 text-white shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare size={15} />
            <span>Chat Q&A (Anonim)</span>
          </button>

          <button
            id="tab-btn-pendaftaran"
            onClick={() => setActiveMainTab('pendaftaran')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeMainTab === 'pendaftaran'
                ? 'bg-blue-600 text-white shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck2 size={15} />
            <span>Pendaftaran Catin & Asuh</span>
          </button>

          <button
            id="tab-btn-database"
            onClick={() => setActiveMainTab('database')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeMainTab === 'database'
                ? 'bg-blue-600 text-white shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database size={15} />
            <span>Pusat Data & Berkas ({dbState.uploadedFiles.length} File)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB A: LAMAN CHAT Q&A — KODE TERPISAH DI src/components/QAChatSection.tsx */}
      {/* ========================================================================= */}
      {activeMainTab === 'qa' && <QAChatSection />}




      {/* ========================================================================= */}
      {/* TAB B: FORMULIR PENDAFTARAN RESMI (CATIN & KELUARGA ASUH)                */}
      {/* ========================================================================= */}
      {activeMainTab === 'pendaftaran' && (
        <div className="space-y-6">
          {/* Sub-Tabs: Catin vs Keluarga Asuh */}
          <div
            className={`flex items-center gap-3 border-b pb-3 ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}
          >
            <button
              id="btn-reg-tab-catin"
              onClick={() => setRegType('catin')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                regType === 'catin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isLight
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck size={16} />
              <span>Skrining Calon Pengantin (Catin)</span>
            </button>
            <button
              id="btn-reg-tab-asuh"
              onClick={() => setRegType('keluarga-asuh')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                regType === 'keluarga-asuh'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isLight
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <HeartHandshake size={16} />
              <span>Keluarga Asuh Stunting Desa Sari Mekar</span>
            </button>
          </div>

          {/* CATIN FORM */}
          {regType === 'catin' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div
                className={`lg:col-span-8 rounded-3xl border p-6 sm:p-7 shadow-xl space-y-6 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-blue-900/70'
                }`}
              >
                <div>
                  <h3
                    className={`text-lg font-bold font-serif ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Formulir Registrasi Skrining Pranikah PKBI Buleleng
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Data disimpan langsung ke tabel <code>pendaftaranCatinList</code> di DataService.
                  </p>
                </div>

                {registeredCatinResult ? (
                  <div
                    className={`p-6 rounded-2xl border text-center space-y-4 ${
                      isLight
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
                    }`}
                  >
                    <CheckCircle2 size={42} className="mx-auto text-emerald-500" />
                    <div>
                      <h4 className="text-base font-bold">Pendaftaran Berhasil Disimpan!</h4>
                      <p className="text-xs mt-1">
                        Nomor Registrasi: <strong>{registeredCatinResult.nomorRegistrasi}</strong>
                      </p>
                      <p className="text-xs opacity-80 mt-0.5">
                        Puskesmas Rujukan: {registeredCatinResult.puskesmasRujukan}
                      </p>
                    </div>
                    <button
                      onClick={() => setRegisteredCatinResult(null)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Daftar Kembali
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitCatin} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold">Nama Calon Suami (Pria)</label>
                        <input
                          type="text"
                          required
                          value={catinForm.namaPria}
                          onChange={(e) => setCatinForm({ ...catinForm, namaPria: e.target.value })}
                          placeholder="contoh: I Kadek Sudarma"
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                            isLight
                              ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                              : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold">Nama Calon Istri (Wanita)</label>
                        <input
                          type="text"
                          required
                          value={catinForm.namaWanita}
                          onChange={(e) => setCatinForm({ ...catinForm, namaWanita: e.target.value })}
                          placeholder="contoh: Ni Luh Putu Sintia"
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                            isLight
                              ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                              : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold">Nomor WhatsApp Aktif</label>
                        <input
                          type="tel"
                          required
                          value={catinForm.noHp}
                          onChange={(e) => setCatinForm({ ...catinForm, noHp: e.target.value })}
                          placeholder="08xxxxxxxxxx"
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                            isLight
                              ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                              : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold">Puskesmas Rujukan Terdekat</label>
                        <select
                          value={catinForm.puskesmasRujukan}
                          onChange={(e) =>
                            setCatinForm({ ...catinForm, puskesmasRujukan: e.target.value })
                          }
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                            isLight
                              ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                              : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                          }`}
                        >
                          <option>Puskesmas Buleleng I</option>
                          <option>Puskesmas Buleleng II</option>
                          <option>Puskesmas Sukasada I</option>
                          <option>Puskesmas Tejakula I</option>
                          <option>Puskesmas Seririt I</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition shadow-lg cursor-pointer mt-4"
                    >
                      Daftarkan Jadwal Skrining Pranikah
                    </button>
                  </form>
                )}
              </div>

              {/* Sidebar Info */}
              <div
                className={`lg:col-span-4 rounded-3xl border p-5 shadow-xl space-y-4 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-blue-900/70'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  <ShieldCheck size={16} />
                  <span>Jaminan Privasi Data</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                  Semua pendaftaran skrining pranikah disimpan dalam basis data terpadu dan hanya
                  dapat diakses oleh nakes berwenang di Puskesmas rujukan.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-bold block mb-1">Total Pendaftar Tersimpan:</span>
                  <span className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                    {dbState.pendaftaranCatinList.length} Pasangan Catin
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ASUH FORM */}
          {regType === 'keluarga-asuh' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div
                className={`lg:col-span-8 rounded-3xl border p-6 sm:p-7 shadow-xl space-y-6 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-blue-900/70'
                }`}
              >
                <div>
                  <h3
                    className={`text-lg font-bold font-serif ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Formulir Komitmen Orang Tua Asuh Balita Stunting
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Data disimpan langsung ke tabel <code>pendaftaranKeluargaAsuhList</code> di
                    DataService.
                  </p>
                </div>

                {registeredAsuhResult ? (
                  <div
                    className={`p-6 rounded-2xl border text-center space-y-4 ${
                      isLight
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
                    }`}
                  >
                    <CheckCircle2 size={42} className="mx-auto text-emerald-500" />
                    <div>
                      <h4 className="text-base font-bold">Komitmen Anda Telah Tersimpan!</h4>
                      <p className="text-xs mt-1">
                        Nomor Registrasi: <strong>{registeredAsuhResult.nomorRegistrasi}</strong>
                      </p>
                      <p className="text-xs opacity-80 mt-0.5">
                        Paket: {registeredAsuhResult.paketBantuan} • Sasaran:{' '}
                        {registeredAsuhResult.desaSasaran}
                      </p>
                    </div>
                    <button
                      onClick={() => setRegisteredAsuhResult(null)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Daftar Kembali
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitAsuh} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold">Nama Lengkap / Instansi</label>
                        <input
                          type="text"
                          required
                          value={asuhForm.namaLengkap}
                          onChange={(e) => setAsuhForm({ ...asuhForm, namaLengkap: e.target.value })}
                          placeholder="contoh: I Made Sukadana, S.E."
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                            isLight
                              ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                              : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold">Pekerjaan / Usaha</label>
                        <input
                          type="text"
                          value={asuhForm.pekerjaan}
                          onChange={(e) => setAsuhForm({ ...asuhForm, pekerjaan: e.target.value })}
                          placeholder="contoh: Wiraswasta / ASN"
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                            isLight
                              ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                              : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold">Nomor WhatsApp Aktif</label>
                        <input
                          type="tel"
                          required
                          value={asuhForm.noHp}
                          onChange={(e) => setAsuhForm({ ...asuhForm, noHp: e.target.value })}
                          placeholder="08xxxxxxxxxx"
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                            isLight
                              ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                              : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold">Paket Bantuan Nutrisi</label>
                        <select
                          value={asuhForm.paketBantuan}
                          onChange={(e) =>
                            setAsuhForm({
                              ...asuhForm,
                              paketBantuan: e.target.value as any,
                            })
                          }
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                            isLight
                              ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                              : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'
                          }`}
                        >
                          <option>Paket Gizi Balita (PMT)</option>
                          <option>Bantuan Nutrisi & Vitamin</option>
                          <option>Pendampingan Penuh 6 Bulan</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition shadow-lg cursor-pointer mt-4"
                    >
                      Konfirmasi Komitmen Keluarga Asuh
                    </button>
                  </form>
                )}
              </div>

              {/* Sidebar Info */}
              <div
                className={`lg:col-span-4 rounded-3xl border p-5 shadow-xl space-y-4 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-blue-900/70'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
                  <HeartHandshake size={16} />
                  <span>Keluarga Asuh Aktif</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                  Pemberian 2 butir telur dan ikan setiap hari didanai oleh orang tua asuh yang
                  terdata di DataService.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-bold block mb-1">Total Keluarga Asuh Terdaftar:</span>
                  <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {dbState.pendaftaranKeluargaAsuhList.length} Donatur Peduli
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB C: PUSAT DATA & BERKAS (MASTER DATABASE 1-FILE READY FOR BACKEND)     */}
      {/* ========================================================================= */}
      {activeMainTab === 'database' && (
        <div className="space-y-8">
          {/* Overview Architecture Card */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border shadow-xl ${
              isLight
                ? 'bg-gradient-to-br from-blue-50 to-white border-blue-200'
                : 'bg-gradient-to-br from-slate-900 to-blue-950/60 border-blue-900/70'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  <Database size={15} />
                  <span>Struktur Data Terpusat (Single Master Database)</span>
                </div>
                <h3
                  className={`text-xl sm:text-2xl font-bold font-serif ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Pusat Kendali Data Aplikasi & Lampiran Berkas
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 max-w-3xl leading-relaxed">
                  Semua data sistem (User Chat, File Upload, Pendaftaran Catin & Asuh, Data Wilayah,
                  dan Stunting) dikelola dalam 1 modul repository di <code>src/services/dataService.ts</code>{' '}
                  dan <code>src/data/masterDatabase.ts</code>. Anda sangat mudah mengintegrasikannya ke
                  database backend (seperti Firestore, Supabase, atau PostgreSQL) hanya dengan mengubah file
                  tersebut!
                </p>
              </div>

              {/* Action Buttons: Copy JSON & Download .json */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyJSON}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
                >
                  {copiedJSON ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedJSON ? 'Tersalin!' : 'Salin JSON Database'}</span>
                </button>
                <button
                  onClick={handleDownloadJSON}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-white border-blue-800/80'
                  }`}
                >
                  <Download size={14} />
                  <span>Unduh File .json</span>
                </button>
                <button
                  onClick={() => jsonInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
                  title="Muat basis data dari file JSON hasil unduhan sebelumnya"
                >
                  <UploadCloud size={14} />
                  <span>Unggah File JSON</span>
                </button>
                <input
                  ref={jsonInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleImportJSONFile}
                />
                <button
                  onClick={() => {
                    if (confirm('Kembalikan database ke data bawaan awal?')) {
                      resetDatabaseToDefault();
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/20 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="Reset Database"
                >
                  <RefreshCw size={13} />
                  <span>Reset Data</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/80">
              <div
                className={`p-3 rounded-2xl border text-center ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                  Kanal Chat Q&A
                </span>
                <span className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                  {dbState.qaChatRooms['kesehatan-seksual'].length +
                    dbState.qaChatRooms['keluarga-asuh'].length}{' '}
                  Pesan
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl border text-center ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                  Chat Dokter / Nakes
                </span>
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {dbState.tanyaNakesChats.length} Percakapan
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl border text-center ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                  Total Pendaftaran
                </span>
                <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                  {dbState.pendaftaranCatinList.length + dbState.pendaftaranKeluargaAsuhList.length} Rekam
                </span>
              </div>

              <div
                className={`p-3 rounded-2xl border text-center ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                  Berkas / File Upload
                </span>
                <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {dbState.uploadedFiles.length} File
                </span>
              </div>
            </div>

            {/* Status Impor / Unggah JSON */}
            {importStatus && (
              <div
                className={`mt-4 px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                  importStatus.ok
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-rose-50 border-rose-300 text-rose-700'
                }`}
              >
                {importStatus.ok ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                <span>{importStatus.msg}</span>
              </div>
            )}
          </div>

          {/* Section 1: Berkas / Dokumen Upload Pengguna */}
          <div
            className={`p-6 rounded-3xl border shadow-md space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-blue-900/70'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4
                  className={`text-base font-bold font-serif flex items-center gap-2 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  <FileText className="text-blue-600" size={18} />
                  <span>Daftar Berkas & Lampiran Pengguna (Files)</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Berkas yang dilampirkan pengguna saat chat maupun registrasi tersimpan di tabel{' '}
                  <code>uploadedFiles</code>.
                </p>
              </div>

              <button
                onClick={() => {
                  const randomId = Math.floor(100 + Math.random() * 900);
                  addUploadedFile({
                    fileName: `Surat_Keterangan_Sehat_${randomId}.pdf`,
                    fileSize: '720 KB',
                    fileType: 'application/pdf',
                    category: 'konsultasi_medis',
                    uploaderName: guestProfile.alias,
                    description: 'Dokumen tes laboratorium mandiri',
                  });
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <FilePlus size={14} />
                <span>Unggah Contoh Dokumen Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {dbState.uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 transition ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 hover:border-blue-400'
                      : 'bg-slate-950 border-slate-800 hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-xs block truncate" title={file.fileName}>
                          {file.fileName}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{file.fileSize}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteUploadedFile(file.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                      title="Hapus File"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {file.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {file.description}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Oleh: {file.uploaderName}</span>
                    <span>{file.uploadedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Profil Tenaga Kesehatan & Chat Protokol (Centralized in dataService) */}
          <div
            className={`p-6 rounded-3xl border shadow-md space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-blue-900/70'
            }`}
          >
            <div>
              <h4
                className={`text-base font-bold font-serif flex items-center gap-2 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                <Stethoscope className="text-emerald-500" size={18} />
                <span>Tenaga Kesehatan & Sistem Protokol Chat (chat_protokol)</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Data dokter/bidan serta respon otomasi chat terpusat di <code>masterDatabase.ts</code> dan diproses oleh <code>dataService.ts</code>.
              </p>
            </div>

            {/* Nakes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {getNakesList().map((nakes) => {
                const protokol = getChatProtokol(nakes.id);
                return (
                  <div
                    key={nakes.id}
                    className={`p-4 rounded-2xl border space-y-2 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-600 flex items-center justify-center text-lg shrink-0 font-bold">
                        {nakes.avatarIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold truncate">{nakes.nama}</h5>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-mono">
                            {nakes.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                          {nakes.jabatan}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {nakes.spesialisasi} • {nakes.lokasiPraktik}
                        </p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          SIP: {nakes.nomorSip} | Jadwal: {nakes.jadwalLayanan}
                        </span>
                      </div>
                    </div>

                    {protokol && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-600 dark:text-slate-300">
                            Aturan Respon:
                          </span>
                          <span className="text-emerald-500 font-mono">
                            {protokol.aturanRespon.length} Kata Kunci Terdaftar
                          </span>
                        </div>
                        <p className="text-[10px] italic line-clamp-1">
                          Default: &quot;{protokol.responDefault}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: JSON Viewer Code Box */}
          <div
            className={`p-6 rounded-3xl border shadow-md space-y-3 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-blue-900/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4
                  className={`text-base font-bold font-serif ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Snapshot Data Mentah (Master Database JSON)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Data ini adalah replika struktur tunggal yang siap dimasukkan ke database server Anda.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                v{dbState.version} • Terakhir diperbarui:{' '}
                {new Date(dbState.lastUpdated).toLocaleTimeString('id-ID')}
              </span>
            </div>

            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto">
              <pre>{exportDatabaseJSON()}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
