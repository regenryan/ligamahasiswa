export type Chapter = {
  slug: string;
  name: string;
  short: string;
  ig: string;
  color: string;
  tagline: string;
};

export type Member = {
  name: string;
  chapterSlug: string;
  role: string;
  blurb: string;
};

export type Campaign = {
  slug: string;
  chapterSlug: string;
  title: string;
  status: "Aktif" | "Menang" | "On-going";
  summary: string;
  demands: string[];
  timeline: { date: string; text: string }[];
  hasTicker: boolean;
};

export type EventItem = {
  slug: string;
  chapterSlug: string;
  title: string;
  date: string;
  time: string;
  place: string;
  type: "Forum" | "Perhimpunan" | "Dialog";
  blurb: string;
};

export type MediaItem = {
  slug: string;
  outlet: string;
  title: string;
  date: string;
  kind: "Video" | "Podcast" | "Artikel";
  blurb: string;
};

export type ZinePost = {
  slug: string;
  author: string;
  chapterSlug: string;
  title: string;
  excerpt: string;
  likes: number;
};

export type Product = {
  slug: string;
  chapterSlug: string;
  name: string;
  price: string;
  tag: string;
  memberOnly: boolean;
};

export const chapters: Chapter[] = [
  {
    slug: "malaysia",
    name: "Liga Mahasiswa Malaysia",
    short: "Malaysia",
    ig: "@ligamahasiswa.my",
    color: "#e11d2e",
    tagline: "Gerakan mahasiswa di peringkat kebangsaan.",
  },
  {
    slug: "um",
    name: "Liga Mahasiswa UM",
    short: "UM",
    ig: "@ligamahasiswa.um",
    color: "#e11d2e",
    tagline: "Kampus pertama yang berani.",
  },
  {
    slug: "utm",
    name: "Liga Mahasiswa UTM",
    short: "UTM",
    ig: "@ligamahasiswautm",
    color: "#e11d2e",
    tagline: "Engineers yang tak diam je.",
  },
  {
    slug: "usm",
    name: "Liga Mahasiswa USM",
    short: "USM",
    ig: "@ligamahasiswa.usm",
    color: "#e11d2e",
    tagline: "Pulau, pantai, perlawanan.",
  },
  {
    slug: "unisza",
    name: "Liga Mahasiswa UniSZA",
    short: "UniSZA",
    ig: "@ligamahasiswa.unisza",
    color: "#e11d2e",
    tagline: "Terengganu ada suara sendiri.",
  },
  {
    slug: "utem",
    name: "SPARC UTeM",
    short: "SPARC UTeM",
    ig: "@sparc.utem",
    color: "#e11d2e",
    tagline: "Student power, rise of campus.",
  },
];

export const members: Member[] = [
  {
    name: "Alyaah Hani Anuar",
    chapterSlug: "malaysia",
    role: "President",
    blurb: "Suara utama gerakan. Bekas pelajar UM, sekarang jaga arah nasional.",
  },
  {
    name: "Adam Raiyan Abd. Rahim",
    chapterSlug: "malaysia",
    role: "Jurucakap",
    blurb: "Jurucakap Liga Mahasiswa Malaysia dan UTM. Selalunya depan mikrofon.",
  },
  {
    name: "Ammar Daniel Noor Irwan",
    chapterSlug: "um",
    role: "President",
    blurb: "Pimpin Liga Mahasiswa UM. Tak gentar bila kampus saman pelajarnya.",
  },
  {
    name: "Ahsanul Akmal Muhammad Sulam",
    chapterSlug: "um",
    role: "Vice President",
    blurb: "Tangan kanan presiden UM. Urus gerak kerja harian kampus.",
  },
  {
    name: "Adief Al Syarif",
    chapterSlug: "utm",
    role: "President",
    blurb: "Ketuai gabungan gerakan mahasiswa UTM lawan peraturan lapuk.",
  },
  {
    name: "Muhammad Ajwad",
    chapterSlug: "usm",
    role: "President",
    blurb: "Bina liga di Pulau Pinang dari kosong. Kini jadi rujukan kampus.",
  },
  {
    name: "Irfan Wafiy",
    chapterSlug: "unisza",
    role: "President",
    blurb: "Bawa isu mahasiswa luar bandar ke aras nasional.",
  },
];

export const campaigns: Campaign[] = [
  {
    slug: "mansuh-auku",
    chapterSlug: "malaysia",
    title: "Mansuh AUKU",
    status: "Aktif",
    summary:
      "AUKU 1971 telah memerintah kehidupan pelajar selama 55 tahun. Sekarang dah cukup.",
    demands: [
      "Hapuskan AUKU 1971 sepenuhnya",
      "Ganti dengan akta yang hormat hak pelajar",
      "Pelajar duduk sekali dalam penggubalan undang-undang kampus",
    ],
    timeline: [
      { date: "2024", text: "Gerakan Liga Mahasiswa mula dibentuk" },
      { date: "2025-08", text: "Perhimpunan depan Parlimen, memo Zara Qairina" },
      { date: "2026-02", text: "Rali Mansuh AUKU, memorandum diserah kepada Parlimen" },
      { date: "2026-08", text: "Desak kerajaan umum garis masa pemansuhan" },
    ],
    hasTicker: true,
  },
  {
    slug: "dialog-terbuka-kpt",
    chapterSlug: "malaysia",
    title: "Dialog Terbuka dengan KPT",
    status: "Menang",
    summary:
      "Kami cabar Timbalan Menteri Pengajian Tinggi berdialog secara terbuka. Dia setuju. Dialog berlangsung.",
    demands: ["Dialog terbuka di kampus", "Nota dialog diterbitkan untuk umum"],
    timeline: [
      { date: "2026-01-19", text: "Jemputan terbuka dibuat, jawapan: jumpa nanti" },
      { date: "2026-05", text: "Dialog KPT dan Liga Mahasiswa berlangsung" },
    ],
    hasTicker: false,
  },
  {
    slug: "keadilan-zara-qairina",
    chapterSlug: "malaysia",
    title: "Keadilan Zara Qairina",
    status: "Aktif",
    summary:
      "Buli sistematik dalam sistem asrama pelajar tidak boleh dianggap kes terpencil.",
    demands: ["Siasatan telus", "Perlindungan untuk mangsa buli"],
    timeline: [{ date: "2025-08-12", text: "Perarakan ke Parlimen, memo diserahkan" }],
    hasTicker: false,
  },
  {
    slug: "um-rumah-mandiri",
    chapterSlug: "um",
    title: "Rumah Mandiri UM",
    status: "Aktif",
    summary:
      "Kampus ancam saman pelajar yang bercakap. Kami kata tak boleh.",
    demands: ["Tarik balik ancaman saman", "Kebebasan bersuara dalam kampus"],
    timeline: [{ date: "2026-03", text: "Sidang media menolak ancaman undang-undang" }],
    hasTicker: false,
  },
  {
    slug: "gabungan-palestin",
    chapterSlug: "malaysia",
    title: "GMMP: Solidariti Palestin",
    status: "On-going",
    summary:
      "Sebahagian dari Gabungan Mahasiswa Memperjuangkan Palestin bersama bab UM, UniSZA dan lain-lain.",
    demands: ["Boikot akademik dan ekonomi", "Suara mahasiswa untuk Palestin"],
    timeline: [{ date: "2025-03", text: "Gabungan ditubuhkan" }],
    hasTicker: false,
  },
  {
    slug: "sekolah-migran",
    chapterSlug: "malaysia",
    title: "Pendidikan Inklusif",
    status: "On-going",
    summary:
      "Pendidikan sejatinya hak semua orang. Kami sokong sanggar belajar kanak-kanak migran di Semenyih.",
    demands: ["Akses pendidikan untuk semua"],
    timeline: [{ date: "2025-05", text: "Sumbangan buku dan peralatan ke Sanggar Belajar Beranang" }],
    hasTicker: false,
  },
];

export const events: EventItem[] = [
  {
    slug: "kuliah-hak-mahasiswa-101",
    chapterSlug: "malaysia",
    title: "Kuliah Umum: Hak Mahasiswa 101",
    date: "2026-10-17",
    time: "8:00 PM",
    place: "Kuala Lumpur",
    type: "Forum",
    blurb: "Apa itu AUKU, apa hak kau, dan apa boleh dibuat. Sesi terbuka untuk semua.",
  },
  {
    slug: "gerak-jalan-mansuh-auku",
    chapterSlug: "malaysia",
    title: "Gerak Jalan Mansuh AUKU",
    date: "2026-11-14",
    time: "9:00 AM",
    place: "Dataran Merdeka",
    type: "Perhimpunan",
    blurb: "Bawa baju merah. Bawa kawan. Bawa sebab kita belum habis.",
  },
  {
    slug: "dialog-suara-pelajar-utm",
    chapterSlug: "utm",
    title: "Dialog Terbuka: Suara Pelajar UTM",
    date: "2026-09-26",
    time: "7:30 PM",
    place: "Skudai",
    type: "Dialog",
    blurb: "Peraturan lama, saman tak munasabah. Masa pelajar jawab.",
  },
];

export const mediaItems: MediaItem[] = [
  {
    slug: "kinitv-kad-merah",
    outlet: "KiniTV",
    title: "Demo anti-AUKU: Mahasiswa beri kad merah pada Adam Adli",
    date: "2026-08",
    kind: "Video",
    blurb: "Liputan penuh demo. Kad merah adalah mesej kami.",
  },
  {
    slug: "awani-dialog",
    outlet: "Astro AWANI",
    title: "Jumpa nanti: Adam Adli setuju berdialog dengan Liga Mahasiswa Malaysia",
    date: "2026-01-19",
    kind: "Artikel",
    blurb: "Cabar kami dijemput. Balasan menteri: setuju.",
  },
  {
    slug: "syok-podcast",
    outlet: "SYOK Podcast",
    title: "Life Confessions S4E25 bersama Alyaah Hani",
    date: "2025-09-29",
    kind: "Podcast",
    blurb: "Presiden Liga bercerita tentang AUKU, kebebasan kampus, dan kenapa ia peribadi.",
  },
  {
    slug: "utusan-rally",
    outlet: "Utusan Malaysia",
    title: "Liga Mahasiswa berhimpun desak AUKU dimansuhkan",
    date: "2026-02-09",
    kind: "Artikel",
    blurb: "Perhimpunan aman depan Parlimen disokong puluhan organisasi mahasiswa.",
  },
  {
    slug: "fmt-parliament-march",
    outlet: "Free Malaysia Today",
    title: "Protesters march on Parliament with memo seeking justice for Zara Qairina",
    date: "2025-08-12",
    kind: "Artikel",
    blurb: "Perarakan dan penyerahan memo ke Parlimen.",
  },
  {
    slug: "bernama-dialog-may",
    outlet: "Bernama",
    title: "MOHE-LMM dialogue expected to take place in May",
    date: "2026-04-18",
    kind: "Artikel",
    blurb: "Dialog rasmi antara KPT dan Liga Mahasiswa dijadualkan.",
  },
];

export const zinePosts: ZinePost[] = [
  {
    slug: "surat-bakal-presiden",
    author: "Alyaah Hani",
    chapterSlug: "malaysia",
    title: "Surat terbuka kepada bakal presiden",
    excerpt:
      "Kepada sesiapa yang bakal pegang jawatan. Ingat: kau bukan bos, kau adalah pekerja rakyat.",
    likes: 214,
  },
  {
    slug: "auku-dan-sewa-bilik",
    author: "Irfan Wafiy",
    chapterSlug: "unisza",
    title: "AUKU dan sewa bilik",
    excerpt:
      "Kadang aku tertanya, yang mana lebih mahal: yuran aku atau sewa bilik aku. Jawapan dia menyedihkan.",
    likes: 158,
  },
  {
    slug: "nota-dari-perhimpunan",
    author: "Adam Raiyan",
    chapterSlug: "utm",
    title: "Nota dari perhimpunan",
    excerpt:
      "Hujan turun tapi tak seorang pun balik. Itu kali pertama aku rasa apa makna kemenangan kecil.",
    likes: 342,
  },
  {
    slug: "zine-apa-makna-merdeka",
    author: "Ammar Daniel",
    chapterSlug: "um",
    title: "Apa makna merdeka untuk pelajar",
    excerpt:
      "Merdeka bukan hanya bendera. Merdeka ialah bila kau boleh bercakap tanpa takut disaman.",
    likes: 189,
  },
];

export const products: Product[] = [
  {
    slug: "tee-mansuh-auku",
    chapterSlug: "malaysia",
    name: "Tee Mansuh AUKU",
    price: "RM39",
    tag: "Preorder",
    memberOnly: false,
  },
  {
    slug: "pin-kad-merah",
    chapterSlug: "malaysia",
    name: "Pin Kad Merah",
    price: "RM12",
    tag: "Ready stock",
    memberOnly: false,
  },
  {
    slug: "sticker-kampung",
    chapterSlug: "malaysia",
    name: "Sticker Pack Kampung Liga",
    price: "RM10",
    tag: "Ready stock",
    memberOnly: false,
  },
  {
    slug: "tote-kampus-bebas",
    chapterSlug: "malaysia",
    name: "Tote Kampus Bebas",
    price: "RM35",
    tag: "Ready stock",
    memberOnly: false,
  },
  {
    slug: "hoodie-liga",
    chapterSlug: "malaysia",
    name: "Hoodie Liga Members Only",
    price: "RM89",
    tag: "Member exclusive",
    memberOnly: true,
  },
  {
    slug: "lanyard-member",
    chapterSlug: "malaysia",
    name: "Lanyard Member ID",
    price: "RM15",
    tag: "Member exclusive",
    memberOnly: true,
  },
];

export const stories = [
  {
    name: "Ammar, UM",
    text: "Bilik sewa aku lebih mahal dari yuran aku. Ada yang patut berubah.",
  },
  {
    name: "Alyaah, Malaysia",
    text: "Aku bosan dengar orang cakap jangan ganggu. Bila aku diam, aku marah.",
  },
  {
    name: "Adam, UTM",
    text: "Bila kampus saman pelajar sendiri, aku tahu kena ada yang lawan balik.",
  },
];

export const allies = [
  "FEDERASI",
  "Ikatan Mahasiswa Demokratik",
  "Pro-Siswa Kolej Komuniti",
  "UMANY",
  "NewGen UM",
  "Suara Siswa UM",
  "Kelab Bahasa Melayu UniSHAMS",
  "Congress",
];

export const getChapter = (slug: string) =>
  chapters.find((c) => c.slug === slug) ?? chapters[0];

export const getCampaign = (chapterSlug: string, campaignSlug: string) =>
  campaigns.find((c) => c.chapterSlug === chapterSlug && c.slug === campaignSlug) ?? campaigns[0];

export const countdownTarget = new Date("2026-11-14T09:00:00+08:00");
export const aukuStart = new Date("1971-05-01T00:00:00+08:00");
