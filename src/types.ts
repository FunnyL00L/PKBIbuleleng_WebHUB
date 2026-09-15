export type ContentCategory = 'map' | 'desa-binaan' | 'pendaftaran-qa' | 'edukasi-interaktif';

export type AppTheme = 'light' | 'dark';
export type AppLanguage = 'id' | 'en' | 'ban';

export interface KecamatanActivity {
  id: string;
  title: string;
  category: string;
  hari: string;
  tanggal: string;
  imageUrl: string;
  description: string;
  participants: number;
  location: string;
}

export interface DesaDetailInfo {
  id: string;
  name: string;
  kecamatanId: string;
  lat: number;
  lng: number;
  population: number;
  posyanduCount: number;
  stuntingPct: number;
  statusBinaan: string;
  deskripsi: string;
  polygonBoundary: [number, number][];
}

export interface KecamatanInfo {
  id: string;
  name: string;
  capital: string;
  areaKm2: number;
  population: number;
  lat: number;
  lng: number;
  positionCategory: 'left' | 'center' | 'right'; // For adaptive popover placement
  color: string;
  activities: KecamatanActivity[];
  deskripsi?: string;
  stuntingRate?: number;
  balitaTerpantau?: number;
  posyanduCount?: number;
  puskesmasList?: string[];
  desaList?: string[];
  detailedDesas?: DesaDetailInfo[];
  boundaryPolygon?: [number, number][];
}

export interface DesaSariMekarProfile {
  name: string;
  kecamatanName: string;
  kabupaten: string;
  lat: number;
  lng: number;
  kepalaDesa: string;
  luasWilayahKm2: number;
  jumlahPenduduk: number;
  jumlahBalita: number;
  fokusProgram: string;
  deskripsi: string;
  posyanduList: string[];
}

export interface StuntingBulanData {
  bulan: string;
  prevalensiStuntingPct: number; // e.g., 18.2% down to 6.4%
  balitaTerpantau: number;
  balitaStunting: number;
  pemberianPMT: number; // Pemberian Makanan Tambahan (telur/susu/gizi)
  targetNasional: number; // 14%
}

export interface BeritaKegiatanDetail {
  id: string;
  desaName: string;
  kecamatanName: string;
  title: string;
  hari: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  kategori: string;
  status: 'Selesai' | 'Sedang Berlangsung' | 'Akan Datang';
  imageUrl: string;
  ringkasan: string;
  isiBeritaLengkap: string;
  narasumber: string;
  pesertaCount: number;
  hasilKegiatan: string[];
}

export interface PenyakitSeksualEdu {
  id: string;
  namaPenyakit: string;
  singkatan: string;
  penyebab: string;
  kategori: string;
  tingkatBahaya: 'Tinggi' | 'Sangat Tinggi' | 'Perlu Perhatian Khusus';
  gejalaPria: string[];
  gejalaWanita: string[];
  caraPenularan: string[];
  metodePencegahan: string[];
  pengobatan: string;
  skriningPranikah: string;
  mitosFakta: { mitos: string; fakta: string }[];
}

export interface VideoEdukasi {
  id: string;
  title: string;
  kategori: string;
  durasi: string;
  narasumber: string;
  deskripsi: string;
  imageUrl: string;
  ringkasanPoin: string[];
}

export type QARoomId = 'kesehatan-seksual' | 'keluarga-asuh';

export interface ChatMessage {
  id: string;
  roomId: QARoomId;
  sender: 'user' | 'bot' | 'petugas';
  senderName: string;
  text: string;
  time: string;
  badge?: string;
  isAnonymous?: boolean;
  attachedFile?: UserUploadedFile;
}

export interface GuestUserProfile {
  guestId: string;
  alias: string;
  joinedAt: string;
  saveHistoryLocally: boolean;
}

export interface PendaftaranCatinSubmission {
  id: string;
  tipe: 'calon-pengantin';
  namaPria: string;
  nikPria: string;
  usiaPria: number;
  namaWanita: string;
  nikWanita: string;
  usiaWanita: number;
  noHp: string;
  kecamatan: string;
  desa: string;
  rencanaTanggalNikah: string;
  puskesmasRujukan: string;
  tanggalDaftar: string;
  nomorRegistrasi: string;
  statusKesehatan: string;
  lampiranBerkas?: UserUploadedFile[];
}

export interface PendaftaranKeluargaAsuhSubmission {
  id: string;
  tipe: 'keluarga-asuh';
  namaLengkap: string;
  nik: string;
  pekerjaan: string;
  noHp: string;
  email: string;
  alamatDomisili: string;
  kecamatan: string;
  desa: string;
  paketBantuan: 'Paket Gizi Balita (PMT)' | 'Bantuan Nutrisi & Vitamin' | 'Pendampingan Penuh 6 Bulan';
  komitmenBulan: number;
  desaSasaran: string; // 'Desa Sari Mekar'
  alasanBergabung: string;
  tanggalDaftar: string;
  nomorRegistrasi: string;
  lampiranBerkas?: UserUploadedFile[];
}

// PROFIL TENAGA KESEHATAN (DOKTER / BIDAN / KONSELOR)
export interface NakesProfile {
  id: string; // e.g. 'dr-arya', 'bidan-astini', 'dr-sujana', 'konselor-widya'
  nama: string; // e.g. 'dr. Wayan Arya Putra, Sp.OG'
  panggilan: string; // e.g. 'dr. Wayan'
  gelar: string;
  peran: 'dokter' | 'bidan' | 'konselor';
  jabatan: string; // e.g. 'Dokter Konselor PKBI Buleleng'
  spesialisasi: string; // e.g. 'Spesialis Skrining Pranikah & IMS'
  avatarIcon: string; // emoji e.g. '👨‍⚕️'
  badgeKeahlian: string;
  statusOnline: boolean;
  jadwalLayanan: string;
  lokasiPraktik: string;
  nomorSip: string;
  deskripsi: string;
}

// ATURAN & PROTOKOL RESPON KOMUNIKASI CHAT
export interface AturanResponProtokol {
  kataKunci: string[];
  responMedis: string;
  tindakanLanjutan?: string;
  prioritas?: 'tinggi' | 'sedang' | 'edukasi';
}

export interface ChatProtokol {
  protokolId: string;
  targetId: string; // nakesId atau roomId
  namaProtokol: string;
  namaNakes: string;
  roleNakes: string;
  avatarIcon: string;
  badgeKerahasiaan: string;
  pesanPembuka: string;
  topikCepat: string[];
  aturanRespon: AturanResponProtokol[];
  responDefault: string;
  responLampiranBerkas: string;
}

// CHAT DOKTER / NAKES
export interface NakesChatMessage {
  id: string;
  nakesId?: string;
  sender: 'user' | 'nakes';
  name: string;
  role?: string;
  text: string;
  time: string;
  date?: string;
  attachedFile?: UserUploadedFile;
}

// BERKAS & DOKUMEN UPLOAD PENGGUNA
export interface UserUploadedFile {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  category: 'catin_ktp' | 'catin_surat_desa' | 'asuh_identitas' | 'asuh_bukti_donasi' | 'konsultasi_medis' | 'lainnya';
  uploadedAt: string;
  uploaderName: string;
  previewUrl?: string;
  description?: string;
}

// 1 UNIFIED MASTER DATABASE SCHEMA (STRUKTUR DATA TUNGGAL)
export interface AppDatabaseSchema {
  version: string;
  lastUpdated: string;
  // Bagian 1: Wilayah & Profil Desa
  kecamatanList: KecamatanInfo[];
  desaSariMekarProfile: DesaSariMekarProfile;
  stuntingMonthlyData: StuntingBulanData[];
  beritaKegiatanList: BeritaKegiatanDetail[];
  // Bagian 2: Edukasi Medis & IMS
  edukasiPenyakitList: PenyakitSeksualEdu[];
  videoEdukasiList: VideoEdukasi[];
  // Bagian 3: Master Nakes & Protokol Chat Medis (chat_protokol)
  nakesList: NakesProfile[];
  chat_protokol: Record<string, ChatProtokol>;
  // Bagian 4: Chat Interaksi Pengguna dengan Dokter / Nakes
  tanyaNakesChats: NakesChatMessage[];
  // Bagian 5: Chat Room Q&A Terbuka & Anonim
  qaChatRooms: Record<QARoomId, ChatMessage[]>;
  // Bagian 6: Formulir Pendaftaran Catin & Keluarga Asuh
  pendaftaranCatinList: PendaftaranCatinSubmission[];
  pendaftaranKeluargaAsuhList: PendaftaranKeluargaAsuhSubmission[];
  // Bagian 7: Berkas & Lampiran Dokumen Pengguna (Files)
  uploadedFiles: UserUploadedFile[];
}
