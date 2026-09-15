import {
  AppDatabaseSchema,
  NakesChatMessage,
  ChatMessage,
  QARoomId,
  PendaftaranCatinSubmission,
  PendaftaranKeluargaAsuhSubmission,
  UserUploadedFile,
  KecamatanInfo,
  DesaSariMekarProfile,
  StuntingBulanData,
  BeritaKegiatanDetail,
  PenyakitSeksualEdu,
  VideoEdukasi,
  NakesProfile,
  ChatProtokol,
} from '../types';
import { MASTER_DATABASE_DEFAULT } from '../data/masterDatabase';

/**
 * =========================================================================
 * DATA SERVICE REPOSITORY (PUSAT AKSES DATA SATU PINTU)
 * =========================================================================
 * Seluruh data aplikasi (Daftar Dokter/Nakes, chat_protokol, Chat Q&A Anonim,
 * Pendaftaran Catin & Asuh, Berkas Upload, Data Kecamatan, dan Stunting)
 * dikelola secara terpusat di sini.
 *
 * Komponen UI HANYA memanggil fungsi dari file ini tanpa memegang logika dummy
 * atau hardcoded text dokter/nakes sama sekali.
 */

const STORAGE_KEY = 'buleleng_master_database_v2';

// In-Memory Cache with LocalStorage Persistence
let currentDatabase: AppDatabaseSchema = (() => {
  if (typeof window === 'undefined') {
    return { ...MASTER_DATABASE_DEFAULT };
  }
  try {
    // Clear old v1 storage if exists
    localStorage.removeItem('buleleng_master_database_v1');

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Selalu gunakan nakesList dari source code MASTER_DATABASE_DEFAULT
      // agar perubahan di source code langsung tampil real-time
      return {
        ...MASTER_DATABASE_DEFAULT,
        ...parsed,
        nakesList: MASTER_DATABASE_DEFAULT.nakesList,
        chat_protokol: {
          ...MASTER_DATABASE_DEFAULT.chat_protokol,
          ...(parsed.chat_protokol || {}),
        },
        tanyaNakesChats: [], // Percakapan nakes dikosongkan sesuai permintaan pengguna
        qaChatRooms: {
          ...MASTER_DATABASE_DEFAULT.qaChatRooms,
          ...(parsed.qaChatRooms || {}),
        },
      };
    }
  } catch (err) {
    console.error('Error loading master database from storage, using defaults:', err);
  }
  return { ...MASTER_DATABASE_DEFAULT, tanyaNakesChats: [] };
})();

// Subscribers for reactive updates across components
type DatabaseListener = (data: AppDatabaseSchema) => void;
const listeners: Set<DatabaseListener> = new Set();

function persistAndNotify(): void {
  try {
    currentDatabase.lastUpdated = new Date().toISOString();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentDatabase));
    }
  } catch (e) {
    console.error('Failed to persist database to storage:', e);
  }
  // Notify all listeners
  listeners.forEach((listener) => {
    try {
      listener({ ...currentDatabase });
    } catch (e) {
      console.error('Error in database listener:', e);
    }
  });
}

// ==========================================
// 1. GET DATA UTAMA (MASTER GET DATA)
// ==========================================
export const getData = (): AppDatabaseSchema => {
  return { ...currentDatabase };
};

export const subscribeData = (listener: DatabaseListener): (() => void) => {
  listeners.add(listener);
  // Immediate call with current state
  listener({ ...currentDatabase });
  return () => {
    listeners.delete(listener);
  };
};

export const exportDatabaseJSON = (): string => {
  return JSON.stringify(currentDatabase, null, 2);
};

export const importDatabaseJSON = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString) as AppDatabaseSchema;
    if (parsed && typeof parsed === 'object') {
      currentDatabase = {
        ...MASTER_DATABASE_DEFAULT,
        ...parsed,
      };
      persistAndNotify();
      return true;
    }
  } catch (e) {
    console.error('Failed to import database JSON:', e);
  }
  return false;
};

export const resetDatabaseToDefault = (): void => {
  currentDatabase = JSON.parse(JSON.stringify(MASTER_DATABASE_DEFAULT));
  persistAndNotify();
};

// ==========================================
// 2. MASTER TENAGA KESEHATAN (NAKES) & PROTOKOL CHAT (chat_protokol)
// ==========================================
export const getNakesList = (): NakesProfile[] => {
  // Selalu merujuk ke MASTER_DATABASE_DEFAULT.nakesList dari sourcecode
  // sehingga penambahan atau perubahan nama dokter di sourcecode langsung aktif
  return MASTER_DATABASE_DEFAULT.nakesList;
};

export const getNakesById = (nakesId: string): NakesProfile | undefined => {
  return MASTER_DATABASE_DEFAULT.nakesList.find((n) => n.id === nakesId);
};

export const getChatProtokol = (targetId: string): ChatProtokol | undefined => {
  if (MASTER_DATABASE_DEFAULT.chat_protokol[targetId]) {
    return MASTER_DATABASE_DEFAULT.chat_protokol[targetId];
  }
  if (currentDatabase.chat_protokol?.[targetId]) {
    return currentDatabase.chat_protokol[targetId];
  }
  // Auto-generator bila dokter baru ditambahkan di sourcecode MASTER_NAKES_LIST
  const nakes = getNakesById(targetId);
  if (nakes) {
    return {
      protokolId: `protokol-${nakes.id}`,
      targetId: nakes.id,
      namaProtokol: `Protokol Konsultasi ${nakes.nama}`,
      namaNakes: nakes.nama,
      roleNakes: nakes.jabatan,
      avatarIcon: nakes.avatarIcon || '👨‍⚕️',
      badgeKerahasiaan: 'Rahasia Medis Terjamin 100%',
      pesanPembuka: `Om Swastiastu. Saya ${nakes.nama} dari ${nakes.jabatan}. Silakan sampaikan pertanyaan Anda.`,
      topikCepat: [
        'Apakah tes HIV & IMS di Puskesmas Buleleng dijamin rahasia?',
        'Berapa bulan sebelum menikah cek darah pranikah harus dilakukan?',
        'Bagaimana cara mencegah stunting sejak masa kehamilan?',
      ],
      aturanRespon: [],
      responDefault: 'Pertanyaan saya terima, mohon di tunggu',
      responLampiranBerkas: 'Pertanyaan saya terima, mohon di tunggu',
    };
  }
  return undefined;
};

export const getAllChatProtokol = (): Record<string, ChatProtokol> => {
  return currentDatabase.chat_protokol || MASTER_DATABASE_DEFAULT.chat_protokol;
};

export const getTopikCepatForNakes = (nakesId: string): string[] => {
  const protokol = getChatProtokol(nakesId);
  return (
    protokol?.topikCepat || [
      'Apakah tes HIV & IMS di Puskesmas Buleleng dijamin rahasia?',
      'Berapa bulan sebelum menikah cek darah pranikah harus dilakukan?',
      'Bagaimana cara mencegah stunting sejak masa kehamilan?',
    ]
  );
};

export const getTopikCepatForRoom = (roomId: QARoomId): string[] => {
  const protokol = getChatProtokol(roomId);
  return (
    protokol?.topikCepat || [
      'Berapa lama sebelum menikah tes kesehatan harus dilakukan?',
      'Apakah hasil tes HIV & Sifilis dijamin rahasia?',
      'Apa saja syarat pemeriksaan calon pengantin di Puskesmas?',
    ]
  );
};

/**
 * Mesin Pencocok Protokol Komunikasi (Protocol Matching Engine)
 * Sesuai instruksi: Inti jawabannya adalah 'Pertanyaan saya terima, mohon di tunggu'
 */
export const prosesPesanProtokol = (
  protokol: ChatProtokol,
  pesanText: string,
  berkas?: UserUploadedFile
): string => {
  return protokol.responDefault || 'Pertanyaan saya terima, mohon di tunggu';
};

// ==========================================
// 3. BAGIAN CHAT DOKTER / NAKES
// ==========================================
export const getNakesChats = (filterNakesId?: string): NakesChatMessage[] => {
  const allChats = currentDatabase.tanyaNakesChats || [];
  if (filterNakesId) {
    return allChats.filter((c) => !c.nakesId || c.nakesId === filterNakesId);
  }
  return allChats;
};

export const addNakesMessage = (message: NakesChatMessage): void => {
  currentDatabase.tanyaNakesChats = [...(currentDatabase.tanyaNakesChats || []), message];
  persistAndNotify();
};

export const clearNakesChats = (): void => {
  currentDatabase.tanyaNakesChats = [];
  persistAndNotify();
};

/**
 * Fungsi Pengiriman Chat Dokter / Nakes Resmi Melalui chat_protokol
 * Respon otomatis: "Pertanyaan saya terima, mohon di tunggu"
 */
export const kirimPesanTanyaNakes = ({
  nakesId,
  text,
  attachedFile,
  senderName,
}: {
  nakesId: string;
  text: string;
  attachedFile?: UserUploadedFile;
  senderName?: string;
}): { userMsg: NakesChatMessage; nakesReply: NakesChatMessage } => {
  const nakesProfile = getNakesById(nakesId);
  const protokol = getChatProtokol(nakesId) || MASTER_DATABASE_DEFAULT.chat_protokol['dr-edy'];
  const timeStr =
    new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA';

  // 1. Simpan Pesan Pengguna
  const userMsg: NakesChatMessage = {
    id: `tn-usr-${Date.now()}`,
    nakesId,
    sender: 'user',
    name: senderName || 'Warga Buleleng',
    text: text || (attachedFile ? `[Melampirkan Dokumen: ${attachedFile.fileName}]` : ''),
    time: timeStr,
    date: 'Hari ini',
    attachedFile,
  };
  addNakesMessage(userMsg);

  // 2. Olah Respon: "Pertanyaan saya terima, mohon di tunggu"
  const responText = 'Pertanyaan saya terima, mohon di tunggu';
  const nakesReply: NakesChatMessage = {
    id: `tn-reply-${Date.now() + 1}`,
    nakesId,
    sender: 'nakes',
    name: nakesProfile ? nakesProfile.nama : (protokol?.namaNakes || 'dr. Edy Sukarma'),
    role: nakesProfile ? nakesProfile.jabatan : (protokol?.roleNakes || 'Dokter PKBI Buleleng'),
    text: responText,
    time: timeStr,
    date: 'Hari ini',
  };

  addNakesMessage(nakesReply);

  return { userMsg, nakesReply };
};

// ==========================================
// 4. BAGIAN CHAT Q&A (KESEHATAN SEKSUAL & KELUARGA ASUH)
// ==========================================
export const getQAChatMessages = (roomId: QARoomId): ChatMessage[] => {
  return currentDatabase.qaChatRooms?.[roomId] || [];
};

export const addQAChatMessage = (roomId: QARoomId, message: ChatMessage): void => {
  const currentRoomMsgs = currentDatabase.qaChatRooms?.[roomId] || [];
  currentDatabase.qaChatRooms = {
    ...currentDatabase.qaChatRooms,
    [roomId]: [...currentRoomMsgs, message],
  };
  persistAndNotify();
};

export const clearQAChatMessages = (roomId?: QARoomId): void => {
  if (roomId) {
    currentDatabase.qaChatRooms = {
      ...currentDatabase.qaChatRooms,
      [roomId]: MASTER_DATABASE_DEFAULT.qaChatRooms[roomId] || [],
    };
  } else {
    currentDatabase.qaChatRooms = { ...MASTER_DATABASE_DEFAULT.qaChatRooms };
  }
  persistAndNotify();
};

/**
 * Fungsi Pengiriman Chat Room Q&A Resmi Melalui chat_protokol
 */
export const kirimPesanQARoom = ({
  roomId,
  text,
  senderName,
  attachedFile,
  isAnonymous = true,
}: {
  roomId: QARoomId;
  text: string;
  senderName: string;
  attachedFile?: UserUploadedFile;
  isAnonymous?: boolean;
}): { userMsg: ChatMessage; botReply: ChatMessage } => {
  const protokol =
    getChatProtokol(roomId) || MASTER_DATABASE_DEFAULT.chat_protokol['kesehatan-seksual'];
  const timeStr =
    new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA';

  // 1. Simpan Pesan Pengguna
  const userMsg: ChatMessage = {
    id: `qa-usr-${Date.now()}`,
    roomId,
    sender: 'user',
    senderName: senderName || 'Tamu Anonim',
    text: text || (attachedFile ? `[Melampirkan Dokumen: ${attachedFile.fileName}]` : ''),
    time: timeStr,
    isAnonymous,
    attachedFile,
  };
  addQAChatMessage(roomId, userMsg);

  // 2. Olah Respon Menggunakan chat_protokol
  const responText = prosesPesanProtokol(protokol, text, attachedFile);
  const botReply: ChatMessage = {
    id: `qa-bot-${Date.now() + 1}`,
    roomId,
    sender: 'petugas',
    senderName: protokol.namaNakes,
    text: responText,
    time: timeStr,
    badge: protokol.badgeKerahasiaan,
  };
  addQAChatMessage(roomId, botReply);

  return { userMsg, botReply };
};

// ==========================================
// 5. BAGIAN PENDAFTARAN CATIN & KELUARGA ASUH
// ==========================================
export const getPendaftaranCatinList = (): PendaftaranCatinSubmission[] => {
  return currentDatabase.pendaftaranCatinList || [];
};

export const submitPendaftaranCatin = (
  submission: Omit<PendaftaranCatinSubmission, 'id' | 'tipe' | 'tanggalDaftar' | 'nomorRegistrasi' | 'statusKesehatan'>
): PendaftaranCatinSubmission => {
  const newSubmission: PendaftaranCatinSubmission = {
    id: `catin-${Date.now()}`,
    tipe: 'calon-pengantin',
    ...submission,
    tanggalDaftar: new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    nomorRegistrasi: `REG-CATIN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    statusKesehatan: 'Terdaftar - Siap Skrining Puskesmas',
  };

  currentDatabase.pendaftaranCatinList = [newSubmission, ...(currentDatabase.pendaftaranCatinList || [])];
  persistAndNotify();
  return newSubmission;
};

export const getPendaftaranKeluargaAsuhList = (): PendaftaranKeluargaAsuhSubmission[] => {
  return currentDatabase.pendaftaranKeluargaAsuhList || [];
};

export const submitPendaftaranKeluargaAsuh = (
  submission: Omit<PendaftaranKeluargaAsuhSubmission, 'id' | 'tipe' | 'tanggalDaftar' | 'nomorRegistrasi'>
): PendaftaranKeluargaAsuhSubmission => {
  const newSubmission: PendaftaranKeluargaAsuhSubmission = {
    id: `asuh-${Date.now()}`,
    tipe: 'keluarga-asuh',
    ...submission,
    tanggalDaftar: new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    nomorRegistrasi: `REG-ASUH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
  };

  currentDatabase.pendaftaranKeluargaAsuhList = [
    newSubmission,
    ...(currentDatabase.pendaftaranKeluargaAsuhList || []),
  ];
  persistAndNotify();
  return newSubmission;
};

// ==========================================
// 6. BAGIAN BERKAS & DOKUMEN (FILE UPLOADS)
// ==========================================
export const getUploadedFiles = (): UserUploadedFile[] => {
  return currentDatabase.uploadedFiles || [];
};

export const addUploadedFile = (
  fileData: Omit<UserUploadedFile, 'id' | 'uploadedAt'>
): UserUploadedFile => {
  const newFile: UserUploadedFile = {
    id: `file-${Date.now()}`,
    ...fileData,
    uploadedAt: new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WITA`,
  };

  currentDatabase.uploadedFiles = [newFile, ...(currentDatabase.uploadedFiles || [])];
  persistAndNotify();
  return newFile;
};

export const deleteUploadedFile = (fileId: string): void => {
  currentDatabase.uploadedFiles = (currentDatabase.uploadedFiles || []).filter((f) => f.id !== fileId);
  persistAndNotify();
};

// ==========================================
// 7. BAGIAN DATA WILAYAH & EDUKASI
// ==========================================
export const getKecamatanList = (): KecamatanInfo[] => {
  return currentDatabase.kecamatanList || [];
};

export const getDesaSariMekarProfile = (): DesaSariMekarProfile => {
  return currentDatabase.desaSariMekarProfile;
};

export const getStuntingMonthlyData = (): StuntingBulanData[] => {
  return currentDatabase.stuntingMonthlyData || [];
};

export const getBeritaKegiatanList = (): BeritaKegiatanDetail[] => {
  return currentDatabase.beritaKegiatanList || [];
};

export const getEdukasiPenyakitList = (): PenyakitSeksualEdu[] => {
  return currentDatabase.edukasiPenyakitList || [];
};

export const getVideoEdukasiList = (): VideoEdukasi[] => {
  return currentDatabase.videoEdukasiList || [];
};
