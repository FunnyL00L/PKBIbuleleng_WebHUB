import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Calendar,
  Users,
  Building2,
  ArrowRight,
  X,
  Sparkles,
  RotateCcw,
  Compass,
  ChevronRight,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Maximize2,
  Menu,
} from 'lucide-react';
import { DATA_BULELENG_GEOJSON } from '../data/bulelengGeoJson';
import {
  KECAMATAN_LIST,
  DESA_SARI_MEKAR_PROFILE,
} from '../data/bulelengData';
import { KecamatanInfo, KecamatanActivity } from '../types';
import { LamanKecamatanDetail } from './LamanKecamatanDetail';
import { ProgramTerlaksanaDrawer } from './ProgramTerlaksanaDrawer';
import { useAppTheme } from '../context/ThemeContext';

interface MapKecamatanProps {
  onNavigateToProgram?: () => void;
}

export const MapKecamatan: React.FC<MapKecamatanProps> = ({ onNavigateToProgram }) => {
  const { theme } = useAppTheme();
  const isLight = theme === 'light';

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeKecId, setActiveKecId] = useState<string | null>(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState<KecamatanInfo | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<KecamatanActivity | null>(null);
  const [isSariMekarFocused, setIsSariMekarFocused] = useState<boolean>(false);
  const [showHighlightModal, setShowHighlightModal] = useState<boolean>(false);
  const [viewingKecamatan, setViewingKecamatan] = useState<KecamatanInfo | null>(null);
  const [isProgramDrawerOpen, setIsProgramDrawerOpen] = useState<boolean>(false);

  // Style normal - transparan tanpa garis tebal
  const styleNormal: L.PathOptions = {
    color: 'transparent',
    weight: 0,
    fillColor: 'transparent',
    fillOpacity: 0,
  };

  // Style fokus - Garis merah putus-putus + warna transparan saat wilayah diklik
  const styleFokus: L.PathOptions = {
    color: '#ff0000',
    weight: 3,
    dashArray: '5, 5',
    fillColor: '#ffcccc',
    fillOpacity: 0.35,
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Batas Geografis Kabupaten Buleleng (Kunci Peta HANYA di Buleleng)
    // Southwest: Ujung Barat Gerokgak/Gilimanuk
    // Northeast: Pesisir Timur Tejakula
    const bulelengBounds = L.latLngBounds(
      L.latLng(-8.46, 114.40),
      L.latLng(-8.03, 115.54)
    );

    // Inisialisasi Map Buleleng terkunci ketat di batas kabupaten
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      minZoom: 10,
      maxZoom: 16,
      maxBounds: bulelengBounds,
      maxBoundsViscosity: 1.0, // 1.0 memastikan user tidak bisa menggeser peta keluar dari Buleleng
    }).setView([-8.20, 115.00], 10.3);

    // Zoom control di pojok kanan bawah
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // TileLayer OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors | Batas Administrasi Kemendagri',
    }).addTo(map);

    // Layer group untuk pin marker
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    // GeoJSON layer 9 Kecamatan Buleleng
    const layerKecamatan = L.geoJSON(DATA_BULELENG_GEOJSON as any, {
      style: () => styleNormal,
      onEachFeature: (feature, layer) => {
        // Tooltip saat kursor melintas
        layer.bindTooltip('Kec. ' + feature.properties.nama, {
          permanent: false,
          direction: 'center',
          className: 'kec-tooltip',
        });

        // Klik poligon wilayah langsung memunculkan highlight kegiatan
        layer.on('click', () => {
          handleSelectKecamatanById(feature.properties.id, layer as L.Path);
        });

        layer.on('mouseover', () => {
          (layer as L.Path).setStyle({ cursor: 'pointer' } as any);
        });
      },
    }).addTo(map);

    geoJsonLayerRef.current = layerKecamatan;

    // Zoomend listener: jika zoom out kembali ke level awal (<= 10.3), reset gaya
    map.on('zoomend', () => {
      if (map.getZoom() <= 10.2) {
        layerKecamatan.eachLayer((l) => {
          (l as L.Path).setStyle(styleNormal);
        });
        setActiveKecId(null);
        setSelectedKecamatan(null);
        setShowHighlightModal(false);
        markersGroup.clearLayers();
      }
    });

    mapInstanceRef.current = map;

    // Memastikan tile dirender penuh tanpa distorsi saat pertama kali atau kembali ke titik ini
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // ResizeObserver untuk memastikan ukuran map tetap presisi
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handler pemilihan kecamatan (melalui klik peta atau pill atas)
  const handleSelectKecamatanById = (kecId: string, specificLayer?: L.Path) => {
    if (!geoJsonLayerRef.current || !mapInstanceRef.current) return;

    const layerKecamatan = geoJsonLayerRef.current;
    const map = mapInstanceRef.current;

    // 1. Reset semua poligon ke transparan
    layerKecamatan.eachLayer((l) => {
      (l as L.Path).setStyle(styleNormal);
    });

    // 2. Cari layer jika belum di-pass
    let targetLayer: L.Path | undefined = specificLayer;
    if (!targetLayer) {
      layerKecamatan.eachLayer((l: any) => {
        if (l.feature?.properties?.id === kecId) {
          targetLayer = l as L.Path;
        }
      });
    }

    // 3. Pasang border merah putus-putus pada wilayah terpilih
    if (targetLayer) {
      targetLayer.setStyle(styleFokus);
      if ((targetLayer as any).getBounds) {
        map.fitBounds((targetLayer as any).getBounds(), {
          padding: [60, 60],
          maxZoom: 12,
        });
      }
    }

    // 4. Update data state
    setActiveKecId(kecId);
    const kecData = KECAMATAN_LIST.find((k) => k.id === kecId) || null;
    setSelectedKecamatan(kecData);
    setIsSariMekarFocused(false);

    if (kecData && kecData.activities.length > 0) {
      setSelectedActivity(kecData.activities[0]);
    } else {
      setSelectedActivity(null);
    }

    // Tampilkan modal/drawer highlight kegiatan dengan gambar
    setShowHighlightModal(true);

    // 5. Update marker di peta
    updateMapMarkers(kecId, kecData);
  };

  // Marker pembantu di peta
  const updateMapMarkers = (kecId: string, kecData: KecamatanInfo | null) => {
    if (!markersGroupRef.current) return;
    markersGroupRef.current.clearLayers();

    if (!kecData) return;

    if (kecId === 'buleleng') {
      const bulelengIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div class="flex flex-col items-center cursor-pointer -translate-x-1/2 -translate-y-1/2">
            <div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              </svg>
            </div>
            <div class="mt-1 px-2 py-0.5 rounded bg-white text-slate-900 border border-blue-600 text-[10px] font-bold shadow whitespace-nowrap">
              Kec. Buleleng
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const sariMekarIcon = L.divIcon({
        className: 'custom-leaflet-sarimekar',
        html: `
          <div class="flex flex-col items-center cursor-pointer -translate-x-1/2 -translate-y-1/2">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 border-2 border-white shadow-2xl flex items-center justify-center ring-4 ring-amber-400/40 animate-bounce">
              <span class="text-sm">⭐</span>
            </div>
            <div class="mt-1 px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] shadow whitespace-nowrap">
              Desa Sari Mekar
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const mBuleleng = L.marker([kecData.lat, kecData.lng], { icon: bulelengIcon });
      const mSariMekar = L.marker([DESA_SARI_MEKAR_PROFILE.lat, DESA_SARI_MEKAR_PROFILE.lng], {
        icon: sariMekarIcon,
      });

      mSariMekar.on('click', () => {
        setIsSariMekarFocused(true);
        setSelectedActivity({
          id: 'sm-focus-special',
          title: 'Desa Binaan Utama: Pendampingan Posyandu Terpadu & Keluarga Asuh',
          hari: 'Rabu',
          tanggal: '12 Februari 2025',
          location: 'Balai Desa Sari Mekar, Buleleng',
          description:
            'Sentra intervensi stunting PKBI Buleleng. Penurunan prevalensi stunting dari 17.6% menjadi 6.7% melalui 35 orang tua asuh terdaftar.',
          imageUrl:
            'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80',
          participants: 120,
          category: 'Desa Binaan Terpadu',
        });
        setShowHighlightModal(true);
      });

      markersGroupRef.current.addLayer(mBuleleng);
      markersGroupRef.current.addLayer(mSariMekar);
    }
  };

  // Reset peta ke tampilan awal Buleleng
  const handleResetMap = () => {
    if (!mapInstanceRef.current || !geoJsonLayerRef.current) return;

    geoJsonLayerRef.current.eachLayer((l) => {
      (l as L.Path).setStyle(styleNormal);
    });

    markersGroupRef.current?.clearLayers();
    setActiveKecId(null);
    setSelectedKecamatan(null);
    setSelectedActivity(null);
    setIsSariMekarFocused(false);
    setShowHighlightModal(false);

    mapInstanceRef.current.setView([-8.20, 115.00], 10.3);
    mapInstanceRef.current.invalidateSize();
  };

  // Jika user membuka laman detail lengkap kecamatan
  if (viewingKecamatan) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <LamanKecamatanDetail
          kecamatan={viewingKecamatan}
          onBackToMap={() => setViewingKecamatan(null)}
          onNavigateToQA={onNavigateToProgram}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4">
      {/* Container Peta Utama: Navigasi samping telah dihapus sepenuhnya sehingga peta tampil luas dan leluasa */}
      <div
        className={`w-full rounded-2xl overflow-hidden border shadow-2xl relative transition-colors h-[640px] sm:h-[700px] lg:h-[760px] flex flex-col ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#0f172a] border-slate-800 text-white'
        }`}
      >
        {/* =========================================================================
            FLOATING TOP BAR (Header & Quick Kecamatan Selector)
            ========================================================================= */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none">
          {/* Badge Wilayah */}
          <div
            className={`pointer-events-auto backdrop-blur-md px-4 py-2.5 rounded-xl border shadow-lg flex items-center gap-3 transition ${
              isLight
                ? 'bg-white/95 border-slate-200/90 text-slate-800'
                : 'bg-slate-900/95 border-slate-700/80 text-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Compass size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold font-serif leading-none">
                  Kabupaten Buleleng
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  9 Kecamatan
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Batas Administrasi Kemendagri • Klik wilayah untuk melihat foto & highlight kegiatan
              </p>
            </div>
          </div>

          {/* Quick Actions: Hamburger Bar Program & Reset View */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Hamburger Button untuk Program Terlaksana & Jadwal Wilayah */}
            <button
              id="btn-hamburger-program"
              onClick={() => setIsProgramDrawerOpen(true)}
              className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-md border shadow-lg flex items-center gap-2 transition cursor-pointer bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white border-blue-400/40 shadow-blue-600/30"
              title="Buka Menu Program Terlaksana & Jadwal Wilayah"
            >
              <Menu size={16} className="text-white" />
              <span className="hidden xs:inline sm:inline">Program & Jadwal Buleleng</span>
              <span className="xs:hidden sm:hidden">Program</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {/* Quick Action Button: Reset View */}
            <button
              id="btn-reset-map-view"
              onClick={handleResetMap}
              className={`px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border shadow-lg flex items-center gap-1.5 transition cursor-pointer ${
                isLight
                  ? 'bg-white/95 hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-900/95 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
              title="Kembalikan Tampilan Peta Buleleng"
            >
              <RotateCcw size={13} className="text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Reset Tampilan</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            FLOATING PILLS: Pilih Cepat 9 Kecamatan (Horizontal Scroll)
            ========================================================================= */}
        <div className="absolute top-20 sm:top-18 left-4 right-4 z-20 pointer-events-none">
          <div className="pointer-events-auto overflow-x-auto no-scrollbar py-1 flex items-center gap-1.5">
            {DATA_BULELENG_GEOJSON.features.map((feat) => {
              const kecId = feat.properties.id;
              const isActive = activeKecId === kecId;

              return (
                <button
                  key={kecId}
                  id={`pill-kec-${kecId}`}
                  onClick={() => handleSelectKecamatanById(kecId)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-red-600 border-red-500 text-white ring-2 ring-red-400/50'
                      : isLight
                      ? 'bg-white/90 hover:bg-white border-slate-200 text-slate-700 hover:text-blue-600'
                      : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-200 hover:text-blue-400'
                  }`}
                >
                  <MapPin size={11} className={isActive ? 'text-white' : 'text-blue-500'} />
                  <span>Kec. {feat.properties.nama}</span>
                  {kecId === 'buleleng' && (
                    <span className="text-[9px] px-1 rounded bg-amber-400 text-slate-950 font-extrabold">
                      ⭐ Sari Mekar
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            LEAFLET MAP DOM
            ========================================================================= */}
        <div
          ref={mapContainerRef}
          id="map"
          className="w-full h-full flex-1 z-10"
        />

        {/* =========================================================================
            HIGHLIGHT KEGIATAN WILAYAH (Muncul Saat Wilayah Diklik)
            Menampilkan Foto Kegiatan, Agenda, Tanggal, dan Deskripsi Lengkap
            ========================================================================= */}
        {showHighlightModal && selectedKecamatan && selectedActivity && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-lg lg:max-w-xl z-30 animate-in fade-in slide-in-from-bottom-6 duration-300">
            <div
              className={`rounded-2xl border-2 shadow-2xl overflow-hidden backdrop-blur-xl transition-all ${
                isLight
                  ? 'bg-white/95 border-red-500/80 text-slate-800 shadow-red-900/10'
                  : 'bg-slate-900/95 border-red-500/80 text-white shadow-black/80'
              }`}
            >
              {/* Header Bar Popover */}
              <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-100/70 dark:bg-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    Highlight Kegiatan Wilayah
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {selectedKecamatan.name}
                  </span>
                </div>

                <button
                  id="btn-close-highlight-card"
                  onClick={() => setShowHighlightModal(false)}
                  className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition cursor-pointer text-slate-600 dark:text-slate-300"
                  title="Tutup Highlight"
                >
                  <X size={14} />
                </button>
              </div>

              {/* GAMBAR KEGIATAN UTAMA (Featured Activity Image) */}
              <div className="relative w-full h-44 sm:h-52 bg-slate-200 dark:bg-slate-800 overflow-hidden group">
                <img
                  src={selectedActivity.imageUrl}
                  alt={selectedActivity.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                {/* Badge Kategori & Partisipan */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-md flex items-center gap-1">
                    <ImageIcon size={12} />
                    <span>{selectedActivity.category}</span>
                  </span>

                  {selectedKecamatan.id === 'buleleng' && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-md flex items-center gap-1">
                      ⭐ Sari Mekar Binaan
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1.5 mb-1">
                    <Calendar size={12} />
                    <span>
                      {selectedActivity.hari}, {selectedActivity.tanggal}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold font-serif leading-snug drop-shadow">
                    {selectedActivity.title}
                  </h3>
                </div>
              </div>

              {/* Detail Konten & Informasi Lokasi */}
              <div className="p-4 space-y-3">
                {/* Meta Info Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2">
                    <MapPin size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Lokasi Kegiatan:</span>
                      <strong className="text-slate-800 dark:text-slate-200 leading-tight block">
                        {selectedActivity.location}
                      </strong>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2">
                    <Users size={14} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Partisipasi Warga:</span>
                      <strong className="text-slate-800 dark:text-slate-200 leading-tight block">
                        {selectedActivity.participants} Peserta
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Deskripsi Kegiatan */}
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p>{selectedActivity.description}</p>
                </div>

                {/* Jika Kecamatan Buleleng: Pilihan Switch Kegiatan Desa Sari Mekar */}
                {selectedKecamatan.id === 'buleleng' && (
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⭐</span>
                      <div>
                        <span className="font-bold text-amber-900 dark:text-amber-200 block">
                          Fokus Stunting: Desa Sari Mekar
                        </span>
                        <span className="text-[10px] text-amber-700 dark:text-amber-300">
                          Prevalensi turun 17.6% ➔ 6.7% • 35 Orang Tua Asuh
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsSariMekarFocused(!isSariMekarFocused);
                        if (!isSariMekarFocused) {
                          setSelectedActivity({
                            id: 'sm-focus-special',
                            title: 'Pemberdayaan Terpadu Posyandu & Gizi Balita Desa Sari Mekar',
                            hari: 'Senin',
                            tanggal: '07 Oktober 2024',
                            location: 'Balai Banjar Dangin Yeh, Desa Sari Mekar, Buleleng',
                            description:
                              'Skrining kesehatan balita, edukasi ASI eksklusif, dan penyerahan paket nutrisi telur serta susu pertumbuhan.',
                            imageUrl:
                              'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
                            participants: 165,
                            category: 'Kesehatan & Desa Binaan',
                          });
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition shadow-sm shrink-0 cursor-pointer"
                    >
                      {isSariMekarFocused ? 'Kembali' : 'Lihat Sari Mekar'}
                    </button>
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    id="btn-buka-laman-detail-wilayah"
                    onClick={() => setViewingKecamatan(selectedKecamatan)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Building2 size={14} />
                    <span>Laman Detail Lengkap {selectedKecamatan.name}</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    id="btn-tutup-highlight-modal"
                    onClick={() => setShowHighlightModal(false)}
                    className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Drawer Menu Hamburger: Program yang Telah Dilaksanakan & Jadwal Galeri Marquee */}
        <ProgramTerlaksanaDrawer
          isOpen={isProgramDrawerOpen}
          onClose={() => setIsProgramDrawerOpen(false)}
          onSelectKecamatan={(kecId) => {
            handleSelectKecamatanById(kecId);
          }}
        />
      </div>
    </div>
  );
};
