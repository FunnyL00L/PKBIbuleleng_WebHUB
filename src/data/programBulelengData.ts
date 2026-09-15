export interface ProgramHighlightItem {
  id: string;
  kecamatanId: string;
  wilayahNama: string;
  jadwal: string;
  hariTanggal: string;
  title: string;
  category: string;
  imageUrl: string;
  participants: number;
  status: string;
}

export interface ProgramKabupatenInfo {
  id: string;
  title: string;
  kategori: 'stunting' | 'catin' | 'kespro' | 'remaja' | 'pangan';
  kategoriLabel: string;
  statusPelaksanaan: 'Terlaksana & Berkelanjutan' | 'Rutin Setiap Bulan' | 'Selesai 100%';
  periode: string;
  wilayahCakupan: string;
  kecamatanTargetIds: string[];
  totalPenerimaManfaat: string;
  capaianUtama: string;
  deskripsi: string;
  imageUrl: string;
  indikatorSukses: string[];
}

// Highlight foto kegiatan yang akan scroll secara terus-menerus
export const HIGHLIGHT_WILAYAH_SCROLL: ProgramHighlightItem[] = [
  {
    id: 'hl-1',
    kecamatanId: 'buleleng',
    wilayahNama: 'Desa Sari Mekar, Kec. Buleleng',
    jadwal: 'Rutin Setiap Senin & Rabu',
    hariTanggal: 'Senin, 07 Oktober 2024',
    title: 'Pemberian Makanan Tambahan (PMT) Berbasis Telur & Ikan Lokal',
    category: 'Penanganan Stunting',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    participants: 165,
    status: 'Terlaksana',
  },
  {
    id: 'hl-2',
    kecamatanId: 'tejakula',
    wilayahNama: 'Kecamatan Tejakula',
    jadwal: 'Pekan Ke-2 Tiap Bulan',
    hariTanggal: 'Rabu, 13 November 2024',
    title: 'Skrining Calon Pengantin (Catin) & Konseling Kesehatan Pranikah',
    category: 'Kesehatan Reproduksi',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    participants: 85,
    status: 'Terlaksana',
  },
  {
    id: 'hl-3',
    kecamatanId: 'sukasada',
    wilayahNama: 'Kecamatan Sukasada',
    jadwal: 'Minggu Ke-1 Tiap Bulan',
    hariTanggal: 'Sabtu, 05 Oktober 2024',
    title: 'Pemeriksaan USG Kehamilan Portabel & Pemantauan Tumbuh Kembang Janin',
    category: 'Kesehatan Ibu & Bayi',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    participants: 140,
    status: 'Terlaksana',
  },
  {
    id: 'hl-4',
    kecamatanId: 'buleleng',
    wilayahNama: 'Desa Sari Mekar (Binaan Utama)',
    jadwal: 'Pendampingan 6 Bulan Intensif',
    hariTanggal: 'Kamis, 17 Oktober 2024',
    title: 'Gerakan Keluarga Asuh Balita Stunting bersama 35 Orang Tua Angkat',
    category: 'Inovasi Kolaboratif',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    participants: 92,
    status: 'Terlaksana & Aktif',
  },
  {
    id: 'hl-5',
    kecamatanId: 'gerokgak',
    wilayahNama: 'Kecamatan Gerokgak',
    jadwal: 'Bulan Bakti Pesisir',
    hariTanggal: 'Senin, 16 September 2024',
    title: 'Restorasi Terumbu Karang & Ketahanan Pangan Bahari Nelayan',
    category: 'Pemberdayaan Pesisir',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    participants: 120,
    status: 'Terlaksana',
  },
  {
    id: 'hl-6',
    kecamatanId: 'seririt',
    wilayahNama: 'Kecamatan Seririt',
    jadwal: 'Pekan Panen & Gizi',
    hariTanggal: 'Kamis, 26 September 2024',
    title: 'Diversifikasi Pangan Olahan Jagung Manis & Anggur Hitam Seririt',
    category: 'Pangan Lokal',
    imageUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80',
    participants: 95,
    status: 'Terlaksana',
  },
  {
    id: 'hl-7',
    kecamatanId: 'busungbiu',
    wilayahNama: 'Kecamatan Busungbiu',
    jadwal: 'Konservasi & Edukasi Warga',
    hariTanggal: 'Selasa, 01 Oktober 2024',
    title: 'Pembinaan Keluarga Petani Kopi & Edukasi Sanitasi Air Bersih DAS Saba',
    category: 'Lingkungan Sehat',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
    participants: 80,
    status: 'Terlaksana',
  },
  {
    id: 'hl-8',
    kecamatanId: 'sawan',
    wilayahNama: 'Kecamatan Sawan',
    jadwal: 'Festival Budaya & Posyandu',
    hariTanggal: 'Rabu, 09 Oktober 2024',
    title: 'Aksi Sehat Posyandu Terpadu saat Gelaran Seni Budaya Sangsit',
    category: 'Posyandu Kreatif',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    participants: 150,
    status: 'Terlaksana',
  },
  {
    id: 'hl-9',
    kecamatanId: 'kubutambahan',
    wilayahNama: 'Kecamatan Kubutambahan',
    jadwal: 'Edukasi Gizi Pertanian',
    hariTanggal: 'Jumat, 18 Oktober 2024',
    title: 'Pemanfaatan Buah Naga Merah untuk Asupan Antioksidan Ibu Hamil',
    category: 'Gizi Hortikultura',
    imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
    participants: 110,
    status: 'Terlaksana',
  },
];

// Daftar Program-Program yang Telah Dilaksanakan di Kabupaten Buleleng
export const PROGRAM_KABUPATEN_BULELENG: ProgramKabupatenInfo[] = [
  {
    id: 'prog-stunting-terpadu',
    title: 'Program Percepatan Penurunan Stunting Terpadu & Gerakan Orang Tua Asuh',
    kategori: 'stunting',
    kategoriLabel: 'Stunting & Balita',
    statusPelaksanaan: 'Terlaksana & Berkelanjutan',
    periode: 'Januari - Desember 2024 (Berkelanjutan 2025)',
    wilayahCakupan: 'Desa Sari Mekar & 9 Kecamatan se-Kabupaten Buleleng',
    kecamatanTargetIds: ['buleleng', 'sukasada', 'tejakula', 'banjar', 'sawan'],
    totalPenerimaManfaat: '284 Balita & 45 Ibu Hamil',
    capaianUtama: 'Prevalensi stunting di Desa Binaan Sari Mekar turun tajam dari 17.6% menjadi 6.7%',
    deskripsi:
      'Program aksi konvergensi stunting dengan memasangkan 35 donatur/orang tua asuh dengan keluarga balita berisiko gagal tumbuh. Program meliputi pemenuhan pangan hewani harian, monitoring e-PPGBM bulanan, dan pendampingan gizi berkelanjutan.',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    indikatorSukses: [
      'Penurunan angka balita stunting dari 46 anak menjadi 19 anak di Desa Binaan',
      'Terdistribusinya 1.250+ paket protein hewani (telur, susu, dan ikan segar)',
      '100% balita terdata dalam kartu kontrol digital dan dipantau bidan desa',
    ],
  },
  {
    id: 'prog-skrining-catin',
    title: 'Layanan Pemeriksaan Pranikah & Konseling Calon Pengantin (Catin Sehat)',
    kategori: 'catin',
    kategoriLabel: 'Layanan Calon Pengantin',
    statusPelaksanaan: 'Rutin Setiap Bulan',
    periode: 'Tahun 2024 - 2025',
    wilayahCakupan: '9 KUA & Kantor Camat di 9 Kecamatan Kabupaten Buleleng',
    kecamatanTargetIds: ['buleleng', 'seririt', 'gerokgak', 'busungbiu', 'tejakula', 'banjar', 'sukasada', 'sawan', 'kubutambahan'],
    totalPenerimaManfaat: '840+ Pasangan Calon Pengantin',
    capaianUtama: '100% Catin binaan teredukasi risiko anemia dan menerima sertifikat Elsimil',
    deskripsi:
      'Pemeriksaan medis terpadu pranikah yang menjamin privasi calon pengantin. Meliputi pemeriksaan Hemoglobin (Hb) untuk pencegahan anemia calon ibu, deteksi dini IMS, bimbingan psikologi keluarga, dan perencanaan kehamilan sehat.',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    indikatorSukses: [
      '840 pasangan menyelesaikan skrining kesehatan reproduksi pranikah',
      'Deteksi dini dan penanganan 38 kasus anemia pada calon pengantin wanita',
      'Pelaksanaan bimbingan konseling rahasia & bebas stigma bagi seluruh pasangan',
    ],
  },
  {
    id: 'prog-dashat-pkk',
    title: 'Dapur Sehat Atasi Stunting (DASHAT) & Pemanfaatan Kebun Gizi Pekarangan',
    kategori: 'pangan',
    kategoriLabel: 'Ketahanan Pangan Lokal',
    statusPelaksanaan: 'Terlaksana & Berkelanjutan',
    periode: 'Agustus - Desember 2024',
    wilayahCakupan: 'Kelompok PKK di 4 Banjar Desa Sari Mekar & Kecamatan Sekitar',
    kecamatanTargetIds: ['buleleng', 'sukasada', 'banjar'],
    totalPenerimaManfaat: '180 Kader PKK & 320 Keluarga',
    capaianUtama: 'Tersusunnya 8 formula resep MP-ASI bergizi tinggi dari bahan baku lokal (Kelor, Labu, Telur)',
    deskripsi:
      'Pelatihan memasak praktis makanan pendamping ASI bernutrisi tinggi tanpa penyedap sintetis. Kader dibekali keterampilan mengolah komoditas pangan lokal yang melimpah di pekarangan rumah seperti daun kelor dan labu kuning.',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    indikatorSukses: [
      '100 pekarangan rumah warga menerima bibit tanaman kelor dan labu madu',
      'Penerbitan Buku Saku Menu Bergizi Seimbang DASHAT Buleleng',
      'Penyediaan dapur percontohan mandiri di setiap banjar dinas',
    ],
  },
  {
    id: 'prog-kespro-ims',
    title: 'Mobile Clinic Kesehatan Reproduksi, Deteksi Dini IMS & Skrining IVA Test',
    kategori: 'kespro',
    kategoriLabel: 'Kesehatan Reproduksi',
    statusPelaksanaan: 'Selesai 100%',
    periode: 'Triwulan III & IV 2024',
    wilayahCakupan: 'Kecamatan Tejakula, Gerokgak, Sawan, dan Kubutambahan',
    kecamatanTargetIds: ['tejakula', 'gerokgak', 'sawan', 'kubutambahan'],
    totalPenerimaManfaat: '620 Wanita Usia Subur & Nelayan',
    capaianUtama: 'Pemeriksaan IVA test dan rapid test IMS sukarela gratis dengan ruang privasi tertutup',
    deskripsi:
      'Pusat layanan kesehatan bergerak PKBI menjangkau wilayah pelosok dan pesisir Buleleng. Memberikan penyuluhan tentang bahaya penyakit menular seksual, pencegahan transmisi ibu ke anak, dan layanan konseling dokter spesialis kulit dan kelamin.',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
    indikatorSukses: [
      '620 warga terlayani pemeriksaan kesehatan reproduksi komprehensif',
      'Fasilitasi tes VCT sukarela bebas stigma bagi kelompok berisiko tinggi',
      'Rujukan medis langsung ke RSUD Buleleng bagi pasien terindikasi',
    ],
  },
  {
    id: 'prog-genre-remaja',
    title: 'Pusat Informasi & Konseling Remaja (PIK-R) & Edukasi Generasi Berencana',
    kategori: 'remaja',
    kategoriLabel: 'Edukasi Remaja & GenRe',
    statusPelaksanaan: 'Terlaksana & Berkelanjutan',
    periode: 'Sepanjang Tahun 2024',
    wilayahCakupan: '18 Sekolah Menengah Atas/Kejuruan se-Kabupaten Buleleng',
    kecamatanTargetIds: ['buleleng', 'seririt', 'banjar', 'sukasada'],
    totalPenerimaManfaat: '1.450 Siswa & Karang Taruna',
    capaianUtama: 'Pencegahan pernikahan dini dan edukasi kesehatan reproduksi ramah remaja',
    deskripsi:
      'Program konseling sebaya yang memberdayakan remaja Buleleng agar memiliki pemahaman matang mengenai usia ideal menikah (minimal 21 tahun untuk perempuan dan 25 tahun untuk laki-laki), bahaya seks berisiko, serta perencanaan masa depan.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    indikatorSukses: [
      'Pembentukan 18 kelompok PIK-R aktif di sekolah dan desa adat',
      'Pelatihan 60 pendidik sebaya (peer educator) bersertifikat PKBI',
      'Penurunan signifikan laporan pernikahan usia dini di tingkat desa binaan',
    ],
  },
  {
    id: 'prog-usg-antenatal',
    title: 'Safari Antenatal Care & Pemeriksaan USG Kehamilan Gratis di Pelosok',
    kategori: 'stunting',
    kategoriLabel: 'Kesehatan Ibu Hamil',
    statusPelaksanaan: 'Rutin Setiap Bulan',
    periode: 'Mei - Desember 2024',
    wilayahCakupan: 'Desa-desa perbukitan Sukasada, Busungbiu, dan Banjar',
    kecamatanTargetIds: ['sukasada', 'busungbiu', 'banjar'],
    totalPenerimaManfaat: '310 Ibu Hamil',
    capaianUtama: 'Deteksi dini risiko Intrauterine Growth Restriction (IUGR) dan preeklamsia',
    deskripsi:
      'Menghadirkan dokter spesialis obstetri dan ginekologi (Sp.OG) langsung ke balai desa dengan alat USG portabel canggih. Memberikan kepastian tumbuh kembang janin bagi ibu hamil yang memiliki akses terbatas ke rumah sakit rujukan.',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    indikatorSukses: [
      '310 ibu hamil mendapatkan USG 2D/4D dan konsultasi dokter kandungan gratis',
      'Pemberian suplemen asam folat dan zat besi untuk 100% ibu hamil terdata',
      'Zero kasus kematian ibu melahirkan di wilayah sasaran program sepanjang 2024',
    ],
  },
];
