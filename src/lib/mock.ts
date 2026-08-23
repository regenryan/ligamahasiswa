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
  status: "Active" | "Won" | "Ongoing";
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
  type: "Forum" | "Assembly" | "Dialogue";
  blurb: string;
};

export type MediaItem = {
  slug: string;
  outlet: string;
  title: string;
  date: string;
  kind: "Video" | "Podcast" | "Article";
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
  preorder: boolean;
  deliveryEstimate: string;
};

export const chapters: Chapter[] = [
  {
    slug: "ligamy",
    name: "Liga Mahasiswa Malaysia",
    short: "LigaMY",
    ig: "@ligamahasiswa.my",
    color: "#e11d2e",
    tagline: "The national student movement.",
  },
  {
    slug: "ligaum",
    name: "Liga Mahasiswa UM",
    short: "LigaUM",
    ig: "@ligamahasiswa.um",
    color: "#e11d2e",
    tagline: "The first campus that dared.",
  },
  {
    slug: "ligautm",
    name: "Liga Mahasiswa UTM",
    short: "LigaUTM",
    ig: "@ligamahasiswautm",
    color: "#e11d2e",
    tagline: "Engineers who refuse to stay quiet.",
  },
  {
    slug: "ligausm",
    name: "Liga Mahasiswa USM",
    short: "LigaUSM",
    ig: "@ligamahasiswa.usm",
    color: "#e11d2e",
    tagline: "Island, beach, resistance.",
  },
  {
    slug: "ligaunisza",
    name: "Liga Mahasiswa UniSZA",
    short: "LigaUniSZA",
    ig: "@ligamahasiswa.unisza",
    color: "#e11d2e",
    tagline: "Terengganu has its own voice.",
  },
  {
    slug: "sparcutem",
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
    chapterSlug: "ligamy",
    role: "President",
    blurb:
      "The movement's leading voice. Former UM student, now steering the national direction.",
  },
  {
    name: "Adam Raiyan Abd. Rahim",
    chapterSlug: "ligamy",
    role: "Spokesperson",
    blurb:
      "Spokesperson for Liga Mahasiswa Malaysia and UTM. Usually in front of a microphone.",
  },
  {
    name: "Ammar Daniel Noor Irwan",
    chapterSlug: "ligaum",
    role: "President",
    blurb:
      "Leads Liga Mahasiswa UM. Unshaken when the campus sued its own students.",
  },
  {
    name: "Ahsanul Akmal Muhammad Sulam",
    chapterSlug: "ligaum",
    role: "Vice President",
    blurb: "The UM president's right hand. Runs the day-to-day campus work.",
  },
  {
    name: "Adief Al Syarif",
    chapterSlug: "ligautm",
    role: "President",
    blurb: "Heads the UTM student coalition against outdated campus rules.",
  },
  {
    name: "Muhammad Ajwad",
    chapterSlug: "ligausm",
    role: "President",
    blurb: "Built the league in Penang from zero. Now a reference for other campuses.",
  },
  {
    name: "Irfan Wafiy",
    chapterSlug: "ligaunisza",
    role: "President",
    blurb: "Carries rural student issues to the national level.",
  },
];

export const campaigns: Campaign[] = [
  {
    slug: "mansuh-auku",
    chapterSlug: "ligamy",
    title: "Mansuh AUKU",
    status: "Active",
    summary:
      "AUKU 1971 has ruled student life for 55 years. That is long enough.",
    demands: [
      "Abolish AUKU 1971 entirely",
      "Replace it with a law that respects student rights",
      "Students sit at the table when campus law is drafted",
    ],
    timeline: [
      { date: "2024", text: "The Liga Mahasiswa movement is formed" },
      { date: "2025-08", text: "Assembly in front of Parliament, Zara Qairina memo handed over" },
      { date: "2026-02", text: "Mansuh AUKU rally, memorandum submitted to Parliament" },
      { date: "2026-08", text: "Pushing the government to announce an abolition timeline" },
    ],
    hasTicker: true,
  },
  {
    slug: "dialog-terbuka-kpt",
    chapterSlug: "ligamy",
    title: "Dialog Terbuka dengan KPT",
    status: "Won",
    summary:
      "We challenged the Deputy Higher Education Minister to an open dialogue. He agreed. The dialogue happened.",
    demands: ["An open dialogue on campus", "A public record of the dialogue notes"],
    timeline: [
      { date: "2026-01-19", text: "Open invitation issued. Reply: we will meet" },
      { date: "2026-05", text: "The KPT and Liga Mahasiswa dialogue takes place" },
    ],
    hasTicker: false,
  },
  {
    slug: "keadilan-zara-qairina",
    chapterSlug: "ligamy",
    title: "Keadilan Zara Qairina",
    status: "Active",
    summary:
      "Systematic bullying inside the student housing system is not one isolated case.",
    demands: ["A transparent investigation", "Protection for bullying survivors"],
    timeline: [{ date: "2025-08-12", text: "March to Parliament, memo handed over" }],
    hasTicker: false,
  },
  {
    slug: "um-rumah-mandiri",
    chapterSlug: "ligaum",
    title: "Rumah Mandiri UM",
    status: "Active",
    summary: "The campus threatened to sue students for speaking up. We say no.",
    demands: ["Withdraw the legal threats", "Freedom of speech on campus"],
    timeline: [{ date: "2026-03", text: "Press conference rejecting the legal threats" }],
    hasTicker: false,
  },
  {
    slug: "gabungan-palestin",
    chapterSlug: "ligamy",
    title: "GMMP: Solidariti Palestin",
    status: "Ongoing",
    summary:
      "Part of the Gabungan Mahasiswa Memperjuangkan Palestin together with the UM, UniSZA and other chapters.",
    demands: ["Academic and economic boycott", "A student voice for Palestine"],
    timeline: [{ date: "2025-03", text: "The coalition is formed" }],
    hasTicker: false,
  },
  {
    slug: "sekolah-migran",
    chapterSlug: "ligamy",
    title: "Pendidikan Inklusif",
    status: "Ongoing",
    summary:
      "Education is everyone's right. We support the migrant children learning centres in Semenyih.",
    demands: ["Access to education for all"],
    timeline: [
      { date: "2025-05", text: "Books and supplies donated to Sanggar Belajar Beranang" },
    ],
    hasTicker: false,
  },
];

export const events: EventItem[] = [
  {
    slug: "kuliah-hak-mahasiswa-101",
    chapterSlug: "ligamy",
    title: "Open Lecture: Student Rights 101",
    date: "2026-10-17",
    time: "8:00 PM",
    place: "Kuala Lumpur",
    type: "Forum",
    blurb:
      "What AUKU is, what your rights are, and what you can do about it. Open session for everyone.",
  },
  {
    slug: "gerak-jalan-mansuh-auku",
    chapterSlug: "ligamy",
    title: "Gerak Jalan Mansuh AUKU",
    date: "2026-11-14",
    time: "9:00 AM",
    place: "Dataran Merdeka",
    type: "Assembly",
    blurb: "Wear red. Bring a friend. Bring the reasons we are not done yet.",
  },
  {
    slug: "dialog-suara-pelajar-utm",
    chapterSlug: "ligautm",
    title: "Open Dialogue: The UTM Student Voice",
    date: "2026-09-26",
    time: "7:30 PM",
    place: "Skudai",
    type: "Dialogue",
    blurb: "Outdated rules, unreasonable lawsuits. Time for students to answer back.",
  },
];

export const mediaItems: MediaItem[] = [
  {
    slug: "kinitv-kad-merah",
    outlet: "KiniTV",
    title: "Anti-AUKU demo: Students show a red card to Adam Adli",
    date: "2026-08",
    kind: "Video",
    blurb: "Full coverage of the demo. The red card is our message.",
  },
  {
    slug: "awani-dialog",
    outlet: "Astro AWANI",
    title: "We will meet: Adam Adli agrees to a dialogue with Liga Mahasiswa Malaysia",
    date: "2026-01-19",
    kind: "Article",
    blurb: "We issued the challenge. The minister's reply: agreed.",
  },
  {
    slug: "syok-podcast",
    outlet: "SYOK Podcast",
    title: "Life Confessions S4E25 with Alyaah Hani",
    date: "2025-09-29",
    kind: "Podcast",
    blurb:
      "The league president on AUKU, campus freedom, and why it is personal.",
  },
  {
    slug: "utusan-rally",
    outlet: "Utusan Malaysia",
    title: "Liga Mahasiswa rallies to demand AUKU be abolished",
    date: "2026-02-09",
    kind: "Article",
    blurb:
      "A peaceful assembly in front of Parliament, backed by dozens of student organisations.",
  },
  {
    slug: "fmt-parliament-march",
    outlet: "Free Malaysia Today",
    title: "Protesters march on Parliament with memo seeking justice for Zara Qairina",
    date: "2025-08-12",
    kind: "Article",
    blurb: "The march and the memo handed over to Parliament.",
  },
  {
    slug: "bernama-dialog-may",
    outlet: "Bernama",
    title: "MOHE-LMM dialogue expected to take place in May",
    date: "2026-04-18",
    kind: "Article",
    blurb: "An official dialogue between KPT and Liga Mahasiswa is scheduled.",
  },
];

export const zinePosts: ZinePost[] = [
  {
    slug: "surat-bakal-presiden",
    author: "Alyaah Hani",
    chapterSlug: "ligamy",
    title: "Open letter to the next president",
    excerpt:
      "To whoever takes office next. Remember: you are not a boss, you are a public servant.",
    likes: 214,
  },
  {
    slug: "auku-dan-sewa-bilik",
    author: "Irfan Wafiy",
    chapterSlug: "ligaunisza",
    title: "AUKU and the rent bill",
    excerpt:
      "Sometimes I wonder which costs more: my tuition or my room rent. The answer is depressing.",
    likes: 158,
  },
  {
    slug: "nota-dari-perhimpunan",
    author: "Adam Raiyan",
    chapterSlug: "ligautm",
    title: "Notes from the assembly",
    excerpt:
      "It rained, and no one left. That was the first time I understood what a small victory feels like.",
    likes: 342,
  },
  {
    slug: "zine-apa-makna-merdeka",
    author: "Ammar Daniel",
    chapterSlug: "ligaum",
    title: "What independence means for a student",
    excerpt:
      "Independence is not just a flag. It is being able to speak without fearing a lawsuit.",
    likes: 189,
  },
];

export const products: Product[] = [
  {
    slug: "tee-mansuh-auku",
    chapterSlug: "ligamy",
    name: "Mansuh AUKU Tee",
    price: "RM39",
    tag: "Preorder",
    memberOnly: false,
    preorder: true,
    deliveryEstimate: "2-3 weeks",
  },
  {
    slug: "pin-kad-merah",
    chapterSlug: "ligamy",
    name: "Red Card Pin",
    price: "RM12",
    tag: "Ready stock",
    memberOnly: false,
    preorder: false,
    deliveryEstimate: "",
  },
  {
    slug: "sticker-kampung",
    chapterSlug: "ligamy",
    name: "Kampung Liga Sticker Pack",
    price: "RM10",
    tag: "Ready stock",
    memberOnly: false,
    preorder: false,
    deliveryEstimate: "",
  },
  {
    slug: "tote-kampus-bebas",
    chapterSlug: "ligamy",
    name: "Free Campus Tote",
    price: "RM35",
    tag: "Ready stock",
    memberOnly: false,
    preorder: false,
    deliveryEstimate: "",
  },
  {
    slug: "hoodie-liga",
    chapterSlug: "ligamy",
    name: "Liga Members-Only Hoodie",
    price: "RM89",
    tag: "Member exclusive",
    memberOnly: true,
    preorder: false,
    deliveryEstimate: "",
  },
  {
    slug: "lanyard-member",
    chapterSlug: "ligamy",
    name: "Member ID Lanyard",
    price: "RM15",
    tag: "Member exclusive",
    memberOnly: true,
    preorder: false,
    deliveryEstimate: "",
  },
];

export const stories = [
  {
    name: "Ammar, UM",
    text: "My room rent costs more than my tuition. Something has to change.",
  },
  {
    name: "Alyaah, Malaysia",
    text: "I am tired of being told not to cause trouble. When I stay quiet, I get angry.",
  },
  {
    name: "Adam, UTM",
    text: "When a campus sues its own students, I knew someone had to fight back.",
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