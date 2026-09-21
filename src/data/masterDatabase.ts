import {
  AppDatabaseSchema,
  NakesChatMessage,
  NakesProfile,
  ChatProtokol,
  UserUploadedFile,
  PendaftaranCatinSubmission,
  PendaftaranKeluargaAsuhSubmission,
} from '../types';
import {
  KECAMATAN_LIST,
  DESA_SARI_MEKAR_PROFILE,
  STUNTING_BULAN_DATA,
  DOKUMENTASI_KEGIATAN_LIST,
  EDUKASI_PENYAKIT_SEKSUAL,
  VIDEO_EDUKASI_LIST,
  INITIAL_CHAT_MESSAGES,
} from './bulelengData';

/**
 * =========================================================================
 * 1 SINGLE MASTER DATABASE INITIAL STATE (1 FILE TERPADU DENGAN BEDA BAGIAN)
 * =========================================================================
 * Seluruh data aplikasi PKBI Buleleng dikumpulkan dalam 1 struktur data tunggal ini.
 * Jika Anda ingin menyambungkan ke database nyata (Firestore, Supabase, PostgreSQL,
 * atau REST API), Anda HANYA PERLU menyesuaikan file ini dan dataService.ts di folder ini.
 *
 * STRUKTUR BAGIAN:
 * 1. Wilayah & Profil Desa (Kecamatan, Sari Mekar, Berita Kegiatan, Stunting)
 * 2. Edukasi Medis & IMS (Penyakit Seksual, Video Edukasi)
 * 3. Master Profil Tenaga Kesehatan (Dokter & Bidan PKBI Buleleng)
 * 4. Protokol Chat Komunikasi Medis Terpadu (chat_protokol)
 * 5. Riwayat Chat Interaksi Dokter & Bidan (Tanya Nakes)
 * 6. Chat Q&A Publik & Anonim (Kesehatan Seksual & Keluarga Asuh)
 * 7. Data Pendaftaran (Calon Pengantin & Keluarga Asuh Balita)
 * 8. Berkas & Lampiran Dokumen Pengguna (File Upload: KTP, Surat Desa, Bukti Donasi)
 */

// BAGIAN 3: MASTER DATA PROFIL NAKES (DOKTER & BIDAN)
// Anda bisa mengubah nama dokter, menambah dokter baru sebanyak yang diinginkan di sini.
// Sistem akan langsung mendeteksi dan menampilkannya secara otomatis.
export const MASTER_NAKES_LIST: NakesProfile[] = [
  {
    id: 'dr-edy',
    nama: 'dr. Edy Sukarma',
    panggilan: 'dr. Edy',
    gelar: 'Dokter PKBI Buleleng',
    peran: 'dokter',
    jabatan: 'Dokter PKBI Buleleng',
    spesialisasi: 'Kesehatan Seksual, Skrining Pranikah & IMS',
    avatarIcon: '👨‍⚕️',
    badgeKeahlian: 'Dokter PKBI Buleleng',
    statusOnline: true,
    jadwalLayanan: 'Senin - Sabtu, 08.00 - 15.00 WITA',
    lokasiPraktik: 'Klinik PKBI Kabupaten Buleleng',
    nomorSip: 'SIP.446/102/DINKES/2023',
    deskripsi:
      'Dokter PKBI Kabupaten Buleleng yang melayani konsultasi kesehatan reproduksi, skrining pranikah, dan pencegahan IMS.',
  },
  {
    id: 'dr-arya',
    nama: 'dr. Wayan Arya Putra, Sp.OG',
    panggilan: 'dr. Wayan Arya',
    gelar: 'Sp.OG (Spesialis Obstetri & Ginekologi)',
    peran: 'dokter',
    jabatan: 'Dokter Konselor PKBI Kabupaten Buleleng',
    spesialisasi: 'Kesehatan Seksual, Skrining Pranikah & IMS',
    avatarIcon: '👨‍⚕️',
    badgeKeahlian: 'Spesialis Medis Pranikah',
    statusOnline: true,
    jadwalLayanan: 'Senin - Jumat, 08.00 - 15.00 WITA',
    lokasiPraktik: 'Klinik PKBI Buleleng & RSUD Buleleng',
    nomorSip: 'SIP.446/089/DINKES/2022',
    deskripsi:
      'Berpengalaman lebih dari 12 tahun dalam konseling klinis IMS, pencegahan penularan HIV/Sifilis ibu-ke-anak, serta skrining pranikah berstandar Elsimil.',
  },
  {
    id: 'bidan-astini',
    nama: 'Bidan Ni Made Astini, S.Tr.Keb',
    panggilan: 'Bidan Astini',
    gelar: 'S.Tr.Keb (Sarjana Terapan Kebidanan)',
    peran: 'bidan',
    jabatan: 'Bidan Koordinator Penurunan Stunting PKBI Buleleng',
    spesialisasi: 'Kesehatan Ibu, Anak, Gizi Balita & 1000 HPK',
    avatarIcon: '👩‍⚕️',
    badgeKeahlian: 'Pakar Gizi 1000 HPK',
    statusOnline: true,
    jadwalLayanan: 'Senin - Sabtu, 08.00 - 16.00 WITA',
    lokasiPraktik: 'Pusat Layanan Ibu & Anak PKBI Buleleng',
    nomorSip: 'SIPB.503/114/DINKES/2021',
    deskripsi:
      'Fasilitator lapangan program pendampingan keluarga balita stunting di Desa Sari Mekar dan koordinator distribusi makanan tambahan (PMT) telur.',
  },
  {
    id: 'dr-sujana',
    nama: 'dr. Ketut Sujana, M.Kes',
    panggilan: 'dr. Sujana',
    gelar: 'M.Kes (Magister Kesehatan Masyarakat)',
    peran: 'dokter',
    jabatan: 'Kepala Tim Skrining Medis Puskesmas Buleleng I',
    spesialisasi: 'Layanan Laboratorium Puskesmas & Rujukan Catin',
    avatarIcon: '🩺',
    badgeKeahlian: 'Dokter Puskesmas Rujukan',
    statusOnline: true,
    jadwalLayanan: 'Senin - Jumat, 08.00 - 13.00 WITA',
    lokasiPraktik: 'Puskesmas Buleleng I, Singaraja',
    nomorSip: 'SIP.445/203/DINKES/2020',
    deskripsi:
      'Penanggung jawab verifikasi surat keterangan sehat pranikah dan pelaksanaan tes laboratorium gratis bagi catin se-Kecamatan Buleleng.',
  },
  {
    id: 'konselor-widya',
    nama: 'Luh Putu Widya, S.Psi',
    panggilan: 'Konselor Widya',
    gelar: 'S.Psi (Sarjana Psikologi)',
    peran: 'konselor',
    jabatan: 'Konselor Psikososial & Pranikah PKBI Buleleng',
    spesialisasi: 'Kesiapan Mental Pranikah & Komunikasi Pasangan',
    avatarIcon: '🌸',
    badgeKeahlian: 'Psikologi Pasangan',
    statusOnline: false,
    jadwalLayanan: 'Selasa & Kamis, 09.00 - 15.00 WITA',
    lokasiPraktik: 'Ruang Konseling Remaja & Catin PKBI',
    nomorSip: 'SIK.712/PKBI-BLG/2023',
    deskripsi:
      'Mendampingi calon pengantin dalam membedah kesiapan psikologis, mitigasi stres menjelang pernikahan, dan rencana pengasuhan anak bersama.',
  },
];

// BAGIAN 4: MASTER CHAT PROTOKOL (chat_protokol)
export const MASTER_CHAT_PROTOKOL: Record<string, ChatProtokol> = {
  'dr-edy': {
    protokolId: 'protokol-dr-edy',
    targetId: 'dr-edy',
    namaProtokol: 'Protokol Konsultasi dr. Edy Sukarma - PKBI',
    namaNakes: 'dr. Edy Sukarma',
    roleNakes: 'Dokter PKBI Buleleng',
    avatarIcon: '👨‍⚕️',
    badgeKerahasiaan: 'Rahasia Medis Terjamin 100%',
    pesanPembuka:
      'Om Swastiastu. Saya dr. Edy Sukarma dari PKBI Buleleng. Silakan sampaikan pertanyaan Anda seputar kesehatan reproduksi atau skrining pranikah.',
    topikCepat: [
      'Apakah tes HIV & IMS di Puskesmas Buleleng dijamin rahasia?',
      'Berapa bulan sebelum menikah cek darah pranikah harus dilakukan?',
      'Bagaimana cara mencegah stunting sejak masa kehamilan?',
      'Kapan usia terbaik untuk mendapatkan vaksinasi kanker serviks (HPV)?',
    ],
    aturanRespon: [],
    responDefault: 'Pertanyaan saya terima, mohon di tunggu',
    responLampiranBerkas: 'Pertanyaan saya terima, mohon di tunggu',
  },

  'dr-arya': {
    protokolId: 'protokol-dr-arya',
    targetId: 'dr-arya',
    namaProtokol: 'Protokol Konsultasi Medis & IMS dr. Wayan Arya Putra, Sp.OG',
    namaNakes: 'dr. Wayan Arya Putra, Sp.OG',
    roleNakes: 'Dokter Konselor PKBI Buleleng',
    avatarIcon: '👨‍⚕️',
    badgeKerahasiaan: 'Rahasia Medis Terjamin 100%',
    pesanPembuka:
      'Om Swastiastu. Saya dr. Wayan Arya Putra, Sp.OG dari PKBI Buleleng. Silakan sampaikan pertanyaan seputar infeksi menular seksual (IMS), pemeriksaan pranikah calon pengantin, atau kesehatan reproduksi. Privasi Anda terjaga sepenuhnya.',
    topikCepat: [
      'Apakah tes HIV & IMS di Puskesmas Buleleng dijamin rahasia?',
      'Berapa bulan sebelum menikah cek darah pranikah harus dilakukan?',
      'Bagaimana jika calon pengantin terdeteksi ada infeksi menular seksual?',
      'Apa perbedaan gejala sifilis dan kencing nanah (gonore)?',
      'Kapan waktu terbaik mendapatkan vaksinasi HPV kanker serviks?',
    ],
    aturanRespon: [],
    responDefault: 'Pertanyaan saya terima, mohon di tunggu',
    responLampiranBerkas: 'Pertanyaan saya terima, mohon di tunggu',
  },

  'bidan-astini': {
    protokolId: 'protokol-bidan-astini',
    targetId: 'bidan-astini',
    namaProtokol: 'Protokol Kesehatan Ibu, Anak & Balita Stunting - Bidan Ni Made Astini, S.Tr.Keb',
    namaNakes: 'Bidan Ni Made Astini, S.Tr.Keb',
    roleNakes: 'Bidan Koordinator PKBI Buleleng',
    avatarIcon: '👩‍⚕️',
    badgeKerahasiaan: 'Pendampingan Bidan Terpercaya',
    pesanPembuka:
      'Salam hangat. Saya Bidan Astini, Koordinator Kebidanan PKBI Buleleng. Saya mendampingi kesehatan ibu hamil, nifas, ASI eksklusif, serta gizi balita untuk pencegahan stunting di desa-desa Buleleng, khususnya Desa Sari Mekar. Apa yang bisa saya bantu?',
    topikCepat: [
      'Bagaimana cara paling efektif mencegah stunting sejak masa kehamilan?',
      'Berapa butir telur yang dibutuhkan balita per hari untuk cegah stunting?',
      'Apa tanda-tanda awal balita mengalami gagal tumbuh (growth faltering)?',
      'Berapa tablet tambah darah (TTD) yang wajib diminum ibu hamil?',
      'Jadwal posyandu di Desa Sari Mekar setiap tanggal berapa?',
    ],
    aturanRespon: [
      {
        kataKunci: ['stunting', 'pendek', 'gizi', 'tumbuh kembang', 'tinggi badan'],
        responMedis:
          'Pencegahan stunting paling efektif berfokus pada 1.000 Hari Pertama Kehidupan (HPK) — sejak janin dalam kandungan hingga anak berusia 2 tahun. Kuncinya adalah asupan protein hewani tinggi setiap hari (telur, ikan lokal, hati ayam), ASI eksklusif 6 bulan tanpa makanan tambahan, pemantauan kurva KMS di Posyandu, dan air bersih sanitasi lingkungan.',
        tindakanLanjutan: 'Rutin timbang dan ukur panjang badan setiap bulan di Posyandu',
        prioritas: 'tinggi',
      },
      {
        kataKunci: ['telur', 'pmt', 'protein', 'makanan', 'menu'],
        responMedis:
          'Penelitian gizi membuktikan pemberian 1 hingga 2 butir telur ayam setiap hari pada anak usia 6-23 bulan mampu menekan risiko stunting hingga 47%. Telur mengandung asam amino esensial lengkap, kolin untuk kecerdasan otak, dan zat besi yang sangat mudah diserap tubuh anak.',
        prioritas: 'sedang',
      },
      {
        kataKunci: ['ibu hamil', 'hamil', 'ttd', 'anemia', 'lila', 'kek'],
        responMedis:
          'Ibu hamil wajib meminum minimal 90 tablet tambah darah (TTD) selama kehamilan guna mencegah anemia. Selain itu, lingkar lengan atas (LILA) ibu hamil harus di atas 23,5 cm. Bila LILA < 23,5 cm (Kurang Energi Kronis/KEK), janin berisiko tinggi lahir dengan berat badan rendah (BBLR) yang merupakan jalur utama terjadinya stunting.',
        prioritas: 'tinggi',
      },
      {
        kataKunci: ['posyandu', 'sari mekar', 'jadwal', 'desa'],
        responMedis:
          'Posyandu Balita di Desa Sari Mekar dilaksanakan setiap pertengahan bulan di masing-masing banjar dinas (Banjar Dinas Sari, Mekar, dan Kelod). Kader Posyandu dan Bidan Desa menyediakan pemantauan berat badan, tinggi badan, imunisasi rutin, serta pembagian makanan tambahan (PMT) balita.',
        prioritas: 'edukasi',
      },
      {
        kataKunci: ['asi', 'menyusui', 'mpasi', 'susu'],
        responMedis:
          'Berikan ASI eksklusif 6 bulan penuh. Masuk usia 6 bulan, kenalkan MPASI bertekstur lembut dengan komposisi 4 bintang yang mengutamakan protein hewani, bukan hanya sayur atau buah, karena zat besi pada sayuran kurang optimal untuk pembentukan sel darah merah balita.',
        prioritas: 'sedang',
      },
    ],
    responDefault:
      'Terima kasih atas pertanyaannya bunda. Setiap anak memiliki keunikan masa pertumbuhan. Selalu pantau kenaikan berat badan balita Anda setiap bulan di Posyandu terdekat agar bila terjadi kenaikan yang tidak adekuat (T tidak naik), bisa segera ditangani bidan desa.',
    responLampiranBerkas:
      'Berkas catatan buku KIA atau grafik berat badan anak Anda telah berhasil kami simpan di database master. Bidan kami akan memeriksa kesesuaian kurva pertumbuhan anak Anda.',
  },

  'dr-sujana': {
    protokolId: 'protokol-dr-sujana',
    targetId: 'dr-sujana',
    namaProtokol: 'Protokol Layanan Skrining Puskesmas Buleleng I - dr. Ketut Sujana, M.Kes',
    namaNakes: 'dr. Ketut Sujana, M.Kes',
    roleNakes: 'Kepala Tim Medis Puskesmas Buleleng I',
    avatarIcon: '🩺',
    badgeKerahasiaan: 'Pelayanan Resmi Puskesmas',
    pesanPembuka:
      'Selamat datang di kanal konsultasi Puskesmas Buleleng I bersama PKBI. Saya dr. Ketut Sujana siap membantu perihal prosedur rujukan, teknis skrining pranikah, dan pelayanan poli KIA/KB di fasilitas kesehatan tingkat pertama.',
    topikCepat: [
      'Apa saja berkas yang harus dibawa saat skrining pranikah di Puskesmas?',
      'Berapa lama proses keluarnya surat keterangan sehat pranikah?',
      'Apakah calon pengantin beda domisili kecamatan bisa periksa di Puskesmas Buleleng I?',
    ],
    aturanRespon: [
      {
        kataKunci: ['berkas', 'syarat', 'dokumen', 'ktp', 'bawa'],
        responMedis:
          'Berkas yang wajib dibawa: Fotokopi KTP calon pengantin, Fotokopi Kartu Keluarga, pas foto 3x4 (2 lembar), dan surat pengantar pengurusan nikah dari kantor desa/kelurahan setempat.',
        prioritas: 'sedang',
      },
      {
        kataKunci: ['lama', 'waktu', 'jadwal', 'surat', 'hasil'],
        responMedis:
          'Layanan laboratorium Catin buka Senin-Jumat pukul 08.00-11.30 WITA. Proses tes darah, pemeriksaan fisik dokter, dan konseling gizi memakan waktu sekitar 45-60 menit. Sertifikat layak kawin dan hasil lab selesai pada hari yang sama.',
        prioritas: 'sedang',
      },
      {
        kataKunci: ['beda', 'domisili', 'luar', 'kecamatan'],
        responMedis:
          'Calon pengantin dengan KTP luar kecamatan tetap dapat dilayani di Puskesmas Buleleng I dengan membawa surat pengantar domisili atau mendaftar melalui aplikasi ini terlebih dahulu.',
        prioritas: 'edukasi',
      },
    ],
    responDefault:
      'Informasi yang Anda sampaikan telah tercatat pada sistem Puskesmas Buleleng I. Silakan kunjungi loket pendaftaran Puskesmas kami dengan membawa identitas diri.',
    responLampiranBerkas:
      'Dokumen Anda telah terverifikasi dalam sistem loket Puskesmas Buleleng I. Silakan tunjukkan nama Anda ke petugas loket saat berkunjung.',
  },

  'konselor-widya': {
    protokolId: 'protokol-konselor-widya',
    targetId: 'konselor-widya',
    namaProtokol: 'Protokol Konseling Psikososial & Kesiapan Mental Catin - Konselor Luh Putu Widya, S.Psi',
    namaNakes: 'Luh Putu Widya, S.Psi',
    roleNakes: 'Konselor Psikososial PKBI Buleleng',
    avatarIcon: '🌸',
    badgeKerahasiaan: 'Konseling Rahasia & Empatik',
    pesanPembuka:
      'Halo, saya Luh Putu Widya, konselor psikologis PKBI Buleleng. Kesiapan menikah bukan hanya fisik dan finansial, tapi juga kesiapan mental, komunikasi pasangan, serta pencegahan stres pranikah. Ruang ini terbuka aman untuk Anda.',
    topikCepat: [
      'Bagaimana mengatasi kecemasan dan stres menjelang hari pernikahan?',
      'Bagaimana cara mendiskusikan rencana jumlah anak dan KB bersama pasangan?',
      'Apakah ada konseling pranikah tatap muka bersama pasangan di PKBI?',
    ],
    aturanRespon: [
      {
        kataKunci: ['stres', 'cemas', 'takut', 'mental', 'panik'],
        responMedis:
          'Sangat wajar merasakan kecemasan pranikah (wedding jitters). Kuncinya adalah luangkan waktu berdiskusi terbuka dengan pasangan tanpa membicarakan pesta, namun fokus pada visi rumah tangga dan saling mendengarkan harapan masing-masing.',
        prioritas: 'sedang',
      },
      {
        kataKunci: ['kb', 'anak', 'rencana', 'jarak'],
        responMedis:
          'Merencanakan jarak kehamilan minimal 2-3 tahun antar anak sangat penting untuk pemulihan rahim ibu dan optimalisasi ASI balita pertama agar tidak stunting. Diskusikan metode kontrasepsi yang nyaman bersama pasangan sejak sebelum menikah.',
        prioritas: 'sedang',
      },
    ],
    responDefault:
      'Terima kasih telah berbagi perasaan Anda. PKBI Buleleng selalu menyediakan ruang aman bagi remaja dan calon pengantin untuk bercerita tanpa penghakiman.',
    responLampiranBerkas:
      'Catatan konsultasi Anda tersimpan secara rahasia dalam berkas pendampingan psikologis PKBI Buleleng.',
  },

  'kesehatan-seksual': {
    protokolId: 'protokol-qa-seksual',
    targetId: 'kesehatan-seksual',
    namaProtokol: 'Protokol Chat BOT Terbuka Kesehatan Seksual & Pranikah',
    namaNakes: 'Konselor Medis Pranikah',
    roleNakes: 'Tim Medis & Konseling PKBI Buleleng',
    avatarIcon: '🛡️',
    badgeKerahasiaan: 'Kerahasiaan Terjamin',
    pesanPembuka:
      'Kanal ini terbuka bagi masyarakat Buleleng untuk menanyakan segala hal mengenai kesehatan reproduksi dan skrining nikah dengan jaminan identitas anonim.',
    topikCepat: [
      'Berapa lama sebelum menikah tes kesehatan harus dilakukan?',
      'Apakah hasil tes HIV & Sifilis dijamin rahasia?',
      'Apa saja syarat pemeriksaan calon pengantin di Puskesmas?',
      'Apakah pemeriksaan skrining pranikah dikenakan biaya?',
    ],
    aturanRespon: [
      {
        kataKunci: ['syarat', 'jadwal', 'daftar', 'nikah', 'catin', 'waktu'],
        responMedis:
          'Pemeriksaan calon pengantin (Catin) dilayani setiap Senin - Jumat di seluruh Puskesmas Kabupaten Buleleng pukul 08.00 - 12.00 WITA. Cukup bawa KTP & surat pengantar desa. Anda bisa mengisi formulir pendaftaran catin langsung di tab Pendaftaran.',
        prioritas: 'tinggi',
      },
      {
        kataKunci: ['hiv', 'sifilis', 'ims', 'biaya', 'gratis', 'rahasia'],
        responMedis:
          'Pemeriksaan laboratorium skrining IMS (HIV, Sifilis VDRL, Hepatitis B) dan tes darah Hb untuk calon pengantin di Puskesmas Buleleng difasilitasi GRATIS dengan jaminan privasi dan kerahasiaan 100%.',
        prioritas: 'tinggi',
      },
    ],
    responDefault:
      'Terima kasih atas pertanyaannya. Konselor medis privasi kami mencatat pertanyaan Anda. Hasil konsultasi ini bersifat rahasia. Jangan ragu bertanya hal sensitif seputar kesehatan reproduksi.',
    responLampiranBerkas:
      'Dokumen berkas Anda telah berhasil diterima oleh sistem terenkripsi PKBI Buleleng. Petugas medis kami akan meninjau berkas tersebut secara rahasia.',
  },

  'keluarga-asuh': {
    protokolId: 'protokol-qa-keluarga-asuh',
    targetId: 'keluarga-asuh',
    namaProtokol: 'Protokol Chat BOT Program Keluarga Asuh Balita Sari Mekar',
    namaNakes: 'Koordinator Sari Mekar',
    roleNakes: 'Koordinator Lapangan Penanganan Stunting Sari Mekar',
    avatarIcon: '🤝',
    badgeKerahasiaan: 'Resmi Buleleng',
    pesanPembuka:
      'Ruang koordinasi dan konsultasi Program Gotong Royong Orang Tua Asuh Balita Desa Sari Mekar, Kecamatan Buleleng.',
    topikCepat: [
      'Bagaimana cara mendaftar jadi Orang Tua Asuh Desa Sari Mekar?',
      'Berapa lama komitmen bantuan nutrisi untuk 1 balita?',
      'Apakah donatur bisa berkunjung langsung ke rumah balita asuh?',
      'Bagaimana cara melihat laporan tumbuh kembang balita asuh?',
    ],
    aturanRespon: [
      {
        kataKunci: ['paket', 'donasi', 'biaya', 'telur', 'bantuan'],
        responMedis:
          'Program Keluarga Asuh Desa Sari Mekar menyediakan Paket Gizi Balita (PMT) berupa telur ayam segar dan pangan lokal bergizi tinggi. Komitmen pendampingan idealnya 6 bulan untuk menjamin tuntas stunting.',
        prioritas: 'tinggi',
      },
      {
        kataKunci: ['daftar', 'cara', 'syarat', 'ikut', 'formulir'],
        responMedis:
          'Untuk mendaftar sebagai orang tua / keluarga asuh balita Desa Sari Mekar, Anda dapat mengisi formulir resmi di tab "Pendaftaran Catin & Keluarga Asuh". Setiap donatur akan menerima laporan perkembangan kurva berat badan balita asuh setiap bulan.',
        prioritas: 'tinggi',
      },
      {
        kataKunci: ['kunjung', 'rumah', 'lihat', 'temu'],
        responMedis:
          'Bisa, kunjungan donatur didampingi oleh Kader Posyandu dan Bidan Desa Sari Mekar dengan tetap menjaga etika dan privasi kenyamanan keluarga balita binaan.',
        prioritas: 'sedang',
      },
      {
        kataKunci: ['laporan', 'pantau', 'kurva', 'timbang'],
        responMedis:
          'Laporan penimbangan berat badan balita dan lingkar kepala diperbarui setiap tanggal 15 setiap bulannya setelah pelaksanaan Posyandu di Desa Sari Mekar.',
        prioritas: 'sedang',
      },
    ],
    responDefault:
      'Terima kasih atas kepedulian Anda terhadap balita Desa Sari Mekar. Koordinator program keluarga asuh kami siap memfasilitasi pendampingan gizi anak asuh Anda.',
    responLampiranBerkas:
      'Berkas bukti transfer donasi atau identitas Anda berhasil disimpan dalam basis data terpadu program Keluarga Asuh Sari Mekar. Koordinator desa akan memverifikasi dalam waktu 1x24 jam.',
  },
};

// BAGIAN 5: INITIAL DATA CHAT DOKTER / NAKES
// Riwayat percakapan dikosongkan agar pengguna memulai dari kondisi bersih (clean state)
export const INITIAL_NAKES_CHATS: NakesChatMessage[] = [];

// BAGIAN 7: INITIAL DATA PENDAFTARAN SAMPLE
export const INITIAL_PENDAFTARAN_CATIN: PendaftaranCatinSubmission[] = [
  {
    id: 'catin-sample-1',
    tipe: 'calon-pengantin',
    namaPria: 'I Kadek Sudarma',
    nikPria: '5108031204960001',
    usiaPria: 28,
    namaWanita: 'Ni Luh Putu Sintia Dewi',
    nikWanita: '5108035508980002',
    usiaWanita: 26,
    noHp: '081234567890',
    kecamatan: 'Buleleng',
    desa: 'Desa Sari Mekar',
    rencanaTanggalNikah: '2025-05-18',
    puskesmasRujukan: 'Puskesmas Buleleng I',
    tanggalDaftar: '2025-02-10',
    nomorRegistrasi: 'REG-CATIN-2025-001',
    statusKesehatan: 'Terdaftar & Terjadwal Skrining',
  },
];

export const INITIAL_PENDAFTARAN_KELUARGA_ASUH: PendaftaranKeluargaAsuhSubmission[] = [
  {
    id: 'asuh-sample-1',
    tipe: 'keluarga-asuh',
    namaLengkap: 'Made Suastika, S.E.',
    nik: '5108051409850003',
    pekerjaan: 'Wiraswasta / Pemerhati Gizi',
    noHp: '081987654321',
    email: 'made.suastika@bulelengcare.id',
    alamatDomisili: 'Jl. Ahmad Yani No. 45, Singaraja',
    kecamatan: 'Buleleng',
    desa: 'Desa Sari Mekar',
    paketBantuan: 'Paket Gizi Balita (PMT)',
    komitmenBulan: 6,
    desaSasaran: 'Desa Sari Mekar',
    alasanBergabung: 'Ingin bergotong royong bersama PKBI memastikan balita di Sari Mekar lulus dari garis stunting.',
    tanggalDaftar: '2025-02-08',
    nomorRegistrasi: 'REG-ASUH-2025-014',
  },
];

// BAGIAN 8: INITIAL DATA BERKAS / FILE UPLOAD
export const INITIAL_UPLOADED_FILES: UserUploadedFile[] = [
  {
    id: 'file-sample-1',
    fileName: 'KTP_Calon_Pengantin_Sintia.pdf',
    fileSize: '1.2 MB',
    fileType: 'application/pdf',
    category: 'catin_ktp',
    uploadedAt: '10 Feb 2025, 09:15 WITA',
    uploaderName: 'Ni Luh Putu Sintia Dewi',
    description: 'Lampiran kartu identitas untuk verifikasi skrining pranikah',
  },
  {
    id: 'file-sample-2',
    fileName: 'Surat_Pengantar_Nikah_DesaSariMekar.pdf',
    fileSize: '840 KB',
    fileType: 'application/pdf',
    category: 'catin_surat_desa',
    uploadedAt: '10 Feb 2025, 09:20 WITA',
    uploaderName: 'I Kadek Sudarma',
    description: 'Surat pengantar resmi dari kantor desa untuk rujukan Puskesmas',
  },
  {
    id: 'file-sample-3',
    fileName: 'Bukti_Donasi_Keluarga_Asuh_Feb2025.jpg',
    fileSize: '450 KB',
    fileType: 'image/jpeg',
    category: 'asuh_bukti_donasi',
    uploadedAt: '08 Feb 2025, 14:02 WITA',
    uploaderName: 'Made Suastika, S.E.',
    description: 'Konfirmasi penyaluran telur dan vitamin balita binaan',
  },
];

// MASTER DATABASE INSTANCE
export const MASTER_DATABASE_DEFAULT: AppDatabaseSchema = {
  version: '1.2.0',
  lastUpdated: new Date().toISOString(),

  // Bagian 1: Wilayah & Profil Desa
  kecamatanList: KECAMATAN_LIST,
  desaSariMekarProfile: DESA_SARI_MEKAR_PROFILE,
  stuntingMonthlyData: STUNTING_BULAN_DATA,
  beritaKegiatanList: DOKUMENTASI_KEGIATAN_LIST,

  // Bagian 2: Edukasi Medis & IMS
  edukasiPenyakitList: EDUKASI_PENYAKIT_SEKSUAL,
  videoEdukasiList: VIDEO_EDUKASI_LIST,

  // Bagian 3 & 4: Nakes & Chat Protokol
  nakesList: MASTER_NAKES_LIST,
  chat_protokol: MASTER_CHAT_PROTOKOL,

  // Bagian 5: Chat Interaksi Dokter / Nakes
  tanyaNakesChats: INITIAL_NAKES_CHATS,

  // Bagian 6: Chat Room Q&A Terbuka & Anonim
  qaChatRooms: INITIAL_CHAT_MESSAGES,

  // Bagian 7: Formulir Pendaftaran
  pendaftaranCatinList: INITIAL_PENDAFTARAN_CATIN,
  pendaftaranKeluargaAsuhList: INITIAL_PENDAFTARAN_KELUARGA_ASUH,

  // Bagian 8: Berkas / File Lampiran Pengguna
  uploadedFiles: INITIAL_UPLOADED_FILES,
};
