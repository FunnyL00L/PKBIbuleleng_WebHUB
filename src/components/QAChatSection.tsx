import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Trash2,
  Paperclip,
  FileText,
  X,
  MessageCircle,
} from 'lucide-react';
import { UserUploadedFile, AppDatabaseSchema } from '../types';
import {
  getData,
  subscribeData,
  clearQAChatMessages,
  addUploadedFile,
  kirimPesanQARoom,
  getTopikCepatForRoom,
} from '../services/dataService';
import { useAppTheme } from '../context/ThemeContext';

/**
 * =========================================================================
 * CHAT ANONIM PKBI (KOMPONEN TERPISAH — MODE MESSENGER, SATU KANAL UMUM)
 * =========================================================================
 * - Hanya 1 mode percakapan: Pertanyaan Umum (tanpa pemilih kanal).
 * - Tampilan sederhana ala aplikasi Messenger.
 * - RESPONSIF:
 *     • HP (mobile)      : chat FULLSCREEN menutupi seluruh layar.
 *     • Desktop / Tablet : chat tampil sebagai panel melayang (floating).
 * - Anonimitas & jaminan kerahasiaan data DIPERTAHANKAN.
 *
 * Nama petugas / protokol respons dimuat otomatis dari chat_protokol di
 * dataService (masterDatabase.ts). Respon otomatis: "Pertanyaan saya terima,
 * mohon di tunggu".
 */

interface QAChatSectionProps {
  /** Dipanggil saat user menutup chat (gelembung akan aktif kembali) */
  onClose?: () => void;
}

// Satu-satunya kanal chat (mode pertanyaan umum)
const ROOM_UMUM = 'kesehatan-seksual' as const;

export const QAChatSection: React.FC<QAChatSectionProps> = ({ onClose }) => {
  const { theme } = useAppTheme();
  const isLight = theme === 'light';

  // Deteksi desktop (>= 1024px): desktop = panel floating, HP = fullscreen
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 1024px)').matches
      : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Master Database Snapshot from Data Service
  const [dbState, setDbState] = useState<AppDatabaseSchema>(() => getData());

  useEffect(() => {
    const unsubscribe = subscribeData((updatedData) => {
      setDbState(updatedData);
    });
    return unsubscribe;
  }, []);

  // Profil tamu anonim (shared localStorage dengan laman Pendaftaran)
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

  // Scroll ke bawah saat pesan berubah
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dbState.qaChatRooms]);

  // Pesan kanal umum dari dataService
  const activeRoomMessages = dbState.qaChatRooms[ROOM_UMUM] || [];

  // Kirim pesan (diproses oleh chat_protokol di dataService)
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
        description: 'Lampiran file via Chat Anonim PKBI',
      });
    }

    const payloadText = textToSend;
    setInputMessage('');
    setAttachedFileForChat(null);

    kirimPesanQARoom({
      roomId: ROOM_UMUM,
      text: payloadText,
      attachedFile: attachedFileObj,
      senderName: guestProfile.alias,
      isAnonymous: true,
    });
  };

  const handleSimulateAttachFile = () => {
    setAttachedFileForChat({
      fileName: 'Hasil_Skrining_Darah_Lab.pdf',
      fileSize: '650 KB',
      fileType: 'application/pdf',
      category: 'konsultasi_medis',
    });
  };

  const handleClearHistory = () => {
    clearQAChatMessages(ROOM_UMUM);
  };

  return (
    <div
      className={
        isDesktop
          ? 'fixed z-50 right-6 top-[10.5rem] w-[calc(100vw-3rem)] max-w-[420px] h-[560px] max-h-[72dvh] flex'
          : 'fixed inset-0 z-[70] flex flex-col'
      }
    >
      <div
        className={`flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden shadow-2xl ${
          isDesktop ? 'rounded-3xl border' : ''
        } ${isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-blue-900/70'}`}
      >
        {/* ================= HEADER ALA MESSENGER ================= */}
        <div
          className={`px-3 sm:px-4 py-2.5 border-b flex items-center gap-2.5 shrink-0 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
          } ${!isDesktop ? 'pt-[calc(env(safe-area-inset-top)+0.625rem)]' : ''}`}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 text-white flex items-center justify-center shrink-0">
            <MessageCircle size={17} />
          </div>

          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm font-bold truncate ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Chat Anonim PKBI
            </h4>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
              🔒 Kerahasiaan 100% Terjamin • {guestProfile.alias}
            </p>
          </div>

          {/* Bersihkan riwayat */}
          <button
            id="btn-clear-chat-history"
            onClick={handleClearHistory}
            title="Bersihkan Riwayat Percakapan"
            className={`p-2 rounded-full transition cursor-pointer shrink-0 ${
              isLight
                ? 'text-slate-400 hover:bg-slate-100 hover:text-rose-600'
                : 'text-slate-500 hover:bg-slate-800 hover:text-rose-400'
            }`}
          >
            <Trash2 size={16} />
          </button>

          {/* Tutup chat */}
          <button
            onClick={onClose}
            aria-label="Tutup Chat"
            title="Tutup Chat"
            className={`p-2 rounded-full transition cursor-pointer shrink-0 ${
              isLight
                ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* ================= STREAM PESAN ================= */}
        <div
          className={`flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-4 space-y-2.5 ${
            isLight ? 'bg-slate-100/80' : 'bg-[#0b1428]'
          }`}
        >
          {activeRoomMessages.length === 0 ? (
            <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isLight ? 'bg-blue-50 text-blue-600' : 'bg-blue-600/20 text-blue-400'
                }`}
              >
                <MessageCircle size={22} />
              </div>
              <p
                className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-200'}`}
              >
                Belum ada pesan
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
                🔒 Mulai percakapan — identitas Anda tetap rahasia dan tidak
                ditampilkan kepada siapa pun.
              </p>
            </div>
          ) : (
            activeRoomMessages.map((msg) => {
              const isMe = msg.sender === 'user';
              const displayName =
                msg.sender === 'petugas' ? 'Petugas PKBI' : msg.senderName;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  {/* Meta: nama + badge kerahasiaan + waktu */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1 mb-0.5">
                    <span className="font-semibold">{displayName}</span>
                    {msg.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded border ${
                          isLight
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-blue-900/60 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        🔒 {msg.badge}
                      </span>
                    )}
                    <span>{msg.time}</span>
                  </div>

                  {/* Gelembung pesan */}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-md shadow-md'
                        : isLight
                        ? 'bg-white text-slate-800 border border-slate-200 rounded-bl-md shadow-sm'
                        : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-md shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Lampiran berkas */}
                    {msg.attachedFile && (
                      <div
                        className={`mt-2 p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                          isMe
                            ? 'bg-blue-700/60 border-blue-400/40 text-white'
                            : isLight
                            ? 'bg-slate-50 border-slate-300 text-slate-800'
                            : 'bg-slate-950 border-slate-700 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText
                            size={15}
                            className={isMe ? 'text-cyan-200' : 'text-blue-600'}
                          />
                          <div className="truncate">
                            <span className="font-bold block truncate">
                              {msg.attachedFile.fileName}
                            </span>
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
            })
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* ================= TANYA CEPAT ================= */}
        <div
          className={`px-3 py-2 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800/80'
          }`}
        >
          {getTopikCepatForRoom(ROOM_UMUM).map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className={`px-3 py-1 rounded-full border text-[11px] whitespace-nowrap transition cursor-pointer shrink-0 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* ================= STATUS LAMPIRAN ================= */}
        {attachedFileForChat && (
          <div
            className={`px-4 py-2 border-t flex items-center justify-between text-xs shrink-0 ${
              isLight
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-blue-950/60 border-blue-900/60 text-blue-300'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Paperclip size={14} className="text-blue-500 shrink-0" />
              <span className="truncate">
                <strong>{attachedFileForChat.fileName}</strong> (
                {attachedFileForChat.fileSize})
              </span>
            </div>
            <button
              onClick={() => setAttachedFileForChat(null)}
              className="text-rose-500 hover:text-rose-700 text-xs font-bold shrink-0"
            >
              Batal
            </button>
          </div>
        )}

        {/* ================= INPUT BAR ================= */}
        <div
          className={`p-3 border-t flex items-center gap-2 shrink-0 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
          } ${!isDesktop ? 'pb-[calc(env(safe-area-inset-bottom)+0.75rem)]' : ''}`}
        >
          <button
            type="button"
            title="Lampirkan Dokumen"
            onClick={handleSimulateAttachFile}
            className={`p-2.5 rounded-full border transition cursor-pointer shrink-0 ${
              attachedFileForChat
                ? 'bg-blue-600 text-white border-blue-600'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <Paperclip size={16} />
          </button>

          <input
            id="input-qa-chat-message"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ketik pertanyaan Anda..."
            className={`flex-1 min-w-0 rounded-full px-4 py-2.5 text-xs sm:text-sm border focus:outline-none transition ${
              isLight
                ? 'bg-slate-100 border-transparent text-slate-900 focus:bg-white focus:border-blue-600'
                : 'bg-slate-900 border-slate-800 text-white focus:border-blue-500'
            }`}
          />

          <button
            id="btn-send-qa-chat"
            onClick={() => handleSendMessage()}
            aria-label="Kirim Pesan"
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition shadow-lg cursor-pointer shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
