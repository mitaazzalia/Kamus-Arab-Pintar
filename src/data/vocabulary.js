import { extraVocabulary } from './vocabulary-extra.js';
import { importedVocabulary } from './vocabulary-imported.js';
import { expandedVocabulary } from './vocabulary-expanded.js';

export const categories = [
  { id: 'semua', label: 'Semua kata', icon: '🌟' },
  { id: 'rumah', label: 'Rumah', icon: '🏡' },
  { id: 'makanan', label: 'Makanan', icon: '🍎' },
  { id: 'sekolah', label: 'Sekolah', icon: '📚' },
  { id: 'keluarga', label: 'Keluarga', icon: '👨‍👩‍👧' },
  { id: 'perjalanan', label: 'Perjalanan', icon: '🚌' },
  { id: 'keseharian', label: 'Keseharian', icon: '💬' },
  { id: 'ibadah', label: 'Ibadah', icon: '🕌' },
  { id: 'tubuh', label: 'Anggota tubuh', icon: '🧍' },
  { id: 'kesehatan', label: 'Kesehatan', icon: '🩺' },
  { id: 'pekerjaan', label: 'Pekerjaan', icon: '💼' },
  { id: 'teknologi', label: 'Teknologi', icon: '💻' },
  { id: 'alam', label: 'Alam', icon: '🌿' },
  { id: 'warna-angka', label: 'Warna & angka', icon: '🎨' },
  { id: 'kata-kerja', label: 'Kata kerja', icon: '🏃' },
  { id: 'sifat', label: 'Kata sifat', icon: '✨' },
];

const baseVocabulary = [
  { id: 1, arabic: 'بَيْتٌ', latin: 'baytun', indo: 'rumah', category: 'rumah', emoji: '🏡', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80', exampleAr: 'هٰذَا بَيْتِيْ', exampleId: 'Ini rumah saya.' },
  { id: 2, arabic: 'بَابٌ', latin: 'bābun', indo: 'pintu', category: 'rumah', emoji: '🚪', exampleAr: 'اِفْتَحِ الْبَابَ', exampleId: 'Bukalah pintu.' },
  { id: 3, arabic: 'نَافِذَةٌ', latin: 'nāfidhatun', indo: 'jendela', category: 'rumah', emoji: '🪟', exampleAr: 'النَّافِذَةُ مَفْتُوْحَةٌ', exampleId: 'Jendelanya terbuka.' },
  { id: 4, arabic: 'كُرْسِيٌّ', latin: 'kursiyyun', indo: 'kursi', category: 'rumah', emoji: '🪑', exampleAr: 'هٰذَا كُرْسِيٌّ جَدِيْدٌ', exampleId: 'Ini kursi baru.' },
  { id: 5, arabic: 'كِتَابٌ', latin: 'kitābun', indo: 'buku', category: 'sekolah', emoji: '📘', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80', exampleAr: 'أَقْرَأُ الْكِتَابَ', exampleId: 'Saya membaca buku.' },
  { id: 6, arabic: 'قَلَمٌ', latin: 'qalamun', indo: 'pena', category: 'sekolah', emoji: '🖊️', exampleAr: 'هٰذَا قَلَمِيْ', exampleId: 'Ini pena saya.' },
  { id: 7, arabic: 'مَدْرَسَةٌ', latin: 'madrasatun', indo: 'sekolah', category: 'sekolah', emoji: '🏫', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80', exampleAr: 'أَذْهَبُ إِلَى الْمَدْرَسَةِ', exampleId: 'Saya pergi ke sekolah.' },
  { id: 8, arabic: 'مُعَلِّمٌ', latin: 'muʿallimun', indo: 'guru laki-laki', category: 'sekolah', emoji: '👨‍🏫', exampleAr: 'الْمُعَلِّمُ فِي الْفَصْلِ', exampleId: 'Guru berada di kelas.' },
  { id: 9, arabic: 'تُفَّاحٌ', latin: 'tuffāḥun', indo: 'apel', category: 'makanan', emoji: '🍎', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80', exampleAr: 'أُحِبُّ التُّفَّاحَ', exampleId: 'Saya suka apel.' },
  { id: 10, arabic: 'مَوْزٌ', latin: 'mawzun', indo: 'pisang', category: 'makanan', emoji: '🍌', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80', exampleAr: 'هٰذَا مَوْزٌ لَذِيْذٌ', exampleId: 'Ini pisang yang enak.' },
  { id: 11, arabic: 'خُبْزٌ', latin: 'khubzun', indo: 'roti', category: 'makanan', emoji: '🍞', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', exampleAr: 'أُرِيْدُ خُبْزًا', exampleId: 'Saya ingin roti.' },
  { id: 12, arabic: 'مَاءٌ', latin: 'mā’un', indo: 'air', category: 'makanan', emoji: '💧', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=600&q=80', exampleAr: 'أَشْرَبُ الْمَاءَ', exampleId: 'Saya minum air.' },
  { id: 13, arabic: 'أُمٌّ', latin: 'ummun', indo: 'ibu', category: 'keluarga', emoji: '👩', exampleAr: 'أُمِّيْ طَيِّبَةٌ', exampleId: 'Ibu saya baik.' },
  { id: 14, arabic: 'أَبٌ', latin: 'abun', indo: 'ayah', category: 'keluarga', emoji: '👨', exampleAr: 'أَبِيْ فِي الْبَيْتِ', exampleId: 'Ayah saya di rumah.' },
  { id: 15, arabic: 'أَخٌ', latin: 'akhun', indo: 'saudara laki-laki', category: 'keluarga', emoji: '🧑', exampleAr: 'لِيْ أَخٌ وَاحِدٌ', exampleId: 'Saya mempunyai satu saudara laki-laki.' },
  { id: 16, arabic: 'أُخْتٌ', latin: 'ukhtun', indo: 'saudara perempuan', category: 'keluarga', emoji: '👧', exampleAr: 'أُخْتِيْ طَالِبَةٌ', exampleId: 'Saudara perempuan saya seorang pelajar.' },
  { id: 17, arabic: 'سَيَّارَةٌ', latin: 'sayyāratun', indo: 'mobil', category: 'perjalanan', emoji: '🚗', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80', exampleAr: 'السَّيَّارَةُ سَرِيْعَةٌ', exampleId: 'Mobil itu cepat.' },
  { id: 18, arabic: 'حَافِلَةٌ', latin: 'ḥāfilatun', indo: 'bus', category: 'perjalanan', emoji: '🚌', exampleAr: 'أَنْتَظِرُ الْحَافِلَةَ', exampleId: 'Saya menunggu bus.' },
  { id: 19, arabic: 'مَطَارٌ', latin: 'maṭārun', indo: 'bandara', category: 'perjalanan', emoji: '✈️', exampleAr: 'أَنَا فِي الْمَطَارِ', exampleId: 'Saya berada di bandara.' },
  { id: 20, arabic: 'سُوْقٌ', latin: 'sūqun', indo: 'pasar', category: 'keseharian', emoji: '🛍️', exampleAr: 'أَذْهَبُ إِلَى السُّوْقِ', exampleId: 'Saya pergi ke pasar.' },
  { id: 21, arabic: 'مُسْتَشْفًى', latin: 'mustashfan', indo: 'rumah sakit', category: 'keseharian', emoji: '🏥', exampleAr: 'هُوَ فِي الْمُسْتَشْفَى', exampleId: 'Dia berada di rumah sakit.' },
  { id: 22, arabic: 'مَسْجِدٌ', latin: ' masjidun', indo: 'masjid', category: 'ibadah', emoji: '🕌', exampleAr: 'أُصَلِّيْ فِي الْمَسْجِدِ', exampleId: 'Saya salat di masjid.' },
  { id: 23, arabic: 'صَلَاةٌ', latin: 'ṣalātun', indo: 'salat', category: 'ibadah', emoji: '🤲', exampleAr: 'الصَّلَاةُ عِبَادَةٌ', exampleId: 'Salat adalah ibadah.' },
  { id: 24, arabic: 'كَيْفَ حَالُكَ؟', latin: 'kayfa ḥāluka?', indo: 'apa kabar? (laki-laki)', category: 'keseharian', emoji: '💬', exampleAr: 'السَّلَامُ عَلَيْكُمْ، كَيْفَ حَالُكَ؟', exampleId: 'Assalamu’alaikum, apa kabar?' },
  { id: 25, arabic: 'شُكْرًا', latin: 'shukran', indo: 'terima kasih', category: 'keseharian', emoji: '🙏', exampleAr: 'شُكْرًا جَزِيْلًا', exampleId: 'Terima kasih banyak.' },
  { id: 26, arabic: 'مِنْ فَضْلِكَ', latin: 'min faḍlika', indo: 'tolong / silakan (kepada laki-laki)', category: 'keseharian', emoji: '✨', exampleAr: 'مِنْ فَضْلِكَ، سَاعِدْنِيْ', exampleId: 'Tolong, bantu saya.' },
  { id: 27, arabic: 'نَعَمْ', latin: 'naʿam', indo: 'ya', category: 'keseharian', emoji: '✅', exampleAr: 'نَعَمْ، أَنَا مُسْتَعِدٌّ', exampleId: 'Ya, saya siap.' },
  { id: 28, arabic: 'لَا', latin: 'lā', indo: 'tidak', category: 'keseharian', emoji: '❌', exampleAr: 'لَا، شُكْرًا', exampleId: 'Tidak, terima kasih.' },
  { id: 29, arabic: 'صَبَاحُ الْخَيْرِ', latin: 'ṣabāḥul-khayr', indo: 'selamat pagi', category: 'keseharian', emoji: '🌅', exampleAr: 'صَبَاحُ الْخَيْرِ يَا صَدِيْقِيْ', exampleId: 'Selamat pagi, temanku.' },
  { id: 30, arabic: 'مَعَ السَّلَامَةِ', latin: 'maʿa as-salāmah', indo: 'sampai jumpa', category: 'keseharian', emoji: '👋', exampleAr: 'إِلَى اللِّقَاءِ، مَعَ السَّلَامَةِ', exampleId: 'Sampai bertemu lagi, sampai jumpa.' },
  { id: 31, arabic: 'مَرْحَبًا', latin: 'marḥaban', indo: 'halo / selamat datang', category: 'keseharian', emoji: '👋', exampleAr: 'مَرْحَبًا بِكَ فِي بَيْتِيْ', exampleId: 'Selamat datang di rumah saya.' },
  { id: 32, arabic: 'أَنَا جَائِعٌ', latin: 'anā jā’iʿun', indo: 'saya lapar (laki-laki)', category: 'keseharian', emoji: '🍽️', exampleAr: 'أَنَا جَائِعٌ، أُرِيْدُ الطَّعَامَ', exampleId: 'Saya lapar, saya ingin makanan.' },
  { id: 33, arabic: 'أَيْنَ الْحَمَّامُ؟', latin: 'ayna al-ḥammām?', indo: 'di mana kamar mandi?', category: 'keseharian', emoji: '🚻', exampleAr: 'عَفْوًا، أَيْنَ الْحَمَّامُ؟', exampleId: 'Permisi, di mana kamar mandi?' },
  { id: 34, arabic: 'كَمِ السِّعْرُ؟', latin: 'kam as-siʿru?', indo: 'berapa harganya?', category: 'keseharian', emoji: '💰', exampleAr: 'كَمِ السِّعْرُ مِنْ فَضْلِكَ؟', exampleId: 'Berapa harganya, tolong?' },
  { id: 35, arabic: 'تَفَضَّلْ', latin: 'tafaḍḍal', indo: 'silakan (kepada laki-laki)', category: 'keseharian', emoji: '🤝', exampleAr: 'تَفَضَّلْ، اِجْلِسْ هُنَا', exampleId: 'Silakan, duduklah di sini.' },
  { id: 36, arabic: 'أُحِبُّكَ', latin: 'uḥibbuka', indo: 'saya menyayangimu (laki-laki)', category: 'keseharian', emoji: '❤️', exampleAr: 'أُحِبُّكَ فِي اللَّهِ', exampleId: 'Saya menyayangimu karena Allah.' },
];


const normalizeWord = (value = '') => String(value).normalize('NFD').replace(/[\u064B-\u065F\u0670\u0640]/g, '').trim().toLocaleLowerCase('id-ID');

const readSavedVocabulary = () => {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(window.localStorage.getItem('arabic-smart-generated-vocabulary') || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const storedGeneratedVocabulary = readSavedVocabulary();
const allVocabulary = [
  ...baseVocabulary,
  ...extraVocabulary.map((item, index) => ({ id: baseVocabulary.length + index + 1, ...item })),
  ...expandedVocabulary.map((item, index) => ({ id: baseVocabulary.length + extraVocabulary.length + index + 1, ...item })),
  ...importedVocabulary.map((item, index) => ({ id: `imported-${index + 1}`, ...item })),
  ...storedGeneratedVocabulary,
];
const seenArabicWords = new Set();
export const vocabulary = allVocabulary.filter((item) => {
  const key = normalizeWord(item.arabic);
  if (!key || seenArabicWords.has(key)) return false;
  seenArabicWords.add(key);
  return true;
});
const VOCAB_DB_NAME = 'arabic-smart-vocabulary';
const VOCAB_STORE_NAME = 'generated-words';

function openVocabularyDb() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB tidak tersedia.'));
      return;
    }
    const request = window.indexedDB.open(VOCAB_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(VOCAB_STORE_NAME)) db.createObjectStore(VOCAB_STORE_NAME, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Tidak dapat membuka penyimpanan kosakata.'));
  });
}

async function persistGeneratedVocabulary(items) {
  if (typeof window === 'undefined') return;
  try {
    const db = await openVocabularyDb();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(VOCAB_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(VOCAB_STORE_NAME);
      items.forEach((item) => store.put(item));
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error('Penyimpanan gagal.'));
      transaction.onabort = () => reject(transaction.error || new Error('Penyimpanan dibatalkan.'));
    });
    db.close();
  } catch {
    try {
      const previous = readSavedVocabulary();
      const next = [...previous, ...items];
      window.localStorage.setItem('arabic-smart-generated-vocabulary', JSON.stringify(next));
    } catch {
      // The UI remains usable for the current session; export the batch before closing the tab.
    }
  }
}

export async function loadGeneratedVocabulary() {
  if (typeof window === 'undefined') return [];
  try {
    const db = await openVocabularyDb();
    const items = await new Promise((resolve, reject) => {
      const request = db.transaction(VOCAB_STORE_NAME, 'readonly').objectStore(VOCAB_STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error || new Error('Tidak dapat membaca kosakata.'));
    });
    db.close();
    if (items.length) return items;
  } catch {
    // Use the legacy localStorage fallback below.
  }
  return readSavedVocabulary();
}

export function addGeneratedVocabulary(items, options = {}) {
  const knownArabic = new Set(vocabulary.map((item) => normalizeWord(item.arabic)));
  const unique = [];
  for (const item of items || []) {
    const arabicKey = normalizeWord(item.arabic);
    const indoKey = normalizeWord(item.indo);
    if (!arabicKey || !indoKey || knownArabic.has(arabicKey)) continue;
    const entry = {
      id: typeof item.id === 'string' && item.id.startsWith('ai-') ? item.id : `ai-${Date.now()}-${unique.length}-${Math.random().toString(36).slice(2, 7)}`,
      category: item.category,
      arabic: String(item.arabic).trim(),
      latin: String(item.latin || '').trim(),
      indo: String(item.indo).trim(),
      emoji: String(item.emoji || '📘'),
      exampleAr: String(item.exampleAr || ''),
      exampleId: String(item.exampleId || ''),
    };
    unique.push(entry);
    knownArabic.add(arabicKey);
  }
  if (!unique.length) return [];
  vocabulary.push(...unique);
  if (options.persist !== false) void persistGeneratedVocabulary(unique);
  return unique;
}

export const localTranslations = {
  'halo': 'مَرْحَبًا',
  'selamat pagi': 'صَبَاحُ الْخَيْرِ',
  'terima kasih': 'شُكْرًا',
  'apa kabar': 'كَيْفَ حَالُكَ؟',
  'sampai jumpa': 'مَعَ السَّلَامَةِ',
  'rumah': 'بَيْتٌ',
  'buku': 'كِتَابٌ',
  'apel': 'تُفَّاحٌ',
  'air': 'مَاءٌ',
  'ibu': 'أُمٌّ',
  'ayah': 'أَبٌ',
  'sekolah': 'مَدْرَسَةٌ',
  'masjid': 'مَسْجِدٌ',
};
