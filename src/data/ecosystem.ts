export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  deliverables: string[];
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'website-development',
    title: 'Website Development',
    category: 'Engineering',
    description:
      'Rekayasa web berkinerja tinggi dengan arsitektur modern, struktur semantik presisi, dan responsivitas lintas perangkat.',
    deliverables: ['Responsive Architecture', 'Technical SEO Ready', 'Production Frontend Stack'],
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    category: 'Engineering',
    description:
      'Pengembangan aplikasi mobile lintas platform yang stabil, terukur, dan dirancang untuk interaksi sentuh yang presisi.',
    deliverables: ['iOS & Android Ready', 'Modular Codebase', 'Seamless API Sync'],
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    category: 'Design',
    description:
      'Perancangan sistem antarmuka dan pengalaman pengguna berbasis arsitektur informasi, prototipe interaktif, dan design system.',
    deliverables: ['Scalable Design System', 'Interactive Prototype', 'WCAG Accessibility'],
  },
  {
    id: 'custom-software',
    title: 'Custom Software Development',
    category: 'Engineering',
    description:
      'Pembangunan sistem perangkat lunak terdedikasi yang selaras dengan logika operasional dan kebutuhan skalabilitas organisasi.',
    deliverables: ['Tailored System Design', 'Resilient Backend', 'Technical Documentation'],
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    category: 'Creative',
    description:
      'Konstruksi identitas visual, sistem tipografi, dan aset komunikasi grafis dengan karakter estetika yang konsisten.',
    deliverables: ['Visual Identity System', 'Brand Guidelines', 'Multi-Medium Assets'],
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    category: 'Growth',
    description:
      'Eksekusi strategi akuisisi dan kampanye digital terstruktur untuk memperluas jangkauan pasar secara terukur.',
    deliverables: ['Acquisition Strategy', 'Conversion Funnel', 'Analytics Alignment'],
  },
  {
    id: 'social-media-management',
    title: 'Social Media Management',
    category: 'Growth',
    description:
      'Pengelolaan kanal komunikasi digital secara sistematis untuk menjaga konsistensi narasi dan kredibilitas brand.',
    deliverables: ['Editorial Calendar', 'Visual Direction', 'Channel Governance'],
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    category: 'Creative',
    description:
      'Produksi aset editorial, visual, dan multimedia berstandar studio untuk mendukung kampanye serta edukasi produk.',
    deliverables: ['Visual Storytelling', 'Studio-Grade Assets', 'Brand Alignment'],
  },
];

export const WHY_JEVALLENE = [
  {
    title: 'Aksesibilitas Tanpa Friksi',
    description:
      'Seluruh utilitas web dirancang siap pakai langsung dari peramban tanpa instalasi berat maupun hambatan akses.',
  },
  {
    title: 'Riset & Inovasi Berkelanjutan',
    description:
      'Setiap modul dikembangkan secara iteratif mengikuti standar teknologi web modern dan kebutuhan alur kerja aktual.',
  },
  {
    title: 'Dukungan Teknis Responsif',
    description:
      'Komunikasi langsung yang terstruktur untuk mendampingi pengguna maupun mitra bisnis di setiap fase kolaborasi.',
  },
  {
    title: 'Rekayasa Lokal, Standar Global',
    description:
      'Dibangun di Indonesia dengan perhatian penuh terhadap presisi desain, kecepatan eksekusi, dan keandalan sistem.',
  },
];

export const SOLUTIONS = [
  {
    id: 'individuals',
    title: 'Individuals',
    subtitle: 'Gen Z, Pelajar & Mahasiswa',
    description:
      'Akses tools produktivitas dan pengolah visual instan langsung dari browser untuk tugas, proyek pribadi, maupun eksplorasi kreatif.',
    highlights: ['Akses instan tanpa instalasi', 'Antarmuka ringkas & modern', 'Cocok untuk alur kerja harian'],
  },
  {
    id: 'creators',
    title: 'Creators',
    subtitle: 'Fotografer, Videografer & Content Creators',
    description:
      'Alur kerja pengeditan foto, konversi format media, dan kurasi visual studio dalam satu ekosistem terpadu.',
    highlights: ['Jevallene Photo Editor', 'Jevallene Converter', 'Jevallene PhotoStudio'],
  },
  {
    id: 'freelancers',
    title: 'Freelancers',
    subtitle: 'Desainer, Developer & Konsultan Independen',
    description:
      'Percepat pengiriman proyek klien dengan utilitas media cepat serta dukungan layanan teknis maupun UI/UX.',
    highlights: ['Alat bantu produksi cepat', 'Standar visual konsisten', 'Kolaborasi proyek fleksibel'],
  },
  {
    id: 'umkm',
    title: 'UMKM',
    subtitle: 'Usaha Mikro, Kecil & Menengah',
    description:
      'Bangun kehadiran digital yang profesional mulai dari website, identitas grafis, hingga manajemen konten media sosial.',
    highlights: ['Website & katalog digital', 'Desain grafis & branding', 'Pendampingan bertahap'],
  },
  {
    id: 'business',
    title: 'Business',
    subtitle: 'Entrepreneur & Perusahaan Berkembang',
    description:
      'Solusi perangkat lunak kustom, sistem desain, dan strategi digital untuk meningkatkan efisiensi operasional dan daya saing.',
    highlights: ['Custom Web & App Development', 'UI/UX Design System', 'Digital Growth Strategy'],
  },
  {
    id: 'organizations',
    title: 'Organizations',
    subtitle: 'Komunitas, Institusi & Organisasi',
    description:
      'Platform digital terstruktur yang memudahkan publikasi informasi, kolaborasi tim, dan pengelolaan layanan internal.',
    highlights: ['Arsitektur terukur', 'Aksesibilitas lintas perangkat', 'Dukungan jangka panjang'],
  },
];

export const WORKFLOW_STEPS = [
  { step: '01', title: 'Discovery', desc: 'Memahami kebutuhan, tujuan bisnis, dan tantangan pengguna secara menyeluruh.' },
  { step: '02', title: 'Planning', desc: 'Menyusun arsitektur informasi, ruang lingkup, dan peta jalan pengembangan.' },
  { step: '03', title: 'Design', desc: 'Merancang wireframe, UI/UX system, dan prototipe visual berkarakter.' },
  { step: '04', title: 'Development', desc: 'Mengimplementasikan kode frontend, backend, dan integrasi secara presisi.' },
  { step: '05', title: 'Delivery', desc: 'Pengujian menyeluruh, peluncuran ke produksi, dan dukungan berkelanjutan.' },
];

export interface BlogArticle {
  slug: string;
  title: string;
  category: 'Ecosystem' | 'Design' | 'Technology' | 'Productivity';
  date: string;
  readTime: string;
  excerpt: string;
  content: string[];
  featured?: boolean;
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'membangun-ekosistem-kreatif-berbasis-browser',
    title: 'Membangun Ekosistem Kreatif Berbasis Browser Tanpa Beban Instalasi',
    category: 'Ecosystem',
    date: '2025',
    readTime: '4 min read',
    featured: true,
    excerpt:
      'Bagaimana Jevallene menyatukan tools editing foto, konversi berkas, dan studio kurasi visual langsung di peramban modern.',
    content: [
      'Kebutuhan kreator dan pelaku bisnis digital menuntut kecepatan akses tanpa harus bergantung pada perangkat berspesifikasi tinggi atau proses instalasi yang panjang.',
      'Melalui Jevallene Photo Editor, Jevallene Converter, dan Jevallene PhotoStudio, seluruh alur kerja dasar dapat dijalankan langsung dari browser dengan antarmuka yang konsisten.',
      'Pendekatan ini membantu pelajar, freelancer, hingga tim kreatif bekerja lebih lincah dari mana saja.',
    ],
  },
  {
    slug: 'prinsip-red-gradient-black-pada-design-system',
    title: 'Prinsip Red Gradient Black dalam Membangun Karakter Visual',
    category: 'Design',
    date: '2025',
    readTime: '3 min read',
    excerpt:
      'Mengapa kontras hitam pekat dan aksen merah elektrik menciptakan hierarki visual yang tegas sekaligus minimalis.',
    content: [
      'Dalam merancang antarmuka gelap modern, keseimbangan antara ruang kosong, kontras tipografi, dan titik fokus warna menjadi kunci keterbacaan.',
      'Kombinasi Pure Black (#090909), Charcoal (#171717), dan Electric Red (#FF3030) memberi penekanan yang jelas pada aksi utama tanpa membuat tampilan terasa ramai.',
    ],
  },
  {
    slug: 'alur-kerja-kolaborasi-discovery-hingga-delivery',
    title: 'Alur Kerja Pengembangan Digital: Dari Discovery Hingga Delivery',
    category: 'Technology',
    date: '2025',
    readTime: '5 min read',
    excerpt:
      'Pendekatan terstruktur lima tahap dalam merancang website, aplikasi, dan solusi perangkat lunak kustom bersama Jevallene.',
    content: [
      'Setiap proyek digital yang berhasil selalu berawal dari pemahaman masalah yang tepat pada fase Discovery.',
      'Dengan membagi proses ke dalam Discovery, Planning, Design, Development, dan Delivery, klien memiliki visibilitas yang jelas terhadap setiap progres.',
    ],
  },
  {
    slug: 'optimasi-aset-visual-untuk-umkm-dan-kreator',
    title: 'Menjaga Konsistensi Aset Visual untuk UMKM dan Content Creator',
    category: 'Productivity',
    date: '2025',
    readTime: '4 min read',
    excerpt:
      'Langkah praktis menyiapkan gambar, format berkas, dan presentasi visual agar tetap tajam di berbagai platform digital.',
    content: [
      'Kualitas aset visual memengaruhi persepsi profesionalitas sebuah brand di mata audiens.',
      'Memanfaatkan alat bantu seperti photo editor dan converter berbasis web membantu proses persiapan aset menjadi lebih cepat dan rapi.',
    ],
  },
];
