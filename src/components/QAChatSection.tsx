import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Send,
  HeartHandshake,
  UserCheck,
  Trash2,
  Paperclip,
  FileText,
  Stethoscope,
} from 'lucide-react';
import { QARoomId, UserUploadedFile, AppDatabaseSchema } from '../types';
import {
  getData,
  subscribeData,
  clearQAChatMessages,
  addUploadedFile,
  kirimPesanQARoom,
  getTopikCepatForRoom,
  getChatProtokol,
} from '../services/dataService';
import { useAppTheme } from '../context/ThemeContext';

/**
 * =========================================================================
 * QA CHAT SECTION (KOMPONEN TERPISAH)
 * =========================================================================
 * Dipisahkan dari PendaftaranDanQASection agar dapat dipakai ulang secara
 * independen, misalnya di:
 *   1. Tab "Chat Q&A (Anonim)" pada laman Pendaftaran & QA.
 *   2. Panel chat melayang (floating) di laman Edukasi Interaktif.
 *
 * Nama dokter / petugas penanggung jawab kanal dimuat otomatis dari
 * chat_protokol di dataService (masterDatabase.ts).
 */

interface QAChatSectionProps {
  /** Mode ringkas untuk panel chat melayang (tanpa profil tamu & tinggi fleksibel) */
  compact?: boolean;
}

export const QAChatSection: React.FC<QAChatSectionProps> = ({ compact = false }) => {
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

  // Separate Q&A Rooms: 'kesehatan-seksual' vs 'keluarga-asuh'
  const [activeRoomId, setActiveRoomId] = useState<QARoomId>('kesehatan-seksual');

  // Guest User Profile State (shared localStorage key dengan laman Pendaftaran)
  const [guestProfile] = useState<{ guestId: string; alias: string }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('buleleng_guest_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed?.alias) return { guestId: parsed.guestId, alias: parsed.alias };
        } catch (e) {}
      }
    }
    const randomId = Math.floor(1000 + Math.random() * 9000);
    return {
      guestId: `GUEST-${randomId}`,
      alias: `Tamu Anonim #${randomId}`,
    };
  });

  const [inputMessage, setInputMessage] = useState<string>('');
  const [attachedFileForChat, setAttachedFileForChat] = useState<{
    fileName: string;
    fileSize: string;
    fileType: string;
    category: UserUploadedFile['category'];
  } | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dbState.qaChatRooms, activeRoomId]);

  // Current chat messages for active room from dataService
  const activeRoomMessages = dbState.qaChatRooms[activeRoomId] || [];

  // Protokol & nama dokter / petugas penanggung jawab kanal aktif (dari master data)
  const protokolAktif = getChatProtokol(activeRoomId);
  const namaPetugas = protokolAktif?.namaNakes || 'Petugas PKBI Buleleng';
  const jabatanPetugas = protokolAktif?.roleNakes || 'Tim Medis PKBI Buleleng';

  // Handle sending a chat message (processed by centralized chat_protokol in dataService)
  const handleSendMessage = (customText?: string) => {
    const textToSend = typeof customText === 'string' ? customText : inputMessage;
    if (!textToSend.trim() && !attachedFileForChat) return;

    let attachedFileObj: UserUploadedFile | undefined = undefined;
    if (attachedFileForChat) {
      attachedFileObj = addUploadedFile({
        fileName: attachedFileForChat.fileName,
        fileSize: attachedFileForChat.fileSize,
        fileType: attachedFileForChat.fileType,
        category: attachedFileForChat.category,
        uploaderName: guestProfile.alias,
        description: `Lampiran file via Chat (${activeRoomId === 'kesehatan-seksual' ? 'Kesehatan Seksual' : 'Keluarga Asuh'})`,
      });
    }

    const payloadText = textToSend;
    setInputMessage('');
    setAttachedFileForChat(null);

    // Call centralized dataService (chat_protokol handles bot reply automatically)
    kirimPesanQARoom({
      roomId: activeRoomId,
      text: payloadText,
      attachedFile: attachedFileObj,
      senderName: guestProfile.alias,
      isAnonymous: true,
    });
  };

  const handleSimulateAttachFile = (
    fileName: string,
    size: string,
    category: UserUploadedFile['category']
  ) => {
    setAttachedFileForChat({
      fileName,
      fileSize: size,
      fileType: fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      category,
    });
  };

  const handleClearHistory = () => {
    clearQAChatMessages(activeRoomId);
  };

  return (
    <div
      className={
        compact ? 'flex flex-col h-full min-h-0 space-y-3' : 'w-full space-y-6'
      }
    >
      {/* Room Selectors: Separate Channels Switcher */}
      <div
        className={`flex items-center gap-2 p-1.5 rounded-2xl border shrink-0 ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/90 border-blue-900/60'
        }`}
      >
        <button
          id={compact ? 'btn-float-room-seksual' : 'btn-room-seksual'}
          onClick={() => setActiveRoomId('kesehatan-seksual')}
          className={`flex-1 min-w-0 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeRoomId === 'kesehatan-seksual'
              ? 'bg-blue-600 text-white shadow'
              : isLight
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lock size={14} className={isLight ? 'text-blue-200' : 'text-cyan-300'} />
          <span className="truncate">Kanal 1: Kesehatan Seksual & Catin</span>
        </button>

        <button
          id={compact ? 'btn-float-room-asuh' : 'btn-room-asuh'}
          onClick={() => setActiveRoomId('keluarga-asuh')}
          className={`flex-1 min-w-0 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeRoomId === 'keluarga-asuh'
              ? 'bg-blue-600 text-white shadow'
              : isLight
              ? 'text-slate-600 hover:text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HeartHandshake size={14} className={isLight ? 'text-amber-200' : 'text-amber-300'} />
          <span className="truncate">Kanal 2: Keluarga Asuh & Stunting</span>
        </button>
      </div>

      {/* Guest Profile & Clear Controls (disembunyikan di mode compact agar panel ringkas) */}
      {!compact && (
        <div
          className={`min-w-0 flex items-center justify-between gap-3 px-4 py-2 rounded-2xl border text-xs ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-blue-900/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                isLight
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-blue-600/30 text-blue-400 border border-blue-400/40'
              }`}
            >
              <UserCheck size={14} />
            </div>
            <div>
              <div className={`font-bold leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {guestProfile.alias}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                ● Mode Terenkripsi (Data Service)
              </div>
            </div>
          </div>

          <button
            id="btn-clear-chat-history"
            onClick={handleClearHistory}
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
            title="Reset Riwayat Percakapan"
          >
            <Trash2 size={13} />
            <span>Bersihkan</span>
          </button>
        </div>
      )}

      {/* Chat Window Frame: tinggi adaptif (fixed di mode penuh, fleksibel di mode compact) */}
      <div
        className={`rounded-3xl overflow-hidden border shadow-xl flex flex-col ${
          compact
            ? 'flex-1 min-h-0'
            : 'h-[70dvh] min-h-[420px] sm:h-[580px]'
        } ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/95 border-blue-900/80'}`}
      >
        {/* Chat Room Sub-Header DENGAN NAMA DOKTER / PETUGAS */}
        <div
          className={`p-3 sm:p-4 border-b flex items-center justify-between gap-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center border text-base shrink-0 ${
                isLight
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-blue-600/20 text-blue-400 border-blue-400/30'
              }`}
            >
              {protokolAktif?.avatarIcon ||
                (activeRoomId === 'kesehatan-seksual' ? <Lock size={15} /> : <HeartHandshake size={15} />)}
            </div>
            <div className="min-w-0">
              <h4
                className={`font-bold text-xs sm:text-sm truncate ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {activeRoomId === 'kesehatan-seksual'
                  ? 'Konsultasi Rahasia: IMS & Calon Pengantin'
                  : 'Layanan Informasi: Keluarga Asuh & Stunting Sari Mekar'}
              </h4>
              {/* NAMA DOKTER / PETUGAS PENANGGUNG JAWAB KANAL */}
              <div className="flex items-center gap-1.5 text-[11px] mt-0.5 min-w-0">
                <Stethoscope size={12} className="text-emerald-500 shrink-0" />
                <span className="truncate text-slate-500 dark:text-slate-400">
                  Ditangani oleh:{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400">{namaPetugas}</strong>
                  {' • '}
                  {jabatanPetugas}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full border hidden sm:block shrink-0 ${
              isLight
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-blue-950 text-blue-300 border-blue-900/80'
            }`}
          >
            🔒 {protokolAktif?.badgeKerahasiaan || 'Kerahasiaan 100% Terjamin'}
          </div>
        </div>

        {/* Tombol bersihkan riwayat versi compact (di luar sub-header agar hemat ruang) */}
        {compact && (
          <div className="px-3 pt-2 flex justify-end">
            <button
              id="btn-clear-chat-history-float"
              onClick={handleClearHistory}
              className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
              title="Reset Riwayat Percakapan"
            >
              <Trash2 size={11} />
              <span>Bersihkan Riwayat</span>
            </button>
          </div>
        )}

        {/* Message Stream */}
        <div
          className={`flex-1 min-h-0 p-4 sm:p-5 overflow-y-auto space-y-4 ${
            isLight
              ? 'bg-gradient-to-b from-slate-50/50 to-white'
              : 'bg-gradient-to-b from-[#070e22] to-slate-950'
          }`}
        >
          {activeRoomMessages.map((msg) => {
            const isMe = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-1">
                  <span className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {msg.senderName}
                  </span>
                  {msg.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        isLight
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-blue-900/60 text-blue-300 border-blue-500/30'
                      }`}
                    >
                      {msg.badge}
                    </span>
                  )}
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                      : isLight
                      ? 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                      : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none shadow-md'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Attached File Chip if present */}
                  {msg.attachedFile && (
                    <div
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                        isMe
                          ? 'bg-blue-700/60 border-blue-400/40 text-white'
                          : isLight
                          ? 'bg-white border-slate-300 text-slate-800'
                          : 'bg-slate-950 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText size={16} className={isMe ? 'text-cyan-200' : 'text-blue-600'} />
                        <div className="truncate">
                          <span className="font-bold block truncate">{msg.attachedFile.fileName}</span>
                          <span className="text-[10px] opacity-80 block">
                            {msg.attachedFile.fileSize} • Tersimpan di Database
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/20 shrink-0">
                        Berkas
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Questions Helper Bar (DIMUAT DARI chat_protokol dataService) */}
        <div
          className={`p-2.5 border-t flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full shrink-0 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
          }`}
        >
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap pl-1">
            Tanya Cepat:
          </span>
          {getTopikCepatForRoom(activeRoomId).map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className={`px-3 py-1 rounded-full border text-[11px] whitespace-nowrap transition cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* File Attachment Status Bar */}
        {attachedFileForChat && (
          <div
            className={`px-4 py-2 border-t flex items-center justify-between text-xs shrink-0 ${
              isLight
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-blue-950/60 border-blue-900/60 text-blue-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Paperclip size={14} className="text-blue-500" />
              <span>
                Berkas siap dikirim: <strong>{attachedFileForChat.fileName}</strong> (
                {attachedFileForChat.fileSize})
              </span>
            </div>
            <button
              onClick={() => setAttachedFileForChat(null)}
              className="text-rose-500 hover:text-rose-700 text-xs font-bold"
            >
              Batal Lampirkan
            </button>
          </div>
        )}

        {/* Input Bar with Attachment Button */}
        <div
          className={`p-3 sm:p-4 border-t flex items-center gap-2 shrink-0 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <button
            type="button"
            title="Lampirkan Dokumen (KTP, Surat Pengantar, Bukti Donasi, Hasil Lab)"
            onClick={() =>
              handleSimulateAttachFile(
                activeRoomId === 'kesehatan-seksual'
                  ? 'Hasil_Skrining_Darah_Lab.pdf'
                  : 'Bukti_Transfer_Donasi_Nutrisi.jpg',
                activeRoomId === 'kesehatan-seksual' ? '650 KB' : '420 KB',
                activeRoomId === 'kesehatan-seksual' ? 'konsultasi_medis' : 'asuh_bukti_donasi'
              )
            }
            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center gap-1 text-xs font-bold shrink-0 ${
              attachedFileForChat
                ? 'bg-blue-600 text-white border-blue-600'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <Paperclip size={16} />
            <span className="hidden sm:inline">Lampirkan</span>
          </button>

          <input
            id={compact ? 'input-float-qa-chat-message' : 'input-qa-chat-message'}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={
              activeRoomId === 'kesehatan-seksual'
                ? 'Ketik pertanyaan rahasia Anda seputar IMS, tes pranikah...'
                : 'Tanyakan alur pendaftaran keluarga asuh, paket nutrisi...'
            }
            className={`flex-1 min-w-0 rounded-xl px-4 py-2.5 text-xs sm:text-sm border focus:outline-none transition ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white'
                : 'bg-slate-900 border-slate-800 text-white focus:border-blue-500'
            }`}
          />

          <button
            id={compact ? 'btn-send-float-qa-chat' : 'btn-send-qa-chat'}
            onClick={() => handleSendMessage()}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition shadow-lg cursor-pointer shrink-0"
          >
            <span>Kirim</span>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
