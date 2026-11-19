import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'jevallene-db.json');

const SEED_DATA = {
  products: [
    {
      id: 'photo-editor',
      slug: 'photo-editor',
      number: '01',
      name: 'Jevallene Photo Editor',
      shortTitle: 'Photo Engine',
      category: 'editor',
      categoryLabel: 'Editor Grafis',
      versionBadge: 'LIVE V2.0',
      engineTag: 'GPU ACCELERATED',
      techStackLabel: 'WEBGL / CANVAS API',
      summary:
        'Editor foto berbasis browser untuk crop, resize presisi, filter film analog, bokeh optik, penghapus objek, hingga ekspor PNG transparan.',
      longDescription:
        'Jevallene Photo Editor menghadirkan alat editing foto langsung di peramban: potong & putar, filter film analog, simulasi bokeh optik f/1.4, restorasi foto, watermark, dan ekspor PNG alpha transparan tanpa instalasi.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCLRJpfZFSUG3dryzMxKI597slNLh7yg8ZBMqEXTNp9rrLpLLxzxPDI70H4wcF0q8TmXFutitRT8_0nBzAImJFCtoKB_ZmocY2WTiz4PmYCUmNRxlcrOaud8DrU-4iH7ZrmvkDnj5-OzU_yMwwdcUUCe9S7HOc7BBYYQO8a1GFBp5ohzj2tcHPURPK3aGGYMN5L6NTwYvqz8vTU4eOkm-05VsGFeMc_U9Z-lAnxQ4Y',
      detailHeroImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDdg0S2TJWF4uCYylfDW1OUVZ2bwcwJAvz3aO8J9I00RVheHu-xhMTJfyG8Sir2uaDM39-I0E-WF3ea_DcbfiTxMvfvuaA71qTVdcoIv57NSLs_TrR7z2mGFigabDVGVxFACagX9q5SyALRkGo3OYrS96DPJ78KUluSqThiesUJkqTcvJjw1JNcKKoOI4fJrEUygWxVC4oYmopecqSKSY6-Ya6_9osHYQNNf045yNY',
      liveUrl: 'https://jevallene-photo-editor.vercel.app/',
      pills: ['Filter Film Analog', 'Crop & Resize', 'Ekspor PNG Transparan'],
      bentoSpecs: [
        { icon: 'photo_filter', label: 'Filter Film Analog & Bokeh Optik' },
        { icon: 'crop', label: 'Crop, Rotate & Resize Lanczos3' },
        { icon: 'auto_fix_high', label: 'Object Removal & Restorasi Foto' },
        { icon: 'image', label: 'Watermark & Ekspor PNG Transparan' },
      ],
      telemetryStat: '60.0 FPS',
      telemetrySub: 'WebGL Frame Lock',
      attributes: ['client-side', 'gpu'],
      searchKeywords: 'photo editor webgl grafis pemotong kanvas png jpg webp',
      popularity: 98,
      releaseOrder: 2,
      launches: 0,
    },
    {
      id: 'converter',
      slug: 'converter',
      number: '02',
      name: 'Jevallene Converter',
      shortTitle: 'Converter',
      category: 'utilitas',
      categoryLabel: 'Utilitas Berkas',
      versionBadge: 'LIVE V1.0',
      engineTag: 'WASM PIPELINE',
      techStackLabel: '100% LOCAL BROWSER ENGINE',
      summary:
        'All-in-One File Converter — Drop. Convert. Download. Done. Berjalan 100% lokal di browser tanpa akun atau unggah ke server.',
      longDescription:
        'Privacy-first file converter yang berjalan 100% secara lokal di peramban Anda. Konversi gambar, PDF, structured data, teks, dan arsip secara instan tanpa perlu membuat akun atau mengunggah berkas ke server.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC7h8jhKrGtrbbbh7rAIlCyFjd_kIvXplNXgp0PEufn1bxzsIvcSqxLgjf-7MJbja_ENkcrCMKmN8Jrg6U-RFsl-P4AqRD5tDfMCF8RlR8pK1L622JSL46rzIE5qVDqZc2dg_JveBe620UDeHaFUTPhRfTZcM5F-UxvXUJqxQb8Cq7SoDyKo_qWrIptTsCC8eFBINfKByi13fFV_iCkOOV3SaNRI74D7Zf2tFAybcw',
      detailHeroImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC7h8jhKrGtrbbbh7rAIlCyFjd_kIvXplNXgp0PEufn1bxzsIvcSqxLgjf-7MJbja_ENkcrCMKmN8Jrg6U-RFsl-P4AqRD5tDfMCF8RlR8pK1L622JSL46rzIE5qVDqZc2dg_JveBe620UDeHaFUTPhRfTZcM5F-UxvXUJqxQb8Cq7SoDyKo_qWrIptTsCC8eFBINfKByi13fFV_iCkOOV3SaNRI74D7Zf2tFAybcw',
      liveUrl: 'https://jevallene-converter.vercel.app/',
      pills: ['Privacy-First', 'No Uploads', 'All-in-One Converter'],
      bentoSpecs: [
        { icon: 'security', label: '100% Lokal Tanpa Upload Server' },
        { icon: 'image', label: 'Konversi Images & PDFs' },
        { icon: 'data_object', label: 'Structured Data, Text & Archives' },
        { icon: 'bolt', label: 'Tanpa Akun — Drop, Convert, Done' },
      ],
      telemetryStat: '120 MB/s',
      telemetrySub: 'In-Memory IO',
      attributes: ['client-side', 'batch'],
      searchKeywords: 'converter wasm ffmpeg utilitas berkas audio video format dokumen massal',
      popularity: 92,
      releaseOrder: 1,
      launches: 0,
    },
    {
      id: 'photostudio',
      slug: 'photostudio',
      number: '03',
      name: 'Jevallene PhotoStudio',
      shortTitle: 'PhotoStudio',
      category: 'studio',
      categoryLabel: 'Photobox & Studio',
      versionBadge: 'LIVE V2.0',
      engineTag: 'PHOTOBOX & EDITOR',
      techStackLabel: 'NEXT.JS / CROSS-PLATFORM',
      summary:
        'Platform photobox dan studio editing foto gratis lintas platform dengan template estetik dan watermark Jevallene.',
      longDescription:
        'JEVALLENE PhotoStudio adalah platform photobox dan studio editing foto gratis lintas platform yang dilengkapi beragam template estetik serta watermark resmi Jevallene langsung dari browser.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC4XNCOg9njrQBThPcGhEl5p5_PhU26g6rTfhu6315EeXX_l8Wtx3OrTzj8v_vhBnZQgqzXt6Di9gtpAqLOs3Ybm10sOGHFxsn2SawZDq_O4JiERsj-ejbSpdXOh5kUxm8Jk2QU3IJ3ImidEnnPpENn-c_kNSa3pgU_yRVkqHDrXnt6mfXJZubKZEARLT_D9gMgy3WVUX7Mu6mmExfQy33oog3BJwxkgl8t8_eG39I',
      detailHeroImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC4XNCOg9njrQBThPcGhEl5p5_PhU26g6rTfhu6315EeXX_l8Wtx3OrTzj8v_vhBnZQgqzXt6Di9gtpAqLOs3Ybm10sOGHFxsn2SawZDq_O4JiERsj-ejbSpdXOh5kUxm8Jk2QU3IJ3ImidEnnPpENn-c_kNSa3pgU_yRVkqHDrXnt6mfXJZubKZEARLT_D9gMgy3WVUX7Mu6mmExfQy33oog3BJwxkgl8t8_eG39I',
      liveUrl: 'https://jevallene-photostudio.vercel.app/',
      pills: ['Photobox Gratis', 'Template Estetik', 'Watermark Jevallene'],
      bentoSpecs: [
        { icon: 'photo_camera', label: 'Platform Photobox Lintas Perangkat' },
        { icon: 'style', label: 'Template Estetik Siap Pakai' },
        { icon: 'edit', label: 'Studio Editing Foto Gratis' },
        { icon: 'branding_watermark', label: 'Watermark Resmi Jevallene' },
      ],
      telemetryStat: 'DCI-P3 Gamut',
      telemetrySub: 'Virtual Studio Emulation',
      attributes: ['client-side', 'gpu', 'raw'],
      searchKeywords: 'photostudio raw portfolio fotografi grading gallery dci-p3 exif',
      popularity: 95,
      releaseOrder: 3,
      launches: 0,
    },
  ],
  upcomingModules: [
    {
      status: 'TAHAP RISET',
      icon: 'animation',
      title: 'Jevallene Motion Lab',
      description:
        'Generator micro-motion dan export animasi Lottie/SVG parametrik langsung dari peramban tanpa antrean rendering farm eksternal.',
      platform: 'Browser WebGL',
      eta: 'Segera Hadir',
    },
    {
      status: 'PROTOTIPE',
      icon: 'graphic_eq',
      title: 'Jevallene Audio Synth',
      description:
        'Synthesizer WebAudio modular dan mastering stem audio real-time untuk kreator sound design dan scoring film indie.',
      platform: 'WebAudio API',
      eta: 'Q4 2025',
    },
    {
      status: 'ARSITEKTUR',
      icon: 'neurology',
      title: 'Jevallene Local Vision',
      description:
        'Inferensi model segmentasi & upscaling gambar berbasis WebGPU murni di perangkat lokal tanpa API cloud berbayar.',
      platform: 'WebGPU / ONNX',
      eta: 'Segera Hadir',
    },
  ],
  inquiries: [],
  users: [],
  sessions: [],
};

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(SEED_DATA, null, 2), 'utf8');
  }
}

export function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.users)) parsed.users = [];
  if (!Array.isArray(parsed.sessions)) parsed.sessions = [];
  if (!Array.isArray(parsed.inquiries)) parsed.inquiries = [];
  return parsed;
}

export function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}
